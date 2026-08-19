// --- Elements ---
const showsView = document.getElementById("shows-view");
const episodesView = document.getElementById("episodes-view");
const showsGrid = document.getElementById("shows-grid");
const showsCount = document.getElementById("shows-count");
const showSearchInput = document.getElementById("show-search");
const backToShowsBtn = document.getElementById("back-to-shows");
const currentShowNameElem = document.getElementById("current-show-name");

const grid = document.getElementById("grid");
const searchInput = document.getElementById("search-input");
const select = document.getElementById("episode-select");

const SHOWS_URL = "https://api.tvmaze.com/shows";

// --- State ---
let allShows = [];
let showSearchTerm = "";

let currentEpisodes = [];
let currentShowId = null;

// Fetch once per URL - covers requirement 6 (never fetch the same URL twice)
const episodeCache = new Map();

// _____________________________________________________________________________
// SETUP

async function setup() {
  setupShowSearch();
  setupSearch();
  setupEpisodeSelector();
  setupBackToShows();

  await fetch(SHOWS_URL)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return response.json();
    })
    .then((shows) => {
      allShows = shows.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {sensitivity: "base"}),
      );
      renderShows(allShows);
    })
    .catch((err) => {
      displayError(err.message);
    });
}

// _____________________________________________________________________________
// SHOWS LISTING VIEW

function filterShows() {
  const term = showSearchTerm.trim().toLowerCase();
  if (!term) return allShows;

  return allShows.filter((show) => {
    const name = show.name.toLowerCase();
    const genres = (show.genres || []).join(" ").toLowerCase();
    const summary = (show.summary || "").toLowerCase();
    return (
      name.includes(term) || genres.includes(term) || summary.includes(term)
    );
  });
}

function setupShowSearch() {
  showSearchInput.addEventListener("input", () => {
    showSearchTerm = showSearchInput.value;
    renderShows(filterShows());
  });
}

function renderShows(showList) {
  const template = document.getElementById("show-card");
  showsGrid.innerHTML = "";

  for (const show of showList) {
    const clone = template.content.cloneNode(true);

    clone.querySelector(".show-name").textContent = show.name;
    clone.querySelector(".show-image").src = show.image
      ? show.image.medium
      : "";
    clone.querySelector(".show-summary").innerHTML = show.summary || "";
    clone.querySelector(".show-genres").textContent = (show.genres || []).join(
      ", ",
    );
    clone.querySelector(".show-status").textContent = `Status: ${show.status}`;
    clone.querySelector(".show-rating").textContent = `Rating: ${
      show.rating && show.rating.average ? show.rating.average : "N/A"
    }`;
    clone.querySelector(".show-runtime").textContent =
      `Runtime: ${show.runtime ? show.runtime + " min" : "N/A"}`;

    // Clicking the show name (or the whole card) opens its episode list
    const nameElem = clone.querySelector(".show-name");
    nameElem.style.cursor = "pointer";
    nameElem.addEventListener("click", () => {
      openShow(show);
    });

    showsGrid.appendChild(clone);
  }

  showsCount.textContent =
    showList.length === allShows.length
      ? `Showing all ${allShows.length} shows`
      : `Showing ${showList.length}/${allShows.length} shows`;
}

// _____________________________________________________________________________
// VIEW SWITCHING

function openShow(show) {
  currentShowNameElem.textContent = show.name;
  showsView.classList.add("hidden");
  episodesView.classList.remove("hidden");
  loadShow(show.id);
}

function setupBackToShows() {
  backToShowsBtn.addEventListener("click", () => {
    episodesView.classList.add("hidden");
    showsView.classList.remove("hidden");
  });
}

// _____________________________________________________________________________
// LOAD EPISODES FOR A SHOW - fetch once per show, reuse cache after that

function loadShow(showId) {
  currentShowId = showId;
  searchInput.value = "";

  if (episodeCache.has(showId)) {
    currentEpisodes = episodeCache.get(showId);
    render(currentEpisodes);
    return;
  }

  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return response.json();
    })
    .then((episodeList) => {
      episodeCache.set(showId, episodeList);
      if (currentShowId === showId) {
        currentEpisodes = episodeList;
        render(currentEpisodes);
      }
    })
    .catch((err) => {
      displayError(err.message);
    });
}

// _____________________________________________________________________________
// ERROR HANDLING

function displayError(errorMessage) {
  grid.innerHTML = "";

  const template = document.getElementById("error");
  const clone = template.content.cloneNode(true);
  clone.querySelector(".error-message").textContent = errorMessage;

  document.body.appendChild(clone);
}

// _____________________________________________________________________________
// EPISODES RENDERING (same as level 400, unchanged)

function render(episodeList) {
  const template = document.getElementById("episode-card");

  grid.innerHTML = "";

  if (episodeList == undefined || episodeList.length === 0) return;

  for (const episode of episodeList) {
    const clone = template.content.cloneNode(true);

    const card =
      clone.querySelector(".episode-card") || clone.firstElementChild;
    if (card) card.id = `episode-${episode.id}`;

    clone.querySelector(".title").textContent =
      episode.name +
      " - S" +
      String(episode.season).padStart(2, "0") +
      "E" +
      String(episode.number).padStart(2, "0");
    clone.querySelector(".thumb").src = episode.image.medium;
    clone.querySelector(".description").innerHTML = episode.summary;

    grid.appendChild(clone);
  }

  updateMatchCount(episodeList.length, currentEpisodes.length);
  populateEpisodeSelectOptions(episodeList);
}

function updateMatchCount(shown, total) {
  const rootElem = document.getElementById("root");
  rootElem.textContent =
    shown === total
      ? `Got ${total} episode(s)`
      : `Displaying ${shown}/${total} episode(s)`;
}

// --- Episode search ---

function setupSearch() {
  searchInput.addEventListener("input", () => {
    const term = searchInput.value.trim().toLowerCase();

    const filtered = term
      ? currentEpisodes.filter((episode) => {
          const name = episode.name.toLowerCase();
          const summary = (episode.summary || "").toLowerCase();
          return name.includes(term) || summary.includes(term);
        })
      : currentEpisodes;

    render(filtered);
  });
}

// --- Episode selector ---

function setupEpisodeSelector() {
  select.addEventListener("change", () => {
    const selectedId = select.value; // capture BEFORE render() rebuilds the select
    if (!selectedId) return;

    searchInput.value = "";
    render(currentEpisodes);

    const target = document.getElementById(`episode-${selectedId}`);
    if (target) {
      target.scrollIntoView({behavior: "smooth", block: "start"});
    }

    // render() reset the select back to the placeholder - restore
    // the user's actual selection so the dropdown reflects it
    select.value = selectedId;
  });
}

function populateEpisodeSelectOptions(episodeList) {
  select.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Jump to episode...";
  select.appendChild(placeholder);

  if (episodeList == undefined || episodeList.length === 0) return;

  for (const episode of episodeList) {
    const code =
      "S" +
      String(episode.season).padStart(2, "0") +
      "E" +
      String(episode.number).padStart(2, "0");
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${code} - ${episode.name}`;
    select.appendChild(option);
  }
}

window.onload = setup;
