document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('press-to-dj');
    const djConsole = document.getElementById('dj-console');
    const diplomaModal = document.getElementById('diploma-modal');
    const strobe = document.querySelector('.strobe-overlay');
    const reflectors = document.querySelector('.reflectors');
    const stopBtn = document.getElementById('stop-dj');
    const okBtn = document.getElementById('ok-dj-now');
    const statusMsg = document.querySelector('.status-msg');

    let audioCtx;
    let isPlaying = false;
    let beatInterval;
    let confettiInterval;

    const sillyMessages = [
        "beat matched emotionally",
        "crowd goes mild",
        "sync button achieved enlightenment",
        "first transition survived",
        "bassline detected probably",
        "you pressed a thing. art happened."
    ];

    function stopGame() {
        if (beatInterval) clearInterval(beatInterval);
        if (confettiInterval) clearInterval(confettiInterval);
        if (audioCtx) audioCtx.close();

        isPlaying = false;
        document.body.classList.remove('party-mode');
        if (strobe) strobe.classList.add('hidden');
        if (reflectors) reflectors.classList.add('hidden');
        document.querySelector('.cursed-container').classList.remove('game-active');
        document.querySelectorAll('.deck').forEach(d => d.classList.remove('spinning'));
        stopBtn.classList.add('hidden');
        startBtn.classList.remove('hidden');
        djConsole.classList.add('hidden');
        diplomaModal.classList.add('hidden');
        audioCtx = null;
        confettiInterval = null;
    }

    function createSillyBeat() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        let step = 0;
        beatInterval = setInterval(() => {
            const time = audioCtx.currentTime;
            
            // Stupid Kick
            const kick = audioCtx.createOscillator();
            const kickGain = audioCtx.createGain();
            kick.frequency.setValueAtTime(150, time);
            kick.frequency.exponentialRampToValueAtTime(0.01, time + 0.1);
            kickGain.gain.setValueAtTime(0.5, time);
            kickGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
            kick.connect(kickGain);
            kickGain.connect(audioCtx.destination);
            kick.start();
            kick.stop(time + 0.1);

            // Stupid Hat on off-beats
            if (step % 2 === 1) {
                const hat = audioCtx.createOscillator();
                const hatGain = audioCtx.createGain();
                hat.type = 'square';
                hat.frequency.setValueAtTime(8000, time);
                hatGain.gain.setValueAtTime(0.1, time);
                hatGain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
                hat.connect(hatGain);
                hatGain.connect(audioCtx.destination);
                hat.start();
                hat.stop(time + 0.05);
            }

            step = (step + 1) % 4;
        }, 500);
    }

    function triggerSingleConfetti() {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = Math.random() * 18 + 5 + 'px';
        confetti.style.height = Math.random() * 12 + 5 + 'px';
        confetti.style.backgroundColor = ['#ff0000', '#39ff14', '#00ffff', '#ff00ff', '#ffff00'][Math.floor(Math.random() * 5)];
        
        const startX = Math.random() * 120 - 10 + 'vw';
        const startY = Math.random() * -50 - 20 + 'px';
        const endX = (parseFloat(startX) + (Math.random() * 40 - 20)) + 'vw';
        const endY = '110vh';

        confetti.style.left = startX;
        confetti.style.top = startY;
        confetti.style.zIndex = '2000';
        document.body.appendChild(confetti);

        const animation = confetti.animate([
            { top: startY, left: startX, transform: `rotate(0deg) skew(0deg)` },
            { 
                top: '50vh', 
                left: (parseFloat(startX) + (Math.random() * 20 - 10)) + 'vw', 
                transform: `rotate(${Math.random() * 500}deg) skew(${Math.random() * 20}deg)` 
            },
            { top: endY, left: endX, transform: `rotate(${Math.random() * 1500}deg) skew(0deg)` }
        ], {
            duration: 1500 + Math.random() * 3000,
            easing: 'ease-in'
        });

        animation.onfinish = () => confetti.remove();
    }

    function triggerConfetti(count = 180) {
        for (let i = 0; i < count; i++) {
            triggerSingleConfetti();
        }
    }

    startBtn.addEventListener('click', () => {
        if (isPlaying) return;
        
        isPlaying = true;
        startBtn.classList.add('hidden');
        djConsole.classList.remove('hidden');
        stopBtn.classList.remove('hidden');
        document.querySelector('.cursed-container').classList.add('game-active');
        
        createSillyBeat();
        document.body.classList.add('party-mode');
        document.querySelectorAll('.deck').forEach(d => d.classList.add('spinning'));
    });

    djConsole.addEventListener('click', (e) => {
        if (!isPlaying) return;
        
        diplomaModal.classList.remove('hidden');
        if (strobe) strobe.classList.remove('hidden');
        if (reflectors) reflectors.classList.remove('hidden');
        
        // Initial burst
        triggerConfetti(150);
        
        // Start continuous loop if not already running
        if (!confettiInterval) {
            confettiInterval = setInterval(() => {
                triggerConfetti(20);
            }, 400);
        }
        
        statusMsg.innerText = sillyMessages[Math.floor(Math.random() * sillyMessages.length)];
        
        if (e.target.classList.contains('fx-btn')) {
            const osc = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(440, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
            g.gain.setValueAtTime(0.2, audioCtx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            osc.connect(g);
            g.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.5);
        }
    });

    stopBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        stopGame();
    });

    okBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        stopGame();
    });
});
