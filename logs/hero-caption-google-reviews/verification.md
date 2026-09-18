# TOP縦書き視認性・口コミカード

対象: hitomin-git/nakamura-hp-preview（既存デザインプレビュー）
規模: M。TOP HTMLと独立CSS・JSの追加。外部APIや依存追加なし。
担当: leader-pm（実装・静的確認）、親エージェント（PC/スマホ実画面QA）。
方針: 写真上の縦書きに生成り94%の背景帯と既存の深緑文字。院長紹介の後にGoogle口コミカードを追加。その他セクション、共有CSS、既存メニューJS、下層ページ、noindexは変更しない。

## 静的確認
- `node --check js/reviews.js` / `node --check js/reviews-data.js`: exit 0、構文エラーなし。
- 空配列・null・不正形式・verified未確認: プレースホルダー保持 PASS。
- 評価0/6/小数、不正出典URL、空の投稿者名: 非表示 PASS。
- 確認済みデータの描画: 星3・5点満点中3点・投稿者名・本文・出典リンク PASS。
- HTMLを含むテスト文字列: textContentとして保持 PASS、HTML挿入なし。
- 出典リンク: HTTPSとGoogleホスト検証、noopener noreferrer PASS。
- 実口コミデータは空配列。架空の評価・投稿者・本文なし。
- 機密情報/個人情報/認証変更/指示外通信追加なし。
- 実装・テストチェックリスト確認済み。

実ブラウザの画面検証結果は親エージェントが別途記録します。

## 実画面QAの途中結果
- PC 1440×1000: 親エージェントの目視確認OK。
- スマホ390×844: 検証中。縦書きが写真上端に近いため、13px文字を維持し、上下paddingを6px・字間を.06emへ調整。再確認待ち。

## 最終画面確認
- PC 1440×1000: TOP文字と口コミ3列を目視確認。横はみ出しなし。
- スマホ390×844: TOP文字と口コミ1列を目視確認。文字帯193.14pxが写真220px内に収まり、上14.86px・下12pxの余白を確保。
- スマホ320×700: 文字帯の収まりを目視確認。全口コミカードのscrollWidthとclientWidthが一致、横はみ出しなし。
- 確認画像: outputs/top-pc.png、top-mobile.png、reviews-pc.png、reviews-mobile.png。
- git diff --check: PASS。
