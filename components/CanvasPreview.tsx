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
  const drawText = async () => {
    if (!canvasRef.current) return
    if (typeof document !== 'undefined' && document.fonts) {
      await document.fonts.ready
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const lines = text.split('\n').filter((line) => line.length > 0)
    if (lines.length === 0) return

    const chars = Array.from(text)
    if (chars.length === 2 && lines.length === 1) {
      drawTwoCharacterLayout(ctx, chars, canvasSize, color, fontFamily)
    } else {
      drawNormalLayout(ctx, lines, canvasSize, color, fontFamily)
    }
  }

  const getTextMetrics = (
    ctx: CanvasRenderingContext2D,
    content: string,
    fontSize: number,
    fontFamily: string
  ) => {
    ctx.font = `bold ${fontSize}px ${fontFamily}`
    const metrics = ctx.measureText(content)
    const width =
      typeof metrics.actualBoundingBoxLeft === 'number' &&
      typeof metrics.actualBoundingBoxRight === 'number'
        ? metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight
        : metrics.width
    const ascent =
      typeof metrics.actualBoundingBoxAscent === 'number'
        ? metrics.actualBoundingBoxAscent
        : fontSize * 0.8
    const descent =
      typeof metrics.actualBoundingBoxDescent === 'number'
        ? metrics.actualBoundingBoxDescent
        : fontSize * 0.2
    const height = ascent + descent
    return { width, height, ascent, descent }
  }

  const fitTextBlock = (
    ctx: CanvasRenderingContext2D,
    lines: string[],
    maxWidth: number,
    maxHeight: number,
    fontFamily: string
  ) => {
    const baseSize = 1000
    const lineSpacingFactor = 0.05
    const measured = lines.map((line) =>
      getTextMetrics(ctx, line, baseSize, fontFamily)
    )
    const widestLine = Math.max(...measured.map((metric) => metric.width))
    const totalTextHeight = measured.reduce((sum, metric) => sum + metric.height, 0)
    const lineGap = Math.max(...measured.map((metric) => metric.height)) * lineSpacingFactor
    const totalHeight = totalTextHeight + (lines.length - 1) * lineGap

    const widthScale = maxWidth / widestLine
    const heightScale = maxHeight / totalHeight
    const scale = Math.min(widthScale, heightScale)
    return baseSize * scale
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
    ctx.textBaseline = 'alphabetic'

    const padding = 0
    const availableWidth = size - padding * 2
    const availableHeight = size - padding * 2
    const lineSpacingFactor = 0.05

    const fontSize = fitTextBlock(ctx, lines, availableWidth, availableHeight, fontFamily)
    const metrics = lines.map((line) => getTextMetrics(ctx, line, fontSize, fontFamily))
    const lineHeight = Math.max(...metrics.map((metric) => metric.height))
    const lineGap = lineHeight * lineSpacingFactor
    const totalHeight = metrics.reduce((sum, metric) => sum + metric.height, 0) + (lines.length - 1) * lineGap
    let y = size / 2 - totalHeight / 2

    lines.forEach((line, index) => {
      const metric = metrics[index]
      y += metric.ascent
      ctx.fillText(line, size / 2, y)
      y += metric.descent + lineGap
    })
  }

  // 2文字の場合の特殊レイアウト（左右に1文字ずつ、縦に引き伸ばし）
  const drawTwoCharacterLayout = (
    ctx: CanvasRenderingContext2D,
    chars: string[],
    size: number,
    color: string,
    fontFamily: string
  ) => {
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'

    const [char1, char2] = chars
    const padding = 0
    const gap = 2
    const availableWidth = size - padding * 2
    const availableHeight = size - padding * 2
    const cellWidth = (availableWidth - gap) / 2

    let fontSize = size * 0.86
    const metrics1 = getTextMetrics(ctx, char1, fontSize, fontFamily)
    const metrics2 = getTextMetrics(ctx, char2, fontSize, fontFamily)
    const widthScale = Math.min(cellWidth / metrics1.width, cellWidth / metrics2.width)
    const heightScale = Math.min(availableHeight / metrics1.height, availableHeight / metrics2.height)
    const scale = Math.min(widthScale, heightScale)
    if (scale < 1) {
      fontSize = fontSize * scale
    }

    const finalMetrics1 = getTextMetrics(ctx, char1, fontSize, fontFamily)
    const finalMetrics2 = getTextMetrics(ctx, char2, fontSize, fontFamily)
    const top = size / 2 - availableHeight / 2
    const y1 = top + (availableHeight - finalMetrics1.height) / 2 + finalMetrics1.ascent
    const y2 = top + (availableHeight - finalMetrics2.height) / 2 + finalMetrics2.ascent
    const x1 = padding + cellWidth / 2
    const x2 = padding + cellWidth + gap + cellWidth / 2

    ctx.fillText(char1, x1, y1)
    ctx.fillText(char2, x2, y2)
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
