import assert from "node:assert/strict";
import { parse, isVideoId, watchUrl, shortUrl, embedUrl, thumbnails } from "../src/index.js";
import { createRequire } from "node:module";

const ok = [
  ["https://www.youtube.com/watch?v=aqz-KE-bpKQ", "aqz-KE-bpKQ", "video"],
  ["youtube.com/watch?v=aqz-KE-bpKQ", "aqz-KE-bpKQ", "video"],
  ["https://m.youtube.com/watch?v=aqz-KE-bpKQ&feature=share", "aqz-KE-bpKQ", "video"],
  ["https://music.youtube.com/watch?v=aqz-KE-bpKQ", "aqz-KE-bpKQ", "video"],
  ["https://youtu.be/jNQXAC9IVRw?si=abc", "jNQXAC9IVRw", "video"],
  ["jNQXAC9IVRw", "jNQXAC9IVRw", "video"],
  ["https://www.youtube.com/shorts/tPEE9ZwTmy0?feature=share", "tPEE9ZwTmy0", "short"],
  ["https://www.youtube.com/live/jfKfPfyJRdk", "jfKfPfyJRdk", "live"],
  ["https://www.youtube.com/embed/aqz-KE-bpKQ", "aqz-KE-bpKQ", "embed"],
  ["https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ", "aqz-KE-bpKQ", "embed"],
  ["Watch this https://youtu.be/jNQXAC9IVRw?si=x it's great", "jNQXAC9IVRw", "video"],
];
for (const [input, id, kind] of ok) {
  const r = parse(input);
  assert.equal(r.ok, true, input);
  assert.equal(r.id, id, input);
  assert.equal(r.kind, kind, input);
}

assert.equal(parse("https://youtu.be/jNQXAC9IVRw?t=90").start, 90);
assert.equal(parse("https://www.youtube.com/watch?v=aqz-KE-bpKQ&t=1m30s").start, 90);
assert.equal(parse("https://www.youtube.com/watch?v=aqz-KE-bpKQ&t=1h2m3s").start, 3723);
assert.equal(parse("https://www.youtube.com/watch?v=aqz-KE-bpKQ#t=45").start, 45);
assert.equal(parse("https://www.youtube.com/watch?v=aqz-KE-bpKQ&list=PLx&index=2").playlist, "PLx");
assert.equal(parse("https://www.youtube.com/shorts/tPEE9ZwTmy0").url, "https://www.youtube.com/shorts/tPEE9ZwTmy0");

const bad = [
  ["", "empty"], ["   ", "empty"], [null, "empty"], ["hello world", "invalid"],
  ["https://vimeo.com/123", "invalid"], ["https://www.youtube.com/@channel", "invalid"],
  ["https://youtube.com.evil.com/watch?v=aqz-KE-bpKQ", "invalid"],
  ["https://www.youtube.com/watch?v=short", "invalid"], ["x".repeat(3000), "invalid"],
  ["https://www.youtube.com/playlist?list=PLx", "playlist"],
];
for (const [input, error] of bad) assert.equal(parse(input).error, error, String(input).slice(0, 40));

assert.equal(isVideoId("aqz-KE-bpKQ"), true);
assert.equal(isVideoId("nope"), false);
assert.equal(watchUrl("aqz-KE-bpKQ", 90), "https://www.youtube.com/watch?v=aqz-KE-bpKQ&t=90s");
assert.equal(shortUrl("aqz-KE-bpKQ"), "https://youtu.be/aqz-KE-bpKQ");
assert.equal(embedUrl("aqz-KE-bpKQ", { start: 5, privacy: true }), "https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ?start=5");
assert.equal(thumbnails("aqz-KE-bpKQ").high, "https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg");
assert.throws(() => watchUrl("bad"));

const cjs = createRequire(import.meta.url)("../dist/index.cjs");
assert.equal(cjs.parse("youtu.be/jNQXAC9IVRw").id, "jNQXAC9IVRw");

console.log(`all ${ok.length + bad.length + 12} checks passed`);
