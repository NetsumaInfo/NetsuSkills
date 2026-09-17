# Chinese: words and typography

Load before writing or reviewing a Chinese string. `scripts/scan.mjs` reads the three
`## Lexicon` tables below, so keep each row to three cells: backticked patterns first, `block` or
`check` last. Chinese has no spaces between words, so the scan matches each pattern as a plain
substring, with no word boundary: every pattern is long enough not to hide inside an ordinary
word. Rows list the Simplified form and, when it differs, the Traditional one. `block` is wrong
in any UI. `check` means read it in context. The word in brackets at the end of a hint gives its
basis: (guide) a style guide rule listed in `## Sources`, (listed) named in a dated list of AI
tells or corporate jargon but never measured, (house) a house rule with no measurement.

## Register

- **Script and market.** Simplified Chinese (zh-CN, zh-Hans) unless the `zh` entry of the `Market`
  line in `## Voice` of `DESIGN.md` names Taiwan (zh-TW) or Hong Kong (zh-HK). Traditional is not a
  font switch: the words change. Never convert character by character; converters such as OpenCC
  ship regional phrase tables for this reason. Microsoft publishes one Simplified and one
  Traditional (Taiwan) guide, and no separate Hong Kong guide (list read 2026-09-16).
- **你 or 您** comes from `## Voice` in `DESIGN.md`. One form for the whole product. If the file is
  silent, run `references/setup.md`. Never pick one yourself, never mix them.
  - zh-CN: Microsoft uses 你 over 您 when a pronoun is needed (Simplified guide 4.1.12). Ant
    Design's copywriting spec says the same: 您 puts the user at a distance (read 2026-09-16).
  - zh-TW: Microsoft uses 您 in all software, and 你們 for the plural, never 您們 (Traditional
    guide 2.1.4).
  - Either way, drop the pronoun when the sentence works without it (Simplified guide 4.1.12).
- **Buttons: a verb, or verb plus object.** `保存`, `删除项目`, `发送申请`. Say what the person
  gets (Ant Design).
- **Errors: 无法 plus the verb, then the next step.** `无法删除文件。` (Simplified guide 5.5.2).
  Ant Design prefers `无法完成` to `失败`, and avoids 不能, 不要, 请勿 as commands.
- **请 once, for a real request.** `请检查网络后再试。` Microsoft's Traditional guide adds 請 only
  where it helps the sentence read.
- **Everyday words over formal ones** (Simplified guide 2.1.2): `如果`, not `倘若` or `假使`;
  `要`, not `若要`; `只是`, not `仅是`. The Traditional guide says the same of 如果 and 倘若.
- **Active voice.** Rewrite 被 sentences (Traditional guide 4.2.11).
- **Headings can be fragments:** `步骤如下：` (Simplified guide 4.1.14).
- **Measure words.** The specific one: `两位研究人员`, not `2 个研究人员` (Simplified guide 4.1.10).

Region vocabulary, from OpenCC's Taiwan phrase table (TWPhrases, read 2026-09-16):

| Concept | zh-CN | zh-TW |
|---|---|---|
| file / folder | 文件 / 文件夹 | 檔案 / 資料夾 |
| video | 视频 | 影片 (視訊 for calls) |
| software / network | 软件 / 网络 | 軟體 / 網路 |
| information | 信息 | 資訊 (訊息 for a message) |
| default / settings | 默认 / 设置 | 預設 / 設定 |
| log in | 登录 | 登入 |
| screen / print | 屏幕 / 打印 | 螢幕 / 列印 |
| program / server | 程序 / 服务器 | 程式 / 伺服器 |
| user / data | 用户 / 数据 | 使用者 / 資料 |
| link / optimize | 链接 / 优化 | 連結 / 最佳化 |

zh-HK keeps several Mainland words in Traditional characters: 軟件, 網絡, 打印, where Taiwan says
軟體, 網路, 列印. Source: a 2009 Hong Kong and Taiwan comparison seen only in search results,
not confirmed. Have a Hong Kong reader check zh-HK strings.

## Typography

| Case | Write | Notes |
|---|---|---|
| Sentence punctuation | `已保存，可以关闭。` | Full-width `，。；：？！`. No space before or after them, none between Han characters (Microsoft Traditional 4.2.10) |
| Listed items | `Word、Excel 和 PowerPoint` | `、` between items (Microsoft Simplified 4.1.13). `Intl.ListFormat('zh')` gives `甲、乙和丙` |
| Quotes, Mainland | `“月度报告”` | U+201C U+201D outside, `‘’` inside (GB/T 15834-2011; W3C CLReq). `「」` is for vertical text there |
| Quotes, Taiwan and Hong Kong | `「月報」` | `「」` outside, `『』` inside (Taiwan Ministry of Education punctuation handbook; CLReq; Microsoft Traditional) |
| Titles | `《使用指南》` | Title marks, full-width |
| Software convention | `错误: %1` | Microsoft uses half-width `:` `?` `!` `()` in software UI and full-width in documents (both guides). Pick one set for the product |
| Letters and digits | `1000 元`, `iPhone` | Half-width. CLReq: store them as ordinary characters, never `１０００` |
| Han next to Latin or digits | `打开 Word`, `2 个文件` | See below |
| Percent, degrees | `50%`, `90°` | No space before them (Ant Design; chinese-copywriting-guidelines) |
| Units | `10 GB` | Space between number and unit (chinese-copywriting-guidelines). `Intl.NumberFormat('zh-CN', { style: 'unit', unit: 'megabyte' })` gives `10 MB` with a plain space (Node 22) |
| Ellipsis | `……` in a sentence, `正在导出…` on a status | `……` is two U+2026, two character widths, never split across lines (GB/T 15834-2011; the Taiwan handbook; CLReq 5.4.1). Microsoft writes the English ellipsis after status labels: `正在上载…` |
| Dash | Rephrase | Microsoft Simplified 4.1.13: avoid the em dash, it can read as 一 |
| Repeated marks | `导出完成！` | Never `！！` (chinese-copywriting-guidelines) |
| Money | `¥1,234.50` | `Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' })`, U+00A5. zh-TW formats TWD as `$1,234.50` (Node 22) |
| Large numbers | `1235万` | `Intl.NumberFormat('zh-CN', { notation: 'compact' })` |
| Date | `2026年9月16日` | `dateStyle: 'medium'` or `'long'` in zh-CN and zh-TW. `'full'` adds `星期三`. The output has no spaces, even in a product that spaces digits |
| Time | `15:30` | zh-CN is 24-hour. zh-TW and zh-HK give `下午3:30`: pass `hourCycle: 'h23'` for 24-hour |
| Plural | `3 个文件` | `Intl.PluralRules('zh')` has one category, `other`. A measure word, never `文件(s)` |
| Script | `视频` or `影片` | Never Simplified and Traditional characters in one string |

Space between Han characters and Latin letters or digits:

- W3C CLReq (Group Note Draft, 2026-09-01): a gap of at most a quarter of a Han character.
- Microsoft Traditional guide 4.2.10: type a half-width space (`不明的 xsi:type 資訊`,
  `2021 年 3 月 14 日`), but none next to full-width punctuation. The Simplified guide's
  examples do the same (`1 TB 的 OneDrive`).
- Ant Design and chinese-copywriting-guidelines (MIT, read 2026-09-16): a space between
  full-width and half-width characters, `2 个`.
- So the default is a typed half-width space. The other option is CSS `text-autospace: normal`,
  set explicitly, with no typed spaces (MDN, Baseline 2025, page modified 2026-04-20). Record the
  choice on the `Script conventions` line of `## Voice` in `DESIGN.md`. Never both, never mixed.

In JSON or JSX, type Chinese characters as they are in a UTF-8 file.

## Length

- Chinese is compact: text translated out of Chinese usually grows. Each Chinese character is
  counted as two English characters of width (W3C Internationalization, "Text size in
  translation", read 2026-09-16). A shorter string can still be as wide as the English one.
- Chinese needs more line height than Latin text (same page). Check the string in the real
  component at its narrowest width, in every script the product ships.
- A button stays on one line. Shorten the words, never truncate a button with `…`.

## Choosing between two words

The glossary in `DESIGN.md` wins, then the region table above.

Tie-breaker between two plain words: SUBTLEX-CH, word and character frequencies from 33.5
million words of Mainland film and TV subtitles (Cai and Brysbaert, PLoS ONE 5(6), e10729,
2010-06-02). In the paper, its counts predicted reading times for two-character words better
than a written corpus did. The article is CC BY; the abstract says the frequencies are "freely
available for research purposes", and no separate data licence was found. It covers Simplified
Mainland usage only.

Other lists: TUBELEX-zh, from YouTube subtitles (COLING 2025, BSD-3-Clause, GitHub
naist-nlp/tubelex), and `wordfreq` (data CC BY-SA 4.0, frozen at about 2021 usage). No
Taiwan-specific subtitle list was found (searched 2026-09-16). Look words up; never copy the data
into the project.

Pairs worth a lookup: `上载` / `上传`, `单击` / `点击`, `获取` / `获得`, `使用` / `用`,
`进行修改` / `修改`, `倘若` / `如果`.

## Lexicon: politeness and filler

| Pattern | Write instead | Level |
|---|---|---|
| `亲爱的用户` `親愛的用戶` `亲爱的会员` `親愛的會員` | The person's name, or nothing (house) | block |
| `尊敬的用户` `尊敬的用戶` `尊敬的客户` `尊敬的客戶` | The name, or nothing, on a screen. Fine in a formal letter (house) | check |
| `请您` `請您` | Drop 您 when the verb is enough: "请输入密码". Never 您 in a 你 product (guide) | check |
| `操作成功` `操作失败` `操作失敗` | Say what happened: "已保存", "无法保存" (house) | block |
| `已成功` `成功地` | Delete: "文件已上传" (house) | check |
| `未知错误` `未知錯誤` | Say what failed and what to do: "无法保存。请检查网络后再试。" (guide) | block |
| `系统错误` `系統錯誤` `发生错误` `發生錯誤` `出错了` `出錯了` | Name what failed: "无法加载文件" (guide) | check |
| `网络异常` `網路異常` `网络错误` `網路錯誤` | Say what to do: "无法连接。请检查网络后再试。" (house) | check |
| `非法` | Say what is not accepted: "不支持此格式" (house) | check |
| `无效` `無效` `请输入有效` `請輸入有效` | Show the expected format: "请输入 6 位数字" (house) | check |
| `您确定` `你确定` `您確定` `你確定` | Name the action and its effect: "删除项目？删除后无法恢复。" (house) | check |
| `点击这里` `点击此处` `點擊這裡` `點擊此處` | Put the link on the words that say where it goes (house) | block |
| `点击` `點擊` `单击` `單擊` | Name the action. "点击量" as a metric is fine (house) | check |
| `提交` | Say what happens: "发送申请", "付款". "已提交" as a status is fine (house) | check |
| `温馨提示` `溫馨提示` | Delete the label. State the fact (house) | check |
| `感谢您的耐心` `感謝您的耐心` `敬请谅解` `敬請見諒` | Say when it will be done (house) | check |
| `带来的不便` `帶來的不便` `带来不便` `帶來不便` | Say what broke and when it works again (house) | check |
| `敬请期待` `敬請期待` | Give a date, or delete (house) | check |
| `进行删除` `进行修改` `进行设置` `进行操作` `进行更新` `進行刪除` `進行設定` | The verb itself: "删除", "修改" (listed) | check |
| `作为一款` `作為一款` | Delete. Start with what it does (listed) | block |
| `基于` `基於` | Often translationese: "根据", or cut. "基于位置" is fine (listed) | check |
| `倘若` `假使` `若要` | "如果", "要" (guide) | check |

## Lexicon: hype and AI tells

| Pattern | Write instead | Level |
|---|---|---|
| `值得注意的是` `值得一提的是` | Delete. State the fact (listed) | block |
| `总而言之` `總而言之` `综上所述` `綜上所述` | Delete. A screen has no conclusion (house) | block |
| `此外` | Delete, or "还" (listed) | check |
| `至关重要` `至關重要` `意义重大` `意義重大` | Delete, or say why it matters (listed) | check |
| `见证` `見證` `标志着` `標誌著` `奠定基础` `奠定基礎` | Delete. Say what changed (listed) | check |
| `不可磨灭` `不可磨滅` `根植于` `根植於` | Delete (listed) | block |
| `稳稳地` `穩穩地` `稳稳接住` `穩穩接住` | Delete (listed) | check |
| `不断变化的格局` `不斷變化的格局` `瞬息万变` `瞬息萬變` | Delete. Start with what the product does (listed) | block |
| `很多人觉得` `很多人覺得` `你以为` `你以為` | State the fact (listed) | check |
| `赋能` `賦能` | Say what the person can now do (listed) | block |
| `抓手` | Name the concrete step or tool (listed) | block |
| `底层逻辑` `底層邏輯` | Give the reason in plain words (listed) | block |
| `认知升级` `認知升級` `长期主义` `長期主義` | Delete (listed) | block |
| `组合拳` `組合拳` | List the actual measures (listed) | block |
| `闭环` `閉環` | Say what is finished. Fine in control engineering (listed) | check |
| `打通` | "连接", "同步". Fine for a phone call getting through (listed) | check |
| `生态` `生態` | Name the parts and what they do. Fine for ecology (listed) | check |
| `在当今` `在當今` `数字化时代` `數位時代` | Delete. Start with what the product does (house) | block |
| `深入探讨` `深入探討` | Delete, or "看看" (house) | block |
| `无缝` `無縫` | Say what is gone: "无需设置" (house) | block |
| `革命性` `颠覆` `顛覆` `前所未有` | Delete. Say what is new (house) | block |
| `助力` | Say what it does, for whom (house) | check |
| `打造` | "做", "建", or say what the person gets (house) | check |
| `一站式` | Say what is in one place (house) | check |
| `之旅` `旅程` | Name the first step. Fine in a travel product (house) | check |
| `极致` `極致` `全方位` | Say what, with a number (house) | check |
| `沉浸式` | Say what the mode does. Fine for VR or a reading mode (house) | check |
| `强大的` `強大的` | Say what it handles: "可打开 4 GB 的文件" (house) | check |
| `轻松` `輕鬆` `只需` | Delete in instructions; give the steps or the time: "2 步完成" (house) | check |
| `解决方案` `解決方案` | Name the thing: "应用", "工具" (house) | check |
| `引领` `引領` `重新定义` `重新定義` `新一代` | Say what is new, with proof. "重新定义变量" in code is fine (house) | check |

## Lexicon: jargon and anglicisms

| Pattern | Write instead | Level |
|---|---|---|
| `痛点` `痛點` | Name the problem (house) | check |
| `颗粒度` `顆粒度` | "细节", "精度" (house) | check |
| `链路` `鏈路` | "流程", "步骤" (house) | check |
| `心智` | Say what people remember or believe (house) | check |
| `沉淀` `沉澱` | "积累", "保存". Fine in chemistry (house) | check |
| `登陆` | "登录". "登陆" means landing (house) | check |
| `上载` | "上传", the everyday word; Microsoft still writes 上载 (house) | check |
| `undefined` `[object Object]` | A bug: the string shows an empty value. Fix the data, or show "未设置" (house) | block |
| `loading` | "加载中…", "載入中…" (house) | block |

## Patterns

No word list catches these. Read for them.

| Pattern | Rewrite |
|---|---|
| 「这不是 X，而是 Y」 (Chinese Wikipedia; Enovace) | Say Y |
| Three items or parallel clauses in every sentence (Chinese Wikipedia; Enovace) | The number of items there really are |
| Opening with hook, pain, promise (Enovace) | Start with what the screen does |
| 「你以为……其实……」 set-ups (Enovace) | State the fact |
| Inflated significance: 标志着, 见证, 奠定基础 (Chinese Wikipedia) | Say what changed |
| Vague authority: 专家认为, 行业报告显示 (Enovace) | Name the source, or cut |
| Translationese with 进行, 作为, 关于, 基于: 「对文件进行删除」 (Enovace) | 「删除文件」 |
| Passive 被 sentences (Microsoft Traditional 4.2.11) | Active voice |
| 你 and 您 in one flow, or Simplified and Traditional in one string | One form, one script |
| Spaced and unspaced Latin in the same screen: `打开Word`, `打开 Word` | One convention |

## Examples

The zh-CN column uses 你, `“”` and spaced digits; the zh-TW column uses 您, `「」` and Taiwan
vocabulary.

| Before | After, zh-CN, 你 | After, zh-TW, 您 |
|---|---|---|
| 操作失败，请稍后重试！ | 无法保存。请检查网络后再试。 | 無法儲存。請檢查網路後再試一次。 |
| 文件已成功上传！ | 文件已上传 | 檔案已上傳 |
| 您确定要删除吗？ | 删除“月度报告”？删除后无法恢复。 | 刪除「月報」？刪除後無法復原。 |
| 请输入有效的邮箱地址 | 请输入完整的邮箱地址，例如 name@example.com | 請輸入完整的電子郵件地址，例如 name@example.com |
| 赋能创作者，打造一站式无缝剪辑体验 | 从电子表格一次重命名 200 个片段。 | 從試算表一次重新命名 200 個片段。 |
| 点击这里了解更多 | 查看计费说明 | 查看計費說明 |
| 系统错误，给您带来的不便敬请谅解 | 服务暂时无法使用，预计 14:00 恢复。 | 服務暫時無法使用，預計 14:00 恢復。 |
| 提交 (quote form button) | 发送询价 | 索取報價 |
| 亲爱的用户，欢迎开启你的创作之旅！ | 欢迎。导入文件夹即可查看片段。 | 歡迎。匯入資料夾即可檢視片段。 |
| 视频加载中... | 正在加载视频… | 正在載入影片… |
| 网络异常 | 无法连接网络。请检查连接后再试。 | 無法連線到網路。請檢查連線後再試一次。 |
| 你可以对设置进行修改 | 你可以修改设置 | 您可以變更設定 |

## Sources

- Microsoft Chinese (Simplified) Localization Style Guide, aka.ms/chinese-simplified-styleguide,
  PDF modified 2024-09-05: sections 2.1.2, 4.1.10, 4.1.12, 4.1.13, 4.1.14, 5.5.2.
- Microsoft Chinese (Traditional) Localization Style Guide, aka.ms/chinese-traditional-styleguide,
  PDF modified 2024-09-05: sections 2.1.4, 4.2.7, 4.2.10, 4.2.11.
- W3C, "Requirements for Chinese Text Layout" (CLReq), Group Note Draft, 2026-09-01.
- GB/T 15834-2011 《标点符号用法》, published 2011-12-30, in force 2012-06-01.
- Taiwan Ministry of Education, 《重訂標點符號手冊》修訂版, PDF dated 2009-05-14.
- Ant Design, 文案 (copywriting) spec, read 2026-09-16. sparanoid/chinese-copywriting-guidelines,
  MIT, read 2026-09-16. OpenCC, TWPhrases table, read 2026-09-16.
- MDN, `text-autospace`, modified 2026-04-20. W3C, "Text size in translation", read 2026-09-16.
- Cai and Brysbaert, "SUBTLEX-CH", PLoS ONE, 2010-06-02. Nohejl et al., COLING 2025 (TUBELEX).
- Listed AI tells, no measurement behind them: Chinese Wikipedia, 「Wikipedia:AI生成文的特徵」,
  last edited 2026-09-11 (至关重要, 意义重大, 见证, 标志着, 奠定基础, 不可磨灭, 根植于, 稳稳地,
  接住, 不断变化的格局, 「这不是……而是……」), with its own caveat that these are observations,
  not proof; Enovace blog, 2026-06-22 (赋能, 底层逻辑, 认知升级, 闭环, 长期主义, 抓手, 此外,
  值得注意的是, 作为, 基于, 进行, 「不是 X 而是 Y」); Text-Well, 去 AI 味 page, © 2025
  (值得注意的是, 值得一提的是, 此外).
- Corporate jargon, listed: 差评 on The Paper (澎湃新闻), 2021-04-03 (抓手, 赋能, 底层逻辑, 闭环,
  打通, 对齐, 组合拳, 生态).
- Seen only in search results, not confirmed: the Hong Kong vocabulary note, and 总而言之 and
  综上所述 as AI tells. No measured study of Chinese AI vocabulary was found (searched 2026-09-16).
- House rules, no measurement: 助力, 打造, 一站式, 无缝, 革命性, 深入探讨 and the other (house)
  rows. They are weak product copy, not proven AI tells.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Converting zh-CN strings to Traditional character by character | Taiwan or Hong Kong vocabulary: 檔案, 影片, 軟體, 設定 |
| 您 on the screens, 你 in the onboarding email | One form, taken from `DESIGN.md` |
| Straight `"报告"` quotes, or `“”` in a Taiwan product | `“”` for the Mainland, `「」` for Taiwan and Hong Kong |
| `打开Word` here, `打开 Word` there | One spacing convention, recorded in `DESIGN.md` |
| `...` or a single `…` at the end of a sentence | `……` in sentences, one `…` on status labels |
| 赋能, 打造, 一站式 on a landing page | What the product does, with a number |
| Every `点击` and `提交` rewritten on sight | Read the string; `check` rows are prompts, not verdicts |
