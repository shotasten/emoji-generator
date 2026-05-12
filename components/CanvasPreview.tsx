'use client'

import { useRef, useEffect } from 'react'

interface CanvasPreviewProps {
  text: string
  fontSize?: number
  fontFamily?: string
  color?: string
  canvasSize?: number
}

const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  text,
  fontSize = 80,
  fontFamily = "Rounded M+ 1p black",
  color = '#FFB7C5',
  canvasSize = 180,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Canvas描画ロジック
  const drawText = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // キャンバスをクリア（透明にする）
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const lines = text.split('\n').filter(line => line.length > 0)
    
    if (lines.length === 0) return

    // 2文字の場合の特殊処理
    if (text.length === 2 && lines.length === 1) {
      drawTwoCharacterLayout(ctx, text, canvasSize, color, fontFamily)
    } else {
      drawNormalLayout(ctx, lines, canvasSize, color, fontFamily)
    }
  }

  // 通常のレイアウト（複数行対応）
  const drawNormalLayout = (
    ctx: CanvasRenderingContext2D,
    lines: string[],
    size: number,
    color: string,
    fontFamily: string
  ) => {
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const padding = size * 0.05
    const maxWidth = size - padding * 2
    const maxHeight = size - padding * 2
    let fontSize = size * 0.95
    const lineHeightFactor = lines.length > 1 ? 0.9 : 0.95

    while (fontSize > 10) {
      ctx.font = `bold ${fontSize}px ${fontFamily}`
      const widestLine = Math.max(...lines.map((line) => ctx.measureText(line).width))
      const lineHeight = fontSize * lineHeightFactor
      const totalHeight = lineHeight * lines.length

      if (widestLine <= maxWidth && totalHeight <= maxHeight) {
        break
      }

      fontSize -= 1
    }

    ctx.font = `bold ${fontSize}px ${fontFamily}`
    const lineHeight = fontSize * lineHeightFactor
    const totalHeight = lineHeight * lines.length
    const startY = size / 2 - totalHeight / 2 + lineHeight / 2

    lines.forEach((line, index) => {
      ctx.fillText(line, size / 2, startY + index * lineHeight)
    })
  }

  // 2文字の場合の特殊レイアウト（左右に1文字ずつ、縦に引き伸ばし）
  const drawTwoCharacterLayout = (
    ctx: CanvasRenderingContext2D,
    text: string,
    size: number,
    color: string,
    fontFamily: string
  ) => {
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const [char1, char2] = text.split('')
    const padding = size * 0.02
    const availableWidth = size - padding * 2
    const availableHeight = size - padding * 2
    const targetCharWidth = availableWidth * 0.46

    let fontSize = availableHeight * 0.95
    while (fontSize > 10) {
      ctx.font = `bold ${fontSize}px ${fontFamily}`
      const width1 = ctx.measureText(char1).width
      const width2 = ctx.measureText(char2).width
      const maxWidth = Math.max(width1, width2)

      if (maxWidth <= targetCharWidth) {
        break
      }

      fontSize -= 1
    }

    const verticalScale = availableHeight / (fontSize * 0.92)
    ctx.font = `bold ${fontSize}px ${fontFamily}`
    ctx.save()
    ctx.translate(0, size / 2)
    ctx.scale(1, verticalScale)
    ctx.fillText(char1, size * 0.25, 0)
    ctx.fillText(char2, size * 0.75, 0)
    ctx.restore()
  }

  useEffect(() => {
    drawText()
  }, [text, fontSize, fontFamily, color, canvasSize])

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    // ファイル名：入力文字列の改行を _ に置換
    const filename = text.replace(/\n/g, '_').replace(/[/:*?"<>|]/g, '_') + '.png'
    link.download = filename
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          className="border-2 border-gray-300 rounded"
          style={{ backgroundColor: 'transparent' }}
        />
      </div>
      <button
        onClick={downloadImage}
        disabled={!text}
        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors"
      >
        ダウンロード（PNG）
      </button>
    </div>
  )
}

export default CanvasPreview
