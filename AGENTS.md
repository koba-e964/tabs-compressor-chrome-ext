# architecture rules – how we structure code here
- Keep MV3 extension logic in `background.js` (service worker) and UI in `popup.*`.
- Use message-based APIs (`chrome.runtime.sendMessage`) to bridge UI and background logic.
- Prefer window-focused behavior via `chrome.windows.getLastFocused({ windowTypes: ["normal"] })`.

# known mistakes – what the ai got wrong and how to fix it
- `chrome.windows.getCurrent()` can point at the extension popup, not the main browser window.
- UI changes in extensions require a reload from `chrome://extensions/` to take effect.
- Selecting output: use a dedicated `textarea` for JSON to avoid `Ctrl+A` selecting the whole popup.

# constraints – security, performance, and cost limits
- `pre-commit` hooks must be pinned to exact commit hashes (tag + hash comment).
- Keep hooks lightweight (formatting/whitespace/json checks only; no heavy tests by default).

# References
- <https://x.com/rohit4verse/status/2020501497377968397>
