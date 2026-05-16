const CONFIG = {
  EMAILJS_KEY: 'GWpamiJVqZuJS9Tf3',
  SERVICE_ID: 'service_k542gs9',
  TEMPLATE_ID: 'template_ag8133n',
};

const toastContainerId = 'toast-container';

const initEmailJS = () => {
  if (window.emailjs) {
    emailjs.init(CONFIG.EMAILJS_KEY);
  } else {
    console.warn('EmailJS SDK did not load.');
  }
};

const updateThemeIcon = () => {
  const icon = document.getElementById('themeIcon');
  if (!icon) return;
  icon.className = document.documentElement.classList.contains('dark')
    ? 'fa-solid fa-moon'
    : 'fa-solid fa-sun';
};

const initTheme = () => {
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  }

  updateThemeIcon();
};

const showToast = (message, type = 'success') => {
  let container = document.getElementById(toastContainerId);
  if (!container) {
    container = document.createElement('div');
    container.id = toastContainerId;
    container.style.position = 'fixed';
    container.style.bottom = '1.5rem';
    container.style.right = '1.5rem';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '0.75rem';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.padding = '1rem 1.25rem';
  toast.style.borderRadius = '1rem';
  toast.style.color = '#fff';
  toast.style.background = type === 'error' ? 'rgba(220,38,38,0.92)' : 'rgba(16,185,129,0.96)';
  toast.style.boxShadow = '0 24px 60px rgba(15, 23, 42, 0.18)';
  toast.style.maxWidth = '320px';
  toast.style.fontSize = '0.95rem';
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
  toast.style.transform = 'translateY(10px)';

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => container.removeChild(toast), 250);
  }, 3600);
};

const toggleTheme = () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcon();
};

const initMobileMenu = () => {
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.toggle('hidden');
    menuBtn.innerHTML = isHidden
      ? '<i class="fa-solid fa-bars-staggered"></i>'
      : '<i class="fa-solid fa-xmark"></i>';
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
  });
};

const initRevealObserver = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
};

const handleContactSubmit = async (event) => {
  event.preventDefault();

  const contactForm = document.getElementById('contact-form');
  const btn = document.getElementById('button');
  const btnText = document.getElementById('btnText');
  const successMsg = document.getElementById('successMsg');

  if (!contactForm || !btn || !btnText || !successMsg) return;

  const formData = new FormData(contactForm);
  const email = formData.get('user_email')?.toString().trim();
  const message = formData.get('message')?.toString().trim();

  if (!email || !message) {
    showToast('Please fill in the required fields.', 'error');
    return;
  }

  try {
    btn.disabled = true;
    btnText.textContent = 'Processing...';

    await emailjs.sendForm(CONFIG.SERVICE_ID, CONFIG.TEMPLATE_ID, contactForm);

    btnText.innerHTML = 'Sent Successfully <i class="fa-solid fa-check"></i>';
    btn.classList.replace('bg-emerald-600', 'bg-teal-500');
    contactForm.reset();
    successMsg.classList.remove('hidden');
    showToast('Message sent successfully. Thank you!');
  } catch (error) {
    console.error('Submission failed:', error);
    btn.disabled = false;
    btnText.textContent = 'Retry Submission';
    showToast('Service temporarily unavailable. Please email us directly.', 'error');
  }
};

const handleNavbarScroll = () => {
  const nav = document.getElementById('navbar');
  const panel = nav?.querySelector('.glass');

  if (!nav || !panel) return;

  const isScrolled = window.scrollY > 60;
  nav.classList.toggle('py-2', isScrolled);
  panel.classList.toggle('bg-white/80', isScrolled);
  panel.classList.toggle('dark:bg-gray-950/80', isScrolled);
};

window.addEventListener('DOMContentLoaded', () => {
  initEmailJS();
  initTheme();
  initMobileMenu();
  initRevealObserver();

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }

  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }

  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll();
});