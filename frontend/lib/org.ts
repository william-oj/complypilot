export function getOrgId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("orgId");
}

export function setOrgId(orgId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("orgId", orgId);
}
