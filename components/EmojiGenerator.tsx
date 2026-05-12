'use client'

import { useState } from 'react'
import CanvasPreview from './CanvasPreview'
import ControlPanel from './ControlPanel'

interface EmojiGeneratorProps {}

const EmojiGenerator: React.FC<EmojiGeneratorProps> = () => {
  const [text, setText] = useState('')
  const [fontFamily, setFontFamily] = useState('Rounded M+ 1p black')
  const [color, setColor] = useState('#FFB7C5')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 左側：テキスト入力と設定 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            テキスト入力
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="入力してください（改行可）"
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-500 mt-2">
            ※ 2文字の場合は左右に配置されます
          </p>
        </div>

        {/* コントロールパネル */}
        <ControlPanel
          fontFamily={fontFamily}
          onFontChange={setFontFamily}
          color={color}
          onColorChange={setColor}
        />
      </div>

      {/* 右側：プレビュー */}
      <div className="flex items-center justify-center">
        <CanvasPreview
          text={text}
          fontFamily={fontFamily}
          color={color}
          canvasSize={180}
        />
      </div>
    </div>
  )
}

export default EmojiGenerator
