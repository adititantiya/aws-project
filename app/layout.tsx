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
        <link rel="icon" href="https://aws-taskmanager-bucket.s3.ap-south-2.amazonaws.com/logo.png?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmFwLXNvdXRoLTIiSDBGAiEAgJlBvhwS5IQ0IaNn0s15z6BftkwEvFS%2BPS73UMLxNc4CIQCt5vjDdeCElGJNbdW7ynWqMO6IYtTEdP09VasherbzGyq%2BAwjo%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDU0OTM2MzkwOTQyOSIMT1vXVH%2FuLlfpsGTEKpID%2B4G%2Bpr%2Fs%2B5m3XGsKwc5h59irD8cjJlaUE9lbRGFtsXAY%2Bo%2FNoBItzFfSkrHdZyruzpawrNzavDStzNkJytzjh2ZHTsHQVPLGNyOp1ddY9k8ERACBqIoqhe8Tccc%2BmHqums81TFS0HiVIscnC7e1z9d5JuF%2BScQrCIIkl0pfaVdoGlZCAEj4b7%2FuGmE0YL5TvdvKl70zyW%2FO%2FBxLq5mlcZtfvdABej6CuO5nDpItfz7xYFQd64rYI1CRH1YcsADfSjrwD3B8JZjXl3472QCcf9%2FGZrDbkRi0t9fOJv2QxRHIk2TJqYJGO4088Vh7vTX6VjQquxjhP9vAz10bD2CU2wOB%2F0GGyLOpToKOTVLgcSXOMByh58krh%2F0HQwtnFTS1uKLEq6AN23LaEsyBChTLODZ4nMHQZvwWANFOxvFu%2B1IQEkMEObGS09fJJcbRADv973FpDniwDoxYhgCGhJ7gyEM2h%2FmWjUzvvcbYv5zCBjoFU4pnqgQ%2BSN4E6bKz9d1raeFIOUFXy5kxTc7G1HYrn8sAqMP%2BPjMgGOt0Cbtdwa9yzisIBYUhkerfHpQyE8%2FeEp1umnv8ARowakI62xPRwdPayGkbNpoN6g8K6fnhR7eHJTT8wEqTwXf2m6Bp45YcNR2Yu0MQHdptWa%2BSCraOXi5BYH5XCCYiZuoVvWFIoPxmY90qTdgk0g1kJd9Ga8tLIlQRb%2BeoPgfW00uygFJJnsFuxmvqybvy2ZSS%2BiujrPbeRNFgqQNz1ljdCRgVYlueiZj0M3%2B4ZMJNAdQN9SuhYt12bMUFY3%2FLOytebPvSCZf%2B%2FLYPqIiKex3EveiB7b0W1cF2WYBaY%2BIsYcox5SUsrQVupiejqc%2Fet9S8ONQlNVKxR03DC5fHfgmkhFZOtLOkFODAWpW0c%2BzLq9SHqVP8CEDjWRcYv%2Fo6WMTa1O9iqfE2QP0aJiJnSSah9NXLuTTkjwLU872USSzVDfEnCrVhKS9ThnI56VeVpuABDXo%2Fw0cCf%2Be7HIJqBSg%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAX72FEAM2VLOPOWJV%2F20251030%2Fap-south-2%2Fs3%2Faws4_request&X-Amz-Date=20251030T070914Z&X-Amz-Expires=43200&X-Amz-SignedHeaders=host&X-Amz-Signature=f0267e735a41fa831fda2fa8f894d29a5b7fc3ec39a3e9d27d1d4a3d8708b937" type="image/png"/>
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