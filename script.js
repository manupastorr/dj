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

    function triggerConfetti() {
        // CHAOTIC CONFETTI (150 pieces)
        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = Math.random() * 15 + 5 + 'px';
            confetti.style.height = Math.random() * 15 + 5 + 'px';
            confetti.style.backgroundColor = ['#ff0000', '#39ff14', '#00ffff', '#ff00ff', '#ffff00'][Math.floor(Math.random() * 5)];
            
            // Random start from any edge
            const side = Math.floor(Math.random() * 4);
            let startX, startY, endX, endY;
            
            if (side === 0) { // Top
                startX = Math.random() * 100 + 'vw'; startY = '-20px';
                endX = Math.random() * 100 + 'vw'; endY = '120vh';
            } else if (side === 1) { // Bottom
                startX = Math.random() * 100 + 'vw'; startY = '110vh';
                endX = Math.random() * 100 + 'vw'; endY = '-20vh';
            } else if (side === 2) { // Left
                startX = '-20px'; startY = Math.random() * 100 + 'vh';
                endX = '120vw'; endY = Math.random() * 100 + 'vh';
            } else { // Right
                startX = '110vw'; startY = Math.random() * 100 + 'vh';
                endX = '-20vw'; endY = Math.random() * 100 + 'vh';
            }

            confetti.style.left = startX;
            confetti.style.top = startY;
            confetti.style.zIndex = '2000';
            document.body.appendChild(confetti);

            const animation = confetti.animate([
                { top: startY, left: startX, transform: `rotate(0deg)` },
                { top: endY, left: endX, transform: `rotate(${Math.random() * 2000 - 1000}deg)` }
            ], {
                duration: 1000 + Math.random() * 2000,
                easing: 'cubic-bezier(0.1, 0.5, 0.5, 1)'
            });

            animation.onfinish = () => confetti.remove();
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
        triggerConfetti();
        
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
