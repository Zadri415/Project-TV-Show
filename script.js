//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
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
