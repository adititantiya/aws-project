import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Task Manager",
  description: "Manage your tasks with AI assistance",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Task Manager</title>
        <link rel="icon" href="https://aws-taskmanager-bucket.s3.ap-south-2.amazonaws.com/logo.png?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmFwLXNvdXRoLTIiRjBEAiB0HcZhBRBOY5atZZB1ORWs4xYdX8GNtIwF3yUzR4W0vwIgKYNm4M1Dvetcw7WkNF2ImSmjRRP%2BmBj4vE9bJOXw37gqvgMI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw1NDkzNjM5MDk0MjkiDHPgXxVvLUCds6r8sSqSA22Ut9kANO7yZH7M62htZaG0yUXVcJA8Gg7NFIcVTD03J7lXPhj7fo8vr8adldwGtCSXAgxj3Oua%2BszeltCc0cXUEn65kv9MdQZCSsH25O9Dg2uHrHb6GR36K9uriH6vXT9vvUNAVKn8QDwrrXR7ZPn7nKuPtRakVnUivYPpnHV5VCOM%2B%2BpgD9C63UDwa6hidB8V8BRqzdr0PpLvasLr4dFSFULH6QOqashtRVX0wTUIdG9fxGI9GypHzHEIywXU8bqgo6LgH7Zi4Gc3I8tkUU67i3VZt2zMc1%2Bb%2F77hPziRU75qfPIro47BOxjLU8gukruf%2F2o4eEMQdLSVUqNovsEzRm%2FaG%2BvwRbds9xF5XII%2BaZs7TbSxvyxIqmxRYL6QRpRgjhnoWRIaKzb7d4qzSErafitjU25g8fTLwJDKfOmPJWjKNDJbLCJNFvKgGNNLbznihOWR3xFC4Z%2Ft9hx7SP48jm0Th%2BbA7vGWUyRYshnYD2OuT6eTTbmPiMOozbdfx1A3V6k1jH4CWv2GzfVqSanXEjDA6Y7IBjrfAlZMrFWStdXHr5GwIVe2kvO%2B3TjNmBw%2BV05T9OQjpE1Y3ju%2Fpku7tIwt8TpAq1MydGAuG21%2BT4OkEJRESPT%2FPZV9TaJAGW2aDEVVNuVqJc6afb4dvspVpb3I1VEPA5MZatWiHbL2rfhKhNF%2FikisMIs50eZ77Z6pLnssovnvohAu%2FrQM%2BUq61BrSP4O9dJmuHaD9CHwqM1qoFKeY28B0wto1kQt6lSGG8ts6ix%2Faf%2F6t%2BCkemOxYEOphAr6oo%2FBTUZsRWJUzNNhw7MOor%2BcGEbgvcax4NL0Z%2FOmSZ6vFmp6zBjcdfnjzY%2FLW%2F%2BpTZ1d2s6ujqQXidO6%2B%2BSC5a5Sah1nXIdLPNN%2BpXA5Uy7lTD41z5k8IlsH%2FXzGKPo8kmQOzyMaDxZ5LLw1l0kdywizxDR279ItQBe58qSQQMBNNijhvK1sLeeM8S%2F1sXDL7D019TlrOF3xDMueVW6NvP0p5kg%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAX72FEAM25HIQHDTJ%2F20251030%2Fap-south-2%2Fs3%2Faws4_request&X-Amz-Date=20251030T185925Z&X-Amz-Expires=43200&X-Amz-SignedHeaders=host&X-Amz-Signature=e98483e0e0e00e9d344cee33a1a1450c27750431ef83484309ba2a42cb2cbf5a" type="image/png"/>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'