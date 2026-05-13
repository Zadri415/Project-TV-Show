//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
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

window.onload = setup;
