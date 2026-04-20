//You can edit ALL of the code here
let allEpisodes = [];

function setup() {
  allEpisodes = getAllEpisodes();

  setupSearch();
  setupSelect();

  renderEpisodes(allEpisodes);
  updateCount(allEpisodes.length);
}
function renderEpisodes(episodes) {
  const root = document.getElementById("root");
  root.innerHTML = "";

  episodes.forEach((ep) => {
    root.appendChild(createEpisodeCard(ep));
  });

  root.appendChild(createCredit());
}

function createEpisodeCard(episode) {
  const div = document.createElement("div");
  div.className = "episode";
  div.id = episode.id;

  const code = formatEpisodeCode(episode);
  const imageUrl = episode.image?.medium || "";

  div.innerHTML = `
    <h3>${episode.name} - ${code}</h3>
    <img src="${imageUrl}" alt="${episode.name}" />
    <p>${episode.summary}</p>
  `;

  return div;
}

function formatEpisodeCode(ep) {
  const season = String(ep.season).padStart(2, "0");
  const number = String(ep.number).padStart(2, "0");
  return `S${season}E${number}`;
}

function createCredit() {
  const p = document.createElement("p");
  p.innerHTML = `Data originally from <a href="https://www.tvmaze.com/api">TVMaze API</a>`;
  return p;
}

function setupSearch() {
  const searchInput = document.getElementById("search");

  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();

    const filtered = allEpisodes.filter(
      (ep) =>
        ep.name.toLowerCase().includes(term) ||
        ep.summary.toLowerCase().includes(term),
    );

    renderEpisodes(filtered);
    updateCount(filtered.length);
  });
}

function updateCount(count) {
  const countElem = document.getElementById("count");
  countElem.textContent = `${count} episode(s) found`;
}

function setupSelect() {
  const select = document.getElementById("episode-select");

  
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "All Episodes";
  select.appendChild(defaultOption);

  allEpisodes.forEach((ep) => {
    const option = document.createElement("option");
    option.value = ep.id;
    option.textContent = `${formatEpisodeCode(ep)} - ${ep.name}`;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    const selectedId = select.value;

    if (selectedId === "") {
      renderEpisodes(allEpisodes);
      updateCount(allEpisodes.length);
      return;
    }

    const chosen = allEpisodes.find((ep) => ep.id == selectedId);

    renderEpisodes([chosen]);
    updateCount(1);
  });
}
window.onload = setup;

// --- Level 200: search and selector wiring (non-invasive) ---
(function level200() {
  // elements
  const searchInput = document.getElementById("search-input");
  const select = document.getElementById("episode-select");
  const matchCount = document.getElementById("match-count");

  // helper to format code
  const pad2 = (n) => String(n).padStart(2, "0");

  function populateSelector(episodes) {
    if (!select) return;
    // clear but keep the first 'All episodes' option
    select.length = 1;
    episodes.forEach((ep) => {
      const opt = document.createElement("option");
      opt.value = ep.id || `${ep.season}-${ep.number}`;
      opt.textContent = `S${pad2(ep.season)}E${pad2(ep.number)} - ${ep.name}`;
      select.appendChild(opt);
    });
  }

  function filterAndRender() {
    const all = typeof getAllEpisodes === "function" ? getAllEpisodes() : [];
    const term = ((searchInput && searchInput.value) || "")
      .trim()
      .toLowerCase();
    let filtered = all.slice();
    if (term) {
      filtered = filtered.filter((ep) => {
        const name = (ep.name || "").toLowerCase();
        const summary = (ep.summary || "").toLowerCase();
        return name.includes(term) || summary.includes(term);
      });
    }

    // update match count
    if (matchCount)
      matchCount.textContent = `${filtered.length} matching episode(s)`;

    // re-render
    makePageForEpisodes(filtered);
  }

  // wire events if controls exist
  document.addEventListener("DOMContentLoaded", () => {
    const all = typeof getAllEpisodes === "function" ? getAllEpisodes() : [];
    populateSelector(all);
    if (searchInput) {
      searchInput.addEventListener("input", filterAndRender);
    }
    if (select) {
      select.addEventListener("change", (e) => {
        const val = e.target.value;
        if (!val) {
          // show all
          filterAndRender();
          return;
        }
        // locate the element for the selected episode and scroll into view
        // attempt to use id if present, otherwise match season-number
        const allEps =
          typeof getAllEpisodes === "function" ? getAllEpisodes() : [];
        const ep = allEps.find(
          (x) =>
            (x.id && String(x.id) === val) || `${x.season}-${x.number}` === val,
        );
        if (!ep) return;
        // render only the selected episode (bonus behaviour)
        makePageForEpisodes([ep]);
        // try to scroll to first article
        const first = document.querySelector(".episode-card");
        if (first) first.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  });
})();
