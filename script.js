// DOMS
const rootElem = document.getElementById("root");
const episodeTemplate = document.getElementById("episode-template");
const episodeSearch = document.getElementById("episode-search");
const searchCount = document.getElementById("search-count");
const episodeSelect = document.getElementById("episode-select");

// State
const state = {
  episodes: getAllEpisodes(),
  searchTerm: "",
};

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

episodeSearch.addEventListener("keyup", function () {
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

episodeSelect.addEventListener("change", (event) => {
  const element = document.getElementById(event.target.value);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
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
  clone.querySelector("img").src = episode.image.medium;
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

window.onload = render;
