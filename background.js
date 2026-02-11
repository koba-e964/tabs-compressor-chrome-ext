// Service worker for Manifest V3
// Exposes two message types:
// - GET_WINDOW_URLS { windowId: number }
// - GET_CURRENT_WINDOW_URLS

async function getWindowTabUrls(windowId) {
  const tabs = await chrome.tabs.query({ windowId });
  return { urls: tabs.map((t) => t.url).filter(Boolean) };
}

async function getLastFocusedWindowId() {
  const win = await chrome.windows.getLastFocused({ windowTypes: ["normal"] });
  return win?.id;
}

async function getLastFocusedWindowTabUrls() {
  const windowId = await getLastFocusedWindowId();
  if (typeof windowId !== "number") {
    return { urls: [] };
  }
  return getWindowTabUrls(windowId);
}

async function restoreWindowTabUrls(windowId, urls) {
  const sanitized = urls.filter((u) => typeof u === "string" && u.length > 0);
  if (sanitized.length === 0) {
    return { ok: false, error: "No valid URLs provided." };
  }

  const targetWindowId =
    typeof windowId === "number" ? windowId : await getLastFocusedWindowId();

  if (typeof targetWindowId !== "number") {
    return { ok: false, error: "No target window found." };
  }

  await Promise.all(
    sanitized.map((url) =>
      chrome.tabs.create({ windowId: targetWindowId, url }),
    ),
  );

  return { ok: true, count: sanitized.length };
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "GET_WINDOW_URLS" && typeof msg.windowId === "number") {
    getWindowTabUrls(msg.windowId).then(sendResponse);
    return true;
  }

  if (msg?.type === "GET_LAST_FOCUSED_URLS") {
    getLastFocusedWindowTabUrls().then(sendResponse);
    return true;
  }

  if (msg?.type === "RESTORE_WINDOW_URLS") {
    const { windowId, urls } = msg || {};
    restoreWindowTabUrls(windowId, Array.isArray(urls) ? urls : []).then(
      sendResponse,
    );
    return true;
  }

  return false;
});
