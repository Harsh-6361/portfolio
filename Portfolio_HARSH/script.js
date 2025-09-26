
        // Theme toggle functionality
        function toggleTheme() {
            const body = document.body;
            const themeIcon = document.getElementById('theme-icon');
            const themeText = document.getElementById('theme-text');
            
            if (body.getAttribute('data-theme') === 'light') {
                body.removeAttribute('data-theme');
                themeIcon.textContent = '🌙';
                themeText.textContent = 'Dark';
                localStorage.setItem('theme', 'dark');
            } else {
                body.setAttribute('data-theme', 'light');
                themeIcon.textContent = '☀️';
                themeText.textContent = 'Light';
                localStorage.setItem('theme', 'light');
            }
        }

        // Load saved theme
       // Load theme and set switch state
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
        document.getElementById('theme-switch').checked = true;
    } else {
        document.body.removeAttribute('data-theme');
        document.getElementById('theme-switch').checked = false;
    }
}

// Listen for switch toggle
const themeSwitch = document.getElementById('theme-switch');
if (themeSwitch) {
    themeSwitch.addEventListener('change', () => {
        if (themeSwitch.checked) {
            document.body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Initialize theme on load
document.addEventListener('DOMContentLoaded', loadTheme);


        // Mobile nav toggle
        function toggleNav() {
            const nav = document.getElementById('nav');
            nav.classList.toggle('show');
        }

        // Smooth scrolling and section reveal
        const navLinks = document.querySelectorAll('.nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href') || '';
                if (href.startsWith('#')) {
                    e.preventDefault();
                    document.querySelector(href)?.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                    // Close mobile nav after click
                    document.getElementById('nav').classList.remove('show');
                }
            });
        });

        // Enhanced Intersection Observer for reveal animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100); // Stagger animations
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.section').forEach((sec) => observer.observe(sec));

        // Scrollspy for active nav link
        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const id = entry.target.getAttribute('id');
                const link = document.querySelector(`.nav a[href="#${id}"]`);
                if (link && entry.isIntersecting) {
                    document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        }, { threshold: 0.6 });

        document.querySelectorAll('section[id]').forEach((sec) => spyObserver.observe(sec));

        // Toast utility
        function showToast(text, duration = 3000) {
            const toast = document.getElementById('toast');
            if (!toast) return;
            toast.textContent = text;
            toast.classList.add('show');
            clearTimeout(window.__toastTimeout);
            window.__toastTimeout = setTimeout(() => { 
                toast.classList.remove('show');
            }, duration);
        }

        // Footer contact form
        const footerForm = document.getElementById('footer-contact-form');
        if (footerForm) {
            footerForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const name = document.getElementById('f-name').value.trim();
                const email = document.getElementById('f-email').value.trim();
                const message = document.getElementById('f-message').value.trim();

                if (!name || !email || !message) {
                    return showToast('Please fill in all fields.');
                }
                
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return showToast('Please enter a valid email.');
                }

                // Submit form (Web3Forms will handle it)
                const formData = new FormData(footerForm);
                
                fetch(footerForm.action, {
                    method: 'POST',
                    body: formData
                }).then(response => {
                    if (response.ok) {
                        showToast('Message sent successfully!');
                        footerForm.reset();
                    } else {
                        showToast('Error sending message. Please try again.');
                    }
                }).catch(() => {
                    showToast('Error sending message. Please try again.');
                });
            });
        }

        // =====================
        // Enhanced Modal logic
        // =====================
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const modalMeta = document.getElementById('modal-meta');
        const modalLinks = document.getElementById('modal-links');

        let currentCarouselIndex = 0;
        let currentCarouselImages = [];

        function openModal(payload) {
            if (!modal) return;

            modalTitle.textContent = payload.title || '';
            modalDesc.textContent = payload.desc || '';
            modalMeta.innerHTML = '';
            modalLinks.innerHTML = '';

            // Certificate modal
            if (payload.type === 'cert') {
                if (payload.credential) {
                    const cred = document.createElement('div');
                    cred.innerHTML = `<strong>Credential ID:</strong> ${payload.credential}`;
                    cred.style.marginBottom = '0.5rem';
                    modalMeta.appendChild(cred);
                }
                if (payload.issuer) {
                    const issuer = document.createElement('div');
                    issuer.innerHTML = `<strong>Issuer:</strong> ${payload.issuer}`;
                    issuer.style.marginBottom = '0.5rem';
                    modalMeta.appendChild(issuer);
                }

                const date = document.createElement('span');
                date.className = 'chip';
                date.textContent = payload.date || '';
                modalMeta.appendChild(date);

                (payload.skills || []).forEach((s) => {
                    const chip = document.createElement('span');
                    chip.className = 'chip';
                    chip.textContent = s;
                    modalMeta.appendChild(chip);
                });

                // Add certificate image
                if (payload.image) {
                    const certImg = document.createElement('div');
                    certImg.className = 'cert-preview';
                    certImg.style.backgroundImage = `url(${payload.image})`;
                    certImg.style.backgroundSize = 'cover';
                    certImg.style.backgroundPosition = 'center';
                    modalMeta.appendChild(certImg);
                }

                if (payload.link) {
                    const a = document.createElement('a');
                    a.href = payload.link;
                    a.target = '_blank';
                    a.rel = 'noopener';
                    a.className = 'btn btn-small';
                    a.textContent = 'View Certificate';
                    modalLinks.appendChild(a);
                }
            }

            // Project modal with image carousel
            if (payload.type === 'project') {
                const status = document.createElement('span');
                status.className = 'chip';
                status.textContent = payload.status || '';
                modalMeta.appendChild(status);

                (payload.tech || []).forEach((t) => {
                    const chip = document.createElement('span');
                    chip.className = 'chip';
                    chip.textContent = t;
                    modalMeta.appendChild(chip);
                });

                // Add image carousel for projects
                if (payload.images && Array.isArray(payload.images) && payload.images.length > 0) {
                    currentCarouselImages = payload.images;
                    currentCarouselIndex = 0;

                    const carousel = document.createElement('div');
                    carousel.className = 'modal-carousel';

                    const img = document.createElement('img');
                    img.src = currentCarouselImages[currentCarouselIndex];
                    img.alt = payload.title || 'Project preview';

                    if (payload.images.length > 1) {
                        const prevBtn = document.createElement('button');
                        prevBtn.innerHTML = '‹';
                        prevBtn.className = 'carousel-btn prev';

                        const nextBtn = document.createElement('button');
                        nextBtn.innerHTML = '›';
                        nextBtn.className = 'carousel-btn next';

                        function updateImage() {
                            img.src = currentCarouselImages[currentCarouselIndex];
                        }

                        prevBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            currentCarouselIndex = (currentCarouselIndex - 1 + currentCarouselImages.length) % currentCarouselImages.length;
                            updateImage();
                        });
                        
                        nextBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            currentCarouselIndex = (currentCarouselIndex + 1) % currentCarouselImages.length;
                            updateImage();
                        });

                        carousel.appendChild(prevBtn);
                        carousel.appendChild(img);
                        carousel.appendChild(nextBtn);
                    } else {
                        carousel.appendChild(img);
                    }

                    modalMeta.appendChild(carousel);

                    // Keyboard navigation
                    document.addEventListener('keydown', handleCarouselKeys);
                }

                const links = payload.links || {};
                if (links.github) {
                    const a = document.createElement('a');
                    a.href = links.github;
                    a.target = '_blank';
                    a.rel = 'noopener';
                    a.className = 'btn btn-small';
                    a.textContent = 'GitHub';
                    modalLinks.appendChild(a);
                }
                if (links.demo) {
                    const a = document.createElement('a');
                    a.href = links.demo;
                    a.target = '_blank';
                    a.rel = 'noopener';
                    a.className = 'btn btn-small btn-ghost';
                    a.textContent = 'Live Demo';
                    modalLinks.appendChild(a);
                }
            }

            modal.classList.add('show');
            modal.setAttribute('aria-hidden', 'false');
        }

        function handleCarouselKeys(e) {
            if (!currentCarouselImages.length) return;
            if (e.key === 'ArrowLeft') {
                currentCarouselIndex = (currentCarouselIndex - 1 + currentCarouselImages.length) % currentCarouselImages.length;
                const img = document.querySelector('.modal-carousel img');
                if (img) img.src = currentCarouselImages[currentCarouselIndex];
            }
            if (e.key === 'ArrowRight') {
                currentCarouselIndex = (currentCarouselIndex + 1) % currentCarouselImages.length;
                const img = document.querySelector('.modal-carousel img');
                if (img) img.src = currentCarouselImages[currentCarouselIndex];
            }
        }

        function closeModal() {
            if (!modal) return;
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            currentCarouselImages = [];
            document.removeEventListener('keydown', handleCarouselKeys);
        }

        // Attach modal open to cards
        document.querySelectorAll('.card.cert, .card.project').forEach((card) => {
            card.addEventListener('click', (e) => {
                const target = e.target;
                if (target && (target.tagName === 'A' || target.closest('a'))) return;
                const data = card.getAttribute('data-modal');
                if (!data) return;
                try {
                    const payload = JSON.parse(data);
                    openModal(payload);
                } catch (error) {
                    console.error('Error parsing modal data:', error);
                }
            });
        });

        document.querySelector('.modal-close')?.addEventListener('click', closeModal);
        document.querySelector('.modal-backdrop')?.addEventListener('click', closeModal);
        document.addEventListener('keydown', (e) => { 
            if (e.key === 'Escape') closeModal(); 
        });

        // Initialize theme on load
        document.addEventListener('DOMContentLoaded', loadTheme);

        // Add some scroll-based animations
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.hero-image');
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
        });
