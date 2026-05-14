//You can edit ALL of the code here
function stripHtml(html = "") {
  const d = document.createElement("div");
  d.innerHTML = html;
  return d.textContent || d.innerText || "";
}

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
      state.episodes = episodes;

      makePageForEpisodes(episodes);
      populateEpisodeSelect(episodes);
    })

    .catch(function () {
      rootElem.innerHTML = "Sorry, there was a problem loading episodes.";
    });
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number,
    ).padStart(2, "0")}`;

    // Use template if available
    const template = document.getElementById("episode-card-template");
    let card;
    if (template && template.content) {
      card = template.content.firstElementChild.cloneNode(true);
      const titleEl = card.querySelector(".episode-title");
      const imgEl = card.querySelector("img");
      const descEl = card.querySelector(".episode-desc");

      if (titleEl) {
        titleEl.textContent = `${episode.name} - ${episodeCode}`;
      }

      const imgSrc =
        episode.image && episode.image.medium
          ? episode.image.medium
          : "https://via.placeholder.com/210x295?text=No+Image";
      if (imgEl) {
        imgEl.src = imgSrc;
        imgEl.alt = episode.name || "Episode image";
      }

      if (descEl) {
        descEl.textContent = episode.summary
          ? stripHtml(episode.summary)
          : "No summary available.";
      }
    } else {
      card = document.createElement("article");
      card.innerHTML = `
        <h2>${episode.name} - ${episodeCode}</h2>
        <img src="${episode.image && episode.image.medium ? episode.image.medium : "https://via.placeholder.com/210x295?text=No+Image"}" alt="${episode.name || "Episode image"}" />
      `;
      const p = document.createElement("p");
      p.textContent = episode.summary
        ? stripHtml(episode.summary)
        : "No summary available.";
      card.appendChild(p);
    }

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
  episodes: [],
  searchTerm: "",
};

function createEpisodeCode(episode) {
  const seasonNum = String(episode.season);
  const episodeNum = String(episode.number);
  return `S${seasonNum.padStart(2, 0)}E${episodeNum.padStart(2, 0)}`;
}
function populateEpisodeSelect(episodes) {
  const select = document.getElementById("episode-select");
  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${createEpisodeCode(episode)} - ${episode.name}`;
    select.appendChild(option);
  });
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

const searchInput = document.querySelector("input");
searchInput.addEventListener("keyup", function () {
  state.searchTerm = searchInput.value;
  render();
});

window.onload = setup;
