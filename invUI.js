const container2 = document.querySelector('.container2');
const startArea = document.querySelector('.gameContainer h3');
const container1 = document.querySelector('.container1');
const yesBtn = document.querySelector('.yes');
const noBtn = document.querySelector('.no');

let holding = false;
let autoContinue = false;
let opacity = 1;
let target = 1;
let raf = null;
let lastTime = null;
let hidden = false;

const SPEED = 0.5;

function resetState() {
    hidden = false;
    opacity = 1;
    autoContinue = false;
    target = 1;
    lastTime = null;
    raf = null;

    container2.style.opacity = 1;
    container2.style.display = '';
    container2.style.pointerEvents = 'auto';
    container1.style.pointerEvents = 'none';
}

window.onload = resetState;

function updateTarget() {
    if (opacity <= 0.5) autoContinue = true;
    target = autoContinue ? 0 : (holding ? 0 : 1);
}

function animate(time) {
    if (hidden) return;

    if (!lastTime) lastTime = time;
    const dt = (time - lastTime) / 1000;
    lastTime = time;

    updateTarget();

    if (Math.abs(opacity - target) > 0.001) {
        if (opacity > target) opacity = Math.max(0, opacity - SPEED * dt);
        else opacity = Math.min(1, opacity + SPEED * dt);

        container2.style.opacity = opacity;
    }

    if (opacity <= 0.001) {
        opacity = 0;
        container2.style.opacity = 0;
        container2.style.display = 'none';
        container2.style.pointerEvents = 'none';
        container1.style.pointerEvents = 'auto';
        hidden = true;

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

const cursor = document.createElement('div');
cursor.classList.add('cursor-circle');
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

[yesBtn, noBtn].forEach(btn => {
    btn.addEventListener('mouseenter', () => cursor.classList.add('combine'));
    btn.addEventListener('mouseleave', () => cursor.classList.remove('combine'));
});

noBtn.style.position = 'relative';
noBtn.addEventListener('mouseover', () => {
    const rect = container1.getBoundingClientRect();
    const newX = Math.random() * (rect.width - noBtn.offsetWidth);
    const newY = Math.random() * (rect.height - noBtn.offsetHeight);
    noBtn.style.position = 'absolute';
    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';
});

yesBtn.addEventListener('click', () => {
    alert("Yay! You said yes!");

    opacity = 0;
    container2.style.opacity = 0;
    container2.style.display = 'none';
    container2.style.pointerEvents = 'none';
    container1.style.pointerEvents = 'auto';
    hidden = true;
});
