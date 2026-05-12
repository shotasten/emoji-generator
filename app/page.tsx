'use client'

import { useState, useRef, useEffect } from 'react'
import EmojiGenerator from '@/components/EmojiGenerator'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          絵文字ジェネレーター
        </h1>
        <p className="text-center text-gray-600 mb-8">
          テキストからLINEやSlackで使えるカスタムスタンプを作成できます
        </p>
        <EmojiGenerator />
      </div>
    </main>
  )
}
