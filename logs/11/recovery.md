# Issue #11 mainへの反映復旧

## 確認した状態

| PR | 状態 | 実際のマージ先 | merge commit |
| --- | --- | --- | --- |
| #4 | MERGED | main | 050b9bc |
| #6 | MERGED | fix/3-remove-review-source | 736ee7d |
| #8 | MERGED | fix/3-remove-review-source | e7f6a13 |
| #10 | MERGED | fix/3-remove-review-source | f8f4075 |

後続PRのbaseがmainではなかったため、後続の変更がmainへ到達していなかった。ブランチ削除忘れによる変更消失ではない。

## 復旧方針

- 全変更を保持した `origin/fix/3-remove-review-source` から専用branch `fix/11-deliver-preview-to-main` を作成。
- PRのbaseを明示的に `main` とし、1回のレビュー・マージで未反映分を届ける。
- 初期確認で最終ローカルプレビュー `447fa5f` と復旧元 `f8f4075` のtree diffは空。
- mainとの差分は既存サイト3ファイルと検証ログのみ。新しいUI変更は加えない。
- 既存ブランチの削除、force push、mainへの直接push/mergeは実施しない。
- 連携検証の詳細は `logs/11/integration-test.md` を参照。
- leaderによるmainとの差分セキュリティ確認: 既存表示調整・HTML順序変更のみ。新たな通信先、権限拡大、機密情報の追加なし。
