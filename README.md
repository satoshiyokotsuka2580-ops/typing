# TYPE//LAB v9

## 変更点

- 共有ランキングをモード、レベル、制限時間ごとに分離
- 「この」「その」「あの」「について」などを機械的に付けたデータを全削除
- 初期日本語データは純粋な見出し語300語
- JMdict-Simplifiedから辞書見出し語を最大15,000語抽出する機能を追加

## D1のインデックス更新

```powershell
npx.cmd wrangler d1 execute typing-ranking-db --remote --file=./migrations/0002_duration_indexes.sql
```

既存のランキング行には既にduration列があるため、データ削除は不要です。

## 日本語見出し語を数千語へ増やす

JMdict-Simplifiedの英語版JSONをダウンロードし、プロジェクト外へ保存してから実行します。

```powershell
npm.cmd install
npm.cmd run japanese:import -- C:\path\to\jmdict-eng.json
```

`public/data/japanese.json`が最大15,000語の辞書見出し語へ置き換わります。一般語辞書のJMdictを使い、人名辞書JMnedictは使わないでください。

## 起動

```powershell
npm.cmd run dev
```

## Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- D1 binding: `DB`
