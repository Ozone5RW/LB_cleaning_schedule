
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
}

document.addEventListener("DOMContentLoaded", () => {
    resetChecklist("daily-list", "daily");
});
