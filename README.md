# yt-link-parser

Tiny YouTube link parser with no dependencies. Paste in any YouTube link and get back the video ID, the link type (video, Short, live or embed), the start time and the playlist.

It is the same parser that checks links on [YT to MP4](https://yt-to-mp4.net/), a free YouTube to MP4 converter.

**Try it in your browser:** https://dipak8080.github.io/yt-link-parser/

## Install

```sh
npm install yt-link-parser
```

## Use

```js
import { parse } from "yt-link-parser";

parse("https://youtu.be/jNQXAC9IVRw?si=abc&t=42");
// { ok: true, id: "jNQXAC9IVRw", kind: "video", start: 42, playlist: null,
//   url: "https://www.youtube.com/watch?v=jNQXAC9IVRw" }

parse("https://www.youtube.com/shorts/tPEE9ZwTmy0");
// { ok: true, id: "tPEE9ZwTmy0", kind: "short", ... }

parse("https://vimeo.com/123");
// { ok: false, error: "invalid" }
```

CommonJS works too: `const { parse } = require("yt-link-parser")`.

## What it understands

| Link | Result |
| --- | --- |
| `youtube.com/watch?v=ID` (also `m.`, `music.`, no `https://`) | `kind: "video"` |
| `youtu.be/ID` | `kind: "video"` |
| `youtube.com/shorts/ID` | `kind: "short"` |
| `youtube.com/live/ID` | `kind: "live"` |
| `youtube.com/embed/ID`, `youtube-nocookie.com/embed/ID` | `kind: "embed"` |
| A bare 11-character ID | `kind: "video"` |
| A link inside other text ("watch this https://youtu.be/...") | the link is found and parsed |
| `&t=90`, `&t=1m30s`, `#t=45`, `&start=10` | `start` in seconds |
| `&list=PL...` on a video | `playlist` is set, the video is still parsed |
| `youtube.com/playlist?list=...` | `{ ok: false, error: "playlist" }` |
| Look-alike hosts such as `youtube.com.evil.com` | `{ ok: false, error: "invalid" }` |

## Helpers

```js
import { isVideoId, watchUrl, shortUrl, embedUrl, thumbnails } from "yt-link-parser";

isVideoId("jNQXAC9IVRw");                         // true
watchUrl("jNQXAC9IVRw", 90);                      // https://www.youtube.com/watch?v=jNQXAC9IVRw&t=90s
shortUrl("jNQXAC9IVRw");                          // https://youtu.be/jNQXAC9IVRw
embedUrl("jNQXAC9IVRw", { privacy: true });      // https://www.youtube-nocookie.com/embed/jNQXAC9IVRw
thumbnails("jNQXAC9IVRw").high;                   // https://i.ytimg.com/vi/jNQXAC9IVRw/hqdefault.jpg
```

TypeScript types are included.

## Why

Most snippets online use one regular expression that breaks on Shorts, `music.youtube.com`, share links with `?si=`, or text pasted around the link. This one uses the URL parser, checks the host exactly and is covered by tests.

## Test

```sh
npm test
```

## License

MIT
