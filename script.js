//You can edit ALL of the code here
function setup() {
  render();
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const card = document.createElement("article");

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

window.onload = setup;

// Only episodes whose summary OR name contains the search term should be displayed
// The search should be case-insensitive
// The display should update immediately after each keystroke changes the input
// Display how many episodes match the current search
// If the search box is cleared, all episodes should be shown

// Add a select drop-down which lets the user jump quickly to a particular episode, with the following requirements:

// The select input should list all episodes in the format: “S01E01 - Winter is Coming”
// When the user makes a selection, they should be taken directly to that episode in the list
