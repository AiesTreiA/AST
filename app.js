// AST - Application Logic

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- Video Looping from 4.0s to 10.0s ---
  const qb2Video = document.querySelector('.qb2-video');
  if (qb2Video) {
    qb2Video.addEventListener('timeupdate', () => {
      if (qb2Video.currentTime >= 10.0) {
        qb2Video.currentTime = 4.0;
      }
    });

    qb2Video.addEventListener('play', () => {
      if (qb2Video.currentTime < 4.0) {
        qb2Video.currentTime = 4.0;
      }
    });
  }

  // --- Mobile Menu Toggle ---
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking navigation links (mobile fallback)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('open');
      });
    });
  }

  // --- Scroll Effects (Header & Reading Progress) ---
  const header = document.querySelector('.main-header');
  const progressBar = document.getElementById('progress-bar');

  window.addEventListener('scroll', () => {
    // Header background transparency on scroll
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Update reading progress bar
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (windowHeight > 0) {
      const scrolledFraction = (window.scrollY / windowHeight) * 100;
      progressBar.style.width = `${scrolledFraction}%`;
    }
  });

  // --- Scroll Spy (Active Navigation Highlight) ---
  const sections = document.querySelectorAll('section[id]');
  const spyOptions = {
    root: null,
    rootMargin: '-40% 0px -40% 0px', // trigger when section occupies middle 20% of viewport
    threshold: 0
  };

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
        
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }, spyOptions);

  sections.forEach(section => spyObserver.observe(section));

  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const revealOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px', // trigger slightly before entering viewport
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target); // only animate once
      }
    });
  }, revealOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Transformation Diagram: Healing Arrow Animations ---
  const transformRows = document.querySelectorAll('.transform-row');
  const transformObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        transformObserver.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.15 });

  transformRows.forEach(row => transformObserver.observe(row));



  // --- Testimonials Carousel ---
  const track = document.getElementById('testimonios-track');
  const cards = document.querySelectorAll('.testimonio-card');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const indicators = document.querySelectorAll('.carousel-indicators .indicator');
  
  let currentSlide = 0;
  const slideCount = cards.length;

  if (track && slideCount > 0) {
    const updateCarousel = (index) => {
      // Bounds checks
      if (index < 0) index = slideCount - 1;
      if (index >= slideCount) index = 0;
      
      currentSlide = index;

      // Slide translation
      track.style.transform = `translateX(-${currentSlide * 33.333}%)`;

      // Update active cards
      cards.forEach((card, i) => {
        if (i === currentSlide) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });

      // Update indicators
      indicators.forEach((ind, i) => {
        if (i === currentSlide) {
          ind.classList.add('active');
        } else {
          ind.classList.remove('active');
        }
      });
    };

    prevBtn.addEventListener('click', () => updateCarousel(currentSlide - 1));
    nextBtn.addEventListener('click', () => updateCarousel(currentSlide + 1));

    indicators.forEach((ind, i) => {
      ind.addEventListener('click', () => updateCarousel(i));
    });

    // Auto rotate every 8 seconds
    let autoRotateInterval = setInterval(() => {
      updateCarousel(currentSlide + 1);
    }, 8000);

    // Stop auto-rotation when user interacts
    const stopAutoRotate = () => {
      clearInterval(autoRotateInterval);
    };

    prevBtn.addEventListener('click', stopAutoRotate);
    nextBtn.addEventListener('click', stopAutoRotate);
    indicators.forEach(ind => ind.addEventListener('click', stopAutoRotate));
  }

  // ===================================================
  // CALENDLY-STYLE BOOKING FLOW
  // ===================================================

  // --- NDA scroll detection & Checkbox lock ---
  const ndaScrollbox = document.getElementById('nda-scrollbox');
  const ndaCheckbox = document.getElementById('nda-checkbox');
  const scrollPrompt = document.getElementById('scroll-prompt');

  if (ndaScrollbox && ndaCheckbox) {
    ndaScrollbox.addEventListener('scroll', () => {
      const { scrollHeight, scrollTop, clientHeight } = ndaScrollbox;
      if (scrollHeight - scrollTop <= clientHeight + 15) {
        ndaCheckbox.removeAttribute('disabled');
        if (scrollPrompt) scrollPrompt.classList.add('hidden');
      }
    });

    // Checkbox → reveal calendar step in right panel
    ndaCheckbox.addEventListener('change', () => {
      if (ndaCheckbox.checked) {
        // Swap NDA panel for "confirmed" info in sidebar
        document.getElementById('cly-nda-panel').style.display = 'none';
        document.getElementById('cly-confirmed-info').style.display = 'flex';
        // Enable calendar step
        document.getElementById('cly-step-calendar').style.display = 'block';
        // Initialize calendar
        calRender();
      } else {
        document.getElementById('cly-nda-panel').style.display = 'flex';
        document.getElementById('cly-confirmed-info').style.display = 'none';
        document.getElementById('cly-step-calendar').style.display = 'none';
        document.getElementById('cly-step-form').style.display = 'none';
      }
    });
  }

  // --- Native Dialog Light dismissal fallback ---
  const bookingModal = document.getElementById('booking-modal');
  if (bookingModal && !('closedBy' in HTMLDialogElement.prototype)) {
    bookingModal.addEventListener('click', (event) => {
      if (event.target !== bookingModal) return;
      const rect = bookingModal.getBoundingClientRect();
      const isInside = (
        rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX && event.clientX <= rect.left + rect.width
      );
      if (!isInside) closeBookingModal();
    });
  }
});

// ===================================================
// CALENDAR ENGINE
// ===================================================

let calCurrentDate = new Date();
let calSelectedDate = null;
let calSelectedSlot = null;

const MONTH_NAMES_ES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];
const WEEKDAY_NAMES_ES = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];

function calRender() {
  const grid = document.getElementById('cal-grid');
  const monthLabel = document.getElementById('cal-month-label');
  const prevBtn = document.getElementById('cal-prev-btn');
  if (!grid || !monthLabel) return;

  const today = new Date();
  today.setHours(0,0,0,0);
  const y = calCurrentDate.getFullYear();
  const m = calCurrentDate.getMonth();

  monthLabel.textContent = `${MONTH_NAMES_ES[m]} ${y}`;

  if (prevBtn) {
    prevBtn.disabled = (y === today.getFullYear() && m === today.getMonth());
  }

  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  grid.innerHTML = '';

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'cly-day cly-day--empty';
    grid.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(y, m, d);
    date.setHours(0,0,0,0);
    const dayOfWeek = date.getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const isPast = date < today;
    const isToday = date.getTime() === today.getTime();
    const isSelected = calSelectedDate && date.getTime() === calSelectedDate.getTime();

    const cell = document.createElement('div');
    cell.className = 'cly-day';
    cell.textContent = d;

    if (isWeekend) cell.classList.add('cly-day--weekend');
    if (isPast || isWeekend) cell.classList.add('cly-day--past');
    if (isToday) cell.classList.add('cly-day--today');
    if (isSelected) cell.classList.add('cly-day--selected');

    if (!isPast && !isWeekend) {
      cell.addEventListener('click', () => calSelectDate(date));
    }

    grid.appendChild(cell);
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function calSelectDate(date) {
  calSelectedDate = date;
  calSelectedSlot = null;
  calRender();

  const slotsPanel = document.getElementById('cly-slots-panel');
  const slotsLabel = document.getElementById('cly-slots-date-label');
  const slotsList = document.getElementById('cly-slots-list');

  const dayName = WEEKDAY_NAMES_ES[date.getDay()];
  const day = date.getDate();
  const month = MONTH_NAMES_ES[date.getMonth()];
  slotsLabel.textContent = `${dayName.charAt(0).toUpperCase() + dayName.slice(1)}, ${day} ${month}`;

  slotsList.innerHTML = '';
  const times = [];
  for (let h = 9; h < 17; h++) {
    times.push(`${h.toString().padStart(2,'0')}:00`);
    times.push(`${h.toString().padStart(2,'0')}:30`);
  }

  times.forEach(time => {
    const [hh, mm] = time.split(':').map(Number);
    const suffix = hh < 12 ? 'AM' : 'PM';
    const displayHour = hh > 12 ? hh - 12 : hh === 0 ? 12 : hh;
    const label = `${displayHour}:${mm.toString().padStart(2,'0')} ${suffix}`;

    const slot = document.createElement('div');
    slot.className = 'cly-slot';
    slot.textContent = label;
    slot.dataset.time = time;
    slot.addEventListener('click', () => calSelectSlot(slot, time));
    slotsList.appendChild(slot);
  });

  slotsPanel.style.display = 'block';
}

function calSelectSlot(slotEl, time) {
  document.querySelectorAll('.cly-slot').forEach(s => s.classList.remove('cly-slot--selected'));
  slotEl.classList.add('cly-slot--selected');
  calSelectedSlot = time;

  const [hh, mm] = time.split(':').map(Number);
  const suffix = hh < 12 ? 'AM' : 'PM';
  const displayHour = hh > 12 ? hh - 12 : hh === 0 ? 12 : hh;
  const timeLabel = `${displayHour}:${mm.toString().padStart(2,'0')} ${suffix}`;
  const day = calSelectedDate.getDate();
  const month = MONTH_NAMES_ES[calSelectedDate.getMonth()];
  const dayName = WEEKDAY_NAMES_ES[calSelectedDate.getDay()];

  const dateText = document.getElementById('cly-date-text');
  const dateDisplay = document.getElementById('cly-date-display');
  if (dateText) dateText.textContent = `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${day} ${month} · ${timeLabel}`;
  if (dateDisplay) dateDisplay.style.display = 'flex';

  setTimeout(() => {
    calGoToForm(time, timeLabel, dayName, day, month);
  }, 350);
}

function calGoToForm(time, timeLabel, dayName, day, month) {
  const y = calSelectedDate.getFullYear();
  const m = (calSelectedDate.getMonth() + 1).toString().padStart(2,'0');
  const d = calSelectedDate.getDate().toString().padStart(2,'0');
  const dtInput = document.getElementById('booking-datetime');
  if (dtInput) dtInput.value = `${y}-${m}-${d}T${time}`;

  const summary = document.getElementById('cly-form-meeting-summary');
  if (summary) {
    summary.textContent = `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${day} ${month} · ${timeLabel} · 30 min · Google Meet`;
  }

  document.getElementById('cly-step-calendar').style.display = 'none';
  document.getElementById('cly-step-form').style.display = 'block';

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function calBackToCalendar() {
  calSelectedSlot = null;
  document.getElementById('cly-step-form').style.display = 'none';
  document.getElementById('cly-step-calendar').style.display = 'block';
  document.querySelectorAll('.cly-slot').forEach(s => s.classList.remove('cly-slot--selected'));
}

function calPrev() {
  calCurrentDate.setMonth(calCurrentDate.getMonth() - 1);
  calCurrentDate.setDate(1);
  calRender();
}

function calNext() {
  calCurrentDate.setMonth(calCurrentDate.getMonth() + 1);
  calCurrentDate.setDate(1);
  calRender();
}

// --- Modal Controls ---
function openBookingModal(planName = 'General') {
  const modal = document.getElementById('booking-modal');
  const planInput = document.getElementById('selected-plan-input');
  if (!modal) return;
  if (planInput) planInput.value = planName;
  resetModalStates(planName);
  modal.showModal();
  document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
  const modal = document.getElementById('booking-modal');
  if (!modal) return;
  modal.close();
  document.body.style.overflow = '';
}

function resetModalStates(planName) {
  const layout = document.getElementById('modal-container-grid');
  const success = document.getElementById('modal-success-screen');
  if (layout) layout.style.display = 'flex';
  if (success) success.style.display = 'none';

  const ndaCheckbox = document.getElementById('nda-checkbox');
  const scrollPrompt = document.getElementById('scroll-prompt');
  const ndaScrollbox = document.getElementById('nda-scrollbox');
  const ndaPanel = document.getElementById('cly-nda-panel');
  const confirmedInfo = document.getElementById('cly-confirmed-info');
  const dateDisplay = document.getElementById('cly-date-display');

  if (ndaCheckbox) { ndaCheckbox.checked = false; ndaCheckbox.setAttribute('disabled', 'true'); }
  if (scrollPrompt) scrollPrompt.classList.remove('hidden');
  if (ndaScrollbox) ndaScrollbox.scrollTop = 0;
  if (ndaPanel) ndaPanel.style.display = 'flex';
  if (confirmedInfo) confirmedInfo.style.display = 'none';
  if (dateDisplay) dateDisplay.style.display = 'none';

  calCurrentDate = new Date();
  calSelectedDate = null;
  calSelectedSlot = null;

  const calStep = document.getElementById('cly-step-calendar');
  const formStep = document.getElementById('cly-step-form');
  const slotsPanel = document.getElementById('cly-slots-panel');
  if (calStep) calStep.style.display = 'none';
  if (formStep) formStep.style.display = 'none';
  if (slotsPanel) slotsPanel.style.display = 'none';

  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) bookingForm.reset();

  const planInput = document.getElementById('selected-plan-input');
  if (planInput) planInput.value = planName;
}

// --- Form submission handler ---
function handleBookingSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('booking-name').value;
  const email = document.getElementById('booking-email').value;
  const company = document.getElementById('booking-company').value;
  const plan = document.getElementById('selected-plan-input').value;
  const rawDateTime = document.getElementById('booking-datetime').value;

  // Format date and time to a readable format
  let formattedDate = 'Fecha por confirmar';
  if (rawDateTime) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const dateObj = new Date(rawDateTime);
    formattedDate = dateObj.toLocaleDateString('es-CL', options);
    formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  // Populate success details
  document.getElementById('summary-name').textContent = name;
  document.getElementById('summary-company').textContent = company;
  document.getElementById('summary-email').textContent = email;
  document.getElementById('summary-date').textContent = formattedDate;

  // Format plan tag
  let displayPlan = plan;
  if (plan === 'General') displayPlan = 'Reunión Comercial General';
  if (plan === 'Básico') displayPlan = 'Plan Básico ($700.000)';
  if (plan === 'Empresa Segura') displayPlan = 'Plan Empresa Segura ($2.300.000)';
  if (plan === 'Accidentabilidad Cero') displayPlan = 'Accidentabilidad Cero ($6.500.000 / año)';
  
  document.getElementById('summary-plan').textContent = displayPlan;

  // Hide layout, show success screen
  document.getElementById('modal-container-grid').style.display = 'none';
  document.getElementById('modal-success-screen').style.display = 'flex';

  if (typeof lucide !== 'undefined') lucide.createIcons();
}


// --- FAQ Accordion Control ---
function toggleFaq(trigger) {
  const faqItem = trigger.parentElement;
  const faqContent = trigger.nextElementSibling;
  const isOpen = faqItem.classList.contains('open');

  // Close all other FAQ items first for accordion effect
  document.querySelectorAll('.faq-item').forEach(item => {
    if (item !== faqItem) {
      item.classList.remove('open');
      item.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
      item.querySelector('.faq-content').style.maxHeight = null;
    }
  });

  // Toggle current FAQ item
  if (isOpen) {
    faqItem.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
    faqContent.style.maxHeight = null;
  } else {
    faqItem.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
    // Set max height dynamically to trigger CSS transition
    faqContent.style.maxHeight = faqContent.scrollHeight + "px";
  }
}

// Gallery Lightbox functions
function openLightbox(element) {
  const img = element.querySelector('img');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  
  if (img && lightbox && lightboxImg) {
    lightboxImg.src = img.src;
    lightboxCaption.textContent = img.alt || "";
    lightbox.showModal();
    document.body.style.overflow = 'hidden'; // Lock scroll
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox-modal');
  if (lightbox) {
    lightbox.close();
    document.body.style.overflow = ''; // Unlock scroll
  }
}

function toggleExtendedGallery() {
  const extGallery = document.getElementById('extended-gallery');
  const btn = event.currentTarget;
  if (extGallery) {
    if (extGallery.style.display === 'none') {
      extGallery.style.display = 'block';
      btn.innerHTML = '<i data-lucide="chevron-up"></i> Ocultar Fotos';
    } else {
      extGallery.style.display = 'none';
      btn.innerHTML = '<i data-lucide="images"></i> Ver Más Fotos';
      // Scroll back to main gallery top
      document.getElementById('galeria').scrollIntoView({ behavior: 'smooth' });
    }
    // Re-initialize lucide icons for dynamic content
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}

