
/* ==========================================
   A HAPPY SURPRISE | BY CHRIS
   Complete JavaScript
========================================== */

document.addEventListener('DOMContentLoaded', () => {
  const room = document.getElementById('room');
  const handle = document.getElementById('stringHandle');
  const path = document.getElementById('stringPath');
  const fireflies = document.getElementById('fireflies');
  const card = document.getElementById('mainCard');
  const front = document.getElementById('frontCard');
  const back = document.getElementById('backCard');

  if (!room || !handle || !card || !front || !back) {
    console.error('Missing required HTML elements. Check your element IDs.');
    return;
  }

  let isOn = false;
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let dragX = 0;
  let dragY = 0;

  /* ==========================================
     LAMP CONTROL
  ========================================== */

  function setLamp(on) {
    isOn = on;
    room.classList.toggle('on', isOn);

    if (isOn) {
      createFireflies();
      createHeartOrbit();
    } else {
      if (fireflies) {
        fireflies.innerHTML = '';
      }

      const orbit = card.querySelector('.heart-orbit');

      if (orbit) {
        orbit.remove();
      }
    }
  }

  /* ==========================================
     LAMP STRING
  ========================================== */

  function updateString(x, y) {
    if (!path) return;

    path.setAttribute(
      'd',
      `M 0 0 L ${x} ${80 + y}`
    );
  }

  function resetHandle() {
    handle.style.transform = 'translate(0px, 0px)';
    updateString(0, 0);
  }

  function pointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return;

    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    dragX = 0;
    dragY = 0;

    handle.classList.add('dragging');

    if (handle.setPointerCapture) {
      handle.setPointerCapture(e.pointerId);
    }
  }

  function pointerMove(e) {
    if (!dragging) return;

    dragX = Math.max(
      -35,
      Math.min(35, (e.clientX - startX) * 0.3)
    );

    dragY = Math.max(
      0,
      Math.min(180, (e.clientY - startY) * 0.6)
    );

    handle.style.transform =
      `translate(${dragX}px, ${dragY}px)`;

    updateString(dragX, dragY);
  }

  function pointerUp() {
    if (!dragging) return;

    const pulled = dragY > 30;

    dragging = false;
    handle.classList.remove('dragging');

    resetHandle();

    if (pulled) {
      setLamp(!isOn);
    }
  }

  handle.addEventListener('pointerdown', pointerDown);
  handle.addEventListener('pointermove', pointerMove);
  handle.addEventListener('pointerup', pointerUp);
  handle.addEventListener('pointercancel', pointerUp);

  /* ==========================================
     RANDOM NUMBERS
  ========================================== */

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  /* ==========================================
     GOLDEN FIREFLIES
  ========================================== */

  function createFireflies() {
    if (!fireflies) return;

    fireflies.innerHTML = '';

    for (let i = 0; i < 22; i++) {
      const dot = document.createElement('span');

      dot.className = 'firefly';

      const size = random(3, 7);

      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${random(0, 100)}%`;
      dot.style.top = `${random(0, 100)}%`;

      dot.style.setProperty(
        '--duration',
        `${random(12, 24)}s`
      );

      dot.style.setProperty(
        '--delay',
        `${random(0, 5)}s`
      );

      for (let n = 1; n <= 5; n++) {
        dot.style.setProperty(
          `--x${n}`,
          `${random(-100, 100)}px`
        );

        dot.style.setProperty(
          `--y${n}`,
          `${random(-100, 100)}px`
        );
      }

      fireflies.appendChild(dot);
    }
  }

  /* ==========================================
     FLOATING HEARTS
  ========================================== */

  function createHeartOrbit() {
    if (card.querySelector('.heart-orbit')) return;

    const orbit = document.createElement('div');

    orbit.className = 'heart-orbit';
    orbit.setAttribute('aria-hidden', 'true');

    const symbols = [
      '♥', '♡', '❤', '♥', '♡',
      '♥', '❤', '♡', '♥', '♡'
    ];

    symbols.forEach((symbol, index) => {
      const heart = document.createElement('span');

      heart.className =
        'floating-heart' +
        (index % 3 === 0 ? ' gold' : '');

      heart.textContent = symbol;

      heart.style.setProperty(
        '--heart-size',
        `${16 + random(0, 12)}px`
      );

      heart.style.setProperty(
        '--heart-duration',
        `${7 + random(0, 4)}s`
      );

      heart.style.setProperty(
        '--heart-delay',
        `${-random(0, 8)}s`
      );

      heart.style.setProperty(
        '--heart-radius',
        `${155 + random(0, 30)}px`
      );

      orbit.appendChild(heart);
    });

    card.appendChild(orbit);
  }

  /* ==========================================
     CARD SWITCHING
  ========================================== */

  function toggleCard() {
    // Do not change the card while the lamp is off.
    if (!isOn) return;

    const showingFront =
      front.style.display !== 'none';

    if (showingFront) {
      front.style.display = 'none';
      back.style.display = 'flex';
    } else {
      back.style.display = 'none';
      front.style.display = 'flex';
    }

    // Briefly emphasize the card after changing sides.
    card.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(1.015)' },
        { transform: 'scale(1)' }
      ],
      {
        duration: 350,
        easing: 'ease-out'
      }
    );
  }

  // Required by the onclick="toggleCard()" HTML buttons.
  window.toggleCard = toggleCard;

  /* ==========================================
     INITIAL STATE
  ========================================== */

  front.style.display = 'flex';
  back.style.display = 'none';

  card.classList.remove('flipped');

  // START WITH THE LAMP OFF.
  setLamp(false);

  console.log('Mother’s Day surprise is ready! ❤️');
});
