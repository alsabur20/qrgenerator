import { auth } from "@clerk/nextjs/server"
import { QRCodeGenerator } from "@/components/qr-code-generator"
import { QRCodeHistory } from "@/components/qr-code-history"
import { ModeToggle } from "@/components/mode-toggle" // Import ModeToggle
import { UserButton } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default async function Home() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">QR Code Generator</h1>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <UserButton />
            </div>
        </header>
        <QRCodeGenerator />
        <QRCodeHistory />
      </div>
    </main>
  )
}

