//You can edit ALL of the code here
let allEpisodes = [];

function setup() {
  const rootElem = document.getElementById("root");

  rootElem.innerHTML = "Loading episodes...";

  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load episodes");
      }

      return response.json();
    })

    .then(function (episodes) {
      allEpisodes = episodes;

      makePageForEpisodes(allEpisodes);
    })

    .catch(function () {
      rootElem.innerHTML = "Sorry, there was a problem loading episodes.";
    });
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
