// DOMS
const rootElem = document.getElementById("root");
const episodeTemplate = document.getElementById("episode-template");
const episodeSearch = document.getElementById("episode-search");
const searchCount = document.getElementById("search-count");

// State
const state = {
  episodes: getAllEpisodes(),
  searchTerm: "",
};

// Render page
function render() {
  makePageForEpisodes(filteredEpisodes());
  updateSearchCount();
}

// _____________________________________________________________________________
// SEARCH BAR

function filteredEpisodes() {
  return state.episodes.filter(function (episode) {
    return (
      episode.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      episode.summary.toLowerCase().includes(state.searchTerm.toLowerCase())
    );
  });
}

function updateSearchCount() {
  searchCount.textContent = `Displaying ${filteredEpisodes().length} / ${state.episodes.length} shows`;
}

episodeSearch.addEventListener("keyup", function () {
  state.searchTerm = episodeSearch.value;
  render();
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
