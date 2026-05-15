const API = "https://domain-basketball-association-4.onrender.com";

// =============================
// LOGIN
// =============================
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      document.getElementById("msg").innerText = data.message || "Error al iniciar sesión";
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    window.location.href = "dashboard.html";

  } catch (error) {
    document.getElementById("msg").innerText = "Error conectando con la API";
  }
}

// =============================
// DASHBOARD AUTH CHECK
// =============================
function checkAuth() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html";
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

// =============================
// TAB SYSTEM
// =============================
function showTab(tabId, btn) {
  document.querySelectorAll(".tab-content").forEach(div => div.classList.add("d-none"));
  document.getElementById(tabId).classList.remove("d-none");

  document.querySelectorAll(".nav-link").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

// =============================
// TEAMS CRUD
// =============================
async function loadTeams() {
  const res = await fetch(`${API}/teams`);
  const teams = await res.json();

  const table = document.getElementById("teamsTable");
  table.innerHTML = "";

  teams.forEach(t => {
    table.innerHTML += `
      <tr>
        <td>${t.id}</td>
        <td>${t.nombre}</td>
        <td>${t.ciudad}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editTeam(${t.id}, '${t.nombre}', '${t.ciudad}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deleteTeam(${t.id})">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

async function createTeam() {
  const nombre = document.getElementById("teamName").value;
  const ciudad = document.getElementById("teamCity").value;

  if (!nombre || !ciudad) {
    alert("Completa todos los campos");
    return;
  }

  await fetch(`${API}/teams`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, ciudad })
  });

  document.getElementById("teamName").value = "";
  document.getElementById("teamCity").value = "";

  loadTeams();
}

function editTeam(id, nombre, ciudad) {
  const newName = prompt("Nuevo nombre:", nombre);
  const newCity = prompt("Nueva ciudad:", ciudad);

  if (!newName || !newCity) return;

  fetch(`${API}/teams/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: newName, ciudad: newCity })
  }).then(loadTeams);
}

function deleteTeam(id) {
  if (!confirm("¿Seguro que quieres eliminar este equipo?")) return;

  fetch(`${API}/teams/${id}`, {
    method: "DELETE"
  }).then(loadTeams);
}

// =============================
// PLAYERS
// =============================
async function loadPlayers() {
  const res = await fetch(`${API}/players`);
  const players = await res.json();

  const table = document.getElementById("playersTable");
  table.innerHTML = "";

  players.forEach(p => {
    table.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.nombre}</td>
        <td>${p.posicion}</td>
        <td>${p.equipo_id}</td>
      </tr>
    `;
  });
}

// =============================
// GAMES
// =============================
async function loadGames() {
  const res = await fetch(`${API}/games`);
  const games = await res.json();

  const table = document.getElementById("gamesTable");
  table.innerHTML = "";

  games.forEach(g => {
    table.innerHTML += `
      <tr>
        <td>${g.id}</td>
        <td>${g.local_team}</td>
        <td>${g.away_team}</td>
        <td>${new Date(g.fecha).toLocaleString()}</td>
        <td>${g.puntos_local}</td>
        <td>${g.puntos_visitante}</td>
      </tr>
    `;
  });
}

// =============================
// STATS
// =============================
async function loadStats() {
  const res = await fetch(`${API}/stats`);
  const stats = await res.json();

  const table = document.getElementById("statsTable");
  table.innerHTML = "";

  stats.forEach(s => {
    table.innerHTML += `
      <tr>
        <td>${s.id}</td>
        <td>${s.jugador}</td>
        <td>${s.puntos}</td>
        <td>${s.rebotes}</td>
        <td>${s.asistencias}</td>
      </tr>
    `;
  });
}

// =============================
// AUTO LOAD IF DASHBOARD
// =============================
if (window.location.pathname.includes("dashboard.html")) {
  checkAuth();

  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    document.getElementById("userInfo").innerText = `Usuario: ${user.email} (${user.rol})`;
  }

  loadTeams();
  loadPlayers();
  loadGames();
  loadStats();
}