document.addEventListener("DOMContentLoaded", () => {
    //my kevin portfolio js.script
    // ========== Mobile Navigation ==========
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
  
    const toggleMobileMenu = () => {
      navLinks.classList.toggle("show");
      hamburger.setAttribute(
        'aria-expanded', 
        navLinks.classList.contains("show")
      );
    };
  
    hamburger.addEventListener("click", toggleMobileMenu);
  
    // Close mobile menu when clicking a link
    document.querySelectorAll(".nav-links a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("show");
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  
    // ========== Active Section Highlighting ==========
    const sections = document.querySelectorAll("section");
    const navItems = document.querySelectorAll("nav ul li a");
  
    const highlightActiveSection = () => {
      let current = "";
      const scrollPosition = window.scrollY + 200;
  
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          current = section.getAttribute("id");
        }
      });
  
      navItems.forEach(item => {
        item.classList.remove("active");
        if (item.getAttribute("href") === `#${current}`) {
          item.classList.add("active");
        }
      });
    };
  
    // Debounce scroll event for performance
    let isScrolling;
    window.addEventListener("scroll", () => {
      window.clearTimeout(isScrolling);
      isScrolling = setTimeout(highlightActiveSection, 100);
    });
  
    // Initialize on load
    highlightActiveSection();
  
    // ========== Skill Bar Animations ==========
    const skillBars = document.querySelectorAll(".skill-level");
    const observerOptions = {
      threshold: 0.5,
      rootMargin: "0px 0px -50px 0px"
    };
  
    const skillBarObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.getAttribute("data-width");
          entry.target.style.setProperty("--width", width);
          entry.target.classList.add("in-view");
          skillBarObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
  
    skillBars.forEach(bar => {
      skillBarObserver.observe(bar);
    });
  
    // ========== Profile Gallery ==========
    const profilePics = document.querySelectorAll('.profile-pic');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    let currentPic = 0;
    let galleryInterval;
  
    const showPic = (index) => {
      profilePics.forEach(pic => pic.classList.remove('active'));
      profilePics[index].classList.add('active');
    };
  
    const nextPic = () => {
      currentPic = (currentPic + 1) % profilePics.length;
      showPic(currentPic);
      resetGalleryInterval();
    };
  
    const prevPic = () => {
      currentPic = (currentPic - 1 + profilePics.length) % profilePics.length;
      showPic(currentPic);
      resetGalleryInterval();
    };
  
    const resetGalleryInterval = () => {
      clearInterval(galleryInterval);
      galleryInterval = setInterval(nextPic, 5000);
    };
  
    nextBtn.addEventListener('click', nextPic);
    prevBtn.addEventListener('click', prevPic);
  
    // Initialize gallery with auto-rotation
    resetGalleryInterval();
  
    // ========== Contact Form ==========
    const contactForm = document.getElementById("contactForm");
    const showThankYouMessage = () => {
    const thankYouMessage = document.createElement("div");
    thankYouMessage.className = "thank-you-message";
    thankYouMessage.textContent = "Thank you for your message! I'll get back to you soon.";
    thankYouMessage.setAttribute('role', 'status');
    thankYouMessage.setAttribute('aria-live', 'polite');
    document.body.appendChild(thankYouMessage);

    setTimeout(() => {
        thankYouMessage.style.opacity = "1";
    }, 100);

    setTimeout(() => {
        thankYouMessage.style.opacity = "0";
        setTimeout(() => {
        document.body.removeChild(thankYouMessage);
        }, 300);
    }, 5000);
    };

    const handleFormSubmit = async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector("button[type='submit']");
    const originalBtnText = submitBtn.textContent;
    
    // Disabling button during submission
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
        const formData = new FormData(contactForm);
        
        // manual fields
        formData.append('_replyto', contactForm.querySelector('[name="_replyto"]').value);
        formData.append('name', contactForm.querySelector('[name="name"]').value);
        
        const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        });

        if (response.ok) {
        showThankYouMessage();
        console.log("Form successfully submitted to Formspree");
        } else {
        throw new Error(await response.text());
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to send message. Please try again later or email me directly.");
    } finally {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
    };

    contactForm.addEventListener("submit", handleFormSubmit);
  });