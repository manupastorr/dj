document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('press-to-dj');
    const djConsole = document.getElementById('dj-console');
    const feedback = document.getElementById('game-feedback');
    const stopBtn = document.getElementById('stop-dj');
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
        }, 500); // 120 BPM roughly
    }

    function triggerConfetti() {
        for (let i = 0; i < 20; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = ['#ff0000', '#39ff14', '#00ffff', '#ff00ff'][Math.floor(Math.random() * 4)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.zIndex = '9999';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            document.body.appendChild(confetti);

            const animation = confetti.animate([
                { top: '-10px', transform: `rotate(0deg) translateX(0)` },
                { top: '100vh', transform: `rotate(${Math.random() * 1000}deg) translateX(${Math.random() * 100 - 50}px)` }
            ], {
                duration: 2000 + Math.random() * 3000,
                easing: 'cubic-bezier(0, .9, .57, 1)'
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
        
        // Add "party mode" to body
        document.body.classList.add('party-mode');
        
        // Start spinning decks
        document.querySelectorAll('.deck').forEach(d => d.classList.add('spinning'));
    });

    djConsole.addEventListener('click', (e) => {
        if (!isPlaying) return;
        
        feedback.classList.remove('hidden');
        triggerConfetti();
        
        // Random message
        statusMsg.innerText = sillyMessages[Math.floor(Math.random() * sillyMessages.length)];
        
        // Airhorn sound if they hit the FX button
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
        clearInterval(beatInterval);
        if (audioCtx) audioCtx.close();
        
        isPlaying = false;
        document.body.classList.remove('party-mode');
        document.querySelector('.cursed-container').classList.remove('game-active');
        document.querySelectorAll('.deck').forEach(d => d.classList.remove('spinning'));
        stopBtn.classList.add('hidden');
        startBtn.classList.remove('hidden');
        djConsole.classList.add('hidden');
        feedback.classList.add('hidden');
        audioCtx = null;
    });
});
