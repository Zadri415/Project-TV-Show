//You can edit ALL of the code here
function setup() {
  render();
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const card = document.createElement("article");
    card.id = episode.id;

    const episodeCode = `S${String(episode.season).padStart(
      2,
      "0",
    )}E${String(episode.number).padStart(2, "0")}`;

    card.innerHTML = `
      <h2>${episode.name} - ${episodeCode}</h2>

      <img 
        src="${episode.image.medium}" 
        alt="${episode.name}"
      />

      <p>${episode.summary}</p>
    `;

    rootElem.appendChild(card);
  });
}

function render() {
  const filteredEpisodes = state.episodes.filter(function (episode) {
    return (
      episode.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      episode.summary.toLowerCase().includes(state.searchTerm.toLowerCase())
    );
  });
  document.getElementById("episode-select").innerHTML = "";
  populateEpisodeSelect(filteredEpisodes);
  makePageForEpisodes(filteredEpisodes);
}

const state = {
  episodes: getAllEpisodes(),
  searchTerm: "",
};

const searchInput = document.querySelector("input");
searchInput.addEventListener("keyup", function () {
  state.searchTerm = searchInput.value;
  render();
});

function populateEpisodeSelect(episodes) {
  const select = document.getElementById("episode-select");
  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${createEpisodeCode(episode)} - ${episode.name}`;
    select.appendChild(option);
  });
}

function createEpisodeCode(episode) {
  const seasonNum = String(episode.season);
  const episodeNum = String(episode.number);
  return `S${seasonNum.padStart(2, 0)}E${episodeNum.padStart(2, 0)}`;
}

const episodeSelect = document.getElementById("episode-select");
episodeSelect.addEventListener("change", (event) => {
  const targetId = event.target.value;

  if (targetId) {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
});

window.onload = setup;

// Only episodes whose summary OR name contains the search term should be displayed
// The search should be case-insensitive
// The display should update immediately after each keystroke changes the input
// Display how many episodes match the current search
// If the search box is cleared, all episodes should be shown

// Add a select drop-down which lets the user jump quickly to a particular episode, with the following requirements:

// The select input should list all episodes in the format: “S01E01 - Winter is Coming”
// When the user makes a selection, they should be taken directly to that episode in the list
