# Learned

- 拡張の変更は `chrome://extensions/` でリロードが必要。
- popup は `windows.getCurrent()` だと拡張ウィンドウになることがあるため、通常ウィンドウは `windows.getLastFocused({ windowTypes: ["normal"] })` を使う。
- URL 一覧は `textarea` に出すと `Ctrl+A` でその欄だけ選択できる。
- 取得直後に `navigator.clipboard.writeText()` で自動コピーできる。
