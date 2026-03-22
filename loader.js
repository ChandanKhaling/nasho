(function () {
    const loader    = document.getElementById('loader');
    const countEl   = document.querySelector('.loader-count');
    const lineEl    = document.querySelector('.loader-line');

    let current = 0;
    const total = 100;
    // Varies speed — slow start, fast middle, slow end
    const duration = 2600; // ms total

    function easeInOut(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    let startTime = null;

    function tick(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOut(progress);

        current = Math.floor(eased * total);
        countEl.textContent = current;
        lineEl.style.width = (eased * 100) + '%';
        lineEl.style.transitionDuration = '0ms'; // driven by rAF, not CSS

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            countEl.textContent = 100;
            lineEl.style.width = '100%';

            // Short pause at 100, then split open
            setTimeout(() => {
                countEl.style.opacity = '0';
                loader.classList.add('split');

                // After split animation ends, kill the loader
                loader.addEventListener('transitionend', () => {
                    loader.classList.add('done');
                }, { once: true });
            }, 300);
        }
    }

    // Start as soon as DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(tick));
    } else {
        requestAnimationFrame(tick);
    }
})();