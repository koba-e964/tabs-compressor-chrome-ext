// Service worker for Manifest V3
// Exposes two message types:
// - GET_WINDOW_URLS { windowId: number }
// - GET_CURRENT_WINDOW_URLS

async function getWindowTabUrls(windowId) {
  const tabs = await chrome.tabs.query({ windowId });
  return { urls: tabs.map((t) => t.url).filter(Boolean) };
}

async function getCurrentWindowTabUrls() {
  const win = await chrome.windows.getCurrent();
  const tabs = await chrome.tabs.query({ windowId: win.id });
  return { urls: tabs.map((t) => t.url).filter(Boolean) };
}

async function restoreWindowTabUrls(windowId, urls) {
  const sanitized = urls.filter((u) => typeof u === "string" && u.length > 0);
  if (sanitized.length === 0) {
    return { ok: false, error: "No valid URLs provided." };
  }

  const targetWindowId =
    typeof windowId === "number" ? windowId : (await chrome.windows.getCurrent()).id;

  await Promise.all(
    sanitized.map((url) => chrome.tabs.create({ windowId: targetWindowId, url }))
  );

  return { ok: true, count: sanitized.length };
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "GET_WINDOW_URLS" && typeof msg.windowId === "number") {
    getWindowTabUrls(msg.windowId).then(sendResponse);
    return true;
  }

  if (msg?.type === "GET_CURRENT_WINDOW_URLS") {
    getCurrentWindowTabUrls().then(sendResponse);
    return true;
  }

  if (msg?.type === "RESTORE_WINDOW_URLS") {
    const { windowId, urls } = msg || {};
    restoreWindowTabUrls(windowId, Array.isArray(urls) ? urls : []).then(
      sendResponse
    );
    return true;
  }

  return false;
});
