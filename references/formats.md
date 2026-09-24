# Story formats

A format is the structure of the story, independent of the look. Pick it from what the research found, then pick a look. Every format works in every look through the scene API in [looks.md](looks.md); the pairing marked "native" has a dedicated scene function.

| Format | Structure | Fits topics that have | Native look | Credit |
|---|---|---|---|---|
| Standard promo (default) | hook → title → 3–5 steps or features → one big number → ending | any company, product, or service | any | original |
| Versus | 3–5 rounds, each one criterion with a value per side, then a tally | two options: product A vs B, old vs new version, before vs after | arcade (`versus`) | original |
| Session | a sequence of commands and outputs that tells how something is used | a tool, an API, a workflow, an install-and-run story | terminal (`session`) | original |
| Receipt | an itemised list with a total and a stamp | prices, what a plan includes, a year in review, an event recap | thermal (`receipt`) | original |
| Route map | lines for categories, stations for items, interchanges for what they share | business areas, product lineups, a history, a user journey | transit (`route`) | original |
| Spec sheet | an assembly of parts, each with one dimension or spec | a product's components, an architecture, the anatomy of a service | blueprint (`spec`) | original |
| Lyric music video | an original song whose lines each carry one fact and one diagram | memorable explainers | its own dark explainer look (`lyric.js`), see [styles/lyric.md](styles/lyric.md) | [@goodside](https://x.com/goodside/status/2102852546620744010) |
| Beat-synced footage | real clips cut on a song's beat grid: wall, carousel, phone and panel | the user's own footage and a licensed or synthesized song | its own light/dark stage look (`beat.js`), see [styles/beat.md](styles/beat.md) | [@twoclipping](https://x.com/twoclipping/status/2102554209166000267) |

## Mapping research to a format
- **Versus**: each round's two values come from the same source with the same settings. Say which source in the ending. Report ties as ties, and let the tally follow the data rather than a preferred winner. Words work as values ("none" vs "built in") when a criterion has no number.
- **Session**: commands and outputs illustrate a real workflow. Use real command names from the product's docs, and do not invent output numbers; describe states instead ("research: sourced facts only").
- **Receipt**: every line item is a researched fact or a plain description. Prices come from the official price list with its date. Totals must add up.
- **Route map**: stations are the subject's own words for its areas or steps (official taglines, menu names). Put numbers in station sub-labels only when sourced.
- **Spec sheet**: each part's dimension is one sourced spec (size, count, limit, rate). Keep to 4–6 parts.

## Timing
Build every format from the scene API plus its native scene: open with `hook` or `title` (3.5–4 s), run the format body, and close with `ending` (4.5–5 s). Keep the whole video 20–30 s unless the user chose a different length. The lyric and beat formats follow the structure tables in their guides instead.
