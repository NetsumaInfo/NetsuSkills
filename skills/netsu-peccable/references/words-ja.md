# Japanese: words and typography

Load before writing or reviewing a Japanese string. `scripts/scan.mjs` reads the three
`## Lexicon` tables below, so keep each row to three cells: backticked patterns first, `block` or
`check` last. Japanese has no spaces between words, so the scan matches each pattern as a plain
substring, with no word boundary: every pattern is long enough not to hide inside an ordinary
word. `block` is wrong in any UI. `check` means read it in context. The word in brackets at the
end of a hint gives its basis: (guide) a style guide rule listed in `## Sources`, (listed) named
in a dated list of AI tells but never measured, (house) a house rule with no measurement.

## Register

`## Voice` in `DESIGN.md` records five choices for Japanese: sentence style on its `Address`
line, the other four on its `Script conventions` line. Where the file is silent, setup writes the
Default column below, or the alternative the code already uses. Never mix two in one product.

| Choice | Default | Alternative |
|---|---|---|
| Sentence style | です・ます体 | 常体, only for a product whose whole voice is casual |
| Button form | Bare noun: `保存`, `削除` | Verb with する: `削除する` |
| Space between Japanese and Latin or digits | None: `Word文書` | Half-width space: `Word 文書` |
| `？` `！` | Full-width | Half-width, Microsoft's software convention |
| Ellipsis in UI labels | `…` (U+2026) | `...`, Microsoft's software convention |
| Colon after Japanese text | Full-width `：` | Half-width `:`, Microsoft's software convention |

The scan's `cjk-punct` flags a half-width `,` `.` or `;` next to Japanese text; `：` `？` `！`
follow this table.

- **です・ます体 for sentences.** Messages, dialogs, empty states, emails. Instructions end in
  `〜してください`. Microsoft Japanese style guide, section 4.2 (PDF modified 2024-09-05); the
  government guide asks for です・ます in documents for the public (文化審議会,
  「公用文作成の考え方」, 2022-01-07).
- **常体 and noun phrases where there is no sentence.** Check boxes and options take 常体
  (`パスワードを記憶する`). Menus, tabs, titles and buttons take a noun phrase. Headings stay 常体 or
  体言止め even when the body is です・ます (JTF style guide 3.0, 2019-08-20). Never mix
  です・ます and 常体 inside one message or one list.
- **Buttons.** A kango noun drops する: `追加`, `削除`, `保存`. A native verb stays in dictionary
  form: `戻る`, `閉じる`, `取り消す`. With an object, use を: `権限を追加`. A screen title uses の:
  `権限の追加` (SmartHR Design System, button rule consolidated 2024-12-18, read 2026-09-16).
  Microsoft also puts command buttons in noun form. `削除する` is not wrong; it is a product-wide
  choice.
- **No subject.** Drop あなた and 私たち: `プロジェクト`, not `あなたのプロジェクト`. Use `弊社`
  only in a very formal notice (Microsoft 4.1.8).
- **Questions.** `このまま続けますか？`, not `続けてもよろしいですか？` (Microsoft 4.2).
- **No honorific chains.** No 尊敬語 or 謙譲語 in UI text, except where the product sells to
  customers and the brand is formal (Microsoft 4.2). `〜させていただきます` fits only when the
  reader grants permission and the writer benefits. Otherwise `〜いたします`:
  `本日、休業いたします` (文化審議会, 「敬語の指針」, 2007-02-02, question 18). SmartHR turns
  `ご確認いただけますようお願いいたします` into `確認してください`.
- **Cut padding.** `することができます` becomes `できます`; `削除を行う` becomes `削除する`
  (SmartHR writing principles; Microsoft 2.1.2 turns `が可能です` into `できます`).
- **Short sentences, one point each** (「公用文作成の考え方」). Read bare `OK` and `はい` buttons
  yourself and name the action instead.

## Typography

| Case | Write | Notes |
|---|---|---|
| Sentence punctuation | `保存しました。次に進みます。` | Full-width `、` `。`, no space before or after them |
| Quotes | `「setup」と入力します` | `「」` for quoted or typed text, `『』` for titles and quotes inside quotes (Microsoft 4.1.9) |
| Letters and digits | `12345`, `abc` | Half-width. Never `１２３４５` (JTF rule 8). Kana are full-width, never `ｶﾀｶﾅ` (JTF rule 7) |
| Japanese next to Latin | `Word文書` or `Word 文書` | See below. One convention per product |
| Question, exclamation | `変更を保存しますか？` | JTF: full-width, rare in body text, a space after them when a sentence follows. Microsoft uses half-width `?` `!` in software |
| Ranges | `0から99` or `0-99` | Microsoft 4.1.9: the full-width wave dash `～` breaks some builds |
| Counters | `3か月`, `5か所` | Not `ヶ月`, `ケ月`, `カ月` (Microsoft 4.1.3; 「公用文作成の考え方」) |
| Money | `1,234円` | `Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' })` gives `￥1,234` with the full-width U+FFE5 (Node 22). Pick one form |
| Large numbers | `1235万` | `Intl.NumberFormat('ja-JP', { notation: 'compact' })`. Commas every three digits otherwise |
| Date | `2026年9月16日` | `dateStyle: 'long'`. `'medium'` gives `2026/09/16`, `'full'` adds `水曜日` |
| Time | `15:30` | `Intl.DateTimeFormat('ja-JP')` is 24-hour by default |
| Ellipsis | `読み込み中…`, `その他…` | U+2026 in UI. `……` (two U+2026) when a sentence trails off, as the government guide allows. Microsoft writes `変更...` on labels |
| Long vowel | `コンピューター`, `ユーザー`, `サーバー` | JTF rule 5 keeps every final ー. Microsoft 4.1.11 keeps it after -er, -or, -ar and in words under four characters, so writes `メモリ`. One rule per product |
| Katakana compounds | `ダイアログボックス` or `ダイアログ ボックス` | JTF rule 6: no separator, a half-width space, or `・`, one choice per product. Microsoft uses the space |
| Okurigana | `取り消す`, `申し込む` | Not `取消す` (JTF rule 4) |
| Helper words in kana | `ください`, `いただく`, `できる` | Not `下さい`, `頂く`, `出来る` (「公用文作成の考え方」) |
| Plural | `{count}件` | `Intl.PluralRules('ja')` has one category, `other`. Never `件(s)` |

Space between Japanese and Latin text or digits: the three sources disagree, so the product
chooses.

- W3C JLReq (Group Note, 2020-08-11): in principle a quarter-em gap, set by the layout engine,
  not a typed character.
- JTF style guide 3.0 (2019-08-20), rule 10: no space. `JTF標準`, not `JTF 標準`.
- Microsoft Japanese style guide 4.1.11: a half-width space (`Word を使用`, `PC に`), except next
  to `、` `。`, brackets, a slash, and before `?` `!` `:` `...`.
- For the JLReq gap without typed spaces, set CSS `text-autospace: normal` explicitly (MDN,
  Baseline 2025, page modified 2026-04-20) rather than trusting each browser's initial value.

Line breaks: set `lang="ja"` on the page. For headings and buttons, `word-break: auto-phrase`
wraps at phrase boundaries (Chrome 119, Japanese only, Chrome for Developers, 2023-12-04).

In JSON or JSX, type Japanese characters as they are in a UTF-8 file.

## Length

- Japanese uses fewer characters than English but each is wider: `デスクトップ` has one character
  less than `desktop` and takes more room (W3C Internationalization, "Text size in translation",
  read 2026-09-16). Microsoft 2.1.3 asks for short translations for the same reason.
- CJK text needs more line height than Latin text (same W3C page). Check the string in the real
  component at its narrowest width.
- A button stays on one line. Shorten the words, never truncate a button with `…`.

## Choosing between two words

The glossary in `DESIGN.md` wins over everything below.

Katakana loanword or native word:

1. **Different meaning: take the one that means it.** `キャンセル` stops an action not yet done;
   `取り消し` undoes one already done (SmartHR, 「操作を表す用語」, read 2026-09-16). A sent request
   gets `申請を取り消す`, an open dialog gets `キャンセル`.
2. **Settled loanword: keep it.** `ストレス`, `リサイクル`, `メール`, `アプリ`.
3. **Loanword readers may not know: replace it.** `アジェンダ` → `議題`, `インタラクティブ` →
   `双方向`, `サプライヤー` → `仕入先` (「公用文作成の考え方」, which points to the 国立国語研究所
   「外来語」言い換え提案, 2006).
4. **Still tied: prefer the kanji or kana word.** SmartHR's reason: katakana words carry more
   varied meanings across readers.
5. **Everyday over formal** (Microsoft 2.1.3): `アプリ` over `アプリケーション`, `メール` over
   `電子メール`, `もう一度` over `再度`, `詳しい` over `詳細な`, `選ぶ` over `選択する` in a
   sentence (`選択` stays on a button).

Tie-breaker between two plain words: TUBELEX-ja, word frequencies from Japanese YouTube
subtitles (Nohejl et al., COLING 2025, January 2025; lists and code under BSD-3-Clause, on
GitHub at naist-nlp/tubelex). Its authors report it beats film-subtitle frequencies on
lexical complexity for English and Japanese. Fallback: `wordfreq` (data CC BY-SA 4.0, frozen at
about 2021 usage). No SUBTLEX list for Japanese was found (searched 2026-09-16). Look words up;
never copy the data into the project.

Pairs worth a lookup: `使用する` / `使う`, `作成する` / `作る`, `変更する` / `変える`,
`開始する` / `始める`, `取得する` / `入手する`, `実施する` / `行う`.

## Lexicon: politeness and filler

| Pattern | Write instead | Level |
|---|---|---|
| `させていただ` `させて頂` | "いたします" or the plain verb: "休業いたします". Fine only when the reader grants permission (guide) | check |
| `いただけますよう` | "〜してください": "確認してください" (guide) | check |
| `することができ` | "できます": "保存できます" (guide) | block |
| `が可能です` `が可能になります` | "できます": "利用できます" (guide) | check |
| `を行います` `を行ってください` `を行う` | The verb itself: "削除します" (guide) | check |
| `よろしいですか` | Name the action: "プロジェクトを削除しますか？" (guide) | check |
| `申し訳ございません` `申し訳ありません` | Delete in errors. Apologize only for real harm: an outage, lost data (house) | check |
| `ご不便をおかけ` | Say what broke and when it works again (house) | check |
| `予期しないエラー` `予期せぬエラー` `不明なエラー` | Say what failed and what to do: "保存できませんでした。もう一度お試しください。" (house) | block |
| `エラーが発生しました` | Name what failed: "ファイルを読み込めませんでした" (house) | check |
| `正常に完了` `正常に終了しました` | Drop "正常に": "保存しました" (house) | check |
| `無効です` `無効な` | Show the expected format: "半角数字で入力してください". "無効にする" as a setting is fine (guide) | check |
| `こちらをクリック` `ここをクリック` `こちらをタップ` | Put the link on the words that say where it goes (house) | block |
| `クリックしてください` | Name the action; on touch screens, "タップ" (house) | check |
| `少々お待ちください` `しばらくお待ちください` | Say what is happening and how far along: "書き出し中（3/12）…" (house) | check |
| `あなたの` `あなたは` | Drop the subject: "プロジェクト", not "あなたのプロジェクト" (guide) | check |
| `弊社` | "私たち" or the company name. Keep only in a formal notice (guide) | check |
| `ユーザー様` `ユーザ様` | "お客様", or no address at all (house) | check |

## Lexicon: hype and AI tells

| Pattern | Write instead | Level |
|---|---|---|
| `いかがでしたか` `いかがでしたでしょうか` | Delete. Fine as a real survey question (listed) | check |
| `と言えるでしょう` `といえるでしょう` | State it: "〜です" (listed) | block |
| `と考えられます` | State it, or name who thinks so (listed) | check |
| `探っていきましょう` `深掘りしていきましょう` | Delete. Show the content (listed) | block |
| `結論として` `結論から言うと` | Delete. A screen has no conclusion (listed) | check |
| `一概には言えません` | Give the rule that applies here (listed) | block |
| `非常に重要` | Delete, or say why it matters (listed) | check |
| `ご質問ありがとうございます` | Delete. Answer the question (listed) | check |
| `驚くほど` | Delete, or give the number (listed) | check |
| `一方で` | Keep only when a real trade-off applies to this reader (listed) | check |
| `——` | "、" or two sentences (listed) | check |
| `シームレス` | Say what is gone: "設定不要" (house) | block |
| `革新的` `画期的` | Delete. Say what is new (house) | block |
| `と言っても過言では` | Delete (house) | block |
| `圧倒的` `究極の` `唯一無二` `ゲームチェンジャー` | Delete (house) | block |
| `可能性を広げ` `可能性を解き放` `ポテンシャルを最大` | Say what the person can now do (house) | block |
| `次のレベル` `ワンランク上` | Say what improves, with a number. Fine in a game (house) | check |
| `旅を始め` `冒険を始め` | Name the first step. Fine in a travel product or a game (house) | check |
| `最先端` `次世代` | Keep only with a spec or a benchmark (house) | check |
| `ぜひ` | Delete. The button already asks (house) | check |
| `簡単に` `かんたんに` `手軽に` | Delete in instructions; give the steps or the time: "2クリックで" (house) | check |
| `直感的` | Show it, do not claim it (house) | check |
| `パワフル` `強力な` | Say what it handles: "4GBのファイルを開けます". "強力なパスワード" is fine (house) | check |
| `包括的` `多岐にわたる` | Say what it covers (house) | check |
| `ソリューション` | Name the thing: "アプリ", "ツール" (house) | check |
| `を実現します` `を可能にします` | "〜できます" (house) | check |
| `ワンストップ` | Say what is in one place (house) | check |

## Lexicon: loanwords, jargon and spelling

| Pattern | Write instead | Level |
|---|---|---|
| `アジェンダ` | "議題" (guide) | check |
| `インタラクティブ` | "双方向", or say what reacts (guide) | check |
| `エビデンス` | "根拠", "証拠" (house) | check |
| `スキーム` | "仕組み". "URLスキーム" is fine (house) | check |
| `ローンチ` | "公開", "提供開始" (house) | check |
| `アサイン` | "割り当て", "担当にする" (house) | check |
| `オンボーディング` | "はじめに", "初期設定" (house) | check |
| `ワークフロー` | "手順", "作業の流れ" (house) | check |
| `アセット` | The concrete word: "素材", "ファイル" (house) | check |
| `インスタンス` | The name users know: "サーバー" (house) | check |
| `パラメータ` | "設定", "設定値" (house) | check |
| `取消す` `取消し` | "取り消す", "取り消し" (guide) | check |
| `出来ます` `出来ません` `出来る` | "できます", "できません", "できる" (guide) | check |
| `下さい` `頂きます` `頂けます` | "ください", "いただきます". Kanji only for literally receiving something (guide) | check |
| `ヶ月` `ケ月` `カ月` `ヵ月` | "か月": "3か月" (guide) | check |
| `undefined` `[object Object]` | A bug: the string shows an empty value. Fix the data, or show "未設定" (house) | block |

## Patterns

No word list catches these. Read for them.

| Pattern | Rewrite |
|---|---|
| A promise of ease before the content: 「ここを理解すると、驚くほど楽になります」 (munyoru) | Cut it, start with the content |
| Every benefit followed by 「一方で」 and a drawback nobody asked for (munyoru) | Only the trade-offs that apply here |
| 「第一に」「第二に」「最後に」 scaffolding (Qiita) | A list with the real number of items |
| The same ending three times: 「〜です。〜です。〜です。」 (motoyama) | Merge or vary the sentences |
| A closing 「まとめ」 or 「いかがでしたか」 (Qiita) | Stop after the last useful sentence |
| Stacked の: 「オブジェクトの種類の選択」 (Microsoft 4.2) | 「オブジェクトの種類を選択」 |
| A program as subject: 「コンポーネントがデバイスを検出します」 (Microsoft 4.2) | 「デバイスが検出されます」 |
| Double negative: 「保護されていないと安全ではありません」 (Microsoft 4.1.12) | Say it positively |
| です・ます and 常体 in one message or one list (JTF) | One style per block |

## Examples

The "after" strings use です・ます, bare-noun buttons, no space between Japanese and Latin or
digits, and full-width `？` `！`. Adjust them to the choices in `DESIGN.md`.

| Before | After |
|---|---|
| エラーが発生しました。しばらくしてから再度お試しください。 | 保存できませんでした。接続を確認して、もう一度お試しください。 |
| ファイルのアップロードが正常に完了しました！ | ファイルをアップロードしました |
| 本当に削除してもよろしいですか？ | 「月次レポート」を削除しますか？元に戻せません。 |
| 無効なメールアドレスです。 | メールアドレスを入力してください（例：name@example.com） |
| メンテナンスを実施させていただきます。ご不便をおかけして申し訳ございません。 | 9月20日の2:00から4:00まで、メンテナンスのため利用できません。 |
| 革新的なAIソリューションで、あなたのワークフローを次のレベルへ。 | 表計算ファイルから200本のクリップ名を一度に変更できます。 |
| データの保存をすることができます。 | データを保存できます。 |
| 削除する (button, product uses bare nouns) | 削除 |
| キャンセル (button on a request already sent) | 申請を取り消す |
| 送信 (quote form button) | 見積もりを依頼 |
| ようこそ！さっそく旅を始めましょう。 | ようこそ。フォルダーを読み込むと、クリップが表示されます。 |
| 読み込み中... | 読み込み中… |

## Sources

- Microsoft Japanese Localization Style Guide, aka.ms/japanese-styleguide, PDF modified
  2024-09-05, read 2026-09-16: sections 2.1.2, 2.1.3, 4.1.3, 4.1.8, 4.1.9, 4.1.11, 4.1.12, 4.2.
- JTF 日本語標準スタイルガイド（翻訳用）第3.0版, Japan Translation Federation, 2019-08-20.
- W3C, "Requirements for Japanese Text Layout" (JLReq), Group Note, 2020-08-11.
- 文化審議会, 「公用文作成の考え方」（建議）, 2022-01-07. 文化審議会, 「敬語の指針」, 2007-02-02.
- SmartHR Design System, writing principles, UI text and 「操作を表す用語」, read 2026-09-16.
- MDN, `text-autospace`, modified 2026-04-20. Chrome for Developers, "Introducing four new
  international features in CSS", 2023-12-04. W3C, "Text size in translation", read 2026-09-16.
- Nohejl et al., "Beyond Film Subtitles: Is YouTube the Best Approximation of Spoken
  Vocabulary?", COLING 2025. `wordfreq` README, read 2026-09-16.
- Listed AI tells, no measurement behind them: Qiita (robitan), 2026-02-26 (いかがでしたでしょうか,
  と言えるでしょう, と考えられます, 探っていきましょう, 結論として, 第一に); note (motoyama),
  2026-01-05 (非常に重要です, 結論から言うと, 一概には言えませんが, ご質問ありがとうございます,
  repeated です); note (munyoru), 2026-08-03 (——, 一方で, 驚くほど楽になります). No measured
  study of Japanese AI vocabulary was found (searched 2026-09-16).
- House rules, no measurement: シームレス, 革新的, 次のレベル, ぜひ, ソリューション and the other
  (house) rows. They are weak product copy, not proven AI tells.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Translating the English string word for word, subject and all | The sentence a Japanese user expects, with no あなた |
| `させていただきます` and `ご〜いただけますよう` to sound polite | Plain です・ます: `〜します`, `〜してください` |
| `Word 文書` on one screen and `Word文書` on the next | One spacing convention, recorded in `DESIGN.md` |
| Full-width `１２３` or half-width `ｶﾀｶﾅ` | Half-width digits and letters, full-width kana |
| `キャンセル` on an action that is already done | `取り消す`; `キャンセル` for what has not happened yet |
| `コンピュータ` here, `コンピューター` there | One long-vowel rule for the whole product |
| Every `一方で` and `簡単に` rewritten on sight | Read the string; `check` rows are prompts, not verdicts |
