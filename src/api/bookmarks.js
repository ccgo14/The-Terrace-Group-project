const STORAGE_KEY = "bookmarks";

export function getBookmarks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addBookmark(articleId) {
  try {
    const bookmarks = getBookmarks();
    if (!bookmarks.includes(articleId)) {
      bookmarks.push(articleId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    }
    return bookmarks;
  } catch {
    return [];
  }
}

export function removeBookmark(articleId) {
  try {
    const bookmarks = getBookmarks().filter((id) => id !== articleId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    return bookmarks;
  } catch {
    return [];
  }
}

export function isBookmarked(articleId) {
  return getBookmarks().includes(articleId);
}
