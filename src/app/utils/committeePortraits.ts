/**
 * Real portrait headshots for committee cards (RandomUser public portrait CDN).
 * Google does not expose a general-purpose “person photo by name” API; production
 * apps typically use uploaded photos, Google Cloud Storage, or Custom Search JSON
 * with your own API key. These URLs are stable and gender-matched for demo use.
 */
const PORTRAIT_BY_MEMBER_ID: Record<
  string,
  { dir: "men" | "women"; idx: number }
> = {
  "1": { dir: "men", idx: 32 },
  "2": { dir: "women", idx: 44 },
  "3": { dir: "men", idx: 67 },
  "4": { dir: "women", idx: 26 },
  "5": { dir: "men", idx: 51 },
  "6": { dir: "men", idx: 73 },
};

export function committeeMemberPortraitUrl(member: {
  id: string;
  gender: string;
}): string {
  const female = member.gender.toLowerCase() === "female";
  const curated = PORTRAIT_BY_MEMBER_ID[member.id];
  if (curated) {
    return `https://randomuser.me/api/portraits/${curated.dir}/${curated.idx}.jpg`;
  }
  const dir = female ? "women" : "men";
  const idx = (Number.parseInt(member.id, 10) * 13) % 99;
  return `https://randomuser.me/api/portraits/${dir}/${idx}.jpg`;
}

/** Farmer directory — portrait keyed by FM-### id (stable) and gender. */
export function farmerMemberPortraitUrl(member: { id: string; gender: string }): string {
  const g = member.gender.toLowerCase();
  const num = Number.parseInt(member.id.replace(/\D/g, ""), 10) || 1;
  const idx = num % 99;
  if (g === "female") {
    return `https://randomuser.me/api/portraits/women/${idx}.jpg`;
  }
  if (g === "other") {
    const dir = num % 2 === 0 ? "men" : "women";
    return `https://randomuser.me/api/portraits/${dir}/${(num * 7) % 99}.jpg`;
  }
  return `https://randomuser.me/api/portraits/men/${idx}.jpg`;
}
