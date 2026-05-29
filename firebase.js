// ── Importing Firebase tools ──
  import { initializeApp } 
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

  import { getFirestore, collection, getDocs, orderBy, query } 
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

  // ──Icons ──
  const icons = {
    code: `
      <svg viewBox="0 0 24 24" fill="none" 
           stroke="#0004f0" stroke-width="2" 
           width="40" height="40">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>`,

    layout: `
      <svg viewBox="0 0 24 24" fill="none" 
           stroke="#0004f0" stroke-width="2" 
           width="40" height="40">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 21V9"/>
      </svg>`,

    smartphone: `
      <svg viewBox="0 0 24 24" fill="none" 
           stroke="#0004f0" stroke-width="2" 
           width="40" height="40">
        <rect x="5" y="2" width="14" height="20" rx="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>`
  };

  // ── Fetching services from Firebase ──
  async function loadServices() {

    const container  = document.getElementById("services-container");
    const loadingMsg = document.getElementById("loading-msg");

    try {
      // Fetch services ordered by the "order"
      
const querySnapshot = await getDocs(collection(db, "services"));

     
      loadingMsg.remove();

      // Loop through each service and build a card
      querySnapshot.forEach((doc) => {
        const service = doc.data();
        console.log("Service data:", service);
        const card = document.createElement("div");
        card.className = "services-section";
        card.style.cssText = `
          background-color: var(--bg);
          height: auto;
          min-height: 280px;
          width: 300px;
          border-radius: 5%;
          margin: 20px;
          padding: 20px;
          box-shadow: 10px 10px 12px  rgba(26,107,74,0.1);
        `;

        card.innerHTML = `
          <div style="margin-bottom: 15px;">
            ${icons[service.icon] || icons["code"]}
          </div>
          <h1 style="color: #0004f0; font-size: 1.3rem;">
            ${service.title}
          </h1>
          <p style="font-size: 1rem; 
                    margin-top: 20px; 
                    font-family: 'Times New Roman', Times, serif;
                    line-height: 1.6;">
            ${service.description}
          </p>
        `;

        container.appendChild(card);
      });

    } catch (error) {
      
      //error if Firebase faills
      loadingMsg.textContent = 
        "⚠️ Could not load services. Check your internet connection.";
      loadingMsg.style.color = "red";
      console.error("Firebase error:", error);
    }
  }

  // Run
  loadServices();
  loadProjects();
 
  // Hover effect
document.addEventListener("mouseover", function(e) {
  const card = e.target.closest("#services-container > div");
  if (card) {
    card.style.transform = "translateY(-20px)";
    card.style.boxShadow = "0 16px 40px rgba(0,0,0,0.15)";
  }
});

document.addEventListener("mouseout", function(e) {
  const card = e.target.closest("#services-container > div");
  if (card) {
    card.style.transform = "translateY(0)";
    card.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)";
  }
});


// ── Load Projects ──
async function loadProjects() {
  const slide1     = document.getElementById("slide-1");
  const slide2     = document.getElementById("slide-2");
  const dot1       = document.getElementById("dot-1");
  const dot2       = document.getElementById("dot-2");
  const section    = document.getElementById("projects-section");

  try {
    const querySnapshot = await getDocs(collection(db, "projects"));

    // Sort projects by order field
    const projects = [];
    querySnapshot.forEach((doc) => {
      projects.push(doc.data());
    });
    projects.sort((a, b) => a.order - b.order);

    // Split into two groups of 3
    const group1 = projects.slice(0, 3);
    const group2 = projects.slice(3, 6);

    // Build cards for slide 1
    group1.forEach(function(project) {
      slide1.appendChild(createProjectCard(project));
    });

    // Build cards for slide 2
    group2.forEach(function(project) {
      slide2.appendChild(createProjectCard(project));
    });

    // Set slider wrapper min-height after cards load
    const wrapper = document.getElementById("projects-slider-wrapper");
    setTimeout(function() {
      const h = slide1.offsetHeight;
      if (h > 0) wrapper.style.minHeight = h + "px";
    }, 300);

    // ── Slider Logic ──
    let currentSlide = 1;
    let sliderInterval = null;
    let isAnimating   = false;

    function goToSlide2() {
      if (isAnimating) return;
      isAnimating = true;

      // Slide 1 exits to the left
      slide1.style.transform = "translateX(-100%)";
      slide1.style.opacity   = "0";

      // Slide 2 comes in from the right
      slide2.style.transition = "none";
      slide2.style.transform  = "translateX(100%)";
      slide2.style.opacity    = "0";

      setTimeout(function() {
        slide2.style.transition = "transform 0.8s ease, opacity 0.8s ease";
        slide2.style.transform  = "translateX(0%)";
        slide2.style.opacity    = "1";
        currentSlide = 2;
        dot1.className = "dot-inactive";
        dot2.className = "dot-active";
        setTimeout(function() { isAnimating = false; }, 900);
      }, 50);
    }

    function goToSlide1() {
      if (isAnimating) return;
      isAnimating = true;

      // Slide 2 exits to the right
      slide2.style.transform = "translateX(100%)";
      slide2.style.opacity   = "0";

      // Slide 1 comes in from the left
      slide1.style.transition = "none";
      slide1.style.transform  = "translateX(-100%)";
      slide1.style.opacity    = "0";

      setTimeout(function() {
        slide1.style.transition = "transform 0.8s ease, opacity 0.8s ease";
        slide1.style.transform  = "translateX(0%)";
        slide1.style.opacity    = "1";
        currentSlide = 1;
        dot1.className = "dot-active";
        dot2.className = "dot-inactive";
        setTimeout(function() { isAnimating = false; }, 900);
      }, 50);
    }

    function startSlider() {
      sliderInterval = setInterval(function() {
        if (currentSlide === 1) {
          goToSlide2();
        } else {
          goToSlide1();
        }
      }, 10000); // 10 seconds
    }

    function stopSlider() {
      clearInterval(sliderInterval);
    }

    // Dot click controls
    dot1.addEventListener("click", function() {
      if (currentSlide !== 1) {
        stopSlider();
        goToSlide1();
        startSlider();
      }
    });

    dot2.addEventListener("click", function() {
      if (currentSlide !== 2) {
        stopSlider();
        goToSlide2();
        startSlider();
      }
    });

    // ── Intersection Observer ──
    // Slider only runs when section is visible
    const projectsObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          startSlider(); // start when visible
        } else {
          stopSlider();  // stop when not visible
        }
      });
    }, { threshold: 0.3 });

    projectsObserver.observe(section);

  } catch (error) {
    console.error("Projects error:", error);
  }
}


// ── Helper: Build a project card ──
function createProjectCard(project) {
  const card = document.createElement("div");
  card.className = "project-card";

  card.innerHTML = `
    <img src="${project.image}"
         alt="${project.title}"
         onerror="this.src='class.png'">
    <div class="project-info">
      <h3>${project.title}</h3>
      <p>${project.description}</p>
    </div>
  `;

  return card;
}
