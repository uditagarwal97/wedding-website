/* ==========================================================================
   ROYAL WEDDING WEBSITE - INTERACTIVE APPLICATION SCRIPT
   Features: 3D Wax Seal Reveal, Audio Synthesizer, Scratch Cards Engine,
             Countdown Timer, Photo Carousel, Confetti Particle System
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. FLOATING GLITTER PARTICLES SYSTEM
  // =========================================================================
  function initFloatingGlitter() {
    const container = document.getElementById('landingGlitter');
    if (!container) return;

    const particleCount = 35;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'glitter-particle';
      
      const size = Math.random() * 6 + 3;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${Math.random() * 5 + 6}s`;
      particle.style.animationDelay = `${Math.random() * 6}s`;
      
      container.appendChild(particle);
    }
  }

  initFloatingGlitter();

  // =========================================================================
  // 2. LANDING WAX SEAL REVEAL & CURTAIN WIPE
  // =========================================================================
  const waxSealBtn = document.getElementById('waxSealBtn');
  const tapBanner = document.getElementById('tapBanner');
  const sealLensFlare = document.getElementById('sealLensFlare');
  const landingScreen = document.getElementById('landingScreen');
  const mainInvitation = document.getElementById('mainInvitation');

  let isInvitationOpened = false;

  function openInvitation() {
    if (isInvitationOpened) return;
    isInvitationOpened = true;

    // 1. Trigger Lens Flare Pulse & Sound Effect
    if (sealLensFlare) sealLensFlare.classList.add('active');
    playSealSound();

    // 2. Make mainInvitation visible IMMEDIATELY directly behind stage curtains
    if (mainInvitation) mainInvitation.classList.remove('hidden');

    // 3. Immediately dissolve landing text/pictures/layovers & part stage curtains
    if (landingScreen) landingScreen.classList.add('curtains-open');
    startRomanticAudio();

    // Launch falling rose petals celebration immediately as curtains part open
    launchRosePetals();

    // 4. Remove landing screen overlay after curtains fully open outward
    setTimeout(() => {
      if (landingScreen) landingScreen.style.display = 'none';
      
      const announcement = document.getElementById('announcement');
      if (announcement) announcement.scrollIntoView({ behavior: 'smooth' });
    }, 1500);
  }

  // Only Wax Seal button click triggers reveal
  if (waxSealBtn) waxSealBtn.addEventListener('click', openInvitation);

  // Soft Seal Sound Effect
  function playSealSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.log('AudioContext initialized');
    }
  }

  // =========================================================================
  // 3. WEB AUDIO ROMANTIC MUSIC SYNTHESIZER & CONTROLLER
  // =========================================================================
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioTooltip = document.getElementById('audioTooltip');

  let audioCtx = null;
  let isPlayingAudio = false;
  let synthInterval = null;

  function startRomanticAudio() {
    if (isPlayingAudio) return;

    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      isPlayingAudio = true;
      if (audioToggleBtn) {
        audioToggleBtn.classList.add('playing');
        audioToggleBtn.classList.remove('muted');
      }
      if (audioTooltip) audioTooltip.textContent = '🔊 Pause Music';

      // Play soft ambient romantic synth chords loop
      const chords = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 349.23]  // G7
      ];

      let chordIndex = 0;

      function playChord() {
        if (!isPlayingAudio) return;

        const currentNotes = chords[chordIndex];
        chordIndex = (chordIndex + 1) % chords.length;

        currentNotes.forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

          // Soft attack and decay envelope
          gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
          gain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 1.2);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3.8);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start(audioCtx.currentTime + (i * 0.1));
          osc.stop(audioCtx.currentTime + 4.0);
        });
      }

      playChord();
      synthInterval = setInterval(playChord, 4000);

    } catch (err) {
      console.log('Audio playback prevented or unsupported:', err);
    }
  }

  function stopRomanticAudio() {
    isPlayingAudio = false;
    if (audioToggleBtn) {
      audioToggleBtn.classList.remove('playing');
      audioToggleBtn.classList.add('muted');
    }
    if (audioTooltip) audioTooltip.textContent = '🎵 Play Music';

    if (synthInterval) clearInterval(synthInterval);
    if (audioCtx && audioCtx.state === 'running') {
      audioCtx.suspend();
    }
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      if (isPlayingAudio) {
        stopRomanticAudio();
      } else {
        startRomanticAudio();
      }
    });
  }

  // =========================================================================
  // 4. CANVAS SCRATCH CARDS ENGINE
  // =========================================================================
  const scratchCards = [
    { canvasId: 'canvasDay', cardId: 'scratchCard1' },
    { canvasId: 'canvasMonth', cardId: 'scratchCard2' },
    { canvasId: 'canvasYear', cardId: 'scratchCard3' }
  ];

  let revealedCount = 0;

  scratchCards.forEach(item => {
    const canvas = document.getElementById(item.canvasId);
    const card = document.getElementById(item.cardId);
    if (!canvas || !card) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Draw Terracotta Canvas Coating (Clipped perfectly by SVG clip-path on wrapper)
    function initCanvasCoating() {
      const rect = card.getBoundingClientRect();
      const w = rect.width > 0 ? rect.width : 220;
      const h = rect.height > 0 ? rect.height : 210;

      canvas.width = w;
      canvas.height = h;

      ctx.clearRect(0, 0, w, h);

      // Fill Terracotta background
      ctx.fillStyle = '#C86D51';
      ctx.fillRect(0, 0, w, h);

      // Texture flecks
      ctx.fillStyle = '#B35C42';
      for (let i = 0; i < 40; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 8 + 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Clean, elegant "SCRATCH TO REVEAL" text (Minimalist & Royal)
      ctx.fillStyle = '#FDFBF7';
      ctx.font = '600 13px "Cormorant Garamond", "Cinzel Decorative", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SCRATCH TO REVEAL', w / 2, h / 2);
    }

    initCanvasCoating();

    // Scratch Logic
    let isScratching = false;

    function revealCard() {
      if (card.classList.contains('revealed')) return;
      card.classList.add('revealed');
      canvas.style.opacity = '0';
      setTimeout(() => {
        canvas.style.display = 'none';
      }, 400);

      revealedCount++;
      if (revealedCount === 3) {
        triggerAllScratchCompletion();
      }
    }

    function getScratchPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * (width / rect.width),
        y: (clientY - rect.top) * (height / rect.height)
      };
    }

    function scratch(e) {
      if (!isScratching) return;
      e.preventDefault();

      const pos = getScratchPos(e);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 28, 0, Math.PI * 2);
      ctx.fill();

      checkScratchedPercentage();
    }

    function checkScratchedPercentage() {
      try {
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;
        let clearPixels = 0;

        for (let i = 3; i < pixels.length; i += 4) {
          if (pixels[i] === 0) clearPixels++;
        }

        const percentage = clearPixels / (pixels.length / 4);
        if (percentage > 0.35) {
          revealCard();
        }
      } catch (err) {
        // In case of local CORS restriction on canvas reading
      }
    }

    // Touch & Mouse Scratch Listeners
    canvas.addEventListener('mousedown', (e) => { isScratching = true; scratch(e); });
    canvas.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', () => { isScratching = false; });

    canvas.addEventListener('touchstart', (e) => { isScratching = true; scratch(e); }, { passive: false });
    canvas.addEventListener('touchmove', scratch, { passive: false });
    window.addEventListener('touchend', () => { isScratching = false; });

    // Tap fallback: click anywhere on card auto-reveals
    card.addEventListener('click', () => {
      revealCard();
    });
  });

  function triggerAllScratchCompletion() {
    const msg = document.getElementById('scratchCompletionMsg');
    if (msg) msg.classList.remove('hidden');
    launchConfetti();
    launchFlyingDovesAndFireworks();
  }

  // =========================================================================
  // 5. LIVE COUNTDOWN TIMER TICKER
  // =========================================================================
  const targetDate = new Date('December 11, 2026 11:00:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const daysEl = document.getElementById('timerDays');
    const hoursEl = document.getElementById('timerHours');
    const minsEl = document.getElementById('timerMins');
    const secsEl = document.getElementById('timerSecs');

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = days < 10 ? '0' + days : days;
    hoursEl.textContent = hours < 10 ? '0' + hours : hours;
    minsEl.textContent = minutes < 10 ? '0' + minutes : minutes;
    secsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // =========================================================================
  // 6. PHOTO CAROUSEL ENGINE
  // =========================================================================
  const track = document.getElementById('carouselTrack');
  const slides = Array.from(track ? track.children : []);
  const nextBtn = document.getElementById('carouselNext');
  const prevBtn = document.getElementById('carouselPrev');
  const dotsNav = document.getElementById('carouselDots');
  const dots = Array.from(dotsNav ? dotsNav.children : []);

  let currentIndex = 0;
  let carouselAutoInterval = null;

  function goToSlide(index) {
    if (!track) return;
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
      resetCarouselTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
      resetCarouselTimer();
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      resetCarouselTimer();
    });
  });

  function startCarouselTimer() {
    carouselAutoInterval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 4500);
  }

  function resetCarouselTimer() {
    clearInterval(carouselAutoInterval);
    startCarouselTimer();
  }

  startCarouselTimer();

  // =========================================================================
  // 7. CONFETTI, DOVES & STARDUST CANVAS PARTICLES ENGINE
  // =========================================================================
  const confettiCanvas = document.getElementById('confettiCanvas');
  const cCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;

  let confettiParticles = [];
  let stardustParticles = [];
  let confettiAnimationId = null;

  function resizeConfettiCanvas() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeConfettiCanvas);
  resizeConfettiCanvas();

  // --- Animation 2: Golden Stardust Cursor Trail ---
  let mousePos = { x: -100, y: -100 };
  let lastSparkleTime = 0;

  window.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;

    const now = Date.now();
    if (now - lastSparkleTime > 35) {
      lastSparkleTime = now;
      spawnStardustSparkle(e.clientX, e.clientY);
    }
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      mousePos.x = e.touches[0].clientX;
      mousePos.y = e.touches[0].clientY;
      spawnStardustSparkle(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  function spawnStardustSparkle(x, y) {
    if (!confettiCanvas || !cCtx) return;
    stardustParticles.push({
      x: x + (Math.random() - 0.5) * 12,
      y: y + (Math.random() - 0.5) * 12,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5 - 0.5,
      size: Math.random() * 4 + 2,
      color: Math.random() > 0.4 ? '#F5D77F' : '#FFF',
      opacity: 1
    });

    if (stardustParticles.length > 80) stardustParticles.shift();
    if (!confettiAnimationId) animateCanvasParticles();
  }

  function launchConfetti() {
    if (!confettiCanvas || !cCtx) return;

    confettiParticles = [];
    const particleCount = 120;
    const colors = ['#F5D77F', '#D4AF37', '#FFF', '#C86D51', '#E2D7C3'];

    for (let i = 0; i < particleCount; i++) {
      confettiParticles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.7) * 18,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    if (!confettiAnimationId) animateCanvasParticles();
  }

  // --- Animation 4: Flying Golden Doves & Starburst Fireworks ---
  let doveParticles = [];

  function launchFlyingDovesAndFireworks() {
    if (!confettiCanvas || !cCtx) return;

    doveParticles = [
      { x: window.innerWidth * 0.3, y: window.innerHeight + 50, vx: 2.5, vy: -4, size: 28, wingAngle: 0, opacity: 1 },
      { x: window.innerWidth * 0.7, y: window.innerHeight + 80, vx: -2.5, vy: -4.5, size: 30, wingAngle: 1.5, opacity: 1 }
    ];

    if (!confettiAnimationId) animateCanvasParticles();
  }

  function drawDove(ctx, x, y, size, wingAngle, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = Math.max(0, opacity);
    ctx.fillStyle = '#F5D77F';
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2;

    const wingOffset = Math.sin(wingAngle) * 12;

    // Body
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.5, size * 0.25, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Wings
    ctx.beginPath();
    ctx.moveTo(-size * 0.1, -size * 0.1);
    ctx.quadraticCurveTo(0, -size * 0.8 - wingOffset, size * 0.6, -size * 0.4 - wingOffset);
    ctx.quadraticCurveTo(size * 0.2, -size * 0.2, -size * 0.1, -size * 0.1);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  function animateCanvasParticles() {
    if (!cCtx) return;
    cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    let active = 0;

    // 1. Render Stardust Cursor Trail
    stardustParticles.forEach(sp => {
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.opacity -= 0.03;

      if (sp.opacity > 0) {
        active++;
        cCtx.save();
        cCtx.globalAlpha = Math.max(0, sp.opacity);
        cCtx.fillStyle = sp.color;
        cCtx.beginPath();
        cCtx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        cCtx.fill();
        cCtx.restore();
      }
    });

    // 2. Render Falling Rose Petals (Fades out and stops after 2 seconds or scroll)
    const isScrolledDown = window.scrollY > 350;

    rosePetals.forEach(p => {
      p.y += p.speedY;
      p.swing += p.swingSpeed;
      p.x += Math.sin(p.swing) * 1.5 + p.speedX;
      p.rotation += p.rSpeed;

      // Fade out if 2 sec timer expired OR scrolled down
      if (isScrolledDown || isPetalsExpired) {
        p.opacity -= 0.025;
      }

      // Interactive Wind Push on Cursor Proximity
      const dx = p.x - mousePos.x;
      const dy = p.y - mousePos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        const force = (130 - dist) / 130;
        const angle = Math.atan2(dy, dx);
        p.x += Math.cos(angle) * force * 5;
        p.y += Math.sin(angle) * force * 5;
      }

      // Recycle petals at top ONLY if 2 sec timer active and not scrolled down
      if (p.y > window.innerHeight + 40) {
        if (!isScrolledDown && !isPetalsExpired) {
          p.y = Math.random() * -120 - 20;
          p.x = Math.random() * window.innerWidth;
        }
      }

      if (p.opacity > 0) {
        active++;
        drawRosePetal(cCtx, p.x, p.y, p.size, p.rotation, p.color, p.opacity);
      }
    });

    // 3. Render Confetti
    confettiParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.rotation += p.rSpeed;
      p.opacity -= 0.008;

      if (p.opacity > 0) {
        active++;
        cCtx.save();
        cCtx.translate(p.x, p.y);
        cCtx.rotate((p.rotation * Math.PI) / 180);
        cCtx.globalAlpha = Math.max(0, p.opacity);
        cCtx.fillStyle = p.color;
        cCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        cCtx.restore();
      }
    });

    // 4. Render Doves
    doveParticles.forEach(d => {
      d.x += d.vx;
      d.y += d.vy;
      d.wingAngle += 0.18;
      if (d.y < -100) d.opacity -= 0.02;

      if (d.opacity > 0) {
        active++;
        drawDove(cCtx, d.x, d.y, d.size, d.wingAngle, d.opacity);
      }
    });

    if (active > 0) {
      confettiAnimationId = requestAnimationFrame(animateCanvasParticles);
    } else {
      confettiAnimationId = null;
    }
  }

  // =========================================================================
  // FALLING ROSE PETALS LAUNCHER (2 Second Duration)
  // =========================================================================
  let isPetalsExpired = false;

  function launchRosePetals() {
    if (!confettiCanvas || !cCtx) return;

    isPetalsExpired = false;
    rosePetals = [];
    const petalCount = 22; // Subtle count
    const colors = ['#C8102E', '#E63946', '#D90429', '#800020', '#FF4D6D', '#FF758F', '#FF8FA3', '#C9184A'];

    for (let i = 0; i < petalCount; i++) {
      rosePetals.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * -300 - 20,
        speedY: Math.random() * 2.2 + 1.5,
        speedX: Math.random() * 1.2 - 0.6,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: Math.random() * 0.025 + 0.01,
        size: Math.random() * 14 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 2.2,
        opacity: 1
      });
    }

    // Stop rose petal recycling and fade out after 2 seconds
    setTimeout(() => {
      isPetalsExpired = true;
    }, 2000);

    if (!confettiAnimationId) animateCanvasParticles();
  }

  // Authentic Organic Rose Petal Geometry
  function drawRosePetal(ctx, x, y, size, angle, color, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.globalAlpha = Math.max(0, opacity);
    ctx.fillStyle = color;

    // Organic tapered rose petal silhouette
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.5);
    ctx.bezierCurveTo(size * 0.5, -size * 0.45, size * 0.65, 0, size * 0.4, size * 0.45);
    ctx.bezierCurveTo(size * 0.2, size * 0.65, 0, size * 0.7, 0, size * 0.7);
    ctx.bezierCurveTo(0, size * 0.7, -size * 0.2, size * 0.65, -size * 0.4, size * 0.45);
    ctx.bezierCurveTo(-size * 0.65, 0, -size * 0.5, -size * 0.45, 0, -size * 0.5);
    ctx.closePath();
    ctx.fill();

    // Delicate central vein accent
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.35);
    ctx.quadraticCurveTo(size * 0.08, 0, 0, size * 0.45);
    ctx.stroke();

    ctx.restore();
  }

  // =========================================================================
  // --- Animation 1: 3D Parallax Mouse Tracking ---
  // =========================================================================
  function initParallax3D() {
    const landingContent = document.getElementById('landingContent');
    const parchmentCard = document.querySelector('.parchment-card');

    window.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const tiltX = (e.clientY - cy) / cy * -8;
      const tiltY = (e.clientX - cx) / cx * 8;

      if (landingContent && !landingContent.classList.contains('curtains-open')) {
        landingContent.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }

      if (parchmentCard) {
        parchmentCard.style.transform = `perspective(1000px) rotateX(${tiltX * 0.4}deg) rotateY(${tiltY * 0.4}deg)`;
      }
    });
  }

  initParallax3D();

  // =========================================================================
  // 8. ELEGANT SCROLL REVEAL OBSERVER
  // =========================================================================
  function initScrollObserver() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  initScrollObserver();

});
