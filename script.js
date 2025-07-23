
// Auto-reset daily checklist at midnight
function resetChecklist(listId, interval) {
    const lastResetKey = listId + "-lastReset";
    const now = new Date();
    const lastReset = localStorage.getItem(lastResetKey);

    if (!lastReset || (interval === 'daily' && new Date(lastReset).toDateString() !== now.toDateString())) {
        const checkboxes = document.querySelectorAll(`#${listId} input[type="checkbox"]`);
        checkboxes.forEach(cb => cb.checked = false);
        localStorage.setItem(lastResetKey, now.toISOString());
    }
    if (interval === '3-6-month') {
    const resetMonths = [0, 4, 8]; // Jan (0), May (4), Sep (8)
    const last = new Date(lastReset);
    const isNewResetMonth = resetMonths.includes(now.getMonth()) && (now.getMonth() !== last.getMonth() || now.getFullYear() !== last.getFullYear());
    if (isNewResetMonth) {
        checkboxes.forEach(cb => cb.checked = false);
        localStorage.setItem(interval + '-reset', now);
}

document.addEventListener("DOMContentLoaded", () => {
    resetChecklist("daily-list", "daily");
});
