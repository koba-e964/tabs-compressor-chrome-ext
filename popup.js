const output = document.getElementById("output");
const windowIdInput = document.getElementById("windowId");

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
