# PDF Library（GitHub Pages）

本棚のように複数のPDFを並べ、ブラウザ上で閲覧できる静的サイトのひな形です。アクセス解析はGoogle Analytics 4、コメントはGiscus（GitHub Discussions）を利用します。

## 1. 公開手順

1. GitHubで新しいPublicリポジトリを作成します（例：`pdf-library`）。
2. このフォルダの中身をリポジトリ直下にアップロードします。
3. `pdfs/` に実際のPDFをアップロードします。
4. `app.js` の `BOOKS` 配列を編集し、タイトル・説明・ファイル名などを実際のPDFに合わせます。
5. リポジトリの **Settings → Pages** を開き、**Deploy from a branch**、`main`、`/(root)` を選んで保存します。
6. 数分後に表示されるGitHub PagesのURLを開いて確認します。

## 2. PDFを追加する

`pdfs/` にPDFを追加し、`app.js` の `BOOKS` 配列に1件追加します。

```js
{
  id: "portfolio-2026",       // PDFごとに重複しない英数字ID
  title: "作品集 2026",
  description: "今年度の制作をまとめた作品集です。",
  file: "pdfs/portfolio-2026.pdf",
  category: "PORTFOLIO",
  color: "#496b58",
  textColor: "#ffffff"
}
```

`file` はリポジトリ内の実際のパスに合わせてください。サンプルPDF（sample.pdf等）は実ファイルではないため、削除するか実際のPDFに置き換えてください。

## 3. Google Analytics 4（閲覧数・訪問者数）

1. [Google Analytics](https://analytics.google.com/) でアカウントとGA4プロパティを作成します。
2. Webデータストリームを追加し、GitHub PagesのURLを登録します。
3. 発行された測定ID（`G-`から始まる文字列）を `index.html` のGAコード2か所の `G-XXXXXXXXXX` と置き換えます。
4. HTML内のGAコードを囲む `<!--` と `-->` を削除して有効にします。
5. 公開後、GA4のレポートで「表示回数（Views）」と「アクティブユーザー（Active users）」などを確認します。反映には時間がかかる場合があります。

PDFを開いた回数は `app.js` から `open_pdf` イベントとして送信します。GA4の「イベント」レポートで確認できます。PDFファイルへの直接アクセスや埋め込みビューア内のページ送りは、通常のページビューとは別扱いです。このひな形は「サイトページの閲覧」と「PDFを開いた操作」を計測します。

## 4. コメント機能（Giscus）

GiscusはGitHub Discussionsをコメント欄として利用する仕組みです。コメントする人はGitHubアカウントで認証します。

1. リポジトリをPublicにし、GitHubの **Settings → General → Features → Discussions** を有効にします。
2. Discussionsにコメント用カテゴリ（例：`Announcements`）を作成します。
3. [giscus.app](https://giscus.app/ja) を開き、リポジトリ名を入力して表示される設定を進めます。対象リポジトリにGiscusアプリをインストールし、画面に表示される **Repository ID** と **Category ID** を控えます。
4. `app.js` の `loadComments()` 内にある設定を変更します。

```js
const GISCUS = {
  repo: "あなたのGitHub名/pdf-library",
  repoId: "Giscus画面に表示されたRepository ID",
  category: "Announcements",
  categoryId: "Giscus画面に表示されたCategory ID"
};
```

5. 保存してGitHub Pagesへ反映します。PDFごとに `pdf-<id>` という固有のDiscussionとしてコメントが紐づきます。

Giscusは外部サービスであり、コメント投稿にはGitHubログインが必要です。コメントはリポジトリのDiscussionとして公開されるため、個人情報や公開したくない内容を書かないよう、サイト上にも案内を置くことをおすすめします。

## 5. 注意事項

- GitHub Pagesは静的ホスティングです。コメント本文を独自のデータベースに保存する機能は含めず、Giscusに委ねています。
- アクセス解析ではCookie等の扱いが関係する場合があります。公開対象や利用地域に応じてプライバシー告知・同意取得の要否を確認してください。
- PDFをサイト内で表示しても、ファイルURLを知る人が直接開ける場合があります。閲覧制限や機密文書の保護が必要な用途には使わないでください。
- PDFを埋め込み表示する方式はブラウザにより操作感が異なります。統一したページ送りUIが必要なら、PDF.jsビューアへの切り替えを検討してください。
