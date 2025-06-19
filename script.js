const questions = [
    {
        q: 'Ulubiona pora dnia?',
        a: ['Rano', 'Popołudnie', 'Wieczór']
    },
    {
        q: 'Wolisz kawę czy herbatę?',
        a: ['Kawa', 'Herbata', 'Woda']
    },
    {
        q: 'Jak często się uśmiechasz?',
        a: ['Zawsze', 'Czasami', 'Nigdy']
    },
    {
        q: 'Czy wierzysz w przeznaczenie?',
        a: ['Tak', 'Nie', 'Jeszcze nie wiem']
    },
    {
        q: 'Dlaczego dalej to robisz?',
        a: ['Nie wiem', 'Chcę więcej', '...']
    },
    {
        q: 'Ostatnie pytanie?',
        a: ['Tak', 'Też tak', 'Nie masz wyjścia']
    }
];

const fearMessages = [
    'Czujesz zimny dreszcz...',
    'Ktoś patrzy.',
    'Nie odwracaj się.',
    'To dopiero początek.'
];

let current = 0;
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const nextBtn = document.getElementById('next');
const audioEl = document.getElementById('glitch-audio');
const bloodOverlay = document.getElementById('blood-overlay');
const fearEl = document.getElementById('fear-message');
const bgAudio = document.getElementById('background-audio');

audioEl.src = '';

function startBackground() {
    if (!bgAudio.dataset.played) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 70;
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 5);
        bgAudio.dataset.played = '1';
    }
}

function typeText(el, text, cb) {
    el.textContent = '';
    let i = 0;
    const iv = setInterval(() => {
        el.textContent += text[i++];
        if (i === text.length) {
            clearInterval(iv);
            cb && cb();
        }
    }, 50);
}

function showFearMessage() {
    const msg = fearMessages[Math.floor(Math.random() * fearMessages.length)];
    fearEl.textContent = msg;
    fearEl.classList.remove('hidden');
    document.body.classList.add('flicker');
    setTimeout(() => {
        fearEl.classList.add('hidden');
        document.body.classList.remove('flicker');
    }, 2000);
}

function showQuestion() {
    nextBtn.disabled = true;
    const item = questions[current];
    answersEl.innerHTML = '';
    typeText(questionEl, item.q, () => {
        item.a.forEach(a => {
            const btn = document.createElement('button');
            btn.textContent = a;
            btn.onclick = () => {
                nextBtn.disabled = false;
            };
            answersEl.appendChild(btn);
        });
    });
    if (current >= 2 && Math.random() < 0.5) {
        setTimeout(showFearMessage, 600);
    }

    if (current >= 3) {
        document.body.classList.add('glitch');
        startGlitch();
    }
}

function startGlitch() {
    if (!audioEl.src) {
        // simple beep using Web Audio API
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = 440;
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
        audioEl.src = 'data:,'; // mark as played
    }
    sprayBlood();
}

function sprayBlood() {
    for (let i = 0; i < 3; i++) {
        const drop = document.createElement('div');
        drop.className = 'blood-splatter';
        drop.style.left = Math.random() * 100 + 'vw';
        drop.style.animationDelay = Math.random() * 0.5 + 's';
        bloodOverlay.appendChild(drop);
        setTimeout(() => drop.remove(), 4000);
    }
}

nextBtn.addEventListener('click', () => {
    current++;
    if (current < questions.length) {
        showQuestion();
    } else {
        endQuiz();
    }
});

function endQuiz() {
    document.body.classList.remove('glitch');
    questionEl.textContent = 'Znam cię. Twój czas się kończy.';
    answersEl.innerHTML = '';
    nextBtn.classList.add('hidden');
    document.title = 'To nie koniec';
    localStorage.setItem('visited', '1');
    showFearMessage();
}

window.onload = () => {
    if (localStorage.getItem('visited')) {
        document.title = 'Witaj ponownie...';
    }
    startBackground();
    showQuestion();
};
