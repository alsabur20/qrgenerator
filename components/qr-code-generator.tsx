"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { QRCodeSVG } from "qrcode.react"
import { qrCodeService } from "@/services/qrCodeService"

export function QRCodeGenerator() {
  const [url, setUrl] = useState("")
  const [qrCode, setQrCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const generateQRCode = async () => {
    if (url) {
      setIsLoading(true)
      try {
        const response = await qrCodeService.create(url)
        if (response.success) {
          setQrCode(response.data.url)
          setUrl("")
        }
      } catch (error) {
        console.error("Failed to generate QR code:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code")
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
        downloadLink.download = "qrcode.png"
        downloadLink.href = pngFile
        downloadLink.click()
      }
      img.src = "data:image/svg+xml;base64," + btoa(svgData)
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Generate QR Code</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            type="url"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={generateQRCode} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate QR Code"}
          </Button>
        </div>
        {qrCode && (
          <div className="mt-6 flex justify-center">
            <QRCodeSVG id="qr-code" value={qrCode} size={200} />
          </div>
        )}
      </CardContent>
      {qrCode && (
        <CardFooter className="flex justify-center">
          <Button onClick={downloadQRCode}>Download QR Code</Button>
        </CardFooter>
      )}
    </Card>
  )
}

