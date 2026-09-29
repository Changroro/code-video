# code-video

English | [한국어](README.ko.md)

<a href="docs/hero-45s.mp4"><img src="docs/hero-45s.gif" width="100%" alt="code-video hand-drawn promo: Opus 5.5, Sonnet 5.5, and the skill forged in a blacksmith's shop"></a>

*Claude Opus 5.5 and Claude Sonnet 5.5 filled my feed with videos drawn in code, so I forged a skill for both. This intro was made with that skill: every frame is drawn in code.* [Watch the 45-second MP4](docs/hero-45s.mp4).

## Forged for both models

code-video turns a topic, a design, and a format into an MP4 drawn entirely in code. It is designed to work with both Claude Opus 5.5 and Claude Sonnet 5.5.

An agent skill that researches a topic and turns it into a short video drawn entirely in code. Give it a topic and a style (one of the presets below, any site's DESIGN.md, or a look described in your own words) and get an MP4. No video-generation model and no stock footage: the agent writes the scenes, renders them frame by frame, and hands you the file.

## How it works

1. **Everything is code.** Each frame is a function of time drawn on an HTML canvas, captured by headless Chrome, and encoded by ffmpeg. Music and sound effects are synthesized in code too, so the same input always renders the same video.
2. **Research first.** The agent collects about ten facts with sources and takes the palette and fonts from the brand. Every number on screen has a source.
3. **Design, research, format.** You give the look (a style, a brand preset, any site's DESIGN.md, or any look in your own words), the topic, and the length, frame, and language. The agent writes the story that fits and shows you a short plan before it builds.
4. **Few rules, on purpose.** The skill hands the agent the look and one hard rule (sourced numbers) and leaves the story to it. In our A/B test, cutting the process rules made a video 23–51% cheaper with no visible drop in quality.
5. **Fast enough to iterate.** Frames render in parallel headless Chrome pages and are captured as JPEG: a 45-second 1080p video renders in about a minute on a 10-core laptop, and a whole run from research to MP4 took 4–13 minutes in our tests.

## Gallery

A few seconds from an example in each style. Every example is a video about this skill, made by a fresh agent with only this skill; the full MP4s are in the [latest release](https://github.com/Changroro/code-video/releases/latest). New styles are added over time, and pull requests for new ones are welcome (see [Contributing](#contributing)).

The brand-style presets borrow only the public design language of each site; this project is not affiliated with those companies.

<table>
<tr>
<td width="25%" align="center" valign="bottom"><b>Hand-drawn</b> · <a href="https://www.threads.com/@nahiddotai/post/DdmtD3zDtkB">@nahiddotai</a><br><img src="docs/gallery/handdrawn.gif" width="100%" alt="Hand-drawn"></td>
<td width="25%" align="center" valign="bottom"><b>Brand motion graphics</b> · <a href="https://www.threads.com/@digitalstrategyai/post/DdpAYbcgAj0">@digitalstrategyai</a><br><img src="docs/gallery/motion.gif" width="100%" alt="Brand motion graphics"></td>
<td width="25%" align="center" valign="bottom"><b>Sand art</b> · <a href="https://x.com/Michaelzsguo/status/2102592355165782312">@Michaelzsguo</a><br><img src="docs/gallery/sand.gif" width="100%" alt="Sand art"></td>
<td width="25%" align="center" valign="bottom"><b>Lyric music video</b> · <a href="https://x.com/goodside/status/2102852546620744010">@goodside</a><br><img src="docs/gallery/lyric.gif" width="100%" alt="Lyric music video"></td>
</tr>
<tr>
<td width="25%" align="center" valign="bottom"><b>Beat-synced footage</b> · <a href="https://x.com/twoclipping/status/2102554209166000267">@twoclipping</a><br><img src="docs/gallery/beat.gif" width="100%" alt="Beat-synced footage"></td>
<td width="25%" align="center" valign="bottom"><b>UI morph</b> · <a href="https://x.com/twoclipping/status/2103273003555402193">@twoclipping</a><br><img src="docs/gallery/uimorph.gif" width="100%" alt="UI morph"></td>
<td width="25%" align="center" valign="bottom"><b>Hero comic</b><br><img src="docs/gallery/comic.gif" width="100%" alt="Hero comic"></td>
<td width="25%" align="center" valign="bottom"><b>Scrapbook</b><br><img src="docs/gallery/scrapbook.gif" width="100%" alt="Scrapbook"></td>
</tr>
<tr>
<td width="25%" align="center" valign="bottom"><b>Torn-paper collage</b><br><img src="docs/gallery/collage.gif" width="100%" alt="Torn-paper collage"></td>
<td width="25%" align="center" valign="bottom"><b>Particles</b><br><img src="docs/gallery/particles.gif" width="100%" alt="Particles"></td>
<td width="25%" align="center" valign="bottom"><b>Split-flap board</b><br><img src="docs/gallery/splitflap.gif" width="100%" alt="Split-flap board"></td>
<td width="25%" align="center" valign="bottom"><b>Neon sign</b><br><img src="docs/gallery/neon.gif" width="100%" alt="Neon sign"></td>
</tr>
<tr>
<td width="25%" align="center" valign="bottom"><b>16-bit arcade</b><br><img src="docs/gallery/arcade.gif" width="100%" alt="16-bit arcade"></td>
<td width="25%" align="center" valign="bottom"><b>CRT terminal</b><br><img src="docs/gallery/terminal.gif" width="100%" alt="CRT terminal"></td>
<td width="25%" align="center" valign="bottom"><b>Thermal receipt</b><br><img src="docs/gallery/thermal.gif" width="100%" alt="Thermal receipt"></td>
<td width="25%" align="center" valign="bottom"><b>Transit map</b><br><img src="docs/gallery/transit.gif" width="100%" alt="Transit map"></td>
</tr>
<tr>
<td width="25%" align="center" valign="bottom"><b>Blueprint</b><br><img src="docs/gallery/blueprint.gif" width="100%" alt="Blueprint"></td>
<td width="25%" align="center" valign="bottom"><b>Apple-style showroom</b><br><img src="docs/gallery/brand-apple.gif" width="100%" alt="Apple-style showroom"></td>
<td width="25%" align="center" valign="bottom"><b>Samsung-style tech launch</b><br><img src="docs/gallery/brand-samsung.gif" width="100%" alt="Samsung-style tech launch"></td>
<td width="25%" align="center" valign="bottom"><b>Ferrari-style racing luxury</b><br><img src="docs/gallery/brand-ferrari.gif" width="100%" alt="Ferrari-style racing luxury"></td>
</tr>
<tr>
<td width="25%" align="center" valign="bottom"><b>Nike-style athletic</b><br><img src="docs/gallery/brand-nike.gif" width="100%" alt="Nike-style athletic"></td>
<td width="25%" align="center" valign="bottom"><b>Spotify-style dark media</b><br><img src="docs/gallery/brand-spotify.gif" width="100%" alt="Spotify-style dark media"></td>
<td width="25%" align="center" valign="bottom"><b>From a DESIGN.md (Stripe)</b><br><img src="docs/gallery/designmd-stripe.gif" width="100%" alt="From a DESIGN.md (Stripe)"></td>
<td width="25%" align="center" valign="bottom"><b>Comic book issue</b><br><img src="docs/gallery/comicbook.gif" width="100%" alt="Comic book issue"></td>
</tr>
<tr>
<td width="25%" align="center" valign="bottom"><b>Documentary</b><br><img src="docs/gallery/documentary.gif" width="100%" alt="Documentary"></td>
<td width="25%" align="center" valign="bottom"><b>Museum exhibit</b><br><img src="docs/gallery/museum.gif" width="100%" alt="Museum exhibit"></td>
<td width="25%" align="center" valign="bottom"><b>Breaking news</b><br><img src="docs/gallery/news.gif" width="100%" alt="Breaking news"></td>
<td width="25%" align="center" valign="bottom"><b>Detective board</b><br><img src="docs/gallery/detective.gif" width="100%" alt="Detective board"></td>
</tr>
<tr>
<td width="25%" align="center" valign="bottom"><b>Picture storybook</b><br><img src="docs/gallery/storybook.gif" width="100%" alt="Picture storybook"></td>
<td width="25%" align="center" valign="bottom"><b>RPG quest</b><br><img src="docs/gallery/rpg.gif" width="100%" alt="RPG quest"></td>
<td width="25%" align="center" valign="bottom"><b>Weather forecast</b><br><img src="docs/gallery/weather.gif" width="100%" alt="Weather forecast"></td>
<td width="25%" align="center" valign="bottom"><b>Home-shopping infomercial</b><br><img src="docs/gallery/infomercial.gif" width="100%" alt="Home-shopping infomercial"></td>
</tr>
<tr>
<td width="25%" align="center" valign="bottom"><b>Sports broadcast</b><br><img src="docs/gallery/sports.gif" width="100%" alt="Sports broadcast"></td>
<td width="25%" align="center" valign="bottom"><b>Assembly manual</b><br><img src="docs/gallery/manual.gif" width="100%" alt="Assembly manual"></td>
<td width="25%" align="center" valign="bottom"><b>Whiteboard lecture</b><br><img src="docs/gallery/whiteboard.gif" width="100%" alt="Whiteboard lecture"></td>
<td width="25%" align="center" valign="bottom"><b>Movie trailer</b><br><img src="docs/gallery/trailer.gif" width="100%" alt="Movie trailer"></td>
</tr>
<tr>
<td width="25%" align="center" valign="bottom"><b>Math proof lecture</b><br><img src="docs/gallery/mathlecture.gif" width="100%" alt="Math proof lecture"></td>
<td width="25%" align="center" valign="bottom"><b>Free style (left to the agent)</b><br><img src="docs/gallery/free.gif" width="100%" alt="Free style (left to the agent)"></td>
<td width="25%"></td>
<td width="25%"></td>
</tr>
</table>

## Install

Pick one.

**skills CLI** (Claude Code, Codex and other agents):

```bash
npx skills add Changroro/code-video -g
```

**Claude Code plugin** from the [changroro marketplace](https://github.com/Changroro/plugins):

```
/plugin marketplace add Changroro/plugins
/plugin install code-video@changroro
```

**Manual**: clone into your agent's skills directory.

```bash
git clone https://github.com/Changroro/code-video ~/.claude/skills/code-video   # Claude Code
git clone https://github.com/Changroro/code-video ~/.codex/skills/code-video    # Codex
```

Requirements: Node.js 18+ with npm, ffmpeg built with libx264, Google Chrome, and [uv](https://docs.astral.sh/uv/) for the helper scripts (numpy and scipy for sound, librosa for beat detection, installed on the fly).

## Use

Ask your agent for a video. Name a style if you already know it, or let it suggest one from the topic.

- "Make a 30-second promo video for https://example.com"
- "Make a sand-art video of our company's history"
- "Compare our two plans in the arcade style"
- "Make a comic-style launch video for our app"

A higher reasoning effort for the agent tends to give more detailed motion.

## Contents

| Path | Purpose |
|---|---|
| `SKILL.md` | Workflow: design, research, and format → a short plan → build → render |
| `.claude-plugin/plugin.json` | Claude Code plugin manifest (the skill stays at the repo root) |
| `template/kit.js` | Render contract: canvas setup, scene timing, frame rendering, font loading, motion blur |
| `template/render.mjs` | Deterministic frame capture with parallel pages, piped to ffmpeg, with the audio track muxed in |
| `references/` | Kit API |
| `references/styles/` | One guide per style, each with a Signature table |
| `scripts/` | Font download, logo background cleanup, contact sheets, reference sheets against the original, music and sound synthesis, beat detection |

Fonts are downloaded at build time from Google Fonts and jsDelivr (SIL Open Font License and Apache 2.0) and are not bundled.

## Contributing

Pull requests are welcome, especially new styles.

- **A new style**: add a guide in `references/styles/` that starts with `# Style: <name>` and a short description, with a Signature table of what makes the look, and add its GIF to the gallery in both READMEs. Keep only what defines the look (palette, fonts, defining traits) and rules that must never be broken; leave the story, sound, and how to draw it to the agent, and add no helper code.
- **Adapting someone's public work**: credit the creator with a link, write the guide in your own words (do not paste their prompt), and add four frames from the original to `docs/styles/` so everyone can compare.
- **Check it**: render stills with `node render.mjs stills ...` and, for a credited style, build `scripts/reference_sheet.py <key> <video> <out.jpg>` to put your frames under the original's.
- Bug reports and fixes to the engine, fonts, or guides are just as welcome. Open an issue first for large changes.

## License

[MIT](LICENSE)
