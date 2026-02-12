const container2 = document.querySelector('.container2');
const startArea = document.querySelector('.gameContainer h3');

let holding = false;
let autoContinue = false;
let opacity = 1;
let target = 1;
let raf = null;
let lastTime = null;
let hidden = false;

const SPEED = 0.3;

if (localStorage.getItem("valentineAccepted") === "true") {
    container2.classList.add('hidden');
    container2.style.pointerEvents = 'none';
    hidden = true;
    opacity = 0;
}

function updateTarget() {
    if (opacity <= 0.5) autoContinue = true;
    if (autoContinue) target = 0;
    else target = holding ? 0 : 1;
}

function animate(time) {
    if (hidden) return;
    if (!lastTime) lastTime = time;
    const dt = (time - lastTime) / 1000;
    lastTime = time;

    updateTarget();

    if (Math.abs(opacity - target) > 0.0001) {
        if (opacity > target) opacity = Math.max(0, opacity - SPEED * dt);
        else opacity = Math.min(1, opacity + SPEED * dt);
        container2.style.opacity = opacity;
    }

    if (opacity <= 0.5) {
        autoContinue = true;
        target = 0;
    }

    if (opacity <= 0) {
        opacity = 0;
        container2.style.opacity = 0;
        container2.classList.add('hidden');
        hidden = true;

        setTimeout(() => {
            container2.style.pointerEvents = 'none';
        }, 50);

        cancelAnimationFrame(raf);
        raf = null;
        lastTime = null;
        return;
    }

    if (opacity >= 1 && target === 1 && !holding) {
        container2.style.opacity = 1;
        cancelAnimationFrame(raf);
        raf = null;
        lastTime = null;
        return;
    }

    raf = requestAnimationFrame(animate);
}

function ensureAnimationRunning() {
    if (!raf && !hidden) {
        lastTime = null;
        raf = requestAnimationFrame(animate);
    }
}

function startHold() {
    if (hidden) return;
    holding = true;
    container2.style.display = '';
    container2.style.pointerEvents = 'auto';
    ensureAnimationRunning();
}

function stopHold() {
    if (hidden) return;
    holding = false;
    ensureAnimationRunning();
}

startArea.addEventListener('mousedown', (e) => { e.preventDefault(); startHold(); });
document.addEventListener('mouseup', stopHold);

startArea.addEventListener('touchstart', (e) => { e.preventDefault(); startHold(); });
document.addEventListener('touchend', stopHold);

// --- Custom cursor
const cursor = document.createElement('div');
cursor.classList.add('cursor-circle');
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

const yesBtn = document.querySelector('.yes');
const noBtn = document.querySelector('.no');

[yesBtn, noBtn].forEach(btn => {
    btn.addEventListener('mouseenter', () => { cursor.classList.add('combine'); });
    btn.addEventListener('mouseleave', () => { cursor.classList.remove('combine'); });
});

noBtn.style.position = 'relative';
noBtn.addEventListener('mouseover', () => {
    const container = document.querySelector('.container1');
    const rect = container.getBoundingClientRect();
    const newX = Math.random() * (rect.width - noBtn.offsetWidth);
    const newY = Math.random() * (rect.height - noBtn.offsetHeight);
    noBtn.style.position = 'absolute';
    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';
});

yesBtn.addEventListener('click', () => {
    alert("Yay! You said yes!");
    localStorage.setItem("valentineAccepted", "true");
    container2.classList.add('hidden');
    container2.style.pointerEvents = 'none';
    opacity = 0;
    hidden = true;
});
