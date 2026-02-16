# 開発者向けメモ

## 変更の重さ判定（実装前チェック）
- 以下のどれか1つでも該当したら `non-trivial` として扱い、`Research → Plan → Annotate → Implement` を必須にする
  - `popup.js` と `background.js` 間のメッセージ契約を変更する
  - タブ/ウィンドウ取得ロジック（対象ウィンドウ、フィルタ条件、圧縮ロジック）を変更する
  - `manifest.json` の権限や MV3 の挙動に影響する項目を変更する
  - 永続化（`chrome.storage.*`）を追加・変更する
  - 複数ファイルにまたがる実装変更を行う
  - CI / pre-commit / リリース手順に影響する変更を行う
  - 原因不明のバグ修正や、タイミング依存・再現不安定な不具合を扱う
- `trivial` とみなせる例
  - 文言修正、README/DEV.md などのドキュメントのみ更新
  - 既存仕様に影響しない軽微な整形
  - 既存ファイル参照を追加するだけの機械的変更（例: アイコンファイル追加 + manifest 参照）
- 判断に迷う場合は `non-trivial` 扱いに倒す
- `non-trivial` のときは、コード編集前に `ai/research.md` と `ai/plan.md` を作成し、明示的な承認後に実装する

## Chrome Web Store へ公開（概要）
1. Chrome Web Store のデベロッパーアカウントを用意する
2. 拡張を ZIP 化して Chrome Developer Dashboard から新規アイテムとしてアップロード
   - 最大 ZIP サイズは 2GB
3. ストア掲載情報（説明・スクリーンショット・アイコン等）を入力して提出
4. 審査完了後に公開

詳細は公式ドキュメント参照:
- 公開手順: https://developer.chrome.com/docs/webstore/publish/
- 審査プロセスと目安: https://developer.chrome.com/docs/webstore/review-process/
- プログラムポリシー: https://developer.chrome.com/webstore/program_policies
