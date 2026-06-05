// =============================================
// MARTIN KIMATHI — ADMIN DASHBOARD
// =============================================

import { initializeApp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── Firebase Config ──
const firebaseConfig = {
  apiKey: "AIzaSyBaxLJHGg6xXqumKQCnLGRw-_AeZoNTuDU",
  authDomain: "martin-portfolio-100a0.firebaseapp.com",
  projectId: "martin-portfolio-100a0",
  storageBucket: "martin-portfolio-100a0.firebasestorage.app",
  messagingSenderId: "247649897607",
  appId: "1:247649897607:web:4689925f9e236f2f193c22"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// =============================================
// ── LOGIN PAGE LOGIC ──
// =============================================
const loginBtn = document.getElementById("login-btn");

if (loginBtn) {
  loginBtn.addEventListener("click", async function() {
    const email    = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();
    const errorEl  = document.getElementById("login-error");

    if (!email || !password) {
      errorEl.textContent = "⚠️ Please enter email and password.";
      return;
    }

    loginBtn.textContent = "Logging in...";
    loginBtn.disabled    = true;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "dashboard.html";
    } catch (error) {
      errorEl.textContent  = "❌ Wrong email or password. Try again.";
      loginBtn.textContent = "Login";
      loginBtn.disabled    = false;
    }
  });
}

// =============================================
// ── DASHBOARD PAGE LOGIC ──
// =============================================
const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {

  // Check if user is logged in
  onAuthStateChanged(auth, function(user) {
    if (!user) {
      // Not logged in — redirect to login
      window.location.href = "index.html";
    } else {
      // Logged in — load all data
      loadServices();
      loadProjects();
      loadMessages();
    }
  });

  // Logout
  logoutBtn.addEventListener("click", async function() {
    await signOut(auth);
    window.location.href = "index.html";
  });

  // ── TABS ──
  document.querySelectorAll(".tab-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      this.classList.add("active");
      document.getElementById("tab-" + this.dataset.tab).classList.add("active");
    });
  });

  // =============================================
  // ── SERVICES ──
  // =============================================
  async function loadServices() {
    const list = document.getElementById("services-list");
    list.innerHTML = "<p class='loading-text'>Loading services...</p>";

    const q    = query(collection(db, "services"), orderBy("order"));
    const snap = await getDocs(q);

    list.innerHTML = "";

    snap.forEach(function(docSnap) {
      const s    = docSnap.data();
      const card = document.createElement("div");
      card.className = "item-card";
      card.innerHTML = `
        <div class="item-info">
          <h4>${s.title}</h4>
          <p>${s.description}</p>
        </div>
        <div class="item-actions">
          <button class="edit-btn"
                  onclick="editService('${docSnap.id}',
                  '${s.title}',
                  '${s.description}',
                  '${s.icon}',
                  ${s.order})">
            Edit
          </button>
          <button class="delete-btn"
                  onclick="deleteService('${docSnap.id}')">
            Delete
          </button>
        </div>
      `;
      list.appendChild(card);
    });
  }

  // Show add service form
  document.getElementById("add-service-btn")
    .addEventListener("click", function() {
      document.getElementById("service-form-title").textContent = "Add New Service";
      document.getElementById("service-doc-id").value    = "";
      document.getElementById("service-title").value     = "";
      document.getElementById("service-description").value = "";
      document.getElementById("service-icon").value      = "code";
      document.getElementById("service-order").value     = "";
      document.getElementById("service-status").textContent = "";
      document.getElementById("service-form-card").style.display = "block";
  });

  // Cancel service form
  document.getElementById("cancel-service-btn")
    .addEventListener("click", function() {
      document.getElementById("service-form-card").style.display = "none";
  });

  // Save service
  document.getElementById("save-service-btn")
    .addEventListener("click", async function() {
      const docId  = document.getElementById("service-doc-id").value;
      const title  = document.getElementById("service-title").value.trim();
      const desc   = document.getElementById("service-description").value.trim();
      const icon   = document.getElementById("service-icon").value;
      const order  = parseInt(document.getElementById("service-order").value);
      const status = document.getElementById("service-status");

      if (!title || !desc || !order) {
        status.textContent = "⚠️ Please fill in all fields.";
        status.style.color = "red";
        return;
      }

      status.textContent = "Saving...";
      status.style.color = "#888";

      try {
        if (docId) {
          // Update existing
          await updateDoc(doc(db, "services", docId), {
            title, description: desc, icon, order
          });
        } else {
          // Add new
          await addDoc(collection(db, "services"), {
            title, description: desc, icon, order
          });
        }
        status.textContent = "✅ Saved successfully!";
        status.style.color = "green";
        setTimeout(function() {
          document.getElementById("service-form-card").style.display = "none";
          loadServices();
        }, 1000);
      } catch (error) {
        status.textContent = "❌ Error saving. Try again.";
        status.style.color = "red";
      }
  });

  // Edit service — fill form with existing data
  window.editService = function(id, title, description, icon, order) {
    document.getElementById("service-form-title").textContent = "Edit Service";
    document.getElementById("service-doc-id").value      = id;
    document.getElementById("service-title").value       = title;
    document.getElementById("service-description").value = description;
    document.getElementById("service-icon").value        = icon;
    document.getElementById("service-order").value       = order;
    document.getElementById("service-status").textContent = "";
    document.getElementById("service-form-card").style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete service
  window.deleteService = async function(id) {
    if (confirm("Are you sure you want to delete this service?")) {
      await deleteDoc(doc(db, "services", id));
      loadServices();
    }
  };

  // =============================================
  // ── PROJECTS ──
  // =============================================
  async function loadProjects() {
    const list = document.getElementById("projects-list");
    list.innerHTML = "<p class='loading-text'>Loading projects...</p>";

    const q    = query(collection(db, "projects"), orderBy("order"));
    const snap = await getDocs(q);

    list.innerHTML = "";

    snap.forEach(function(docSnap) {
      const p    = docSnap.data();
      const card = document.createElement("div");
      card.className = "item-card";
      card.innerHTML = `
        <div class="item-info">
          <h4>${p.title}</h4>
          <p>${p.description}</p>
        </div>
        <div class="item-actions">
          <button class="edit-btn"
                  onclick="editProject('${docSnap.id}',
                  '${p.title}',
                  '${p.description}',
                  '${p.image}',
                  ${p.order})">
            Edit
          </button>
          <button class="delete-btn"
                  onclick="deleteProject('${docSnap.id}')">
            Delete
          </button>
        </div>
      `;
      list.appendChild(card);
    });
  }

  // Show add project form
  document.getElementById("add-project-btn")
    .addEventListener("click", function() {
      document.getElementById("project-form-title").textContent = "Add New Project";
      document.getElementById("project-doc-id").value      = "";
      document.getElementById("project-title").value       = "";
      document.getElementById("project-description").value = "";
      document.getElementById("project-image").value       = "";
      document.getElementById("project-order").value       = "";
      document.getElementById("project-status").textContent = "";
      document.getElementById("project-form-card").style.display = "block";
  });

  // Cancel project form
  document.getElementById("cancel-project-btn")
    .addEventListener("click", function() {
      document.getElementById("project-form-card").style.display = "none";
  });

  // Save project
  document.getElementById("save-project-btn")
    .addEventListener("click", async function() {
      const docId  = document.getElementById("project-doc-id").value;
      const title  = document.getElementById("project-title").value.trim();
      const desc   = document.getElementById("project-description").value.trim();
      const image  = document.getElementById("project-image").value.trim();
      const order  = parseInt(document.getElementById("project-order").value);
      const status = document.getElementById("project-status");

      if (!title || !desc || !image || !order) {
        status.textContent = "⚠️ Please fill in all fields.";
        status.style.color = "red";
        return;
      }

      status.textContent = "Saving...";
      status.style.color = "#888";

      try {
        if (docId) {
          await updateDoc(doc(db, "projects", docId), {
            title, description: desc, image, order
          });
        } else {
          await addDoc(collection(db, "projects"), {
            title, description: desc, image, order
          });
        }
        status.textContent = "✅ Saved successfully!";
        status.style.color = "green";
        setTimeout(function() {
          document.getElementById("project-form-card").style.display = "none";
          loadProjects();
        }, 1000);
      } catch (error) {
        status.textContent = "❌ Error saving. Try again.";
        status.style.color = "red";
      }
  });

  // Edit project
  window.editProject = function(id, title, description, image, order) {
    document.getElementById("project-form-title").textContent = "Edit Project";
    document.getElementById("project-doc-id").value      = id;
    document.getElementById("project-title").value       = title;
    document.getElementById("project-description").value = description;
    document.getElementById("project-image").value       = image;
    document.getElementById("project-order").value       = order;
    document.getElementById("project-status").textContent = "";
    document.getElementById("project-form-card").style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete project
  window.deleteProject = async function(id) {
    if (confirm("Are you sure you want to delete this project?")) {
      await deleteDoc(doc(db, "projects", id));
      loadProjects();
    }
  };

  // =============================================
  // ── MESSAGES ──
  // =============================================
async function loadMessages() {
  const list = document.getElementById("messages-list");
  list.innerHTML = "<p class='loading-text'>Loading messages...</p>";

  try {
    const snap = await getDocs(collection(db, "messages"));

    if (snap.empty) {
      list.innerHTML = "<p class='loading-text'>No messages yet.</p>";
      return;
    }

    list.innerHTML = "";

    snap.forEach(function(docSnap) {
      const m    = docSnap.data();
      const card = document.createElement("div");
      card.className = "message-card";

      // Format date nicely
      let dateStr = "";
      if (m.date) {
        const d = new Date(m.date);
        dateStr = d.toLocaleDateString("en-KE", {
          day:   "numeric",
          month: "long",
          year:  "numeric",
          hour:  "2-digit",
          minute:"2-digit"
        });
      }

      card.innerHTML = `
        <div style="display:flex;
                    justify-content:space-between;
                    align-items:flex-start;
                    flex-wrap:wrap;
                    gap:0.5rem;">
          <div>
            <h4>${m.name || m.from_name || "Unknown"}</h4>
            <p class="message-email">
              📧 ${m.email || m.from_email || "No email"}
            </p>
            ${dateStr ? `<p class="message-email">🕐 ${dateStr}</p>` : ""}
          </div>
          <button class="delete-btn"
                  onclick="deleteMessage('${docSnap.id}')">
            Delete
          </button>
        </div>
        <p class="message-text" style="margin-top:10px;">
          ${m.message}
        </p>
      `;

      list.appendChild(card);
    });

  } catch (error) {
    list.innerHTML = "<p class='loading-text'>Could not load messages.</p>";
    console.error("Messages error:", error);
  }
}

// Delete message
window.deleteMessage = async function(id) {
  if (confirm("Delete this message?")) {
    await deleteDoc(doc(db, "messages", id));
    loadMessages();
  }
};
}
