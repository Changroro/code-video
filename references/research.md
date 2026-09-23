# Research protocol

Every line of copy and every number in the video needs a source. Do not use invented numbers, numbers with an unknown reference year, or numbers that may belong to a different company.

## 1. Pin down the subject
- Companies and services with the same name are common. Confirm the subject with at least two of: domain, representative or founder, location.
- The strongest clues are the user's email domain, a URL the user gave, and a GitHub repository.

## 2. Scope (delegate to read-only agents, `model: sonnet`)
- **Official site**: about, CEO or founder message, history, business areas or features, CI pages (logo, colors).
- **Official blog and press releases**: Naver blogs and news block WebFetch, so use curl with a desktop User-Agent.
  - Post list: `https://blog.naver.com/PostTitleListAsync.naver?blogId=<id>&currentPage=1&countPerPage=30`
  - Post body: `https://m.blog.naver.com/PostView.naver?blogId=<id>&logNo=<no>`
- **Third-party articles**: contracts, grants, exhibitions, awards. Confirm the company name appears in the article body.
- **Personal services and sites**: verbatim landing copy, meta and og descriptions. For a private repository, use read-only `gh` commands (README, tree, config, commit count, creation date).
- **Brand assets**: exact logo image URLs, color hex values (from CSS or the CI page), font names, whether a mascot exists.

Ask the agents to report in this order: evidence that the subject is correct → facts with source URLs → number candidates for the video (source and confidence) → verbatim copy → brand assets → what could not be confirmed.

## 3. Verification
- Do not trust an agent report for the headline numbers (the ones shown large in the opening or the stats board). Fetch the original sentence and check it yourself.
- If sources about the same subject disagree, ask the user which to use. Keep the value behind one setting so both versions can be rendered.
- Drop auto-collected data such as revenue or headcount from job sites when the reference year is unclear.
- For a consortium project or joint program, show only the participation. Leave out the total budget unless it is the company's own share.
- Leave out technical details (model names, infrastructure) unless the user wants them, and focus on the value of the subject.

## 4. Report to the user
- A source link for every fact used in the video
- Numbers left out and why
- Numbers that need confirmation, for example because they may be outdated
