import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '絵文字ジェネレーター',
  description: 'LINEやSlackで使用するカスタムスタンプを作成できるWebアプリケーション',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
