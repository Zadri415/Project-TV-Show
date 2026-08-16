// DOMS
const rootElem = document.getElementById("root");
const episodeTemplate = document.getElementById("episode-template");
const episodeSearch = document.getElementById("episode-search");
const searchCount = document.getElementById("search-count");
const episodeSelect = document.getElementById("episode-select");
const showSelect = document.getElementById("show-select");

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
};

// _____________________________________________________________________________
// LOADING / ERROR STATES (level 300 requirements 4 & 5)

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
// FETCH (level 300 requirements 2 & 3: fetch once, from the API)

function setup() {
  showLoadingMessage();

  // fetch episodes
  fetch(`https://api.tvmaze.com/shows/${state.currentShowID}/episodes`)
    .then((response) => {
      if (!response.ok) {
        // fetch only rejects on network failure, not on 4xx/5xx responses,
        // so this check is needed to catch a bad status too.
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.json();
    })
    .then((episodes) => {
      state.episodes = episodes;
      render();
    })
    .catch((error) => {
      showErrorMessage(error);
      throw new Error(error);
    });

  // fetch avaliable shows
  // https://api.tvmaze.com/shows
  if (!state.isShowListInitialized) {
    fetch(SHOWS_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Falied to fetch avaliable shows with status: ${response.status}`,
          );
        }
        return response.json();
      })
      .then((shows) => {
        state.shows = shows;
        state.isShowListInitialized = true;
        populateShowSelect(shows);
        sortSelect(showSelect);
      })
      .catch((error) => {
        showErrorMessage(error);
        throw new Error(error);
      });
  }
}

// Render page
function render() {
  const filteredEpisodes = filterEpisodes();
  makePageForEpisodes(filteredEpisodes);
  updateSearchCount(filteredEpisodes);
  populateEpisodeSelect(filteredEpisodes);
}

// _____________________________________________________________________________
// SEARCH BAR

function filterEpisodes() {
  return state.episodes.filter(function (episode) {
    return (
      episode.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      episode.summary.toLowerCase().includes(state.searchTerm.toLowerCase())
    );
  });
}

function updateSearchCount(filteredEpisodes) {
  searchCount.textContent = `Displaying ${filteredEpisodes.length} / ${state.episodes.length} shows`;
}

episodeSearch.addEventListener("input", function () {
  state.searchTerm = episodeSearch.value;
  render();
});

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

function sortSelect(selectElement) {
  const options = Array.from(selectElement.options);

  options.sort((a, b) => a.text.localeCompare(b.text));

  options.forEach((option) => selectElement.appendChild(option));
}

function populateShowSelect(shows) {
  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = `${show.name}`;
    showSelect.appendChild(option);
  });

  showSelect.value = state.currentShowID;
}

episodeSelect.addEventListener("change", (event) => {
  const element = document.getElementById(event.target.value);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

showSelect.addEventListener("change", (event) => {
  state.currentShowID = event.target.value;
  setup();
});

// _____________________________________________________________________________
//  EPISODES

function makePageForEpisodes(episodeList) {
  // clear anything already inside root
  rootElem.innerHTML = "";

  // go through each episode one by one
  episodeList.forEach(addEpisode);
}

function addEpisode(episode) {
  const clone = episodeTemplate.content.cloneNode(true);
  const episodeCode = createEpisodeCode(episode);

  // put the episode info inside the clone
  clone.querySelector("h2").textContent = `${episode.name} - ${episodeCode}`;
  clone.querySelector("img").src = episode.image
    ? episode.image.medium
    : PLACEHOLDER_IMAGE;
  clone.querySelector("p").textContent = episode.summary;
  clone.querySelector("article").id = episode.id;

  // add the clone to the page
  rootElem.appendChild(clone);
}

function createEpisodeCode(episode) {
  // make the episode code look like S01E07
  // padStart adds a 0 if the number is only 1 digit
  return (
    "S" +
    String(episode.season).padStart(2, "0") +
    "E" +
    String(episode.number).padStart(2, "0")
  );
}

// _____________________________________________________________________________

window.onload = setup;
