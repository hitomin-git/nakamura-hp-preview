# Issue #11 結合テスト

初回実行 `node logs/11/integration-check.cjs` は `AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal` (exit code 1)。GitのLFと作業ツリーのCRLFを比較したテスト側の不備であり、セクション比較の改行コードを正規化して再実行した。サイトコードは変更していない。以下は修正後の実際の結果。Gitから `warning: unable to access 'C:\Users\hitom/.config/git/ignore': Permission denied` が出たが、比較コマンドは終了コード0。

対象: fix/11-deliver-preview-to-main。チェックリスト確認済み。指定 .Codex/CHECKLISTS.md は存在せず、司令塔 .claude/CHECKLISTS.md を代用。
ブラウザ操作は依頼範囲外。DOMスタブでデータ読込→カード生成→補助文削除を通し検証する。

```text
> git rev-parse HEAD
f8f4075afffdb16f4765156455cf4c0059b8f48b
exit code: 0
```

```text
> git rev-parse origin/main
050b9bcfd35baebf13e14978c7874893a53852c3
exit code: 0
```

```text
> git diff --name-only 447fa5f HEAD
(出力なし)
exit code: 0
```

```text
> git diff 447fa5f -- index.html css js picture concerns
(出力なし)
exit code: 0
```

- PASS 447fa5f と復旧HEADの全追跡ファイル一致。作業ツリーのサイトファイルも一致。
```text
> git diff --name-only origin/main HEAD
css/reviews.css
index.html
js/reviews.js
logs/5/verification.md
logs/7/verification.md
logs/9/verification.md
exit code: 0
```

```text
> git diff origin/main HEAD -- css/reviews.css js/reviews.js
diff --git a/css/reviews.css b/css/reviews.css
index 3e1a319..17055f0 100644
--- a/css/reviews.css
+++ b/css/reviews.css
@@ -1,4 +1,9 @@
 /* TOP-only refinements, loaded after the shared mobile stylesheet. */
+#approach {
+  background: #e9ede4;
+  box-shadow: 0 0 0 100vmax #e9ede4;
+  clip-path: inset(0 -100vmax);
+}
 .hero .photo-caption {
   color: var(--ink);
   background: rgba(246, 244, 237, .94);
@@ -10,23 +15,20 @@
 }
 .reviews-section { border-top: 1px solid var(--line); }
 .reviews-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
-.review-card { display: flex; flex-direction: column; min-width: 0; padding: 27px 25px; background: #fcfbf7; border: 1px solid var(--line); border-radius: 3px; }
+.review-card { display: flex; flex-direction: column; min-width: 0; padding: 18px; background: #fcfbf7; border: 1px solid var(--line); border-radius: 3px; }
 .review-source { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; font-size: 12px; }
 .review-status { color: var(--muted); font-size: 10px; padding: 2px 8px; background: #eef0e9; }
-.review-rating { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin: 22px 0 17px; font-size: 11px; color: var(--muted); }
+.review-rating { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin: 0; font-size: 11px; color: var(--muted); }
 .review-stars { color: #8b6c37; font-size: 19px; letter-spacing: .12em; white-space: nowrap; line-height: 1.5; }
 .review-placeholder .review-stars { color: var(--muted); }
-.review-body { font-size: 14px; line-height: 2; overflow-wrap: anywhere; white-space: pre-line; }
-.review-author { display: flex; align-items: center; gap: 10px; margin-top: auto; padding-top: 22px; border-top: 1px solid var(--line); font-size: 11px; overflow-wrap: anywhere; }
+.review-body { margin: 0 0 12px; font-size: 14px; line-height: 2; overflow-wrap: anywhere; white-space: pre-line; }
+.review-author { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; margin-top: auto; padding-top: 10px; border-top: 1px solid var(--line); font-size: 11px; overflow-wrap: anywhere; }
 .review-avatar { display: grid; place-items: center; flex: 0 0 32px; height: 32px; background: #e9ede4; border-radius: 50%; font-size: 13px; }
 .review-link { display: inline-block; font-size: 12px; margin-top: 15px; text-decoration: underline; text-underline-offset: 4px; }
 .reviews-note { color: var(--muted); font-size: 12px; margin: 22px 0 0; }
-@media (max-width: 1000px) { .reviews-grid { gap: 16px; } .review-card { padding: 22px 18px; } }
+@media (max-width: 1000px) { .reviews-grid { gap: 16px; } }
 @media (max-width: 760px) {
   .hero .photo-caption { padding: 6px 7px; font-size: 13px; letter-spacing: .06em; bottom: 12px; right: 14px; }
   .reviews-grid { grid-template-columns: minmax(0, 1fr); gap: 14px; }
-  .review-card { padding: 22px; }
-  .review-body { margin-bottom: 20px; }
-  .review-rating { margin: 18px 0 14px; }
-  .review-author { padding-top: 16px; }
+  .review-card { padding: 14px; }
 }
diff --git a/js/reviews.js b/js/reviews.js
index 9152abc..8917063 100644
--- a/js/reviews.js
+++ b/js/reviews.js
@@ -25,16 +25,16 @@
     const rating = element('div', 'review-rating');
     const stars = element('span', 'review-stars', '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating));
     stars.setAttribute('aria-hidden', 'true');
-    rating.append(stars, element('span', '', `5点満点中${review.rating}点`));
-    card.append(rating, element('p', 'review-body', review.text));
+    rating.setAttribute('role', 'img');
+    rating.setAttribute('aria-label', `5点満点中${review.rating}点`);
+    rating.append(stars);
+    card.append(element('p', 'review-body', review.text));
     const author = element('div', 'review-author');
-    const avatar = element('span', 'review-avatar', '声');
-    avatar.setAttribute('aria-hidden', 'true');
-    author.append(avatar, element('span', '', review.author));
+    author.append(rating, element('span', '', review.author));
     card.append(author);
     return card;
   });
   grid.replaceChildren(...cards);
-  document.getElementById('reviews-intro').textContent = '公式HPに掲載しているお客様の声をご紹介します。';
+  document.getElementById('reviews-intro').remove();
   document.getElementById('reviews-note').remove();
 })();
exit code: 0
```

- PASS mainとの差分は口コミUI/CSS背景・セクション順・過去ログのみ。セクション本文とそれ以外のHTMLは同一。
```text
> node --check js/main.js
(出力なし)
exit code: 0
```

```text
> node --check js/reviews-data.js
(出力なし)
exit code: 0
```

```text
> node --check js/reviews.js
(出力なし)
exit code: 0
```

```text
> git diff --check origin/main HEAD
(出力なし)
exit code: 0
```

```text
> git diff --check
(出力なし)
exit code: 0
```

- PASS 全JS構文とgit diff --check正常。
- PASS データ→DOM: 3カードで本文→星→属性の順、本文/属性を欠損なく維持。声アバター・可視点数・紹介文・出典注記・リンクなし。読み上げ点数は維持。
- PASS 0件・不正点数・許可外URLで例外なし、準備中表示を維持。

総合: PASS

制限: DOMスタブはブラウザ描画・レスポンシブ配置を検証しない。ブラウザ再操作は依頼に従い未実施。mainはローカルorigin/mainを比較基準とした。

再現コマンド: `node logs/11/integration-check.cjs`。上記PASS行は同コマンドの実際の標準出力。
