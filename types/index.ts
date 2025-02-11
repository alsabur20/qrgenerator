export interface QRCode {
    id: string
    url: string
    createdAt: string
    updatedAt: string
  }
  
  export interface ApiResponse<T> {
    data: T
    message: string
    success: boolean
  }
  
  