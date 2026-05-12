# emoji-generator 180x180向け レイアウト改善方針

## 現状の問題

Canvasサイズ自体は：

```txt
180 x 180
```

になっている。

しかし：

```txt
文字が小さい
余白が大きい
2文字レイアウトがスカスカ
```

状態になっている。

---

# 根本原因

現在の実装は：

```txt
理論上のfit
```

を優先しすぎている。

しかし実際のLINE絵文字系では：

```txt
多少はみ出してでも
見た目で大きく見せる
```

ことが重要。

---

# 問題1

## scale に `1` 制限が入っている

現在：

```ts
const scale = Math.min(
  widthScale,
  heightScale,
  1
)
```

になっている。

---

# 問題

これにより：

```txt
scale <= 1
```

に固定される。

つまり：

```txt
baseSize以上に拡大できない
```

状態。

---

# 修正

```ts
const scale = Math.min(
  widthScale,
  heightScale
)
```

へ変更する。

---

# 問題2

## baseSize が小さすぎる

現在：

```ts
const baseSize = 300
```

になっている。

---

# 問題

Canvas の measureText は：

- 小サイズ
- 日本語
- 太字
- 丸文字

で誤差が大きい。

特に：

```txt
Rounded M+
```

系フォントでは：

```txt
指定サイズ ≠ 実際の見た目サイズ
```

になりやすい。

---

# 修正

```ts
const baseSize = 1000
```

へ変更する。

---

# 問題3

## measureText().width を信用しすぎている

現在：

```ts
metrics.width
```

をfit計算に使用している。

しかし日本語では：

```txt
width が大きく出すぎる
```

ケースが多い。

---

# 修正

fit計算は：

```ts
actualBoundingBoxLeft +
actualBoundingBoxRight
```

を優先使用する。

---

# 推奨

```ts
const width =
  metrics.actualBoundingBoxLeft +
  metrics.actualBoundingBoxRight
```

---

# 問題4

## padding が大きすぎる

現在：

```ts
const padding = size * 0.03
```

180px canvasでは：

```txt
5.4px
```

になる。

左右で：

```txt
10.8px
```

失われる。

---

# 修正

180x180専用なら：

```ts
const padding = 0
```

推奨。

---

# 問題5

## 2文字 gap が広すぎる

現在：

```ts
const gap = size * 0.06
```

180pxでは：

```txt
10.8px
```

になる。

---

# 問題

結果：

```txt
1文字あたりの利用幅が
約80pxしかない
```

状態になる。

---

# 修正

固定値推奨：

```ts
const gap = 2
```

または：

```ts
const gap = size * 0.01
```

---

# 問題6

## 2文字レイアウトが「理論fit」になっている

現在：

```txt
measureTextベース
```

でサイズを決定している。

しかし：

```txt
漢字は縦長
```

のため、

理論fitすると：

```txt
小さくなりすぎる
```

。

---

# 修正方針

2文字時は：

```txt
視覚優先
```

へ変更する。

---

# 推奨

## 2文字時は固定比率で決める

```ts
const fontSize = size * 0.86
```

推奨。

---

# 理由

LINE絵文字系では：

```txt
多少はみ出すくらいが
ちょうどよい
```

ため。

---

# 問題7

## 行間計算が二重加算になっている

現在：

```ts
lineHeight =
  maxHeight * (1 + lineSpacingFactor)
```

の後に、

さらに：

```ts
lineHeight * lineSpacingFactor
```

を追加している。

---

# 問題

行間が大きくなりすぎる。

---

# 修正

## gap を分離

```ts
const lineGap =
  lineHeight * lineSpacingFactor
```

---

# totalHeight

```ts
const totalHeight =
  totalTextHeight +
  (lines.length - 1) * lineGap
```

---

# 描画側

```ts
y += metric.descent + lineGap
```

---

# 問題8

## 実際のLINE系スタイルは「視覚fit」

現在のコードは：

```txt
数学的に正しいfit
```

を目指している。

しかしLINE絵文字は：

```txt
見た目が大きいこと
```

が最優先。

---

# つまり必要なのは

```txt
安全fit
```

ではなく：

```txt
視覚fit
```

。

---

# 推奨最終方針

## 通常文字

### 修正

```ts
const padding = 0
const baseSize = 1000
```

---

## fit

```ts
const scale = Math.min(
  widthScale,
  heightScale
)
```

---

# 2文字

## 修正

```ts
const gap = 2
```

---

## fontSize

```ts
const fontSize = size * 0.86
```

---

## 配置

左右均等配置。

---

# 最優先修正項目

## 1

```ts
Math.min(..., 1)
```

削除。

---

## 2

```ts
baseSize = 1000
```

---

## 3

```ts
padding = 0
```

---

## 4

```ts
gap = 2
```

---

## 5

2文字時を固定fontSize化。

---

# 結論

現在の問題は：

```txt
「理論的に安全なfit」
をやりすぎて、
視覚的に小さくなっている
```

こと。

180x180 のLINE絵文字系では：

```txt
多少はみ出すくらい
```

を前提にした：

```txt
視覚fitベース
```

の実装へ変更する必要がある。
