const output = document.getElementById("output");
const jsonInput = document.getElementById("jsonInput");

function showResult(result) {
  output.textContent = JSON.stringify(result, null, 2);
}

function showError(error) {
  output.textContent = String(error?.message || error);
}

document.getElementById("btn-specific").addEventListener("click", async () => {
  try {
    const result = await chrome.runtime.sendMessage({
      type: "GET_LAST_FOCUSED_URLS",
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
