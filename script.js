/**
 * SURYAKRISHNA K V - ACADEMIC & PROFESSIONAL PROFILE
 * Vanilla JavaScript (No Frameworks)
 * Features:
 * - Theme Toggle (Dark Navy / Light with LocalStorage & OS Preference)
 * - Sticky Header & Active Navigation Highlighting (ScrollSpy)
 * - Mobile Navigation Drawer Toggle & Accessible Focus
 * - Smooth Scrolling with Header Offset
 * - Scroll Reveal Animations (IntersectionObserver)
 * - Accessible Form Validation with Real-time Feedback & Toast Notifications
 * - Copy Email to Clipboard Helper
 * - Interactive Tic-Tac-Toe Demo Modal & Game Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Theme Toggle (Dark Navy / Light)
  // -------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;

  // Retrieve saved theme or evaluate system preference
  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('skv_theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  };

  const applyTheme = (theme) => {
    rootElement.setAttribute('data-theme', theme);
    localStorage.setItem('skv_theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    }
  };

  // Initialize theme
  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark Navy' : 'Light'} theme`);
    });
  }

  // -------------------------------------------------------------------------
  // 2. Sticky Header & Back-to-Top Button Visibility
  // -------------------------------------------------------------------------
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('back-to-top');

  const handleScrollState = () => {
    const scrollY = window.scrollY || window.pageYOffset;

    // Header sticky shadow
    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScrollState, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // -------------------------------------------------------------------------
  // 3. Mobile Navigation Menu Toggle
  // -------------------------------------------------------------------------
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileMenu = (forceState) => {
    if (!mobileToggleBtn || !mobileNav) return;
    
    const isOpen = typeof forceState === 'boolean' 
      ? forceState 
      : !mobileToggleBtn.classList.contains('open');

    if (isOpen) {
      mobileToggleBtn.classList.add('open');
      mobileToggleBtn.setAttribute('aria-expanded', 'true');
      mobileNav.classList.add('open');
      mobileNav.setAttribute('aria-hidden', 'false');
    } else {
      mobileToggleBtn.classList.remove('open');
      mobileToggleBtn.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
    }
  };

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', () => toggleMobileMenu());
  }

  // Close mobile drawer when clicking any link
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  // Close mobile drawer when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileNav && mobileNav.classList.contains('open')) {
      if (!mobileNav.contains(e.target) && !mobileToggleBtn.contains(e.target)) {
        toggleMobileMenu(false);
      }
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
      toggleMobileMenu(false);
    }
  });

  // -------------------------------------------------------------------------
  // 4. Smooth Scrolling with Offset Calculation
  // -------------------------------------------------------------------------
  const navAnchorLinks = document.querySelectorAll('a[href^="#"]');

  navAnchorLinks.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 74;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Accessibility focus shift
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
      }
    });
  });

  // -------------------------------------------------------------------------
  // 5. Active Navigation Highlighting (ScrollSpy)
  // -------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  const updateActiveNavLink = () => {
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });

        mobileNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // -------------------------------------------------------------------------
  // 6. Scroll Reveal Animations (IntersectionObserver)
  // -------------------------------------------------------------------------
  const revealItems = document.querySelectorAll('.reveal-item');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealItems.forEach(item => item.classList.add('revealed'));
  }

  // -------------------------------------------------------------------------
  // 7. Toast Notification Utility
  // -------------------------------------------------------------------------
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer = null;

  function showToast(message, duration = 3200) {
    if (!toast || !toastMessage) return;

    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    toastMessage.textContent = message;
    toast.classList.add('show');

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // -------------------------------------------------------------------------
  // 8. Copy Email to Clipboard
  // -------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('btn-copy-email');
  const emailLink = document.getElementById('email-link');

  if (copyEmailBtn && emailLink) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = emailLink.textContent.trim();
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback method
          const tempInput = document.createElement('textarea');
          tempInput.value = email;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }
        
        const originalText = copyEmailBtn.innerHTML;
        copyEmailBtn.innerHTML = '<span>Copied!</span>';
        showToast('Email address copied to clipboard!');
        
        setTimeout(() => {
          copyEmailBtn.innerHTML = originalText;
        }, 2200);
      } catch (err) {
        showToast('Could not copy email automatically.');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 9. Contact Form Frontend Validation
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const charCount = document.getElementById('char-count');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('btn-submit-form');

  // Live Character Counter
  if (messageInput && charCount) {
    messageInput.addEventListener('input', () => {
      const currentLength = messageInput.value.length;
      charCount.textContent = `${currentLength} / 1000`;
    });
  }

  // Validation Helpers
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const setFieldError = (inputEl, errorId, isValid) => {
    const errorEl = document.getElementById(errorId);
    if (!isValid) {
      inputEl.classList.add('invalid');
      if (errorEl) errorEl.classList.add('visible');
    } else {
      inputEl.classList.remove('invalid');
      if (errorEl) errorEl.classList.remove('visible');
    }
  };

  // Real-time error removal on input
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim().length > 1) {
        setFieldError(nameInput, 'name-error', true);
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (isValidEmail(emailInput.value.trim())) {
        setFieldError(emailInput, 'email-error', true);
      }
    });
  }

  if (subjectInput) {
    subjectInput.addEventListener('input', () => {
      if (subjectInput.value.trim().length > 2) {
        setFieldError(subjectInput, 'subject-error', true);
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener('input', () => {
      if (messageInput.value.trim().length >= 15) {
        setFieldError(messageInput, 'message-error', true);
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let formIsValid = true;

      // Validate Name
      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (!nameVal || nameVal.length < 2) {
        setFieldError(nameInput, 'name-error', false);
        formIsValid = false;
      } else {
        setFieldError(nameInput, 'name-error', true);
      }

      // Validate Email
      const emailVal = emailInput ? emailInput.value.trim() : '';
      if (!emailVal || !isValidEmail(emailVal)) {
        setFieldError(emailInput, 'email-error', false);
        formIsValid = false;
      } else {
        setFieldError(emailInput, 'email-error', true);
      }

      // Validate Subject
      const subjectVal = subjectInput ? subjectInput.value.trim() : '';
      if (!subjectVal || subjectVal.length < 3) {
        setFieldError(subjectInput, 'subject-error', false);
        formIsValid = false;
      } else {
        setFieldError(subjectInput, 'subject-error', true);
      }

      // Validate Message
      const messageVal = messageInput ? messageInput.value.trim() : '';
      if (!messageVal || messageVal.length < 15) {
        setFieldError(messageInput, 'message-error', false);
        formIsValid = false;
      } else {
        setFieldError(messageInput, 'message-error', true);
      }

      if (!formIsValid) {
        if (formStatus) {
          formStatus.className = 'form-status error';
          formStatus.textContent = 'Please fill out all required fields correctly before submitting.';
        }
        return;
      }

      // Simulate sending with loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending Message...</span>';

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;

          if (formStatus) {
            formStatus.className = 'form-status success';
            formStatus.textContent = `Thank you, ${nameVal}! Your message has been prepared for Suryakrishna K V.`;
          }

          showToast('Message submitted successfully!');
          contactForm.reset();
          if (charCount) charCount.textContent = '0 / 1000';

          setTimeout(() => {
            if (formStatus) {
              formStatus.className = 'form-status';
              formStatus.textContent = '';
            }
          }, 6000);
        }, 1000);
      }
    });
  }

  // -------------------------------------------------------------------------
  // 10. Interactive Tic-Tac-Toe Live Demo Modal
  // -------------------------------------------------------------------------
  const openGameBtn = document.getElementById('btn-open-tictactoe');
  const gameModal = document.getElementById('game-modal');
  const closeGameBtn = document.getElementById('modal-close');
  const gameCells = document.querySelectorAll('.game-cell');
  const gameStatusText = document.getElementById('game-status');
  const gameResetBtn = document.getElementById('game-reset-btn');

  let gameState = ['', '', '', '', '', '', '', '', ''];
  let currentPlayer = 'X';
  let isGameActive = true;

  const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  const handleCellClick = (e) => {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !isGameActive) {
      return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());

    checkGameResult();
  };

  const checkGameResult = () => {
    let roundWon = false;
    let winningLine = [];

    for (let i = 0; i < winningConditions.length; i++) {
      const winCondition = winningConditions[i];
      const a = gameState[winCondition[0]];
      const b = gameState[winCondition[1]];
      const c = gameState[winCondition[2]];

      if (a === '' || b === '' || c === '') {
        continue;
      }

      if (a === b && b === c) {
        roundWon = true;
        winningLine = winCondition;
        break;
      }
    }

    if (roundWon) {
      if (gameStatusText) gameStatusText.textContent = `Player ${currentPlayer} Wins! 🎉`;
      isGameActive = false;
      winningLine.forEach(index => {
        const cell = document.querySelector(`.game-cell[data-index="${index}"]`);
        if (cell) cell.classList.add('winner');
      });
      showToast(`Player ${currentPlayer} won the Tic-Tac-Toe game!`);
      return;
    }

    const roundDraw = !gameState.includes('');
    if (roundDraw) {
      if (gameStatusText) gameStatusText.textContent = "Game Ended in a Draw! 🤝";
      isGameActive = false;
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (gameStatusText) gameStatusText.textContent = `Player ${currentPlayer}'s Turn`;
  };

  const resetGame = () => {
    gameState = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    currentPlayer = 'X';
    if (gameStatusText) gameStatusText.textContent = "Player X's Turn";

    gameCells.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('x', 'o', 'winner');
    });
  };

  // Modal open/close handlers
  if (openGameBtn && gameModal) {
    openGameBtn.addEventListener('click', () => {
      gameModal.classList.add('open');
      gameModal.setAttribute('aria-hidden', 'false');
      resetGame();
    });
  }

  const closeModal = () => {
    if (gameModal) {
      gameModal.classList.remove('open');
      gameModal.setAttribute('aria-hidden', 'true');
    }
  };

  if (closeGameBtn) {
    closeGameBtn.addEventListener('click', closeModal);
  }

  if (gameModal) {
    gameModal.addEventListener('click', (e) => {
      if (e.target === gameModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && gameModal && gameModal.classList.contains('open')) {
      closeModal();
    }
  });

  gameCells.forEach(cell => cell.addEventListener('click', handleCellClick));
  if (gameResetBtn) gameResetBtn.addEventListener('click', resetGame);

  // -------------------------------------------------------------------------
  // 11. Footer Dynamic Year
  // -------------------------------------------------------------------------
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
