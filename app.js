/*
 * 本棚に並べるPDFは BOOKS 配列に追加してください。
 * PDFファイルはリポジトリ内の pdfs/ フォルダに置く想定です。
 */
const BOOKS = [
  {
    id: "sample-guide",
    title: "はじめてのガイド",
    description: "サイトの使い方を紹介するサンプルPDFです。",
    file: "pdfs/sample.pdf",
    category: "GUIDE",
    color: "#496b58",
    textColor: "#ffffff"
  },
  {
    id: "sample-notes",
    title: "デザインノート",
    description: "制作の記録やアイデアをまとめた資料のサンプルです。",
    file: "pdfs/notes.pdf",
    category: "NOTES",
    color: "#a36c4d",
    textColor: "#ffffff"
  },
  {
    id: "sample-archive",
    title: "アーカイブ 2026",
    description: "過去の資料をまとめたサンプルです。",
    file: "pdfs/archive.pdf",
    category: "ARCHIVE",
    color: "#596b91",
    textColor: "#ffffff"
  }
];

const grid = document.querySelector("#book-grid");
const search = document.querySelector("#search");
const count = document.querySelector("#book-count");
const empty = document.querySelector("#empty-message");
const reader = document.querySelector("#reader");
const frame = document.querySelector("#pdf-frame");
const readerTitle = document.querySelector("#reader-title");

function renderBooks(query = "") {
  const q = query.trim().toLocaleLowerCase("ja");
  const filtered = BOOKS.filter(book =>
    `${book.title} ${book.description} ${book.category}`.toLocaleLowerCase("ja").includes(q)
  );
  grid.replaceChildren();
  count.textContent = `${filtered.length} BOOK${filtered.length === 1 ? "" : "S"}`;
  empty.hidden = filtered.length !== 0;

  filtered.forEach((book, index) => {
    const card = document.createElement("article");
    card.className = "book-card";
    const button = document.createElement("button");
    button.className = "book-open";
    button.type = "button";
    button.setAttribute("aria-label", `${book.title}を読む`);
    const coverWrap = document.createElement("div");
    coverWrap.className = "cover-wrap";
    const cover = document.createElement("div");
    cover.className = "cover";
    cover.style.setProperty("--cover", book.color || "#496b58");
    cover.style.setProperty("--cover-text", book.textColor || "#fff");
    const number = document.createElement("span");
    number.className = "cover-number";
    number.textContent = String(index + 1).padStart(2, "0");
    const title = document.createElement("span");
    title.className = "cover-title";
    title.textContent = book.title;
    const type = document.createElement("span");
    type.className = "cover-type";
    type.textContent = book.category || "PDF DOCUMENT";
    cover.append(number, title, type);
    coverWrap.append(cover);
    button.append(coverWrap);
    button.addEventListener("click", () => openBook(book));

    const meta = document.createElement("div");
    meta.className = "book-meta";
    const heading = document.createElement("h3");
    heading.className = "book-title";
    heading.textContent = book.title;
    const desc = document.createElement("p");
    desc.className = "book-description";
    desc.textContent = book.description || "";
    const link = document.createElement("span");
    link.className = "read-link";
    link.textContent = "読む →";
    meta.append(heading, desc, link);
    card.append(button, meta);
    grid.append(card);
  });
}

function openBook(book) {
  readerTitle.textContent = book.title;
  // viewer query fragment is supported by most desktop browsers.
  frame.src = `${book.file}#view=FitH`;
  reader.dataset.bookId = book.id;
  reader.showModal();
  // GA4: PDFを開いたイベント（GA4設定後に有効）
  if (typeof window.gtag === "function") {
    window.gtag("event", "open_pdf", { pdf_id: book.id, pdf_title: book.title });
  }
  loadComments(book.id);
}

function loadComments(bookId) {
  const container = document.querySelector("#giscus-container");
  container.replaceChildren();
  // Giscus設定値を下記の定数に入力すると、GitHub Discussionsを使ったコメント欄が表示されます。
  const GISCUS = {
    repo: "OWNER/REPOSITORY",
    repoId: "YOUR_REPOSITORY_ID",
    category: "Announcements",
    categoryId: "YOUR_CATEGORY_ID"
  };
  if (GISCUS.repo.includes("OWNER") || GISCUS.repoId.startsWith("YOUR_") || GISCUS.categoryId.startsWith("YOUR_")) {
    const note = document.createElement("p");
    note.className = "setup-note";
    note.textContent = "コメント欄は未設定です。READMEの「コメント機能の設定」を参照してください。";
    container.append(note);
    return;
  }
  const script = document.createElement("script");
  script.src = "https://giscus.app/client.js";
  script.async = true;
  script.crossOrigin = "anonymous";
  script.setAttribute("data-repo", GISCUS.repo);
  script.setAttribute("data-repo-id", GISCUS.repoId);
  script.setAttribute("data-category", GISCUS.category);
  script.setAttribute("data-category-id", GISCUS.categoryId);
  script.setAttribute("data-mapping", "specific");
  script.setAttribute("data-term", `pdf-${bookId}`);
  script.setAttribute("data-strict", "1");
  script.setAttribute("data-reactions-enabled", "1");
  script.setAttribute("data-emit-metadata", "0");
  script.setAttribute("data-input-position", "top");
  script.setAttribute("data-theme", "light");
  script.setAttribute("data-lang", "ja");
  container.append(script);
}

search.addEventListener("input", event => renderBooks(event.target.value));
document.querySelector("#close-reader").addEventListener("click", () => reader.close());
reader.addEventListener("close", () => { frame.src = "about:blank"; });
reader.addEventListener("click", event => {
  if (event.target === reader) reader.close();
});
renderBooks();
