
const $ = id => document.getElementById(id);
const KEY = "devtrack.v1";

let data;
try {
  data = JSON.parse(localStorage.getItem(KEY)) || {};
} catch {
  data = {};
}

data.profile ||= { name: "Developer", github: "" };
data.tasks ||= [];
data.projects ||= [];
data.activity ||= {};

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    alert("Could not save data in this browser.");
  }
}

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, c =>
    ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])
  );
}

function render() {
  const completed = data.tasks.filter(t => t.completed).length;
  const pending = data.tasks.length - completed;

  if ($("stat-completed")) $("stat-completed").textContent = completed;
  if ($("stat-task-note")) $("stat-task-note").textContent = `${pending} tasks remaining`;
  if ($("stat-projects")) $("stat-projects").textContent = data.projects.length;
  if ($("nav-task-count")) $("nav-task-count").textContent = pending;
  if ($("profile-name")) $("profile-name").textContent = data.profile.name;
  if ($("profile-avatar")) $("profile-avatar").textContent = data.profile.name[0].toUpperCase();
  if ($("top-avatar")) $("top-avatar").textContent = data.profile.name[0].toUpperCase();
  if ($("footer-year")) $("footer-year").textContent = new Date().getFullYear();

  if ($("welcome-title")) {
    $("welcome-title").innerHTML =
      `Make progress, <span class="gradient-text">${escapeHTML(data.profile.name.split(" ")[0])}.</span>`;
  }

  const taskList = $("task-preview");
  if (taskList) {
    taskList.innerHTML = data.tasks.slice(0, 5).map(t => `
      <div class="task-row">
        <button class="task-check ${t.completed ? "done" : ""}"
          data-toggle="${escapeHTML(t.id)}">${t.completed ? "✓" : ""}</button>
        <div class="task-main">
          <div class="task-title ${t.completed ? "done" : ""}">${escapeHTML(t.title)}</div>
          <div class="task-meta">${escapeHTML(t.priority)} · ${escapeHTML(t.due || "No due date")}</div>
        </div>
        <button class="mini-action" data-delete="${escapeHTML(t.id)}">×</button>
      </div>
    `).join("") || '<div class="empty-state">Add your first task.</div>';
  }

  const projects = $("project-preview");
  if (projects) {
    projects.innerHTML = data.projects.slice(0, 4).map(p => `
      <div class="project-row">
        <div class="project-symbol">◇</div>
        <div class="project-main">
          <div class="project-name">${escapeHTML(p.name)}</div>
          <div class="project-description">${escapeHTML(p.description)}</div>
          <div class="tech-tags">${p.tech.map(x =>
            `<span class="tech-tag">${escapeHTML(x)}</span>`).join("")}</div>
        </div>
      </div>
    `).join("") || '<div class="empty-state">Add your first project.</div>';
  }

  const heatmap = $("heatmap");
  if (heatmap) {
    heatmap.innerHTML = "";
    for (let i = 83; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
      const count = Number(data.activity[key] || 0);
      const cell = document.createElement("button");
      cell.className = `heat-cell level-${Math.min(4, count ? count <= 1 ? 1 : count <= 3 ? 2 : count <= 5 ? 3 : 4 : 0)}`;
      cell.title = `${key}: ${count} sessions`;
      cell.addEventListener("click", () => {
        if (key === today()) logActivity();
        else alert(`${key}: ${count} coding sessions`);
      });
      heatmap.appendChild(cell);
    }
  }

  const total = Object.values(data.activity).reduce((a, b) => a + Number(b || 0), 0);
  if ($("activity-total")) $("activity-total").textContent = `${total} sessions`;

  let streak = 0;
  const date = new Date();
  if (!data.activity[today()]) date.setDate(date.getDate() - 1);
  while (data.activity[date.toLocaleDateString("en-CA")] > 0) {
    streak++;
    date.setDate(date.getDate() - 1);
    if (streak > 3650) break;
  }
  if ($("stat-streak")) $("stat-streak").textContent = streak;

  const select = $("task-project");
  if (select) {
    const previous = select.value;
    select.innerHTML = '<option value="">No project</option>' +
      data.projects.map(p => `<option value="${escapeHTML(p.id)}">${escapeHTML(p.name)}</option>`).join("");
    select.value = previous;
  }
}

function logActivity() {
  const key = today();
  data.activity[key] = Math.min(20, (data.activity[key] || 0) + 1);
  save();
  render();
  alert("Coding session logged!");
}

function openModal(id) {
  const modal = $(id);
  if (modal?.showModal) modal.showModal();
}

function closeModal(id) {
  const modal = $(id);
  if (modal?.close) modal.close();
}

$("add-task-top")?.addEventListener("click", () => openModal("task-modal"));
$("add-task-inline")?.addEventListener("click", () => openModal("task-modal"));
$("add-project-btn")?.addEventListener("click", () => openModal("project-modal"));
$("log-activity-btn")?.addEventListener("click", logActivity);
$("sidebar-log-btn")?.addEventListener("click", logActivity);
$("heatmap-log")?.addEventListener("click", logActivity);

$("task-form")?.addEventListener("submit", e => {
  e.preventDefault();
  const id = $("task-id").value;
  const old = data.tasks.find(t => t.id === id);
  const task = {
    id: id || Date.now().toString(),
    title: $("task-title").value.trim(),
    priority: $("task-priority").value,
    due: $("task-due").value,
    projectId: $("task-project").value,
    notes: $("task-notes").value,
    completed: old?.completed || false
  };
  if (!task.title) return;
  data.tasks = old ? data.tasks.map(t => t.id === id ? task : t) : [task, ...data.tasks];
  save();
  render();
  closeModal("task-modal");
  e.target.reset();
  $("task-id").value = "";
});

$("task-preview")?.addEventListener("click", e => {
  const toggle = e.target.closest("[data-toggle]");
  const del = e.target.closest("[data-delete]");
  if (toggle) {
    const task = data.tasks.find(t => t.id === toggle.dataset.toggle);
    if (task) task.completed = !task.completed;
  }
  if (del && confirm("Delete this task?")) {
    data.tasks = data.tasks.filter(t => t.id !== del.dataset.delete);
  }
  save();
  render();
});

$("project-form")?.addEventListener("submit", e => {
  e.preventDefault();
  const name = $("project-name").value.trim();
  if (!name) return;
  data.projects.unshift({
    id: Date.now().toString(),
    name,
    description: $("project-description").value.trim(),
    tech: $("project-tech").value.split(",").map(s => s.trim()).filter(Boolean),
    url: $("project-url").value.trim()
  });
  save();
  render();
  closeModal("project-modal");
  e.target.reset();
});

$("settings-btn")?.addEventListener("click", () => {
  $("display-name").value = data.profile.name;
  $("settings-github").value = data.profile.github || "";
  openModal("settings-modal");
});

$("top-avatar")?.addEventListener("click", () => $("settings-btn")?.click());

$("settings-form")?.addEventListener("submit", e => {
  e.preventDefault();
  data.profile.name = $("display-name").value.trim() || "Developer";
  data.profile.github = $("settings-github").value.trim().replace(/^@/, "");
  save();
  render();
  closeModal("settings-modal");
  if ($("github-username")) $("github-username").value = data.profile.github;
});

document.querySelectorAll("[data-close]").forEach(button =>
  button.addEventListener("click", () => closeModal(button.dataset.close))
);

$("github-form")?.addEventListener("submit", async e => {
  e.preventDefault();
  const username = $("github-username").value.trim().replace(/^@/, "");
  if (!username) return alert("Enter a GitHub username.");

  const button = $("github-connect-btn");
  button.disabled = true;
  button.textContent = "Loading...";

  try {
    const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
    if (!response.ok) throw new Error(response.status === 404 ? "Username not found." : "GitHub API unavailable. Try again later.");
    const profile = await response.json();
    const reposResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`);
    if (!reposResponse.ok) throw new Error("Could not load repositories.");
    const repos = await reposResponse.json();
    const stars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

    $("stat-stars").textContent = stars;
    $("stat-github-note").textContent = `${profile.public_repos} public repos`;
    $("api-status").className = "api-status connected";
    $("api-status").innerHTML = "<i></i> Connected";
    $("github-empty").classList.add("hidden");
    $("github-results").classList.remove("hidden");

    $("github-profile").innerHTML = `
      <img class="github-avatar" src="${escapeHTML(profile.avatar_url)}" alt="">
      <div class="github-user-info"><strong>${escapeHTML(profile.name || profile.login)}</strong>
      <span>@${escapeHTML(profile.login)}</span>
      <div class="github-metrics"><span><b>${profile.public_repos}</b> repos</span>
      <span><b>${stars}</b> stars</span><span><b>${profile.followers}</b> followers</span></div></div>
      <a class="github-profile-link" href="${escapeHTML(profile.html_url)}" target="_blank" rel="noopener">Open profile ↗</a>`;

    $("repo-grid").innerHTML = repos.filter(r => !r.fork).slice(0, 6).map(r => `
      <article class="repo-card">
        <a class="repo-name" href="${escapeHTML(r.html_url)}" target="_blank" rel="noopener">${escapeHTML(r.name)}</a>
        <p class="repo-description">${escapeHTML(r.description || "No description")}</p>
        <div class="repo-meta">${escapeHTML(r.language || "Code")} · ☆ ${r.stargazers_count} · Forks ${r.forks_count}</div>
      </article>`).join("");

    data.profile.github = username;
    save();
  } catch (error) {
    alert(error.message);
  } finally {
    button.disabled = false;
    button.textContent = "Connect profile";
  }
});

$("export-btn")?.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "devtrack-backup.json";
  a.click();
  URL.revokeObjectURL(url);
});

$("clear-data-btn")?.addEventListener("click", () => {
  if (!confirm("Clear all DevTrack data from this browser?")) return;
  localStorage.removeItem(KEY);
  location.reload();
});

$("menu-toggle")?.addEventListener("click", () => $("sidebar")?.classList.toggle("open"));

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach(item => item.classList.remove("active"));
    link.classList.add("active");
    $("page-name").textContent = link.textContent.trim();
    $("sidebar")?.classList.remove("open");
  });
});

render();
if (data.profile.github && $("github-username")) {
  $("github-username").value = data.profile.github;
}
  
