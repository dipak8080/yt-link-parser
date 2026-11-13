const ID = /^[A-Za-z0-9_-]{11}$/;
const HOSTS = new Set(["youtube.com", "youtube-nocookie.com", "youtu.be"]);
const PATH_KINDS = { shorts: "short", live: "live", embed: "embed", v: "video" };

function seconds(raw) {
  if (!raw) return null;
  const s = String(raw).trim();
  if (/^\d+$/.test(s)) return Number(s);
  const m = s.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/i);
  if (!m || !(m[1] || m[2] || m[3])) return null;
  return (Number(m[1] || 0) * 3600) + (Number(m[2] || 0) * 60) + Number(m[3] || 0);
}

function isVideoId(value) {
  return ID.test(String(value || ""));
}

function parse(input) {
  let t = String(input == null ? "" : input).trim();
  if (!t) return { ok: false, error: "empty" };
  if (t.length > 2048) return { ok: false, error: "invalid" };
  if (ID.test(t)) return result(t, "video", null, null);

  const found = t.match(/(?:https?:\/\/)?(?:[a-z0-9-]+\.)*(?:youtube(?:-nocookie)?\.com|youtu\.be)\/[^\s"'<>]*/i);
  if (found) t = found[0];
  else if (/\s/.test(t) || !/[./]/.test(t)) return { ok: false, error: "invalid" };
  if (!/^https?:\/\//i.test(t)) t = "https://" + t;

  let u;
  try { u = new URL(t); } catch (e) { return { ok: false, error: "invalid" }; }
  const host = u.hostname.toLowerCase().replace(/^(www|m|music)\./, "");
  if (!HOSTS.has(host)) return { ok: false, error: "invalid" };

  const segs = u.pathname.split("/").filter(Boolean);
  const list = u.searchParams.get("list");
  const start = seconds(u.searchParams.get("t") || u.searchParams.get("start") || (u.hash.match(/t=([^&]+)/) || [])[1]);
  let id = null;
  let kind = "video";

  if (host === "youtu.be") id = segs[0];
  else if (segs[0] === "watch") id = u.searchParams.get("v");
  else if (PATH_KINDS[segs[0]]) { id = segs[1]; kind = PATH_KINDS[segs[0]]; }
  else if (segs[0] === "playlist") return list ? { ok: false, error: "playlist", playlist: list } : { ok: false, error: "invalid" };

  if (id && ID.test(id)) return result(id, kind, start, list);
  if (list) return { ok: false, error: "playlist", playlist: list };
  return { ok: false, error: "invalid" };
}

function result(id, kind, start, playlist) {
  return {
    ok: true,
    id,
    kind,
    start,
    playlist: playlist || null,
    url: kind === "short" ? `https://www.youtube.com/shorts/${id}` : `https://www.youtube.com/watch?v=${id}`,
  };
}

function watchUrl(id, start) {
  if (!ID.test(id)) throw new TypeError("not a YouTube video id");
  return `https://www.youtube.com/watch?v=${id}` + (start > 0 ? `&t=${Math.floor(start)}s` : "");
}

function shortUrl(id) {
  if (!ID.test(id)) throw new TypeError("not a YouTube video id");
  return `https://youtu.be/${id}`;
}

function embedUrl(id, { start, privacy = false } = {}) {
  if (!ID.test(id)) throw new TypeError("not a YouTube video id");
  const base = privacy ? "https://www.youtube-nocookie.com/embed/" : "https://www.youtube.com/embed/";
  return base + id + (start > 0 ? `?start=${Math.floor(start)}` : "");
}

function thumbnails(id) {
  if (!ID.test(id)) throw new TypeError("not a YouTube video id");
  const b = `https://i.ytimg.com/vi/${id}/`;
  return {
    default: b + "default.jpg",
    medium: b + "mqdefault.jpg",
    high: b + "hqdefault.jpg",
    standard: b + "sddefault.jpg",
    max: b + "maxresdefault.jpg",
  };
}



module.exports = { parse, isVideoId, watchUrl, shortUrl, embedUrl, thumbnails };
module.exports.default = module.exports;
