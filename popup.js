const output = document.getElementById("output");
const windowIdInput = document.getElementById("windowId");
const jsonInput = document.getElementById("jsonInput");

function showResult(result) {
  output.textContent = JSON.stringify(result, null, 2);
}

function showError(error) {
  output.textContent = String(error?.message || error);
}

chrome.windows.getCurrent().then((win) => {
  if (win?.id != null) {
    windowIdInput.value = String(win.id);
  }
});

document.getElementById("btn-current").addEventListener("click", async () => {
  try {
    const result = await chrome.runtime.sendMessage({
      type: "GET_CURRENT_WINDOW_URLS",
    });
    showResult(result);
  } catch (err) {
    showError(err);
  }
});

document.getElementById("btn-specific").addEventListener("click", async () => {
  try {
    const value = windowIdInput.value.trim();
    if (!value) {
      showError("Window ID is required for this button.");
      return;
    }

    const result = await chrome.runtime.sendMessage({
      type: "GET_WINDOW_URLS",
      windowId: Number(value),
    });
    showResult(result);
  } catch (err) {
    showError(err);
  }
});

async function restoreUrls(windowId) {
  let payload;
  try {
    payload = JSON.parse(jsonInput.value || "");
  } catch (err) {
    showError("Invalid JSON.");
    return;
  }

  if (!payload || !Array.isArray(payload.urls)) {
    showError("JSON must be in the form {\"urls\":[...] }");
    return;
  }

  try {
    const result = await chrome.runtime.sendMessage({
      type: "RESTORE_WINDOW_URLS",
      windowId,
      urls: payload.urls,
    });
    showResult(result);
  } catch (err) {
    showError(err);
  }
}

document
  .getElementById("btn-restore-current")
  .addEventListener("click", async () => {
    restoreUrls(undefined);
  });

document
  .getElementById("btn-restore-specific")
  .addEventListener("click", async () => {
    const value = windowIdInput.value.trim();
    if (!value) {
      showError("Window ID is required for this button.");
      return;
    }
    restoreUrls(Number(value));
  });
