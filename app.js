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

      // Automatically start slow vertical scroll when user enters main page
      setTimeout(() => {
        startAutoVerticalScroll();
      }, 1400);
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
  // AUTOMATIC SLOW VERTICAL SCROLL ON MAIN PAGE ENTRY
  // =========================================================================
  let isAutoScrolling = false;
  let autoScrollRafId = null;
  let autoScrollLastTimestamp = null;
  let autoScrollElapsed = 0;
  let autoScrollFadeTimeout = null;
  const AUTO_SCROLL_SPEED = 90; // pixels per second (~90px/s for faster, fluid scrolling)
  const AUTO_SCROLL_RAMP = 900; // 0.9s gentle ease-in ramp

  const autoScrollPill = document.getElementById('autoScrollPill');
  const autoScrollToggleBtn = document.getElementById('autoScrollToggleBtn');
  const autoScrollStatus = document.getElementById('autoScrollStatus');

  function updateAutoScrollUI(active) {
    if (!autoScrollPill) return;
    if (active) {
      autoScrollPill.classList.add('visible');
      if (autoScrollStatus) {
        autoScrollStatus.innerHTML = '<i class="fa-solid fa-angles-down scroll-bounce-icon"></i> Auto-Scrolling';
      }
      if (autoScrollToggleBtn) {
        autoScrollToggleBtn.textContent = 'Pause';
        autoScrollToggleBtn.setAttribute('aria-label', 'Pause Auto-Scroll');
      }
      if (autoScrollFadeTimeout) {
        clearTimeout(autoScrollFadeTimeout);
        autoScrollFadeTimeout = null;
      }
    } else {
      if (autoScrollStatus) {
        autoScrollStatus.innerHTML = '<i class="fa-solid fa-pause"></i> Auto-Scroll Paused';
      }
      if (autoScrollToggleBtn) {
        autoScrollToggleBtn.textContent = 'Resume';
        autoScrollToggleBtn.setAttribute('aria-label', 'Resume Auto-Scroll');
      }
      // After 4.5 seconds of pause, gently fade out the indicator if user is reading manually
      if (autoScrollFadeTimeout) clearTimeout(autoScrollFadeTimeout);
      autoScrollFadeTimeout = setTimeout(() => {
        if (!isAutoScrolling && autoScrollPill) {
          autoScrollPill.classList.remove('visible');
        }
      }, 4500);
    }
  }

  function startAutoVerticalScroll() {
    if (isAutoScrolling) return;
    isAutoScrolling = true;
    autoScrollLastTimestamp = null;
    autoScrollElapsed = 0;
    updateAutoScrollUI(true);

    function step(timestamp) {
      if (!isAutoScrolling) return;
      if (!autoScrollLastTimestamp) {
        autoScrollLastTimestamp = timestamp;
      }
      const dt = Math.min((timestamp - autoScrollLastTimestamp) / 1000, 0.1);
      autoScrollLastTimestamp = timestamp;
      autoScrollElapsed += dt * 1000;

      // Smooth ease-in over the first 1.5 seconds
      const ramp = Math.min(autoScrollElapsed / AUTO_SCROLL_RAMP, 1);
      const ease = ramp * (2 - ramp); // Ease-out quadratic
      const stepDist = AUTO_SCROLL_SPEED * ease * dt;

      window.scrollBy(0, stepDist);

      // Stop when reaching near bottom of document
      const maxScroll = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight - 20;
      if (window.scrollY >= maxScroll) {
        stopAutoVerticalScroll();
        return;
      }

      autoScrollRafId = requestAnimationFrame(step);
    }

    autoScrollRafId = requestAnimationFrame(step);
  }

  function stopAutoVerticalScroll() {
    isAutoScrolling = false;
    if (autoScrollRafId) {
      cancelAnimationFrame(autoScrollRafId);
      autoScrollRafId = null;
    }
    updateAutoScrollUI(false);
  }

  // Gracefully pause if user interacts manually
  function handleManualUserScroll() {
    if (isAutoScrolling) {
      stopAutoVerticalScroll();
    }
  }

  window.addEventListener('wheel', handleManualUserScroll, { passive: true });
  window.addEventListener('touchstart', handleManualUserScroll, { passive: true });
  window.addEventListener('pointerdown', (e) => {
    // Don't pause if tapping directly on the auto-scroll toggle button
    if (autoScrollToggleBtn && autoScrollToggleBtn.contains(e.target)) return;
    handleManualUserScroll();
  }, { passive: true });
  window.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space', 'Home', 'End'].includes(e.code)) {
      handleManualUserScroll();
    }
  }, { passive: true });

  if (autoScrollToggleBtn) {
    autoScrollToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isAutoScrolling) {
        stopAutoVerticalScroll();
      } else {
        startAutoVerticalScroll();
      }
    });
  }

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

  function selectWeddingDate(dateKey, isInitialLoad = false) {
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
      if (itinScrollArea && !isInitialLoad) {
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
    if (dateKey === '11' && !isInitialLoad) {
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

  // Default select Dec 10 on initial load
  selectWeddingDate('10', true);

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
  // 6. 3D INTERACTIVE ROYAL MAHAL & ROYAL FOLIO DRAWER ENGINE
  // =========================================================================
  const mahalTheater = document.getElementById('mahalTheater');
  const mahalViewport = document.getElementById('mahalViewport');
  const mahalStage = document.getElementById('mahalStage');
  const mahalRecenterBtn = document.getElementById('mahalRecenterBtn');
  const mahalNavPills = document.querySelectorAll('.mahal-nav-pill');
  const mahalBeacons = document.querySelectorAll('.mahal-hotspot-beacon');

  // Royal Folio Drawer elements
  const royalFolioDrawer = document.getElementById('royalFolioDrawer');
  const folioCloseBtn = document.getElementById('folioCloseBtn');
  const folioPrevBtn = document.getElementById('folioPrevBtn');
  const folioNextBtn = document.getElementById('folioNextBtn');
  const folioPhotoSurface = document.getElementById('folioPhotoSurface') || document.getElementById('folioImg');
  const folioSrcWebp = document.getElementById('folioSrcWebp');
  const folioCounterBadge = document.getElementById('folioCounterBadge');
  const folioDotsContainer = document.getElementById('folioDotsContainer');
  let currentLandmarkPhotoIndex = 0;

  // Landmark Memory Data
  const mahalLandmarks = {
    ballroom: {
      tag: "THE GRAND BALLROOM • SHAHI MAHAL",
      title: "Dancing Under the Stars",
      desc: "Lost in the melody of our favorite song, dancing together in the illuminated grand ballroom of our dreams beneath chandeliers and golden arches.",
      webp: "assets/ballroom_dance.jpg",
      png: "assets/ballroom_dance.jpg",
      alt: "Udit & Gunjan Dancing Under the Stars",
      zoomCoords: { x: 51, y: 56 },
      photos: [
        {
          src: "assets/ballroom_dance.jpg",
          alt: "Udit & Gunjan Dancing Under the Stars",
          title: "Dancing Under the Stars",
          objectPosition: "center 40%"
        },
        {
          src: "assets/ballroom_walk.jpg",
          alt: "A Royal Promenade Through the Ballroom",
          title: "A Royal Promenade",
          objectPosition: "center 35%"
        },
        {
          src: "assets/ballroom_kiss.jpg",
          alt: "Sweet Moments by the Balcony Arch",
          title: "Sunlit Serenade",
          objectPosition: "center 45%"
        },
        {
          src: "assets/ballroom_piano.jpg",
          alt: "Melodies of Love at the Grand Piano",
          title: "Symphony of Hearts",
          objectPosition: "center 50%"
        },
        {
          src: "assets/ballroom_portrait.jpg",
          alt: "Timeless Elegance in the Palace",
          title: "A Regal Love",
          objectPosition: "center 40%"
        }
      ]
    },
    garden: {
      tag: "SHAHI BAAG • ROYAL MUGHAL GARDENS",
      title: "The Beginning of Forever",
      desc: "A golden sunset stroll amidst lush cypress groves, blooming hedges, and ancient pavilions where our paths gently intertwined into forever.",
      webp: "assets/bagh_steps_laugh.jpg",
      png: "assets/bagh_steps_laugh.jpg",
      alt: "Udit & Gunjan in the Royal Gardens",
      zoomCoords: { x: 24, y: 32 },
      photos: [
        {
          src: "assets/bagh_steps_laugh.jpg",
          alt: "Gunjan Leaning on Udit Laughing Together on the Garden Steps",
          title: "Joy on the Garden Steps",
          objectPosition: "center 25%"
        },
        {
          src: "assets/bagh_lawn_dance.jpg",
          alt: "Dancing and Twirling on the Garden Lawn Under Tall Trees",
          title: "Dance Beneath the Pines",
          objectPosition: "center 30%"
        },
        {
          src: "assets/bagh_arches_sit.jpg",
          alt: "Sitting Together on the Ancient Steps Beneath Historic Arches",
          title: "Whispers by the Ancient Arches",
          objectPosition: "center 25%"
        },
        {
          src: "assets/bagh_path_stroll.jpg",
          alt: "Walking Hand-in-Hand Beside Manicured Garden Hedges",
          title: "A Stroll by the Pavilion",
          objectPosition: "center 25%"
        },
        {
          src: "assets/bagh_monument_walk.jpg",
          alt: "Hand-in-Hand Walk Along the Historic Garden Avenue",
          title: "The Beginning of Forever",
          objectPosition: "center 30%"
        }
      ]
    },
    lake: {
      tag: "SHAHI JHEEL • PALACE WATERS",
      title: "Serenade by the Water",
      desc: "Watching the sun dip into tranquil palace waters from a golden royal boat, whispering promises across the gentle waves and lotus blooms.",
      webp: "assets/jheel_proposal.jpg",
      png: "assets/jheel_proposal.jpg",
      alt: "Udit & Gunjan on the Palace Waters",
      zoomCoords: { x: 78, y: 78 },
      photos: [
        {
          src: "assets/jheel_proposal.jpg",
          alt: "The Royal Proposal on the Yacht Bow",
          title: "A Promise on the Waters",
          objectPosition: "center 25%"
        },
        {
          src: "assets/jheel_deck_gown.jpg",
          alt: "Udit & Gunjan Hand-in-Hand with Flowing Gown",
          title: "Serenade by the Water",
          objectPosition: "center 30%"
        },
        {
          src: "assets/jheel_standing_embrace.jpg",
          alt: "Standing Embrace on the Yacht Deck",
          title: "Held in Eternal Harmony",
          objectPosition: "center 25%"
        },
        {
          src: "assets/jheel_embrace_pink.jpg",
          alt: "Gentle Loving Glance Across the Lake",
          title: "Whispering Waves",
          objectPosition: "center 25%"
        }
      ]
    },
    palms: {
      tag: "SHAHI KUNJ • COCONUT GROVE",
      title: "Whispers in the Palms",
      desc: "Strolling hand-in-hand beneath whispering coconut palms and tropical breezes, lost in laughter along sunlit trails where our journey blossoms.",
      webp: "assets/coconut_sit.jpg",
      png: "assets/coconut_sit.jpg",
      alt: "Udit & Gunjan in the Coconut Grove",
      zoomCoords: { x: 45, y: 15 },
      photos: [
        {
          src: "assets/coconut_sit.jpg",
          alt: "Udit & Gunjan Laughing Together by the Water",
          title: "Joyful Moments by the Water",
          objectPosition: "center 35%"
        },
        {
          src: "assets/coconut_run.jpg",
          alt: "Running Together Along the Palm Avenue",
          title: "Carefree Days & Tropical Breezes",
          objectPosition: "center 30%"
        },
        {
          src: "assets/coconut_walk.jpg",
          alt: "Hand in Hand Along the Lush Palm Trail",
          title: "Hand in Hand Forever",
          objectPosition: "center 35%"
        },
        {
          src: "assets/coconut_tree.jpg",
          alt: "Sweet Whispers by the Coconut Trunk",
          title: "Whispering Palms",
          objectPosition: "center 30%"
        },
        {
          src: "assets/coconut_trail.jpg",
          alt: "Balancing Together Along the Palm Ridge",
          title: "Balancing Into Forever",
          objectPosition: "center 35%"
        }
      ]
    },
    beach: {
      tag: "SAGAR TATA • ROYAL BEACH",
      title: "Golden Sands & Ocean Waves",
      desc: "Walking barefoot upon warm golden sands where the turquoise sea whispers eternal love under the radiant tropical sun.",
      webp: "assets/beach_lift.jpg",
      png: "assets/beach_lift.jpg",
      alt: "Udit & Gunjan on the Royal Beach",
      zoomCoords: { x: 72, y: 10 },
      photos: [
        {
          src: "assets/beach_lift.jpg",
          alt: "Udit Lifting Gunjan Joyfully on the Beach Shore",
          title: "Lifted by Love",
          objectPosition: "center 30%"
        },
        {
          src: "assets/beach_twirl.jpg",
          alt: "Twirling Hand-in-Hand in the Ocean Waves",
          title: "Dancing in the Ocean Waves",
          objectPosition: "center 28%"
        },
        {
          src: "assets/beach_laugh.jpg",
          alt: "Walking Arm-in-Arm Laughing Warmly",
          title: "Laughter Along the Coast",
          objectPosition: "center 25%"
        },
        {
          src: "assets/beach_splash.jpg",
          alt: "Running Together Splashing in the Surf",
          title: "Splashing Into Forever",
          objectPosition: "center 25%"
        }
      ]
    },
    bazaar: {
      tag: "MEENA BAZAAR • FESTIVE NIGHTS",
      title: "Joy, Rhythm & Festivities",
      desc: "Basking in vibrant festive canopies, fragrant spices, joyous laughter, and the celebratory beats and dance of our royal Sangeet night.",
      webp: "assets/bazaar_arch_sitting.jpg",
      png: "assets/bazaar_arch_sitting.jpg",
      alt: "Udit & Gunjan in the Vibrant Bazaar",
      zoomCoords: { x: 23, y: 82 },
      photos: [
        {
          src: "assets/bazaar_arch_sitting.jpg",
          alt: "Udit & Gunjan Sitting Beneath Ornate Carved Gateway",
          title: "Beneath the Royal Gateway",
          objectPosition: "center 30%"
        },
        {
          src: "assets/bazaar_alley_walk.jpg",
          alt: "Walking Hand-in-Hand Through the Bustling Bazaar Alley",
          title: "Strolling the Festive Alley",
          objectPosition: "center 30%"
        },
        {
          src: "assets/bazaar_jewelry_shop.jpg",
          alt: "Admiring Golden Jewelry & Tassels at the Bazaar Shop",
          title: "Golden Treasures & Laughter",
          objectPosition: "center 25%"
        }
      ]
    }
  };

  const landmarkOrder = ['ballroom', 'garden', 'lake', 'palms', 'beach', 'bazaar'];
  let currentLandmarkKey = 'ballroom';
  let isDragging = false;
  let startX = 0, startY = 0;
  let currentTiltX = 0, currentTiltY = 0;
  let targetTiltX = 0, targetTiltY = 0;
  let panX = 0, panY = 0;
  let targetPanX = 0, targetPanY = 0;
  let zoomLevel = 1.0;
  let targetZoom = 1.0;
  let isZoomedIn = false;

  // 3D Tilt & Smooth Zoom Render Loop
  function update3DTransform() {
    currentTiltX += (targetTiltX - currentTiltX) * 0.12;
    currentTiltY += (targetTiltY - currentTiltY) * 0.12;
    panX += (targetPanX - panX) * 0.12;
    panY += (targetPanY - panY) * 0.12;
    zoomLevel += (targetZoom - zoomLevel) * 0.12;

    if (mahalStage) {
      mahalStage.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel}) rotateX(${currentTiltX}deg) rotateY(${currentTiltY}deg)`;
    }

    requestAnimationFrame(update3DTransform);
  }
  requestAnimationFrame(update3DTransform);

  let isPointerDown = false;
  let pointerStartX = 0, pointerStartY = 0;
  let hasDragged = false;
  let dragOriginPanX = 0, dragOriginPanY = 0;

  // Mouse & Touch Interactions on the Palace
  if (mahalViewport) {
    mahalViewport.addEventListener('mousemove', (e) => {
      if (isPointerDown && isZoomedIn) {
        const dx = e.clientX - pointerStartX;
        const dy = e.clientY - pointerStartY;
        if (Math.hypot(dx, dy) > 5) {
          hasDragged = true;
          const rect = mahalViewport.getBoundingClientRect();
          const maxPanX = Math.max(0, ((zoomLevel - 1) * rect.width) / 2);
          const maxPanY = Math.max(0, ((zoomLevel - 1) * rect.height) / 2);
          targetPanX = Math.max(-maxPanX, Math.min(maxPanX, dragOriginPanX + dx));
          targetPanY = Math.max(-maxPanY, Math.min(maxPanY, dragOriginPanY + dy));
        }
        return;
      }

      if (isZoomedIn) return;
      const rect = mahalViewport.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      targetTiltX = -y * 14;
      targetTiltY = x * 18;
    });

    mahalViewport.addEventListener('mousedown', (e) => {
      if (e.target.closest('#mahalRecenterBtn') || e.target.closest('.mahal-hotspot-beacon')) return;
      isPointerDown = true;
      hasDragged = false;
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      dragOriginPanX = panX;
      dragOriginPanY = panY;
    });

    window.addEventListener('mouseup', () => {
      isPointerDown = false;
    });

    mahalViewport.addEventListener('mouseleave', () => {
      if (isZoomedIn) return;
      targetTiltX = 0;
      targetTiltY = 0;
    });

    // Direct Click on the Palace to Zoom In
    mahalViewport.addEventListener('click', (e) => {
      if (hasDragged) {
        hasDragged = false;
        return;
      }
      if (e.target.closest('#mahalRecenterBtn') || e.target.closest('.mahal-hotspot-beacon')) {
        return;
      }

      const rect = mahalViewport.getBoundingClientRect();
      const localX = (e.clientX - rect.left - rect.width / 2 - panX) / zoomLevel + rect.width / 2;
      const localY = (e.clientY - rect.top - rect.height / 2 - panY) / zoomLevel + rect.height / 2;
      const clickX = (localX / rect.width) * 100;
      const clickY = (localY / rect.height) * 100;

      let nearestKey = null;
      let minDistance = Infinity;

      for (const [key, item] of Object.entries(mahalLandmarks)) {
        if (!item.zoomCoords) continue;
        const dx = clickX - item.zoomCoords.x;
        const dy = clickY - item.zoomCoords.y;
        const dist = Math.hypot(dx, dy);
        if (dist < minDistance) {
          minDistance = dist;
          nearestKey = key;
        }
      }

      if (nearestKey) {
        onUserManualAction();
        selectLandmark(nearestKey);
      }
    });

    // Touch Drag & Pan for Mobile
    mahalViewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX - panX;
        startY = e.touches[0].clientY - panY;
      }
    }, { passive: true });

    mahalViewport.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      const rect = mahalViewport.getBoundingClientRect();
      const maxPanX = Math.max(0, ((zoomLevel - 1) * rect.width) / 2);
      const maxPanY = Math.max(0, ((zoomLevel - 1) * rect.height) / 2);
      targetPanX = Math.max(-maxPanX, Math.min(maxPanX, (x - startX) * 0.7));
      targetPanY = Math.max(-maxPanY, Math.min(maxPanY, (y - startY) * 0.7));
    }, { passive: true });

    mahalViewport.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // Recenter button
  if (mahalRecenterBtn) {
    mahalRecenterBtn.addEventListener('click', () => {
      resetMahalCamera();
      if (mahalTheater && mahalTheater.classList.contains('drawer-open')) {
        closeFolioDrawer();
      }
    });
  }

  function resetMahalCamera() {
    targetTiltX = 0;
    targetTiltY = 0;
    targetPanX = 0;
    targetPanY = 0;
    targetZoom = 1.0;
    isZoomedIn = false;
    if (mahalViewport) mahalViewport.classList.remove('is-zoomed');
  }

  // Landmark Selection & Folio Drawer Display
  function selectLandmark(key, photoIndex = 0, isAutoTour = false) {
    const data = mahalLandmarks[key];
    if (!data) return;

    currentLandmarkKey = key;

    // Update Nav Pills
    mahalNavPills.forEach(pill => {
      pill.classList.toggle('active-nav', pill.dataset.target === key);
    });

    // Update Beacons
    mahalBeacons.forEach(beacon => {
      beacon.classList.toggle('active-beacon', beacon.dataset.landmark === key);
    });

    // Keep palace unzoomed (1.0x) - pristine image display without blur, distortion, or empty spaces
    targetZoom = 1.0;
    targetPanX = 0;
    targetPanY = 0;
    targetTiltX = 0;
    targetTiltY = 0;
    isZoomedIn = false;
    if (mahalViewport) mahalViewport.classList.remove('is-zoomed');

    // Update Photo with gallery support
    updateFolioPhoto(data, photoIndex);

    openFolioDrawer(isAutoTour);
  }

  function updateFolioPhoto(data, photoIndex = 0) {
    if (!data) return;

    if (data.photos && data.photos.length > 0) {
      currentLandmarkPhotoIndex = (photoIndex + data.photos.length) % data.photos.length;
      const currentPhoto = data.photos[currentLandmarkPhotoIndex];

      if (folioSrcWebp) folioSrcWebp.srcset = currentPhoto.src;
      if (folioPhotoSurface) {
        folioPhotoSurface.style.opacity = '0';
        const imgPreload = new Image();
        imgPreload.onload = () => {
          if (folioPhotoSurface.tagName === 'IMG') {
            folioPhotoSurface.src = currentPhoto.src;
          } else {
            folioPhotoSurface.style.backgroundImage = `url('${currentPhoto.src}')`;
          }
          folioPhotoSurface.style.backgroundPosition = currentPhoto.objectPosition || 'center center';
          folioPhotoSurface.setAttribute('aria-label', currentPhoto.alt || 'Royal Memory Photo');
          setTimeout(() => { folioPhotoSurface.style.opacity = '1'; }, 40);
        };
        imgPreload.src = currentPhoto.src;
      }

      if (folioCounterBadge) {
        folioCounterBadge.style.display = 'block';
        folioCounterBadge.textContent = `${currentLandmarkPhotoIndex + 1} / ${data.photos.length}`;
      }

      if (folioDotsContainer) {
        folioDotsContainer.style.display = 'flex';
        folioDotsContainer.innerHTML = '';
        data.photos.forEach((_, idx) => {
          const dot = document.createElement('button');
          dot.className = `folio-dot ${idx === currentLandmarkPhotoIndex ? 'active' : ''}`;
          dot.setAttribute('aria-label', `Photo ${idx + 1}`);
          dot.addEventListener('click', (e) => {
            e.stopPropagation();
            onUserManualAction();
            updateFolioPhoto(data, idx);
          });
          folioDotsContainer.appendChild(dot);
        });
      }
    } else {
      const src = data.png || data.webp;
      if (folioSrcWebp && src) folioSrcWebp.srcset = src;
      if (folioPhotoSurface && src) {
        folioPhotoSurface.style.opacity = '0';
        const imgPreload = new Image();
        imgPreload.onload = () => {
          if (folioPhotoSurface.tagName === 'IMG') {
            folioPhotoSurface.src = src;
          } else {
            folioPhotoSurface.style.backgroundImage = `url('${src}')`;
          }
          folioPhotoSurface.style.backgroundPosition = 'center center';
          folioPhotoSurface.setAttribute('aria-label', data.alt || 'Royal Palace Landmark');
          setTimeout(() => { folioPhotoSurface.style.opacity = '1'; }, 40);
        };
        imgPreload.src = src;
      }
      if (folioCounterBadge) folioCounterBadge.style.display = 'none';
      if (folioDotsContainer) folioDotsContainer.style.display = 'none';
    }
  }

  function openFolioDrawer(isAutoTour = false) {
    if (!mahalTheater) return;
    const isMobile = window.innerWidth <= 900;
    const wasOpen = mahalTheater.classList.contains('drawer-open');
    mahalTheater.classList.add('drawer-open');

    if (isMobile && !wasOpen && !isAutoTour) {
      setTimeout(() => {
        const folioEl = document.getElementById('royalFolioDrawer');
        if (folioEl) {
          const yOffset = -75;
          const y = folioEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        }
      }, 100);
    }
  }

  function closeFolioDrawer() {
    if (!mahalTheater) return;
    mahalTheater.classList.remove('drawer-open');
    resetMahalCamera();
    mahalBeacons.forEach(beacon => beacon.classList.remove('active-beacon'));
    mahalNavPills.forEach(pill => pill.classList.remove('active-nav'));
  }

  // Event Listeners for Nav Pills
  mahalNavPills.forEach(pill => {
    pill.addEventListener('click', () => {
      onUserManualAction();
      const targetKey = pill.dataset.target;
      selectLandmark(targetKey);
    });
  });

  // Event Listeners for Hotspot Beacons
  mahalBeacons.forEach(beacon => {
    beacon.addEventListener('click', (e) => {
      e.stopPropagation();
      onUserManualAction();
      const landmarkKey = beacon.dataset.landmark;
      selectLandmark(landmarkKey);
    });

    beacon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onUserManualAction();
        const landmarkKey = beacon.dataset.landmark;
        selectLandmark(landmarkKey);
      }
    });
  });

  // Drawer Controls
  if (folioCloseBtn) {
    folioCloseBtn.addEventListener('click', () => {
      onUserManualAction();
      closeFolioDrawer();
    });
  }

  if (folioPrevBtn) {
    folioPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      onUserManualAction();
      const data = mahalLandmarks[currentLandmarkKey];
      if (data && data.photos && data.photos.length > 1) {
        updateFolioPhoto(data, currentLandmarkPhotoIndex - 1);
      } else {
        const curIndex = landmarkOrder.indexOf(currentLandmarkKey);
        const prevIndex = (curIndex - 1 + landmarkOrder.length) % landmarkOrder.length;
        selectLandmark(landmarkOrder[prevIndex]);
      }
    });
  }

  if (folioNextBtn) {
    folioNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      onUserManualAction();
      const data = mahalLandmarks[currentLandmarkKey];
      if (data && data.photos && data.photos.length > 1) {
        updateFolioPhoto(data, currentLandmarkPhotoIndex + 1);
      } else {
        const curIndex = landmarkOrder.indexOf(currentLandmarkKey);
        const nextIndex = (curIndex + 1) % landmarkOrder.length;
        selectLandmark(landmarkOrder[nextIndex]);
      }
    });
  }

  // Touch Swipe on Folio Photo Wrapper for Mobile
  const folioWrapperEl = document.querySelector('.folio-photo-wrapper');
  if (folioWrapperEl) {
    let touchStartX = 0;
    folioWrapperEl.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
      }
    }, { passive: true });
    folioWrapperEl.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches.length > 0) {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 35) {
          onUserManualAction();
          if (diff > 0 && folioNextBtn) {
            folioNextBtn.click();
          } else if (diff < 0 && folioPrevBtn) {
            folioPrevBtn.click();
          }
        }
      }
    }, { passive: true });
  }

  // =========================================================================
  // AUTOMATED PALACE TOUR & LANDMARK SHOWCASE ENGINE
  // =========================================================================
  let isTourActive = false;
  let userManuallyInteracted = false;
  let tourLandmarkIndex = 0;
  let tourPhotoIndex = 0;
  let tourTimer = null;
  let isSectionInViewport = false;

  const tourStatusText = document.getElementById('tourStatusText');
  const tourControlBtn = document.getElementById('tourControlBtn');
  const tourControlIcon = document.getElementById('tourControlIcon');
  const tourControlLabel = document.getElementById('tourControlLabel');

  function updateTourStatusUI(isActive, landmarkName, photoNum, totalPhotos) {
    if (!tourStatusText) return;
    if (isActive) {
      tourStatusText.innerHTML = `<strong>Tour Active:</strong> ${landmarkName} &bull; Photo ${photoNum} of ${totalPhotos}`;
      if (tourControlBtn) {
        tourControlBtn.classList.remove('paused');
        if (tourControlIcon) tourControlIcon.className = 'fa-solid fa-pause';
        if (tourControlLabel) tourControlLabel.textContent = 'Pause Tour';
      }
    } else {
      tourStatusText.innerHTML = `<strong>Interactive Mode:</strong> Tap any landmark beacon or destination pill`;
      if (tourControlBtn) {
        tourControlBtn.classList.add('paused');
        if (tourControlIcon) tourControlIcon.className = 'fa-solid fa-play';
        if (tourControlLabel) tourControlLabel.textContent = 'Play Showcase';
      }
    }
  }

  function runNextTourStep() {
    if (!isTourActive || !isSectionInViewport || userManuallyInteracted) return;

    const landmarkKey = landmarkOrder[tourLandmarkIndex];
    const data = mahalLandmarks[landmarkKey];
    if (!data) return;

    const totalPhotos = (data.photos && data.photos.length) ? data.photos.length : 1;

    if (tourPhotoIndex === 0) {
      selectLandmark(landmarkKey, 0, true);
    } else {
      updateFolioPhoto(data, tourPhotoIndex);
    }

    updateTourStatusUI(true, data.title, tourPhotoIndex + 1, totalPhotos);

    if (tourPhotoIndex < totalPhotos - 1) {
      tourPhotoIndex++;
      tourTimer = setTimeout(runNextTourStep, 2700);
    } else {
      tourPhotoIndex = 0;
      tourLandmarkIndex = (tourLandmarkIndex + 1) % landmarkOrder.length;
      tourTimer = setTimeout(runNextTourStep, 3000);
    }
  }

  function startAutoTour() {
    if (isTourActive || userManuallyInteracted) return;
    if (tourTimer) clearTimeout(tourTimer);
    isTourActive = true;
    runNextTourStep();
  }

  function pauseAutoTour(manual = false) {
    isTourActive = false;
    if (tourTimer) {
      clearTimeout(tourTimer);
      tourTimer = null;
    }
    if (manual) {
      userManuallyInteracted = true;
    }
    updateTourStatusUI(false);
  }

  function onUserManualAction() {
    if (!userManuallyInteracted) {
      userManuallyInteracted = true;
      pauseAutoTour(true);
    }
  }

  if (tourControlBtn) {
    tourControlBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isTourActive) {
        pauseAutoTour(true);
      } else {
        userManuallyInteracted = false;
        const curIdx = landmarkOrder.indexOf(currentLandmarkKey);
        if (curIdx !== -1) {
          tourLandmarkIndex = curIdx;
          tourPhotoIndex = 0;
        }
        startAutoTour();
      }
    });
  }

  // Observe Section 3 Entry
  const glimpseSection = document.getElementById('glimpseOfUsSection');
  if (glimpseSection && 'IntersectionObserver' in window) {
    const tourObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isSectionInViewport = true;
          if (!userManuallyInteracted && !isTourActive) {
            tourTimer = setTimeout(() => {
              if (isSectionInViewport && !userManuallyInteracted) {
                startAutoTour();
              }
            }, 800);
          }
        } else {
          isSectionInViewport = false;
          if (isTourActive) {
            pauseAutoTour(false);
          }
        }
      });
    }, {
      threshold: 0.20
    });

    tourObserver.observe(glimpseSection);
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!mahalTheater || !mahalTheater.classList.contains('drawer-open')) return;
    if (e.key === 'Escape') {
      closeFolioDrawer();
    } else if (e.key === 'ArrowLeft') {
      if (folioPrevBtn) folioPrevBtn.click();
    } else if (e.key === 'ArrowRight') {
      if (folioNextBtn) folioNextBtn.click();
    }
  });

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

  // =========================================================================
  // 9. VENUE - TRANSIT GUIDE & VENUE MAP CONCIERGE
  // =========================================================================
  const transitRoutes = {
    delhi: {
      time: '~2 hrs 15 mins (120 km)',
      route: 'Delhi-Meerut Expressway (NE 3) ➔ NH 58 Direct 4-Lane Highway',
      note: 'Smooth signal-free expressway until Meerut bypass, then straight NH 58 toward Bhopa Road. High-speed, seamless transit.'
    },
    airport: {
      time: '~2 hrs 45 mins (135 km)',
      route: 'IGI Airport (DEL) ➔ UER II / Delhi-Meerut Expressway ➔ NH 58',
      note: 'Pre-paid airport cabs (Uber / Ola / Innova) easily available directly to Palasa Hotel & Resorts, Muzaffarnagar.'
    },
    train: {
      time: '~10 mins drive (4 km)',
      route: 'Muzaffarnagar Jn (MOZ) ➔ Station Road ➔ Bhopa Road',
      note: 'Fast express trains from New Delhi (Vande Bharat, Shatabdi, Jan Shatabdi) take ~1.5 to 2 hrs to Muzaffarnagar.'
    },
    dehradun: {
      time: '~1 hr 45 mins (95 km)',
      route: 'Dehradun / Haridwar ➔ Roorkee ➔ NH 58 Southbound to Bhopa Road',
      note: 'Scenic, smooth 4-lane highway with picturesque sugarcane and rural countryside views.'
    }
  };

  const transitTabs = document.querySelectorAll('.transit-tab');
  const transitTimeVal = document.getElementById('transitTimeVal');
  const transitRouteVal = document.getElementById('transitRouteVal');
  const transitNoteVal = document.getElementById('transitNoteVal');

  if (transitTabs.length > 0) {
    transitTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const routeKey = tab.dataset.route;
        const data = transitRoutes[routeKey];
        if (!data) return;

        transitTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        if (transitTimeVal) transitTimeVal.textContent = data.time;
        if (transitRouteVal) transitRouteVal.textContent = data.route;
        if (transitNoteVal) transitNoteVal.textContent = data.note;
      });
    });
  }

  // Copy Address to Clipboard with Royal Toast
  const copyAddressBtn = document.getElementById('copyAddressBtn');
  const royalToast = document.getElementById('royalToast');
  const royalToastMsg = document.getElementById('royalToastMsg');

  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', async () => {
      const addressText = "Palasa Hotel & Resorts, Bhopa Road, Near Vishwakarma Chowk, Muzaffarnagar, Uttar Pradesh 251001, India";
      try {
        await navigator.clipboard.writeText(addressText);
        showRoyalToast("✦ Palace Address Copied to Clipboard! ✦");
        copyAddressBtn.classList.add('copied');
        const originalHTML = copyAddressBtn.innerHTML;
        copyAddressBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span class="copy-btn-text">Copied!</span>';
        setTimeout(() => {
          copyAddressBtn.innerHTML = originalHTML;
          copyAddressBtn.classList.remove('copied');
        }, 2200);
      } catch (err) {
        // Fallback for older browsers or restricted permissions
        const ta = document.createElement('textarea');
        ta.value = addressText;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showRoyalToast("✦ Palace Address Copied to Clipboard! ✦");
      }
    });
  }

  let toastTimer = null;
  function showRoyalToast(msg) {
    if (!royalToast) return;
    if (royalToastMsg) royalToastMsg.textContent = msg;
    royalToast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      royalToast.classList.remove('visible');
    }, 2800);
  }

});
