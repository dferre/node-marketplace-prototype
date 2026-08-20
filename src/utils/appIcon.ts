const APP_ICON_BACKGROUNDS = [
  "bg-webstack-blue",
  "bg-webstack-orange",
  "bg-webstack-green",
  "bg-webstack-pink",
  "bg-primitives-red",
  "bg-primitives-green",
  "bg-primitives-blue",
  "bg-primitives-orange",
  "bg-primitives-purple",
  "bg-primitives-mint",
  "bg-primitives-teal",
  "bg-primitives-cyan",
  "bg-primitives-indigo",
] as const;

export function appIconBackgroundClass(id: string) {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 31 + id.charCodeAt(index)) >>> 0;
  }
  return APP_ICON_BACKGROUNDS[hash % APP_ICON_BACKGROUNDS.length];
}
