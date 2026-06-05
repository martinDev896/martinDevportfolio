// ── Firebase imports for saving messages ──
import { initializeApp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { getFirestore, collection, addDoc }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
  // ── my Firebase config ──
  const firebaseConfig = {
  apiKey: "AIzaSyBaxLJHGg6xXqumKQCnLGRw-_AeZoNTuDU",
  authDomain: "martin-portfolio-100a0.firebaseapp.com",
  projectId: "martin-portfolio-100a0",
  storageBucket: "martin-portfolio-100a0.firebasestorage.app",
  messagingSenderId: "247649897607",
  appId: "1:247649897607:web:4689925f9e236f2f193c22"
};
  // ── Starting Firebase ──
  const app = initializeApp(firebaseConfig);
  const db  = getFirestore(app);

// ── PAGE LOADER ──
document.addEventListener("DOMContentLoaded", function() {

  const loader = document.getElementById("page-loader");

  // Force hide after 3 seconds no matter what
  setTimeout(function() {
    if (loader) {
      loader.classList.add("loader-hidden");
      setTimeout(function() {
        loader.style.display = "none";
      }, 500);
    }
  }, 800);

});

// ── DARK / LIGHT MODE TOGGLE ──
const themeToggle = document.getElementById("theme-toggle");

// Check saved preference from last visit
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.textContent = "☀️";
} else {
  document.body.classList.remove("dark-mode");
  themeToggle.textContent = "🌙";
}

// Toggle on click
themeToggle.addEventListener("click", function() {
  document.body.classList.toggle("dark-mode");

  // Update icon
  if (document.body.classList.contains("dark-mode")) {
    themeToggle.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    themeToggle.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
});

    /* typing effect*/
    const words = ["Frontend Developer", "Backend Developer", "Graphics Designing", "Video Editting", "Freelancing"];
    let wordIndex = 0, charIndex = 0, isDeleting = false;
    const typingEl = document.getElementById("typing");

    function typeEffect() {
      const currentWord = words[wordIndex];
      if (isDeleting) { charIndex--; } else { charIndex++; }
      typingEl.textContent = currentWord.substring(0, charIndex);
      let speed = isDeleting ? 50 : 100;
      if (!isDeleting && charIndex === currentWord.length) {
        speed = 1500; isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 500;
      }
      setTimeout(typeEffect, speed);
    }
    typeEffect();

    /* Navbar scroll effect */
    window.addEventListener("scroll", function () {
      const navbar = document.getElementById("navbar");
      navbar.classList.toggle("scrolled", window.scrollY > 60);
    });

    /* Hamburger menu */
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobileMenu");

    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("open");
      mobileMenu.classList.toggle("open");
    });

    function closeMenu() {
      hamburger.classList.remove("open");
      mobileMenu.classList.remove("open");
    }

    /* Intersection observer — fade-in + skill bars */
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");

          /* Animate progress bars when visible */
          if (entry.target.classList.contains("skill-item")) {
            const bar = entry.target.querySelector(".progress-bar");
            if (bar) {
              const targetWidth = bar.getAttribute("data-width");
              setTimeout(() => { bar.style.width = targetWidth; }, 200);
            }
          }
        } else {
          entry.target.classList.remove("show");
          /* Reset progress bar */
          if (entry.target.classList.contains("skill-item")) {
            const bar = entry.target.querySelector(".progress-bar");
            if (bar) bar.style.width = "0";
          }
        }
      });
    }, { threshold: 0.25 });

    document.querySelectorAll(".anim, .zoom-img, .skill-item").forEach(el => {
      observer.observe(el);
    });
  



  // Public Key ──
  emailjs.init("0QMe6Ghses2kd1Bo0"); 

  // ──Get form elements ──
  const form       = document.getElementById("contact-form");
  const submitBtn  = document.getElementById("submit-btn");
  const formStatus = document.getElementById("form-status");

  // ──Input focus effects ──
  document.querySelectorAll("input, textarea").forEach(function(el) {
    el.addEventListener("focus", function() {
      this.style.borderColor = "#0004f0";
    });
    el.addEventListener("blur", function() {
      this.style.borderColor = "#d8d4c8";
    });
  });

  // ──Handle form submission ──
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    // Validate fields
    const name    = document.getElementById("from_name").value.trim();
    const email   = document.getElementById("from_email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      formStatus.textContent  = "⚠️ Please fill in all fields.";
      formStatus.style.color  = "red";
      return;
    }

    // Show sending state
    submitBtn.textContent     = "Sending...";
    submitBtn.style.background = "#6b6b6b";
    submitBtn.disabled        = true;
    formStatus.textContent    = "";

    // ──Send email via EmailJS ──
    emailjs.sendForm(
  "service_bv0e61k",   // Replace with your real Service ID
  "template_7gck639",  

  form
)
.then(async function() {

  // Save directly to Firebase
  try {
    await addDoc(collection(db, "messages"), {
      name:    name,
      email:   email,
      message: message,
      date:    new Date().toISOString()
    });
    console.log("✅ Message saved to Firebase!");
  } catch (err) {
    console.error("❌ Firebase save error:", err);
  }

  formStatus.textContent     = "✅ Message sent! I'll get back to you soon.";
  formStatus.style.color     = "green";
  submitBtn.textContent      = "Send Message";
  submitBtn.style.background = "#0004f0";
  submitBtn.disabled         = false;
  form.reset();

})

}, function(error) {
  formStatus.textContent     = "❌ Failed to send. Please try again.";
  formStatus.style.color     = "red";
  submitBtn.textContent      = "Send Message";
  submitBtn.style.background = "#0004f0";
  submitBtn.disabled         = false;
  console.error("EmailJS error:", error);
});

  ;

  // ──Button hover effects ──
  submitBtn.addEventListener("mouseover", function() {
    if (!this.disabled) {
      this.style.background  = "#0003bb";
      this.style.transform   = "translateY(-2px)";
    }
  });

  submitBtn.addEventListener("mouseout", function() {
    if (!this.disabled) {
      this.style.background = "#0004f0";
      this.style.transform  = "translateY(0)";
    }
  });

 
