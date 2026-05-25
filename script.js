//You can edit ALL of the code here
function setup() {
  // grab all the episodes from the data file
  const allEpisodes = getAllEpisodes();
  // pass them into our function so we can display them
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  // find the root div in HTML (this is where episodes will go)
  const rootElem = document.getElementById("root");
  // clear anything already inside root 
  rootElem.innerHTML = "";

  // go through each episode one by one
  episodeList.forEach(function (episode) {
    // make the episode code look like S01E07
    // padStart adds a 0 if the number is only 1 digit
    const episodeCode = "S" + String(episode.season).padStart(2, "0") + "E" + String(episode.number).padStart(2, "0");

    // put the episode info inside the card 
    Clipboard.innerHTML = `
      <div class="card">
        <h2>${episode.name} - ${episodeCode}</h2>
        <img src="${episode.image.medium}" alt="${episode.name}">
        <p>${episode.summary}</p>
      </div>
    `;
    // add the card to the page
    rootElem.appendChild(card);
  });


window.onload = setup;
