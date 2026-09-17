# Spanish: words and typography

Load before writing or reviewing a Spanish string. `scripts/scan.mjs` reads the three
`## Lexicon` tables below, so keep each row to three cells: backticked patterns first, `block` or
`check` last. A pattern matches whole words, ignores case, treats `'` and `’` alike, and a
trailing `*` means "any letters after". `block` is wrong in any UI. `check` means read it in
context. The scan also flags a question or exclamation with no opening mark (`es-marks`), and counts
`tú` and `usted` from pronouns only (`address-mixed`). A verb form such as "confirme" carries
no pronoun: read for it.

## Register

- **Market and address come from `## Voice` in `DESIGN.md`**: the `es` entries of its `Address`
  line (`tú | usted | vos`) and its `Market` line (`es-ES | es-MX | es-419 | neutral`).
  If either is missing, run `references/setup.md`. One form for the whole product: screens,
  emails, notifications, store listing. Never pick one yourself, never mix them.
- **What large products do.** Microsoft recommends `tú` for Spain and for Mexico (Spanish (Spain)
  and Spanish (Mexico) localization style guides, both updated 2024-09-05). Its Spanish (Neutral)
  guide (2021-04-29) uses `usted` for Office, Exchange, Dynamics and its cloud and enterprise
  products, `tú` for the Store and Skype. apple.com/es and apple.com/mx use `tú` (read
  2026-09-16). The Aragón government design system, DESY, uses `tú`.
- **`vos`.** Voseo is accepted by all social classes in Argentina, Paraguay and Uruguay (RAE,
  Diccionario panhispánico de dudas, "voseo"). A product for that market alone may use it:
  `Elegí`, `Revisá`. A product for several countries uses `tú` or `usted`.
- **Plural.** Spain uses `vosotros` for an informal group. All of Latin America, the Canary
  Islands and western Andalusia use `ustedes`, formal or not (DPD, "vosotros"). Neutral Spanish
  uses `ustedes`. Most UI text speaks to one person: avoid the plural.
- **Neutral Spanish is not a dialect.** It means words every market understands (Microsoft
  Spanish (Neutral) guide). Put the market words in `### Words we use` of `DESIGN.md`:

| Concept | Spain | Latin America | Several markets |
|---|---|---|---|
| computer | ordenador | computadora, computador | equipo, PC (Microsoft's choice) |
| mobile phone | móvil | celular | teléfono |
| video | vídeo | video | one spelling, chosen in `DESIGN.md` |
| to pick | coger | tomar, agarrar | elegir, tomar |

The first and third rows come from Microsoft's guides; the other two are common usage, not
checked against a dictionary here. `coger` is vulgar in several Latin American countries: never
use it outside a Spain-only product. Confirm the rest with a reviewer from the market.

- **Buttons: infinitive, one line.** `Guardar`, `Exportar vídeo`, `Iniciar sesión`. The
  infinitive does not change with the address form. Microsoft's Spain guide uses the infinitive
  when the user tells the program what to do (`Marcar todos como leídos`); DESY writes its
  actions in the infinitive (`Ver mi perfil`). Not `Guarda`, not `Guarde`.
- **Instructions: imperative, in the product's form.** `Elige una carpeta.`,
  `Elija una carpeta.`, `Elegí una carpeta.`
- **Short sentences, simple tenses.** Microsoft's Spain guide prefers
  `Después de que termines de instalar` to `Después de haber terminado de instalar`, and plain
  connectors: `pero` for `sin embargo`, `pedir` for `solicitar`, `dar` for `proporcionar`, `usar`
  for `utilizar`, `querer` for `desear`.
- **Errors: problem, period, fix.** Same guide: a period between the two parts, noun phrases
  allowed (`Disco lleno. No se puede guardar el archivo.`), no exclamation mark carried over
  from English, impersonal forms rather than `tú` in every clause.
- **Gender.** The RAE holds that the generic masculine does not discriminate (RAE on X,
  2023-04-05) and, per press reports of its 2020 statements, calls `@`, `x` and `-e` endings
  foreign to Spanish morphology. Addressing the reader removes most of the problem:
  `Te damos la bienvenida`, not `Bienvenido/a`. For groups, DESY names people
  (`las personas usuarias`); Microsoft's Spain guide writes `personal` for `empleados`.

## Typography

| Case | Write | Notes |
|---|---|---|
| Questions, exclamations | `¿Eliminar el proyecto?`, `¡Listo!` | Opening marks stay required in ordinary writing, even where chat drops them (RAE on X, 2018-11-27). `¿` opens where the question starts (RAE, Ortografía): `Si sales ahora, ¿guardamos los cambios?` |
| Quotes | `«Montaje»` or `“Montaje”` | RAE recommends « » first, then “ ”, then ‘ ’ (Ortografía, "Las comillas"). Microsoft's Spanish guides use “ ”. Pick one per product. Never straight `"` |
| Money | `1234,56\u00A0€` (es-ES), `$1,234.56` (es-MX) | `Intl.NumberFormat` with the market locale (Node 22). es-ES leaves four digits ungrouped and groups five with a point: `12.345,5` |
| Thousands, decimals | What `Intl` prints for the market | The RAE groups with a space, never a point, never splits four digits, and recommends the decimal point while keeping the comma valid (Ortografía, 2010). Do not hand-format against the locale |
| Percent, units | `50\u00A0%`, `4\u00A0GB` | A space before `%` (DPD, "porcentajes"). `Intl` es-ES prints `50\u00A0%` but `4 GB` with a plain space: replace it. es-MX prints `50%` |
| Date | `16 de septiembre de 2026`, `16 sept 2026` | Months and days in lowercase (Microsoft Spain guide). `Intl` prints numeric dates day first for es-ES, es-MX and es-US. Never `09/16/2026` |
| Time | `14:30`, or `2:30 p. m.` | The RAE writes `a. m.`, `p. m.` with points and a space (RAE on X, 2025-04-10). `Intl` es-MX prints `2:30 p.m.`: keep generated output, write `p. m.` by hand |
| Ellipsis | `Cargando…` | U+2026, attached to the word before (RAE, "Los puntos suspensivos"; Microsoft Spain guide). Never `...` |
| Capitals | `Configuración de la cuenta`, `Índice` | Sentence case on buttons, menus and dialog titles; accented capitals are mandatory (Microsoft Spain guide) |
| Letters | `Contraseña`, `Año` | Never strip `ñ` or an accent to fit a font, a slug or a key |
| Plural | `0 archivos`, `1 archivo`, `2 archivos` | `Intl.PluralRules('es')` has `one`, `many`, `other`: 0 is `other`, 1000000 is `many` (`1 millón de archivos`). Never `archivo(s)` |
| Exclamation | None in errors | Microsoft Spain guide drops the English one. When one stays, it opens with `¡` |

How to type them:

- In a JS, TS or JSON string: `"\u00BFEliminar?"`, `"\u00A1Listo!"`, `"50\u00A0%"`, or the
  characters themselves in a UTF-8 file.
- In JSX text, `\u00BF` renders as six characters. Type `¿` and `¡` directly, or write
  `&iquest;`, `&iexcl;`, `&laquo;`, `&raquo;`, `&nbsp;`, `{"\u00A0"}`.

## Length

- Spanish runs 15 to 25% longer than English, as a planning range (LocaleProof, updated July
  2026, which calls its figures ranges, not guarantees). Strings under 10 English characters can
  grow 200 to 300% (IBM figures quoted by W3C, "Text size in translation", read 2026-09-16).
  Check the Spanish string in the real component at its narrowest width.
- A button stays on one line. Shorten the words (`Exportar`, not `Realizar la exportación`).
  Never truncate a button with `…`, never let it wrap.
- Fragments are allowed where they are shorter: `Más información` for
  `Obtener más información` (Microsoft Spain guide).

## Choosing between two words

When two words fit, take the one people say more often. The glossary in `DESIGN.md` wins over
this, even when its word is rarer.

Tie-breaker: SUBTLEX-ESP, word frequencies from film and TV subtitles (Cuetos, Glez-Nosti,
Barbón and Brysbaert, Psicológica 32, 2011). The data sits on OSF (osf.io/xp6sz, updated
2025-04-19) under CC BY-NC-SA 4.0, per its `license.txt`: non-commercial, so look words up and
never copy the data into the project. Which regional variety dominates the subtitles was not
checked: weigh the result against the market.

Pairs worth a lookup: `utilizar` / `usar`, `realizar` / `hacer`, `solicitar` / `pedir`,
`seleccionar` / `elegir`, `finalizar` / `terminar`, `visualizar` / `ver`, `desear` / `querer`.

## Lexicon: filler and politeness

| Pattern | Write instead | Level |
|---|---|---|
| `no dude en` `no dudes en` `no duden en` `le rogamos` `te rogamos` `les rogamos` | Delete. Start with the verb, or give the action: "Escríbenos", "Escríbanos" | block |
| `por favor` | Delete in instructions and errors. Keep one when you ask a real favor | check |
| `estimado usuario` `estimada usuaria` `estimado cliente` `estimada clienta` `querido usuario` | The person's name, or nothing | block |
| `lamentamos las molestias` `disculpe las molestias` `disculpa las molestias` `sentimos las molestias` | Say what broke and when it will work again | check |
| `lo sentimos` `lamentablemente` `desafortunadamente` | Delete in errors. Apologize only for real harm: an outage, lost data | check |
| `¡ups` `¡uy` `¡huy` `uy,` | Delete. Say what happened. "UPS" the carrier is not matched | block |
| `con éxito` `exitosamente` | Delete: "Archivo subido" | block |
| `correctamente` | Delete on a confirmation: "Cambios guardados" | check |
| `ha ocurrido un error` `se ha producido un error` `ocurrió un error` `se produjo un error` `error inesperado` `error desconocido` | Say what failed and what to do: "No se pudo guardar. Revisa la conexión." | block |
| `algo salió mal` `algo ha salido mal` | Only with the next step and, when known, the cause | check |
| `inválido` `inválida` `inválidos` `inválidas` `no válido` `no válida` `válido` `válida` | Show the expected format: "Escribe la fecha así: 16/09/2026". "Válido hasta" is fine | check |
| `estás seguro` `estás segura` `está seguro` `está segura` | Name the action and its effect: "¿Eliminar 3 archivos?", then "No se puede deshacer." | check |
| `haz clic aquí` `haga clic aquí` `pulsa aquí` `pulse aquí` `pincha aquí` `clic aquí` | Put the link on the words that say where it goes | block |
| `haz clic` `haga clic` `pincha` `cliquea` | "Selecciona", "Elige"; on touch screens, "Toca". Or name the action | check |
| `someter` | Say what happens: "Enviar solicitud", "Pagar" | check |
| `es importante destacar` `cabe destacar` `cabe señalar` `vale la pena señalar` `es importante tener en cuenta` | State the fact | block |
| `en conclusión` `en resumen` `para resumir` | Delete. A screen has no conclusion | check |
| `asimismo` `no obstante` `por otro lado` `sin embargo` `a fin de` `con el fin de` `con el objetivo de` | asimismo: "también"; no obstante, sin embargo: "pero"; a fin de, con el fin de, con el objetivo de: "para"; por otro lado: delete | check |
| `inténtelo más tarde` `inténtalo más tarde` `inténtelo de nuevo más tarde` `inténtalo de nuevo más tarde` `vuelva a intentarlo más tarde` `vuelve a intentarlo más tarde` `gracias por su paciencia` `gracias por tu paciencia` | Say when it will work, or what to do now | check |
| `bienvenido a bordo` `bienvenida a bordo` `bienvenido/a` `bienvenid@` | "Te damos la bienvenida" or "Le damos la bienvenida", then the first action | check |

## Lexicon: hype and AI tells

| Pattern | Write instead | Level |
|---|---|---|
| `sumérgete` `sumérjase` `sumergirte` `sumerjámonos` `adéntrate` | Say what the screen contains | block |
| `profundizar en` `profundiza en` `embárcate` `embarcarte` | profundizar: "ver", or delete; embarcarse: name the steps, "empezar" | check |
| `sin fisuras` | House rule: delete, or say what is gone, "sin configurar nada" | block |
| `al siguiente nivel` `al próximo nivel` | House rule: say what improves, with a number. Fine in a game | check |
| `descubre` `descubra` `descubran` `potencia tu` `potencia tus` `potencie su` `potenciar` | House rule. descubrir: name the thing, "Ver novedades"; potenciar: say what gets faster, with the number | check |
| `potente` `potentes` `robusto` `robusta` `robustos` `robustas` | potente: say what it handles, "abre archivos de 4 GB"; robusto: name what it survives, "guarda tus cambios sin conexión" | check |
| `revoluciona*` `revolucionari*` | Delete. Say what is new | block |
| `innovador*` | House rule: say what it does | block |
| `libera tu` `todo tu potencial` `todo su potencial` `máximo potencial` | Say what the person can now do | block |
| `desbloquea` `desbloquear` | Fine for a lock or a paid plan; otherwise say what becomes possible | check |
| `en constante evolución` `en el mundo actual` `en la era digital` `en el vertiginoso` | Delete. Start with what the product does | block |
| `sin esfuerzo` `en un abrir y cerrar de ojos` | House rule: give the steps or the time, "en 2 clics" | block |
| `simplemente` `fácilmente` `solo tienes que` `solo tiene que` | Delete. In an instruction it blames the reader when it fails | check |
| `fluido` `fluida` `intuitivo` `intuitiva` | Show it, do not claim it | check |
| `sinergia*` `sinérgic*` `ecosistema*` `transformador*` | Name the parts, what they do and what changes | check |
| `crucial*` `fundamental*` | Delete, or say why it matters | check |
| `emocionante*` `apasionante*` `fascinante*` `vibrante*` | Delete. Let the content be interesting. "Vibrante" is fine for a color setting | check |
| `experiencia única` `experiencia inolvidable` `como por arte de magia` `invaluable*` `encomiable*` `inigualable*` `sin precedentes` | Delete. Say what the person does | block |
| `solución` `soluciones` | Name the thing: "la aplicación", "la herramienta", or its name | check |
| `de última generación` `de vanguardia` `de nueva generación` | Say what is new | check |
| `no solo` | Say both things plainly, in two sentences if needed | check |

## Lexicon: jargon and anglicisms

| Pattern | Write instead | Level |
|---|---|---|
| `loguea*` `logea*` `loguéate` `deslogue*` | loguearse: "iniciar sesión"; desloguearse: "cerrar sesión" | block |
| `customiz*` `resetea*` `setea*` | customizar: "personalizar", "adaptar"; resetear: "restablecer", "reiniciar"; setear: "configurar", "ajustar" | check |
| `checar` `chequear` `chequea` `checando` | "comprobar", "revisar" | check |
| `upload*` `download*` `updatea*` `linkea*` `trackea*` | upload: "subir"; download: "descargar"; updatear: "actualizar"; linkear: "enlazar"; trackear: "seguir" | block |
| `soporta` `soportado` `soportada` `soportados` `soportadas` | "admite", "compatible con" | check |
| `aplicar para` `aplica para` `remover` `remueve` | aplicar para: "solicitar", "postularse"; remover: "quitar", "eliminar" | check |
| `en base a` `a nivel de` | en base a: "según", "a partir de"; a nivel de: "en" | check |
| `realiz*` `llevar a cabo` | "hacer", or the verb itself: "Pago recibido" | check |
| `proporcionar` `proporciona` `proporcione` `suministr*` `utiliz*` `desea` `deseas` `desee` | proporcionar, suministrar: "dar"; utilizar: "usar"; desear: "querer" | check |
| `implementa*` | "poner en marcha", "instalar", "aplicar" | check |
| `autentica*` `autentifica*` `credenciales` | autenticar: "iniciar sesión", "confirmar que eres tú"; credenciales: name what is asked, "correo y contraseña" | check |
| `parámetro*` `instancia` `instancias` `funcionalidad*` | parámetro: "ajuste", "opción"; instancia: the name users know, "servidor", "espacio"; funcionalidad: "función", or its name | check |
| `el usuario` `los usuarios` `usuario final` | "tú" or "usted"; "usuario" is fine in an admin screen | check |
| `usuario/a` `usuarios/as` `tod@s` `todxs` | Address the reader, or "las personas", "el equipo" | check |
| `feedback` `dashboard` `onboarding` | feedback: "opinión"; dashboard: "panel"; onboarding: "primeros pasos" | check |
| `template*` `workflow*` `preview` | template: "plantilla"; workflow: "flujo de trabajo"; preview: "vista previa" | check |
| `password` `loading` | password: "contraseña"; loading: "Cargando…" | block |
| `por defecto` | "predeterminado" | check |
| `timeout` `time out` | Say what did not answer and what to do: "El servidor no responde. Vuelve a intentarlo." | check |
| `null` `undefined` | A bug: the string shows an empty value. Fix the data, or a fallback like "Sin título" | block |

## Patterns

No word list catches these. Read for them.

| Pattern | Rewrite |
|---|---|
| `tú` and `usted` in one flow: "Elige un plan y confirme su pago" | One form, from `DESIGN.md`. The scan misses it: neither verb has a pronoun |
| "No es solo X, es Y", "No solo X, sino también Y" | Say Y |
| A question as a heading: "¿Por qué elegir X?" | A statement: "Qué hace X" |
| Three items in every list | The number of items there really are |
| A `ser` passive: "El pago ha sido realizado" | "Pago recibido", "Pagaste 12\u00A0€" |
| A compound tense where a simple one works: "Se ha producido" | "No se pudo", "Falló" (Microsoft Spain guide) |
| A noun where a verb goes: "realizar la descarga", "proceder a la eliminación" | "descargar", "eliminar" |
| A trailing gerund: "…, permitiendo así compartirlo" | Two sentences, or cut the tail |
| A closing formula: "No dudes en contactarnos", "¡Feliz edición!", "En resumen…" | Stop after the last useful sentence |
| A question with only the closing mark: "Eliminar?" | "¿Eliminar?" (the scan's `es-marks`) |

## Examples

| Before | After, tú | After, usted |
|---|---|---|
| Ha ocurrido un error. Por favor, inténtelo de nuevo más tarde. | Se perdió la conexión. Tus cambios están guardados: vuelve a intentarlo. | Se perdió la conexión. Sus cambios están guardados: vuelva a intentarlo. |
| ¡Archivo subido con éxito! | Archivo subido | Archivo subido |
| ¿Está seguro de que desea continuar? | ¿Eliminar el proyecto «Montaje»? No podrás recuperarlo. | ¿Eliminar el proyecto «Montaje»? No podrá recuperarlo. |
| ¡Ups! No se encontraron resultados. | No hay resultados para «dron». Revisa la ortografía o busca otra palabra. | No hay resultados para «dron». Revise la ortografía o busque otra palabra. |
| Descubre nuestra solución innovadora que lleva tu productividad al siguiente nivel. | Exporta todos tus clips de una vez. | Exporte todos sus clips de una vez. |
| Haz clic aquí para chequear tu configuración (button) | Revisar la configuración | Revisar la configuración |
| Por favor, introduzca un correo electrónico válido. | Escribe un correo completo, por ejemplo nombre@ejemplo.com | Escriba un correo completo, por ejemplo nombre@ejemplo.com |
| Someter (quote form) | Enviar solicitud | Enviar solicitud |
| Guarda (button) | Guardar | Guardar |
| Loguéate para continuar | Inicia sesión para continuar | Inicie sesión para continuar |
| Estimado usuario, ¡bienvenido/a a bordo! | Te damos la bienvenida. Importa una carpeta para ver tus clips. | Le damos la bienvenida. Importe una carpeta para ver sus clips. |
| Configuración De La Cuenta | Configuración de la cuenta | Configuración de la cuenta |

With `vos`: "Revisá la ortografía o buscá otra palabra.", "Iniciá sesión para continuar".

## Sources

- Microsoft Localization Style Guides (learn.microsoft.com/globalization): Spanish (Spain) and
  Spanish (Mexico), PDFs updated 2024-09-05; Spanish (Neutral), updated 2021-04-29.
- RAE and ASALE, Diccionario panhispánico de dudas, "voseo", "vosotros", "porcentajes"; RAE,
  Ortografía de la lengua española (2010), "Las comillas", "Los puntos suspensivos", thousands
  and decimal separators. rae.es refused direct fetches (HTTP 403): the rules were read through
  search results on 2026-09-16.
- RAE on X (@RAEinforma): opening marks, 2018-11-27; "loguearse", 2022-04-17; generic
  masculine, 2023-04-05; "a. m." and "p. m.", 2025-04-10.
- FundéuRAE: "adaptar" or "personalizar" for "customizar", 2023-01-17; "admitir" for
  "soportar" (on X), 2019-02-07.
- DESY, Gobierno de Aragón design system, "Lenguaje claro", read 2026-09-16.
- apple.com/es and apple.com/mx, read 2026-09-16: `tú` throughout.
- LocaleProof, "Text Expansion by Language", updated July 2026; W3C, "Text size in
  translation", read 2026-09-16.
- AI tells, observed, not measured. No dated measurement of Spanish AI vocabulary was found on
  2026-09-16. Borja Girón, 2026-08-12: "Sumérgete en", "Profundizar en", "Desbloquear los
  secretos", "Embarcarse", "Revolucionar", "Es importante destacar", "Vale la pena señalar",
  "En conclusión", "En resumen". Genbeta, 2024-09-19, translating an English list: robusto,
  sinérgico, transformador, vibrante, "en constante evolución", innovador, invaluable,
  emocionante. elEconomista, 2024-07, "De crucial a esencial…": headline only, the page refused
  the fetch, so `crucial` and `cabe destacar` are unconfirmed.
- House rules, no dated source behind them: sin fisuras, al siguiente nivel, descubre, potencia
  tu, libera tu potencial, sin esfuerzo, de última generación. They are bad product copy, not
  proven AI tells.
- Jargon rows with no source above (`resetea*`, `setea*`, `aplicar para`, `en base a`,
  `a nivel de`, `implementa*`, the English loanwords) are house rules from common style advice.
- Not verified: the SUBTLEX-ESP corpus size (41 million words, 1990 to 2009, per its abstract as
  shown in search results; the paper itself was not opened).

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Translating the English string word for word | The sentence a user in that market would say, in the product's address form |
| Spain Spanish shipped to Mexico: `ordenador`, `vosotros`, `coger` | The market from `DESIGN.md`, or neutral words for several markets |
| `tú` on the screens, `usted` in the receipt email | One form, taken from `DESIGN.md` |
| `Eliminar proyecto?` because the English has one mark | `¿Eliminar el proyecto?` |
| `Guarda` or `Guarde` on a button | `Guardar` |
| `Contrasena`, `Indice` to dodge the keyboard | `Contraseña`, `Índice` |
| `1,234.56 €` typed by hand in an es-ES product | `Intl.NumberFormat('es-ES', …)` |
| Every `realizar` and `por favor` rewritten on sight | Read the string; `check` rows are prompts, not verdicts |
