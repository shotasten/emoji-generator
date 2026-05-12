'use client'

interface ControlPanelProps {
  fontFamily: string
  onFontChange: (font: string) => void
  color: string
  onColorChange: (color: string) => void
}

const PRESET_COLORS = [
  { name: 'さくら', value: '#FFB7C5' },
  { name: 'ミモザ', value: '#FFF4BD' },
  { name: 'ミント', value: '#C1F0C8' },
  { name: 'スカイ', value: '#BDE0FE' },
  { name: 'ラベンダー', value: '#E2CCFF' },
  { name: 'ピーチ', value: '#FFDAB9' },
  { name: 'ピスタチオ', value: '#E9FFC2' },
  { name: 'シェル', value: '#FFF1E6' },
  { name: 'コーラル', value: '#FFADAD' },
  { name: 'アイス', value: '#D0F4DE' },
]

const FONTS = [
  'Rounded M+ 1p black',
  // 'たぬき油性マジック' は後で対応予定
]

const ControlPanel: React.FC<ControlPanelProps> = ({
  fontFamily,
  onFontChange,
  color,
  onColorChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="space-y-6">
        {/* フォント選択 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            フォント
          </label>
          <select
            value={fontFamily}
            onChange={(e) => onFontChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {FONTS.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>

        {/* カラーパレット */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            カラー（プリセット）
          </label>
          <div className="grid grid-cols-5 gap-2">
            {PRESET_COLORS.map((presetColor) => (
              <button
                key={presetColor.value}
                onClick={() => onColorChange(presetColor.value)}
                className={`p-3 rounded-lg transition-transform hover:scale-110 ${
                  color === presetColor.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                }`}
                style={{ backgroundColor: presetColor.value }}
                title={presetColor.name}
              />
            ))}
          </div>
        </div>

        {/* カスタムカラー */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            カラー（カスタム）
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => onColorChange(e.target.value)}
              placeholder="#FFB7C5"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ControlPanel
