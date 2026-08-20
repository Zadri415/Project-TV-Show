const rootElem = document.getElementById("root");
const episodeTemplate = document.getElementById("episode-template");
const episodeSearch = document.getElementById("episode-search");
const searchCount = document.getElementById("search-count");
const episodeSelect = document.getElementById("episode-select");

const showsView = document.getElementById("shows-view");
const episodesView = document.getElementById("episodes-view");
const showsGrid = document.getElementById("shows-grid");
const showsCount = document.getElementById("shows-count");
const showSearch = document.getElementById("show-search");
const backToShowsBtn = document.getElementById("back-to-shows");
const currentShowNameElem = document.getElementById("current-show-name");
const showTemplate = document.getElementById("show-template");

const SHOWS_URL = "https://api.tvmaze.com/shows";
const DEFAULT_SHOW_ID = 82; // Game of Thrones

const PLACEHOLDER_IMAGE = "https://placehold.co/250x140";

// State
const state = {
  episodes: [],
  shows: [],
  currentShowID: DEFAULT_SHOW_ID,
  isShowListInitialized: false,
  searchTerm: "",
  showSearchTerm: "",
  episodeCache: {}, // { [showID]: episodes[] }
};

// _____________________________________________________________________________
// LOADING / ERROR STATES

function showLoadingMessage() {
  rootElem.textContent = "Loading episodes, please wait...";
}

function showErrorMessage(error) {
  rootElem.textContent =
    "Sorry, something went wrong loading the episodes. Please try again later.";

  const detail = document.createElement("p");
  detail.className = "error-detail";
  detail.textContent = error.message;
  rootElem.appendChild(detail);
}

// _____________________________________________________________________________
// SETUP - fetch shows list once, then show the listing view

function setup() {
  setupShowSearch();
  setupBackToShows();
  episodeSelect.addEventListener("change", (event) => {
    const element = document.getElementById(event.target.value);
    if (element) {
      element.scrollIntoView({behavior: "smooth", block: "start"});
    }
  });
  episodeSearch.addEventListener("input", function () {
    state.searchTerm = episodeSearch.value;
    render();
  });

  fetch(SHOWS_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to fetch available shows with status: ${response.status}`,
        );
      }
      return response.json();
    })
    .then((shows) => {
      state.shows = shows.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {sensitivity: "base"}),
      );
      state.isShowListInitialized = true;
      renderShows(state.shows);
    })
    .catch((error) => {
      showErrorMessage(error);
    });
}

// _____________________________________________________________________________
// SHOWS LISTING VIEW

function filterShows() {
  const term = state.showSearchTerm.trim().toLowerCase();
  if (!term) return state.shows;

  return state.shows.filter((show) => {
    const name = show.name.toLowerCase();
    const genres = (show.genres || []).join(" ").toLowerCase();
    const summary = (show.summary || "").toLowerCase();
    return (
      name.includes(term) || genres.includes(term) || summary.includes(term)
    );
  });
}

function setupShowSearch() {
  showSearch.addEventListener("input", () => {
    state.showSearchTerm = showSearch.value;
    renderShows(filterShows());
  });
}

function renderShows(showList) {
  showsGrid.innerHTML = "";

  showList.forEach((show) => {
    const clone = showTemplate.content.cloneNode(true);

    const nameElem = clone.querySelector(".show-name");
    nameElem.textContent = show.name;
    nameElem.addEventListener("click", () => openShow(show));

    const imageElem = clone.querySelector(".show-image");
    imageElem.src = show.image ? show.image.medium : PLACEHOLDER_IMAGE;
    imageElem.alt = `${show.name} poster`;
    clone.querySelector(".show-summary").innerHTML = show.summary || "";
    clone.querySelector(".show-genres").textContent = (show.genres || []).join(
      ", ",
    );
    clone.querySelector(".show-status").textContent = `Status: ${show.status}`;
    clone.querySelector(".show-rating").textContent = `Rating: ${
      show.rating && show.rating.average ? show.rating.average : "N/A"
    }`;
    clone.querySelector(".show-runtime").textContent = `Runtime: ${
      show.runtime ? show.runtime + " min" : "N/A"
    }`;

    showsGrid.appendChild(clone);
  });

  showsCount.textContent =
    showList.length === state.shows.length
      ? `Showing all ${state.shows.length} shows`
      : `Showing ${showList.length}/${state.shows.length} shows`;
}

// _____________________________________________________________________________
// VIEW SWITCHING

function openShow(show) {
  state.currentShowID = show.id;
  state.searchTerm = "";
  episodeSearch.value = "";

  currentShowNameElem.textContent = show.name;
  showsView.classList.add("hidden");
  episodesView.classList.remove("hidden");

  loadEpisodes();
}

function setupBackToShows() {
  backToShowsBtn.addEventListener("click", () => {
    episodesView.classList.add("hidden");
    showsView.classList.remove("hidden");
  });
}

// _____________________________________________________________________________
// FETCH EPISODES - cached per show id, so never re-fetched within a visit

function loadEpisodes() {
  const cached = state.episodeCache[state.currentShowID];

  if (cached) {
    state.episodes = cached;
    render();
    return;
  }

  showLoadingMessage();

  fetch(`https://api.tvmaze.com/shows/${state.currentShowID}/episodes`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.json();
    })
    .then((episodes) => {
      state.episodeCache[state.currentShowID] = episodes;
      state.episodes = episodes;
      render();
    })
    .catch((error) => {
      showErrorMessage(error);
    });
}

// Render page
function render() {
  const filteredEpisodes = filterEpisodes();
  makePageForEpisodes(filteredEpisodes);
  updateSearchCount(filteredEpisodes);
  populateEpisodeSelect(filteredEpisodes);
}

// _____________________________________________________________________________
// EPISODE SEARCH BAR

function filterEpisodes() {
  return state.episodes.filter(function (episode) {
    const name = episode.name.toLowerCase();
    const summary = (episode.summary || "").toLowerCase();
    const term = state.searchTerm.toLowerCase();
    return name.includes(term) || summary.includes(term);
  });
}

function updateSearchCount(filteredEpisodes) {
  searchCount.textContent = `Displaying ${filteredEpisodes.length} / ${state.episodes.length} shows`;
}

// _____________________________________________________________________________
// EPISODE SELECT DROP-DOWN

function populateEpisodeSelect(episodes) {
  episodeSelect.innerHTML = "";
  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${createEpisodeCode(episode)} - ${episode.name}`;
    episodeSelect.appendChild(option);
  });
}

// _____________________________________________________________________________
//  EPISODES

function makePageForEpisodes(episodeList) {
  rootElem.innerHTML = "";
  episodeList.forEach(addEpisode);
}

function addEpisode(episode) {
  const clone = episodeTemplate.content.cloneNode(true);
  const episodeCode = createEpisodeCode(episode);

  clone.querySelector("h2").textContent = `${episode.name} - ${episodeCode}`;
  const imageElem = clone.querySelector("img");
  imageElem.src = episode.image ? episode.image.medium : PLACEHOLDER_IMAGE;
  imageElem.alt = `${episode.name} still`;
  clone.querySelector("p").innerHTML = episode.summary;
  clone.querySelector("article").id = episode.id;

  rootElem.appendChild(clone);
}

function createEpisodeCode(episode) {
  return (
    "S" +
    String(episode.season).padStart(2, "0") +
    "E" +
    String(episode.number).padStart(2, "0")
  );
}

// _____________________________________________________________________________

window.onload = setup;
