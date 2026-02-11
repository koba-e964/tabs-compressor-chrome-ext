const output = document.getElementById("output");
const jsonInput = document.getElementById("jsonInput");
const copyButton = document.getElementById("btn-copy");
const statusEl = document.getElementById("status");
let statusTimer = null;

function showResult(result) {
  output.value = JSON.stringify(result, null, 2);
}

function showError(error) {
  output.value = String(error?.message || error);
}

function showStatus(message, timeoutMs = 2500) {
  if (!statusEl) {
    return;
  }
  statusEl.textContent = message;
  if (statusTimer) {
    clearTimeout(statusTimer);
  }
  statusTimer = setTimeout(() => {
    statusEl.textContent = "";
    statusTimer = null;
  }, timeoutMs);
}

async function copyOutput() {
  const text = output.value || "";
  if (!text) {
    showError("Nothing to copy.");
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    showStatus("クリップボードにコピーしました!");
  } catch (err) {
    showError("Clipboard write failed.");
  }
}

document.getElementById("btn-specific").addEventListener("click", async () => {
  try {
    const result = await chrome.runtime.sendMessage({
      type: "GET_LAST_FOCUSED_URLS",
    });
    showResult(result);
    await copyOutput();
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
    showError('JSON must be in the form {"urls":[...] }');
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

copyButton.addEventListener("click", async () => {
  copyOutput();
});
