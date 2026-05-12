# 絵文字ジェネレーター

ユーザーが入力したテキストから、LINE絵文字やSlackスタンプとして利用可能な画像（PNG）をリアルタイムで生成・ダウンロードできるWebアプリケーション。

## 🚀 機能

- **リアルタイムプレビュー:** テキスト入力、色選択、フォント切り替えが即座にプレビューに反映
- **自動配置・レイアウト:** 背景色に対して、テキストを中央寄せし、フレーム内に収まるよう自動でサイズ調整
- **特殊配置（2文字時）:** 2文字入力時は左右に1文字ずつ配置
- **10色のプリセットパレット:** さくら、ミモザ、ミント等のパステルカラー
- **カスタムカラー選択:** カラーピッカーと16進数コード入力による自由指定
- **PNG ダウンロード:** 背景透過のPNG形式で出力、改行は`_`に置換したファイル名

## 🛠 技術スタック

- **フロントエンド:** Next.js 14 (App Router), TypeScript
- **スタイリング:** Tailwind CSS
- **画像生成:** HTML5 Canvas API
- **デプロイ:** Vercel対応

## 📦 セットアップ

### 依存関係のインストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスします。

### ビルド

```bash
npm run build
npm start
```

## 📂 プロジェクト構成

```
emoji-generator/
├── app/
│   ├── layout.tsx       # メインレイアウト
│   ├── page.tsx         # ホームページ
│   └── globals.css      # グローバルスタイル
├── components/
│   ├── EmojiGenerator.tsx   # メインコンポーネント
│   ├── CanvasPreview.tsx    # Canvas描画・ダウンロード
│   └── ControlPanel.tsx     # フォント・カラー設定
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── postcss.config.js
```

## 🎨 カラーパレット

| 名前 | カラーコード |
|------|------------|
| さくら | #FFB7C5 |
| ミモザ | #FFF4BD |
| ミント | #C1F0C8 |
| スカイ | #BDE0FE |
| ラベンダー | #E2CCFF |
| ピーチ | #FFDAB9 |
| ピスタチオ | #E9FFC2 |
| シェル | #FFF1E6 |
| コーラル | #FFADAD |
| アイス | #D0F4DE |

## ✨ 使い方

1. テキストを入力（複数行対応）
2. フォントを選択
3. カラーを選択（プリセットまたはカスタム）
4. プレビューを確認
5. 「ダウンロード（PNG）」ボタンでダウンロード
