import type { QRCode, ApiResponse } from "@/types"

const API_URL = "/api/qrcodes"

export const qrCodeService = {
  async getAll(): Promise<ApiResponse<QRCode[]>> {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error("Failed to fetch QR codes")
    }
    return response.json()
  },

  async create(url: string): Promise<ApiResponse<QRCode>> {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })
    if (!response.ok) {
      throw new Error("Failed to create QR code")
    }
    return response.json()
  },

  async delete(id: string): Promise<ApiResponse<QRCode>> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error("Failed to delete QR code")
    }
    return response.json()
  },
}

