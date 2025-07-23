
// Auto-reset daily checklist at midnight
document.querySelectorAll('.checklist').forEach(section => {
    const interval = section.getAttribute('data-interval');
    const checkboxes = section.querySelectorAll('input[type="checkbox"]');
    const heading = section.querySelector('h2');
    const now = new Date();

    // Add heading labels
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (interval === 'daily') {
        heading.textContent += ` (${now.toLocaleDateString(undefined, { weekday: 'long' })})`;
    } else if (interval === 'weekly') {
        heading.textContent += ` (This Week)`;
    } else if (interval === 'monthly') {
        heading.textContent += ` (${now.toLocaleDateString(undefined, { month: 'long' })})`;
    } else if (interval === 'yearly') {
        heading.textContent += ` (${now.getFullYear()})`;
    } else if (interval === '3-6-month') {
        const startMonth = Math.floor(now.getMonth() / 4) * 4;
        const endMonth = startMonth + 3;
        heading.textContent += ` (${monthNames[startMonth]} – ${monthNames[endMonth]})`;
    }

    // Load checkbox states
    checkboxes.forEach((checkbox, index) => {
        const saved = localStorage.getItem(`${interval}-${index}`);
        if (saved === 'true') checkbox.checked = true;

        checkbox.addEventListener('change', () => {
            localStorage.setItem(`${interval}-${index}`, checkbox.checked);
        });
    });

    // Auto-reset checkboxes
    const lastReset = localStorage.getItem(interval + '-reset');
    let shouldReset = false;

    if (interval === 'daily') {
        shouldReset = !lastReset || new Date(lastReset).toDateString() !== now.toDateString();
    }

    if (interval === 'weekly') {
        const last = new Date(lastReset);
        const currentWeekStart = new Date(now);
        currentWeekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
        currentWeekStart.setHours(0, 0, 0, 0);

        const lastWeekStart = new Date(last);
        lastWeekStart.setDate(last.getDate() - last.getDay() + 1); // Monday
        lastWeekStart.setHours(0, 0, 0, 0);

        shouldReset = !lastReset || currentWeekStart.getTime() !== lastWeekStart.getTime();
    }

    if (interval === 'monthly') {
        shouldReset = !lastReset || new Date(lastReset).getMonth() !== now.getMonth();
    }

    if (interval === 'yearly') {
        shouldReset = !lastReset || new Date(lastReset).getFullYear() !== now.getFullYear();
    }

    if (interval === '3-6-month') {
        const resetMonths = [0, 4, 8]; // Jan, May, Sep
        const thisMonth = now.getMonth();
        const last = new Date(lastReset);
        const lastMonth = last.getMonth();
        const crossedBoundary = resetMonths.some(month => {
            return thisMonth === month && lastMonth !== month;
        });
        shouldReset = !lastReset || crossedBoundary;
    }

    if (shouldReset) {
        checkboxes.forEach(cb => cb.checked = false);
        checkboxes.forEach((_, index) => {
            localStorage.setItem(`${interval}-${index}`, false);
        });
        localStorage.setItem(interval + '-reset', now);
    }
});
