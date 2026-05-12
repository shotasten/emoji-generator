# 絵文字ジェネレーター：文字サイズ・レイアウト不備に関する調査報告と修正方針

## 1. 現状の課題と原因調査

### 課題
- 文字が指定枠（キャンバス）に対して著しく小さく、余白が多い。
- 2文字入力時に「愛情.png」のような、枠いっぱいに縦長に引き伸ばされたレイアウトになっていない。

### 主な原因
1. **アスペクト比の維持:** Canvasの `fillText` は通常、フォントの縦横比を維持します。そのため、横幅が枠に達した時点でリサイズが止まり、高さ方向に大きな余白が生じています。
2. **2文字専用ロジックの欠如:** 「左右分割 + 垂直方向への引き延ばし」を行うには、通常の描画処理とは別に `ctx.scale(x, y)` を用いた座標圧縮/伸長処理が必要ですが、それが実装されていない可能性が高いです。
3. **フォントメトリクスの無視:** フォント特有の上下余白（アセンダ・ディセンダ）により、数値上のフォントサイズを枠いっぱいに設定しても、視覚的には小さく見えてしまいます。

---

## 2. 対応方針

### ① 2文字時の特殊レンダリング実装
- 入力値が2文字の場合のみ、キャンバスを左右に2分割（50%ずつ）する。
- 各文字を独立して描画し、`ctx.scale` を使用して「横は枠の半分」「縦は枠の100%強」になるよう強制的に変倍をかける。

### ② 動的フォントサイズ計算の最適化
- 1文字や3文字以上の場合は、`ctx.measureText` をループ処理で回し、キャンバス幅の95%に収まる限界の `fontSize` を動的に算出する。
- `textBaseline = 'middle'` を指定し、垂直方向のズレを解消する。

### ③ 余白の最小化
- `textAlign = 'center'` と `textBaseline = 'middle'` を組み合わせ、描画基点を `(width/2, height/2)` に固定して中央配置を徹底する。

---

## 3. 修正用ロジック（JavaScript/Canvas）

```javascript
/**
 * 要件に基づいた高密度描画ロジック
 */
function renderEmoji(ctx, text, canvasSize) {
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  if (!text) return;

  const fontFace = "Rounded M+ 1p black";
  ctx.fillStyle = "#FFB7C5"; // サンプル色
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (text.length === 2) {
    // 【2文字：左右分割・縦長引き延ばし】
    const chars = text.split('');
    chars.forEach((char, i) => {
      ctx.save();
      const centerX = (i === 0) ? canvasSize * 0.25 : canvasSize * 0.75;
      const centerY = canvasSize * 0.5;

      // 1. ベースサイズを設定（キャンバス高さを基準）
      const baseFontSize = canvasSize; 
      ctx.font = `bold ${baseFontSize}px "${fontFace}"`;
      
      // 2. スケーリング倍率の計算
      const metrics = ctx.measureText(char);
      const scaleX = (canvasSize * 0.48) / metrics.width; // 横幅48%に収める
      const scaleY = 1.1; // 縦方向に10%ほど強調して引き伸ばす

      ctx.translate(centerX, centerY);
      ctx.scale(scaleX, scaleY);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    });
  } else {
    // 【通常：最大サイズへのフィッティング】
    let fontSize = canvasSize;
    ctx.font = `bold ${fontSize}px "${fontFace}"`;
    
    // 幅が収まるまでサイズを縮小
    while (ctx.measureText(text).width > canvasSize * 0.95 && fontSize > 10) {
      fontSize -= 2;
      ctx.font = `bold ${fontSize}px "${fontFace}"`;
    }
    ctx.fillText(text, canvasSize / 2, canvasSize / 2);
  }
}