import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MCP com Gemini - Guia Completo',
  description: 'Como usar Model Context Protocol com Gemini em Python',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
