// DOMS
const rootElem = document.getElementById("root");
const episodeTemplate = document.getElementById("episode-template");

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
  episodeList.forEach(addEpisode);
}

function addEpisode(episode) {
  const episodeCode = createEpisodeCode(episode);
  const clone = episodeTemplate.content.cloneNode(true);

  // put the episode info inside the card
  clone.querySelector("h2").textContent = `${episode.name} - ${episodeCode}`;
  clone.querySelector("img").src = episode.image.medium;
  clone.querySelector("p").textContent = episode.summary;

  // add the card to the page
  rootElem.appendChild(clone);
}

// make the episode code look like S01E07
// padStart adds a 0 if the number is only 1 digit
function createEpisodeCode(episode) {
  return (
    "S" +
    String(episode.season).padStart(2, "0") +
    "E" +
    String(episode.number).padStart(2, "0")
  );
}

window.onload = setup;
