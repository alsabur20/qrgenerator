"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QRCodeSVG } from "qrcode.react"
import { Copy, Download, Trash, ChevronLeft, ChevronRight } from "lucide-react"
import { qrCodeService } from "@/services/qrCodeService"
import type { QRCode } from "@/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function QRCodeHistory() {
  const [history, setHistory] = useState<QRCode[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchQRCodes()
  }, [])

  const fetchQRCodes = async () => {
    setIsLoading(true)
    try {
      const response = await qrCodeService.getAll()
      if (response.success) {
        // Sort latest to oldest
        setHistory(response.data.reverse())
        console.log("QR codes fetched:", response.data.reverse())
      }
    } catch (error) {
      console.error("Failed to fetch QR codes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url)
  }

  const downloadQRCode = (url: string) => {
    const svg = document.getElementById(`qr-code-${url}`)
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        const pngFile = canvas.toDataURL("image/png")
        const downloadLink = document.createElement("a")
        downloadLink.download = `qrcode-${url}.png`
        downloadLink.href = pngFile
        downloadLink.click()
      }
      img.src = "data:image/svg+xml;base64," + btoa(svgData)
    }
  }

  const removeQRCode = async (id: string) => {
    try {
      const response = await qrCodeService.delete(id)
      if (response.success) {
        const newHistory = history.filter((code) => code.id !== id)
        setHistory(newHistory)
        if (currentIndex >= newHistory.length - 1) {
          setCurrentIndex(Math.max(0, newHistory.length - 3))
        }
      }
    } catch (error) {
      console.error("Failed to delete QR code:", error)
    }
  }

  const nextQRCode = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 3, history.length - 1))
  }

  const prevQRCode = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 3, 0))
  }

  const visibleQRCodes = history.slice(currentIndex, currentIndex + 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code History</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-center">Loading QR codes...</p>
        ) : history.length === 0 ? (
          <p className="text-center text-muted-foreground">No QR codes generated yet.</p>
        ) : (
          <div className="flex flex-col items-center">
            {/* Navigation Buttons */}
            <div className="flex items-center justify-center w-full mb-4">
              <Button variant="outline" size="icon" onClick={prevQRCode} disabled={currentIndex === 0}>
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {/* QR Codes Display Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-4">
                {visibleQRCodes.map((qr) => (
                  <div key={qr.id} className="flex flex-col items-center">
                    <QRCodeSVG id={`qr-code-${qr.url}`} value={qr.url} size={150} />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="mt-2 text-sm text-muted-foreground truncate max-w-[150px]">{qr.url}</p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{qr.url}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Action Buttons (Icons Only) */}
                    <div className="flex gap-2 mt-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => copyLink(qr.url)}>
                              <Copy className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => downloadQRCode(qr.url)}>
                              <Download className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Download</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => removeQRCode(qr.id)}>
                              <Trash className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextQRCode}
                disabled={currentIndex + 3 >= history.length}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
