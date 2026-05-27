// DOMS
const rootElem = document.getElementById("root");

function setup() {
  // grab all the episodes from the data file
  const allEpisodes = getAllEpisodes();
  // pass them into our function so we can display them
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  // clear anything already inside root
  rootElem.innerHTML = "";

  // go through each episode one by one
  episodeList.forEach(function (episode) {
    const episodeCode = createEpisodeCode(episode);
    const card = document.createElement("article");
    // put the episode info inside the card
    card.innerHTML = `
        <h2>${episode.name} - ${episodeCode}</h2>
        <img src="${episode.image.medium}" alt="${episode.name}">
        <p>${episode.summary}</p>
      `;
    // add the card to the page
    rootElem.appendChild(card);
  });
}

// make the episode code look like S01E07
// padStart adds a 0 if the number is only 1 digit
function createEpisodeCode(episode) {
  "S" +
    String(episode.season).padStart(2, "0") +
    "E" +
    String(episode.number).padStart(2, "0");
}

window.onload = setup;
