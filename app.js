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
  // =========================================================================
  // 2. LANDING MARIGOLD REVEAL & CURTAIN WIPE
  // =========================================================================
  const marigoldBtn = document.getElementById('marigoldBtn');
  const marigoldGlow = document.getElementById('marigoldGlow');
  const landingScreen = document.getElementById('landingScreen');
  const mainInvitation = document.getElementById('mainInvitation');

  let isInvitationOpened = false;

  function openInvitation() {
    if (isInvitationOpened) return;
    isInvitationOpened = true;

    // 1. Trigger Marigold Glow Pulse
    if (marigoldGlow) marigoldGlow.classList.add('active');

    // 2. Make mainInvitation visible IMMEDIATELY directly behind stage curtains
    if (mainInvitation) mainInvitation.classList.remove('hidden');

    // 3. Immediately dissolve landing text & part stage curtains
    if (landingScreen) landingScreen.classList.add('curtains-open');
    startRomanticAudio();

    // Launch falling marigold flowers shower immediately as curtains part open
    launchMarigoldShower();

    // 4. Remove landing screen overlay after curtains fully open outward
    setTimeout(() => {
      if (landingScreen) landingScreen.style.display = 'none';

      const announcement = document.getElementById('announcement');
      if (announcement) announcement.scrollIntoView({ behavior: 'smooth' });
    }, 1500);
  }

  // Only Marigold button click triggers reveal
  if (marigoldBtn) marigoldBtn.addEventListener('click', openInvitation);

  // =========================================================================
  // 3. ROMANTIC BACKGROUND MUSIC (Jashn-E-Bahaaraa via YouTube IFrame API)
  // =========================================================================
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioTooltip = document.getElementById('audioTooltip');

  let isPlayingAudio = false;
  let ytPlayer = null;
  let isYtReady = false;
  const JASHN_START_SEC = 13; // Starts right at 0:13
  const JASHN_SPEED = 1.0;    // Original 1.0x playback speed
  const JASHN_VOLUME = 10;    // 10% volume level

  // YouTube IFrame API Callback
  window.onYouTubeIframeAPIReady = function () {
    try {
      ytPlayer = new YT.Player('ytPlayer', {
        height: '1',
        width: '1',
        videoId: 'cZrcHegIFqQ',
        playerVars: {
          autoplay: 0,
          controls: 0,
          start: JASHN_START_SEC,
          loop: 1,
          playlist: 'cZrcHegIFqQ',
          enablejsapi: 1,
          playsinline: 1
        },
        events: {
          onReady: () => {
            isYtReady = true;
            try { ytPlayer.setVolume(JASHN_VOLUME); } catch (e) { }
            console.log('YouTube Jashn-E-Bahaaraa Player Ready');
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING) {
              isPlayingAudio = true;
              try {
                ytPlayer.setPlaybackRate(JASHN_SPEED);
                ytPlayer.setVolume(JASHN_VOLUME);
              } catch (e) { }
              if (audioToggleBtn) {
                audioToggleBtn.classList.add('playing');
                audioToggleBtn.classList.remove('muted');
              }
              if (audioTooltip) audioTooltip.textContent = 'PAUSE MUSIC';
            } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
              isPlayingAudio = false;
              if (audioToggleBtn) {
                audioToggleBtn.classList.remove('playing');
                audioToggleBtn.classList.add('muted');
              }
              if (audioTooltip) audioTooltip.textContent = 'PLAY MUSIC';
            }
          }
        }
      });
    } catch (e) {
      console.log('YouTube Player init error:', e);
    }
  };

  function startRomanticAudio() {
    if (isPlayingAudio) return;

    if (isYtReady && ytPlayer && typeof ytPlayer.playVideo === 'function') {
      try {
        ytPlayer.seekTo(JASHN_START_SEC, true);
        ytPlayer.setPlaybackRate(JASHN_SPEED);
        ytPlayer.setVolume(JASHN_VOLUME);
        ytPlayer.playVideo();
        isPlayingAudio = true;
        if (audioToggleBtn) {
          audioToggleBtn.classList.add('playing');
          audioToggleBtn.classList.remove('muted');
        }
        if (audioTooltip) audioTooltip.textContent = 'PAUSE MUSIC';
        return;
      } catch (err) {
        console.log('YouTube play error:', err);
      }
    }

    // Fallback if API is still loading
    setTimeout(() => {
      if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
        try {
          ytPlayer.seekTo(JASHN_START_SEC, true);
          ytPlayer.setPlaybackRate(JASHN_SPEED);
          ytPlayer.setVolume(JASHN_VOLUME);
          ytPlayer.playVideo();
          isPlayingAudio = true;
          if (audioToggleBtn) {
            audioToggleBtn.classList.add('playing');
            audioToggleBtn.classList.remove('muted');
          }
          if (audioTooltip) audioTooltip.textContent = 'PAUSE MUSIC';
        } catch (e) { }
      }
    }, 1000);
  }

  function stopRomanticAudio() {
    isPlayingAudio = false;
    if (audioToggleBtn) {
      audioToggleBtn.classList.remove('playing');
      audioToggleBtn.classList.add('muted');
    }
    if (audioTooltip) audioTooltip.textContent = 'PLAY MUSIC';

    if (isYtReady && ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
      try {
        ytPlayer.pauseVideo();
      } catch (e) { }
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
  let marigoldPetals = [];
  let isMarigoldsExpired = false;
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

    // 2. Render Falling Marigold Flowers (Floats all the way to the bottom of the section)
    marigoldPetals.forEach(p => {
      p.y += p.speedY;
      p.swing += p.swingSpeed;
      p.x += Math.sin(p.swing) * 1.5 + p.speedX;
      p.rotation += p.rSpeed;

      // Smooth fade out only after expired or reaching bottom
      if (isMarigoldsExpired || p.y > window.innerHeight * 0.85) {
        p.opacity -= 0.008;
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

      // Recycle marigolds at top while shower timer is active
      if (p.y > window.innerHeight + 40) {
        if (!isMarigoldsExpired) {
          p.y = Math.random() * -120 - 20;
          p.x = Math.random() * window.innerWidth;
        }
      }

      if (p.opacity > 0) {
        active++;
        drawMarigoldFlower(cCtx, p.x, p.y, p.size, p.rotation, p.theme, p.opacity);
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
  // FALLING MARIGOLD FLOWERS LAUNCHER (2 Second Duration)
  // =========================================================================
  function launchMarigoldShower() {
    if (!confettiCanvas || !cCtx) return;

    isMarigoldsExpired = false;
    marigoldPetals = [];
    const petalCount = 28; // Rich festive count
    const themes = ['orange', 'yellow'];

    for (let i = 0; i < petalCount; i++) {
      marigoldPetals.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * -300 - 20,
        speedY: Math.random() * 2.0 + 1.8,
        speedX: Math.random() * 1.0 - 0.5,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: Math.random() * 0.02 + 0.01,
        size: Math.random() * 16 + 18, // Generous fluffy size
        theme: themes[Math.floor(Math.random() * themes.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 2.5,
        opacity: 1
      });
    }

    // Stop marigold recycling and fade out after 6.5 seconds (allowing petals to reach section end)
    setTimeout(() => {
      isMarigoldsExpired = true;
    }, 6500);

    if (!confettiAnimationId) animateCanvasParticles();
  }

  // Authentic Organic Marigold Flower Geometry
  function drawMarigoldFlower(ctx, x, y, size, rotation, themeColor, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.globalAlpha = Math.max(0, opacity);

    let colors;
    if (themeColor === 'orange') {
      colors = ['#B71C1C', '#D84315', '#E65100', '#FF9800', '#FFB300'];
    } else {
      colors = ['#E65100', '#FF8F00', '#FFC107', '#FFD54F', '#FFE082'];
    }

    // 5 Concentric layers of fluffy scalloped petal structures
    for (let layer = 0; layer < 5; layer++) {
      const layerSize = size * (1 - layer * 0.16);
      const petalCount = 8 + layer * 4;
      const petalRadius = layerSize * 0.35;

      ctx.fillStyle = colors[Math.min(layer, colors.length - 1)];

      for (let p = 0; p < petalCount; p++) {
        const angle = (p / petalCount) * Math.PI * 2 + (layer * 0.5);
        const px = Math.cos(angle) * (layerSize * 0.52);
        const py = Math.sin(angle) * (layerSize * 0.52);

        ctx.beginPath();
        ctx.arc(px, py, petalRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Bright golden central core
    ctx.fillStyle = '#FFEE58';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
    ctx.fill();

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
