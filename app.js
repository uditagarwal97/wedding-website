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
  // 2. LANDING MARIGOLD REVEAL, AUTO-TIMER & ACCESSIBILITY
  // =========================================================================
  const marigoldBtn = document.getElementById('marigoldBtn');
  const marigoldGlow = document.getElementById('marigoldGlow');
  const landingScreen = document.getElementById('landingScreen');
  const landingPrompt = document.getElementById('landingPrompt');
  const autoTimerCountEl = document.getElementById('autoTimerCount');
  const mainInvitation = document.getElementById('mainInvitation');

  let isInvitationOpened = false;
  let countdownRemaining = 5;
  let autoTimerInterval = null;

  function openInvitation() {
    if (isInvitationOpened) return;
    isInvitationOpened = true;

    // Clear any active auto-countdown timer
    if (autoTimerInterval) {
      clearInterval(autoTimerInterval);
      autoTimerInterval = null;
    }

    // 1. Reset background cinematic video to start from 0:00 and play
    const announcementVideo = document.getElementById('announcementVideo');
    if (announcementVideo) {
      try {
        announcementVideo.currentTime = 0;
        const playPromise = announcementVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch((e) => console.log('Announcement video play error:', e));
        }
      } catch (err) {
        console.log('Announcement video error:', err);
      }
    }

    // 2. Trigger Marigold Glow Pulse
    if (marigoldGlow) marigoldGlow.classList.add('active');

    // 3. Make mainInvitation visible IMMEDIATELY directly behind stage curtains
    if (mainInvitation) mainInvitation.classList.remove('hidden');

    // 4. Immediately dissolve landing text & part stage curtains
    if (landingScreen) landingScreen.classList.add('curtains-open');
    startRomanticAudio();

    // 5. Remove landing screen overlay after curtains fully open outward
    setTimeout(() => {
      if (landingScreen) landingScreen.style.display = 'none';

      const announcement = document.getElementById('announcement');
      if (announcement) announcement.scrollIntoView({ behavior: 'smooth' });
    }, 1500);
  }

  // 5-Second Automatic Animation Trigger with Live Visual Countdown
  autoTimerInterval = setInterval(() => {
    countdownRemaining--;
    if (autoTimerCountEl && countdownRemaining >= 0) {
      autoTimerCountEl.textContent = countdownRemaining;
    }
    if (countdownRemaining <= 0) {
      clearInterval(autoTimerInterval);
      autoTimerInterval = null;
      openInvitation();
    }
  }, 1000);

  // Click & Touch Interactions
  if (marigoldBtn) marigoldBtn.addEventListener('click', (e) => { e.stopPropagation(); openInvitation(); });
  if (landingPrompt) landingPrompt.addEventListener('click', (e) => { e.stopPropagation(); openInvitation(); });
  if (landingScreen) landingScreen.addEventListener('click', openInvitation);

  // Keyboard Accessibility (Enter / Space keys)
  const handleKeyActivation = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      openInvitation();
    }
  };
  if (marigoldBtn) marigoldBtn.addEventListener('keydown', handleKeyActivation);
  if (landingPrompt) landingPrompt.addEventListener('keydown', handleKeyActivation);

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
  // 4. ROYAL MUGHAL CALENDAR & ROYAL ITINERARY
  // =========================================================================
  const calDateButtons = document.querySelectorAll('.wedding-date-btn');
  const itinJumpButtons = document.querySelectorAll('.itin-jump-btn, .farman-jump-btn');
  const panelDay10 = document.getElementById('panelDay10');
  const panelDay11 = document.getElementById('panelDay11');
  const itinScrollArea = document.getElementById('itinScrollArea') || document.getElementById('farmanScrollArea');

  function selectWeddingDate(dateKey) {
    // 1. Update active state on calendar date buttons
    calDateButtons.forEach(btn => {
      if (btn.getAttribute('data-date') === dateKey) {
        btn.classList.add('active-selected');
      } else {
        btn.classList.remove('active-selected');
      }
    });

    // 2. Update active state on Itinerary jump buttons
    itinJumpButtons.forEach(btn => {
      const targetId = btn.getAttribute('data-target');
      if ((dateKey === '10' && targetId === 'panelDay10') || (dateKey === '11' && targetId === 'panelDay11')) {
        btn.classList.add('active-jump');
      } else {
        btn.classList.remove('active-jump');
      }
    });

    // 3. Highlight corresponding day block in the itinerary and smooth scroll into view
    const targetBlock = dateKey === '10' ? panelDay10 : panelDay11;
    const otherBlock = dateKey === '10' ? panelDay11 : panelDay10;

    if (targetBlock) {
      targetBlock.classList.add('day-highlighted');
      if (itinScrollArea) {
        itinScrollArea.scrollTo({
          top: targetBlock.offsetTop - itinScrollArea.offsetTop - 10,
          behavior: 'smooth'
        });
      }
    }
    if (otherBlock) {
      otherBlock.classList.remove('day-highlighted');
    }

    // Special fireworks celebration for the wedding day
    if (dateKey === '11') {
      launchConfetti();
      launchFlyingDovesAndFireworks();
    }
  }

  // Attach click listeners to calendar date buttons
  calDateButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const date = btn.getAttribute('data-date');
      selectWeddingDate(date);
    });
  });

  // Attach click listeners to Itinerary jump buttons
  itinJumpButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const dateKey = targetId === 'panelDay10' ? '10' : '11';
      selectWeddingDate(dateKey);
    });
  });

  // --- 1-Click Calendar Sync Suite ---
  const btnGoogleCal = document.getElementById('btnGoogleCal');
  const btnAppleCal = document.getElementById('btnAppleCal');

  if (btnGoogleCal) {
    const gCalTitle = encodeURIComponent("Royal Wedding Celebrations | Udit & Gunjan");
    const gCalDetails = encodeURIComponent(
      "Join us in celebrating the royal wedding of Udit Agarwal and Gunjan Garg!\n\n" +
      "Shahi Procession Schedule:\n" +
      "• Dec 10, 11:00 AM: Guest Welcome (Shahi Swagat)\n" +
      "• Dec 10, 12:00 PM: Sagai & Godbharai\n" +
      "• Dec 10, 7:00 PM Onwards: Sangeet & Engagement\n" +
      "• Dec 11, 10:00 AM: Haldi Ceremony\n" +
      "• Dec 11, 8:00 PM Onwards: Wedding Reception & Vedic Pheras\n\n" +
      "Venue: Palasa Hotel & Resorts, Muzaffarnagar, Uttar Pradesh\n" +
      "Location Map: https://share.google/FsrWqkFWa4dCP65mh\n" +
      "Hotel Website: https://www.palasahotel.com/"
    );
    const gCalLocation = encodeURIComponent("Palasa Hotel & Resorts, Bhopa Road, Near Vishwakarma Chowk, Muzaffarnagar, Uttar Pradesh 251001");
    // All-day celebration block Dec 10 to Dec 12, 2026
    const gCalDates = "20261210/20261212";
    btnGoogleCal.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${gCalTitle}&dates=${gCalDates}&details=${gCalDetails}&location=${gCalLocation}`;
  }

  if (btnAppleCal) {
    btnAppleCal.addEventListener('click', () => {
      const icsLines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Udit and Gunjan Wedding//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        "UID:wedding-udit-gunjan-2026@palasahotel.com",
        "DTSTAMP:20260906T000000Z",
        "DTSTART;VALUE=DATE:20261210",
        "DTEND;VALUE=DATE:20261212",
        "SUMMARY:Royal Wedding of Udit & Gunjan",
        "DESCRIPTION:Join us in celebrating the royal wedding of Udit Agarwal and Gunjan Garg at Palasa Hotel & Resorts, Muzaffarnagar. Dec 10: 11 AM Guest Welcome | 12 PM Sagai & Godbharai | 7 PM Sangeet & Engagement. Dec 11: 10 AM Haldi | 8 PM Onwards Wedding Reception & Pheras. Map: https://share.google/FsrWqkFWa4dCP65mh",
        "LOCATION:Palasa Hotel & Resorts\\, Bhopa Road\\, Near Vishwakarma Chowk\\, Muzaffarnagar\\, Uttar Pradesh 251001",
        "STATUS:CONFIRMED",
        "TRANSP:OPAQUE",
        "END:VEVENT",
        "END:VCALENDAR"
      ];
      const icsBlob = new Blob([icsLines.join("\r\n")], { type: 'text/calendar;charset=utf-8' });
      const dlLink = document.createElement('a');
      dlLink.href = window.URL.createObjectURL(icsBlob);
      dlLink.setAttribute('download', 'Udit_Gunjan_Royal_Wedding_2026.ics');
      document.body.appendChild(dlLink);
      dlLink.click();
      document.body.removeChild(dlLink);
    });
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

  // =========================================================================
  // 8. SCROLL TO EXPLORE BUTTON
  // =========================================================================
  const scrollIndicator = document.querySelector('.palace-scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const nextSection = document.getElementById('saveTheDate');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  initScrollObserver();

});
