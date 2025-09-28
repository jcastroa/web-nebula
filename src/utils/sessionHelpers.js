// src/utils/sessionHelpers.js
export const wasRecentlyLoggedOut = (windowSeconds = 5) => {
  try {
    const v = localStorage.getItem('session-expired-at');
    if (!v) return false;
    const ts = Number(v);
    if (Number.isNaN(ts)) return false;
    return (Date.now() - ts) < windowSeconds * 1000;
  } catch (e) {
    return false;
  }
};

export const clearSessionExpiredMark = () => {
  try {
    localStorage.removeItem('session-expired-at');
    localStorage.removeItem('session-expired-bump');
  } catch (e) {}
};
