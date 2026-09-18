# Issue #9 背景色調整確認

- 規模S、対象 `css/reviews.css` の `#approach` のみ。
- ベース: PR #8（`28dc031`）。
- `.concerns-section` の既存色 `#e9ede4` を使用。本文幅・余白を維持し背景のみ全幅に拡張。
- `git diff --check`: PASS。Windows改行変換の予告のみ。
- セキュリティ差分確認: CSSの背景描画のみ。通信・権限・機密情報追加なし。
- 親担当のブラウザ検証: computed backgroundがapproach/concerns両方 `rgb(233,237,228)`。
- PC1151pxおよびスマホ390px設定のスクリーンショットで自然な全幅背景を確認。スマホ実測 `scrollWidth = clientWidth = 375` で横はみ出しなし。PASS。
- ローカルプレビュー: `http://127.0.0.1:8765/index.html#approach`。
- 公開テストURLはmainマージ後の反映。
