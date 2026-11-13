export type LinkKind = "video" | "short" | "live" | "embed";

export type ParseResult =
  | { ok: true; id: string; kind: LinkKind; start: number | null; playlist: string | null; url: string }
  | { ok: false; error: "empty" | "invalid" | "playlist"; playlist?: string };

export function parse(input: unknown): ParseResult;
export function isVideoId(value: unknown): boolean;
export function watchUrl(id: string, start?: number): string;
export function shortUrl(id: string): string;
export function embedUrl(id: string, options?: { start?: number; privacy?: boolean }): string;
export function thumbnails(id: string): { default: string; medium: string; high: string; standard: string; max: string };

declare const _default: {
  parse: typeof parse;
  isVideoId: typeof isVideoId;
  watchUrl: typeof watchUrl;
  shortUrl: typeof shortUrl;
  embedUrl: typeof embedUrl;
  thumbnails: typeof thumbnails;
};
export default _default;
