const USERNAME = "qwerasdfzxcvjkl-ckq";

const statusEl = document.getElementById("status");
const listEl = document.getElementById("list");

function setStatus(msg, remove=false) {
  statusEl.textContent = msg;
	if (remove) {
		statusEl.remove();
	}
}

function repoCard(repo) {
  const name = repo.name || "unknown";
  const desc = repo.description ? repo.description : "";
  const htmlUrl = repo.html_url;

  const stars = repo.stargazers_count ?? 0;
  const forks = repo.forks_count ?? 0;
  const lang = repo.language ? repo.language : "—";

  const el = document.createElement("div");
  el.className = "repo";
	el.innerHTML = `
  <div class="project-card">
	<h3><a href="${htmlUrl}" target="_blank" rel="noopener noreferrer">${name}</a></h3>
	${desc ? `<p>${desc}</p>` : `<p class="muted">No description</p>`}
  </div>
  `;
  return el;
}

async function loadRepos() {
  setStatus("Loading…");
  listEl.innerHTML = "";

  const url =
    `https://api.github.com/users/${encodeURIComponent(USERNAME)}` +
    `/repos?per_page=100&sort=created`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/vnd.github+json" }
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`GitHub API error (${res.status}): ${errText || res.statusText}`);
    }

    const repos = await res.json();
    if (!Array.isArray(repos)) {
      setStatus("Unexpected response from GitHub.");
      return;
    }

    if (repos.length === 0) {
      setStatus("No public repositories found.");
      return;
    }

    for (const repo of repos) listEl.appendChild(repoCard(repo));
    setStatus(``, true);
  } catch (e) {
    setStatus(e.message || "Failed to load repositories.");
  }
}

loadRepos();
