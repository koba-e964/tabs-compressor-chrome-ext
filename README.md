# Window Tabs JSON

Chrome 拡張で、特定のウィンドウにあるタブの URL を JSON で取得し、同じ形式の JSON から復元できます。

## 機能
- 最後にフォーカスされた通常ウィンドウのタブ URL を取得
- 取得した JSON をクリップボードへ自動コピー
- `{"urls":[...]}` 形式の JSON からタブを復元

## 使い方
1. Chrome で `chrome://extensions/` を開く
2. 右上の「デベロッパーモード」を ON
3. 「パッケージ化されていない拡張機能を読み込む」からこのフォルダを選択
4. 拡張アイコンをクリックして popup を開く
5. `urls を取得 & コピー` を押すと、URL 一覧の JSON が表示され、クリップボードにコピーされる
6. `urls を復元` に JSON を貼り付けて復元する

## JSON 形式
```json
{"urls":["https://example.com","https://openai.com"]}
```

## 開発メモ
- 変更後は `chrome://extensions/` で拡張をリロードしてください
- pre-commit を使う場合は次を実行
```bash
pre-commit install
pre-commit run --all-files
```
