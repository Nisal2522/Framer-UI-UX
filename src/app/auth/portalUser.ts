const STORAGE_KEY = "agrico_portal_user";

export type PortalRole = "cooperative" | "government_admin";

export type PortalUser = {
  role: PortalRole;
  email: string;
};

export function setPortalUser(user: PortalUser): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function getPortalUser(): PortalUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PortalUser;
    if (parsed.role !== "cooperative" && parsed.role !== "government_admin") return null;
    if (typeof parsed.email !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearPortalUser(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function isGovernmentAdmin(): boolean {
  return getPortalUser()?.role === "government_admin";
}
