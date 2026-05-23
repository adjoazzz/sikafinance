// Initialize AOS (Animate on Scroll)
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });
}

// Select DOM elements
const phoneStage = document.getElementById('phoneStage');
const solutionSection = document.getElementById('solution');
const clusterCards = document.querySelectorAll('.cluster-card');
const heroElement = document.getElementById('hero');

// 1. Intersection observer for solution section cards
if (solutionSection && clusterCards.length > 0) {
    const clusterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                clusterCards.forEach(card => card.classList.add('visible'));
            }
        });
    }, { threshold: 0.3 });

    clusterObserver.observe(solutionSection);
}

// 2. Scroll observer to trigger hero card exit (fade / slide away)
if (phoneStage && heroElement) {
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                phoneStage.classList.add('scrolled');
            } else {
                phoneStage.classList.remove('scrolled');
            }
        });
    }, { threshold: 0.1 });

    heroObserver.observe(heroElement);
}

// 3. Intersection observer for phone stage cards pop-out
if (phoneStage) {
    const phoneObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                phoneStage.classList.add('active');
            } else {
                phoneStage.classList.remove('active');
            }
        });
    }, { threshold: 0.5 });

    phoneObserver.observe(phoneStage);
}

// 4. Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// 5. Paystack & Email Modal Integration
function openEmailModal() {
    const modal = document.getElementById('emailModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeEmailModal() {
    const modal = document.getElementById('emailModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function closeEmailModalOnOutsideClick(e) {
    const modal = document.getElementById('emailModal');
    if (e.target === modal) {
        closeEmailModal();
    }
}


function startPayment() {
    const emailInput = document.getElementById('userEmail');
    if (!emailInput) return;
    
    const email = emailInput.value;
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }
    
    const modal = document.getElementById('emailModal');
    if (modal) {
        modal.classList.remove('active');
    }
    
    payWithPaystack(email);
}

function payWithPaystack(email) {
    if (typeof PaystackPop === 'undefined') {
        alert('Paystack SDK is not loaded. Please check your internet connection.');
        return;
    }

    // Initialize Paystack
    let handler = PaystackPop.setup({
        key: 'pk_test_33ae2ee580d1e7fb5e3e829d92a8c77e70f719c7', // YOUR PUBLIC KEY
        email: email,
        amount: 5000, // Amount in pesewas (5000 = 50 GHS)
        currency: 'GHS',
        ref: 'SIKA_' + Math.floor((Math.random() * 1000000000) + 1), // Unique ref
        callback: function (response) {
            // Hide CTAs and show success message
            const ctaButtons = document.querySelectorAll('#heroCTA .btn-primary, #finalCTA .btn-primary');
            const successMsgs = document.querySelectorAll('.success-message-inline');
            
            ctaButtons.forEach(el => el.style.display = 'none');
            successMsgs.forEach(el => el.style.display = 'flex');

            // Hide other elements like "See how it works" in hero
            const heroGhost = document.querySelector('#heroCTA .btn-ghost');
            if (heroGhost) heroGhost.style.display = 'none';
        },
        onClose: function () {
            // Optional: logic for when user cancels
        }
    });

    handler.openIframe();
}

// 6. Typewriter Effect for Hero Title
const words = [
    "Track every cedi",
    "Log every transaction",
    "Master your budget",
    "Organize your expenses"
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterEl = document.getElementById('typewriter-text');

function type() {
    if (!typewriterEl) return;
    
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        // Deleting characters
        typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        // Typing characters
        typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typingSpeed = isDeleting ? 60 : 120;

    if (!isDeleting && charIndex === currentWord.length) {
        // Pause at the end of the word
        typingSpeed = 3000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        // Pause before typing next word
        typingSpeed = 800;
    }

    setTimeout(type, typingSpeed);
}

// Start typewriter once DOM is loaded
if (typewriterEl) {
    setTimeout(type, 1000);
}

// 8. FAQ Accordion Toggle Logic
function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    
    // Toggle active class on item
    faqItem.classList.toggle('active');
    
    if (faqItem.classList.contains('active')) {
        // Set maximum height to reveal content smoothly
        answer.style.maxHeight = answer.scrollHeight + 'px';
    } else {
        // Clear maximum height to slide shut
        answer.style.maxHeight = '0';
    }
    
    // Close other FAQ items for a clean single-open accordion feel
    const allItems = document.querySelectorAll('.faq-item');
    allItems.forEach(item => {
        if (item !== faqItem && item.classList.contains('active')) {
            item.classList.remove('active');
            item.querySelector('.faq-answer').style.maxHeight = '0';
        }
    });
}

// 9. Interactive Cursor Stickers (Hero & Footer)
const stickerSvgs = [
  // 1. Cedi Coin
  `<svg viewBox="-75 -75 150 150" width="90" height="90" xmlns="http://www.w3.org/2000/svg">
    <circle cx="0" cy="0" r="58" fill="#F7C948" stroke="#111" stroke-width="4"/>
    <circle cx="0" cy="0" r="46" fill="none" stroke="#111" stroke-width="2.5"/>
    <text x="0" y="16" text-anchor="middle" font-family="Georgia,serif" font-size="42" font-weight="800" fill="#111">₵</text>
  </svg>`,
  // 2. MoMo SMS Bubble
  `<svg viewBox="-70 -10 150 130" width="90" height="90" xmlns="http://www.w3.org/2000/svg">
    <rect x="-62" y="0" width="124" height="84" rx="16" fill="#FFD700" stroke="#111" stroke-width="4"/>
    <path d="M-18 82 L-32 106 L14 82 Z" fill="#FFD700" stroke="#111" stroke-width="3.5" stroke-linejoin="round"/>
    <rect x="-42" y="18" width="84" height="8" rx="4" fill="#111" opacity="0.15"/>
    <rect x="-42" y="33" width="60" height="8" rx="4" fill="#111" opacity="0.15"/>
    <text x="0" y="68" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" fill="#111">GH₵ 240.00</text>
  </svg>`,
  // 3. Piggy Bank
  `<svg viewBox="-90 -70 210 185" width="90" height="90" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="10" cy="0" rx="54" ry="46" fill="#FFB3C6" stroke="#111" stroke-width="4"/>
    <ellipse cx="58" cy="6" rx="17" ry="14" fill="#FF8FAB" stroke="#111" stroke-width="3"/>
    <circle cx="52" cy="5" r="3.5" fill="#111"/>
    <circle cx="63" cy="5" r="3.5" fill="#111"/>
    <ellipse cx="-28" cy="-32" rx="11" ry="15" fill="#FFB3C6" stroke="#111" stroke-width="3"/>
    <ellipse cx="-28" cy="-30" rx="6" ry="9" fill="#FF8FAB"/>
    <rect x="-4" y="-46" width="22" height="5" rx="2.5" fill="#111"/>
    <rect x="-32" y="38" width="14" height="22" rx="5" fill="#FFB3C6" stroke="#111" stroke-width="3"/>
    <rect x="-11" y="40" width="14" height="22" rx="5" fill="#FFB3C6" stroke="#111" stroke-width="3"/>
    <rect x="14" y="40" width="14" height="22" rx="5" fill="#FFB3C6" stroke="#111" stroke-width="3"/>
    <rect x="37" y="38" width="14" height="22" rx="5" fill="#FFB3C6" stroke="#111" stroke-width="3"/>
    <path d="M-44 -10 Q-62 -4 -58 12 Q-54 24 -46 16" fill="none" stroke="#111" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  // 4. Telegram
  `<svg viewBox="-65 -65 130 130" width="90" height="90" xmlns="http://www.w3.org/2000/svg">
    <circle cx="0" cy="0" r="52" fill="#29B6F6" stroke="#111" stroke-width="4"/>
    <path d="M-30 2 L34 -20 L18 26 L0 14 Z" fill="#fff" stroke="#111" stroke-width="3" stroke-linejoin="round"/>
    <path d="M0 14 L6 32 L18 26 Z" fill="#B3E5FC" stroke="#111" stroke-width="2.5" stroke-linejoin="round"/>
    <line x1="0" y1="14" x2="18" y2="26" stroke="#111" stroke-width="2.5"/>
  </svg>`,
  // 5. Wallet
  `<svg viewBox="-68 -55 150 110" width="90" height="90" xmlns="http://www.w3.org/2000/svg">
    <rect x="-58" y="-40" width="116" height="80" rx="12" fill="#8B5E3C" stroke="#111" stroke-width="4"/>
    <line x1="0" y1="-40" x2="0" y2="40" stroke="#111" stroke-width="3"/>
    <rect x="8" y="-28" width="42" height="28" rx="6" fill="#A0714F" stroke="#111" stroke-width="2.5"/>
    <rect x="14" y="-34" width="32" height="18" rx="4" fill="#F7C948" stroke="#111" stroke-width="2"/>
    <rect x="-50" y="-28" width="42" height="52" rx="6" fill="#A0714F" stroke="#111" stroke-width="2.5"/>
    <circle cx="-29" cy="4" r="14" fill="#F7C948" stroke="#111" stroke-width="2"/>
    <text x="-29" y="9" text-anchor="middle" font-family="Georgia,serif" font-size="11" font-weight="800" fill="#111">₵</text>
  </svg>`,
  // 6. Receipt
  `<svg viewBox="-55 -5 110 135" width="90" height="90" xmlns="http://www.w3.org/2000/svg">
    <rect x="-46" y="0" width="92" height="118" rx="6" fill="#fff" stroke="#111" stroke-width="4"/>
    <path d="M-46 118 L-36 108 L-26 118 L-16 108 L-6 118 L4 108 L14 118 L24 108 L34 118 L44 108 L46 118" fill="none" stroke="#111" stroke-width="3.5" stroke-linejoin="round"/>
    <rect x="-30" y="16" width="60" height="6" rx="3" fill="#eee" stroke="#111" stroke-width="1.5"/>
    <rect x="-30" y="28" width="42" height="5" rx="2.5" fill="#eee" stroke="#111" stroke-width="1.5"/>
    <rect x="-30" y="40" width="50" height="5" rx="2.5" fill="#eee" stroke="#111" stroke-width="1.5"/>
    <rect x="-30" y="52" width="36" height="5" rx="2.5" fill="#eee" stroke="#111" stroke-width="1.5"/>
    <line x1="-30" y1="66" x2="30" y2="66" stroke="#111" stroke-width="1.5" stroke-dasharray="4,3"/>
    <text x="0" y="86" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="#111">GH₵ 85.00</text>
    <text x="0" y="100" text-anchor="middle" font-family="monospace" font-size="9" fill="#555">TOTAL</text>
  </svg>`,
  // 7. iOS Shortcut
  `<svg viewBox="-44 -5 95 125" width="90" height="90" xmlns="http://www.w3.org/2000/svg">
    <rect x="-34" y="0" width="68" height="112" rx="14" fill="#1C1C1E" stroke="#111" stroke-width="4"/>
    <rect x="-26" y="12" width="52" height="72" rx="6" fill="#2C2C2E"/>
    <rect x="-14" y="0" width="28" height="8" rx="4" fill="#111"/>
    <rect x="-18" y="22" width="36" height="36" rx="8" fill="#FF6B00" stroke="#111" stroke-width="2"/>
    <path d="M2 28 L-4 42 L2 42 L-2 52 L8 38 L2 38 Z" fill="#fff" stroke="#111" stroke-width="1.5" stroke-linejoin="round"/>
    <rect x="-16" y="96" width="32" height="4" rx="2" fill="#555"/>
    <text x="0" y="74" text-anchor="middle" font-family="monospace" font-size="7" fill="#aaa">Shortcuts</text>
  </svg>`,
  // 8. Coin Stack
  `<svg viewBox="-55 82 130 80" width="90" height="90" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="10" cy="142" rx="44" ry="10" fill="#C8960A" stroke="#111" stroke-width="3"/>
    <ellipse cx="10" cy="132" rx="44" ry="10" fill="#D4A017" stroke="#111" stroke-width="3"/>
    <ellipse cx="10" cy="122" rx="44" ry="10" fill="#E0AC20" stroke="#111" stroke-width="3"/>
    <ellipse cx="10" cy="112" rx="44" ry="10" fill="#EDB82A" stroke="#111" stroke-width="3"/>
    <ellipse cx="10" cy="102" rx="44" ry="10" fill="#F7C948" stroke="#111" stroke-width="3"/>
    <ellipse cx="10" cy="92" rx="44" ry="10" fill="#FAD75A" stroke="#111" stroke-width="3.5"/>
    <text x="10" y="97" text-anchor="middle" font-family="Georgia,serif" font-size="14" font-weight="800" fill="#111">₵</text>
  </svg>`
];

function initCursorStickers(selector) {
    const targets = document.querySelectorAll(selector);
    
    targets.forEach(target => {
        // Pre-create sticker pool for this target container to prevent DOM thrashing
        const pool = stickerSvgs.map(svgString => {
            const el = document.createElement('div');
            el.className = 'sticker';
            el.innerHTML = svgString;
            target.appendChild(el);
            return { el, busy: false };
        });

        let idx = 0;
        let lastX = null, lastY = null;
        const SPAWN_DIST = 75; // px cursor must travel before next sticker spawns

        function spawn(x, y) {
            let tries = 0;
            while (pool[idx % pool.length].busy && tries < pool.length) {
                idx++; tries++;
            }
            const item = pool[idx % pool.length];
            idx++;
            if (item.busy) return;

            const rot = (Math.random() * 24 - 12) + 'deg';
            item.el.style.setProperty('--rot', rot);
            item.el.style.left = x + 'px';
            item.el.style.top = y + 'px';

            // Reset animation
            item.el.classList.remove('pop', 'fade');
            void item.el.offsetWidth; // Trigger reflow

            item.busy = true;
            item.el.classList.add('pop');

            setTimeout(() => {
                item.el.classList.remove('pop');
                item.el.classList.add('fade');
                setTimeout(() => {
                    item.el.classList.remove('fade');
                    item.el.style.opacity = '0';
                    item.busy = false;
                }, 400);
            }, 600);
        }

        target.addEventListener('mousemove', e => {
            const r = target.getBoundingClientRect();
            const x = e.clientX - r.left;
            const y = e.clientY - r.top;

            if (lastX === null || Math.hypot(x - lastX, y - lastY) >= SPAWN_DIST) {
                lastX = x; lastY = y;
                spawn(x, y);
            }
        });
    });
}

// Initialize on hero and site footer
document.addEventListener('DOMContentLoaded', () => {
    initCursorStickers('.hero, .site-footer');

    // Interactive 3D flip for the 20 cedi bill note
    const wrap = document.getElementById('noteWrap');
    const note = document.getElementById('note');
    if (wrap && note) {
        wrap.addEventListener('mouseenter', () => {
            note.style.transform = 'scaleX(1) rotateY(0deg)';
        });
        wrap.addEventListener('mouseleave', () => {
            note.style.transform = 'scaleX(0.28) rotateY(55deg)';
        });
    }
});
