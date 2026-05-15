//Global DOM elements
const searchCount = document.getElementById("search-count");
const rootElem = document.getElementById("root");
const template = document.getElementById("episode-card-template");
const showSelect = document.getElementById("show-select");
const episodeSelect = document.getElementById("episode-select");

// holds state of shows, current tv show episodes and cache
const state = {
  shows: [],
  episodes: [],
  episodeCache: {},
  searchTerm: "",
};

function stripHtml(html = "") {
  const d = document.createElement("div");
  d.innerHTML = html;
  return d.textContent || d.innerText || "";
}

//gets episodes information for show
function getEpisodes(showId) {
  const showName = state.shows.find((show) => show.id === Number(showId)).name;
  //checks cache for episodes
  if (state.episodeCache[showId]) {
    state.episodes = state.episodeCache[showId];
    console.log(`fetched ${showName} episodes from cache`);
    render();
    return;
  }
  //fetches episodes from API
  rootElem.innerHTML = "Loading episodes...";
  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load episodes");
      }
      return response.json();
    })
    .then(function (episodes) {
      console.log(`fetched ${showName} episodes from tvMaze`);
      state.episodeCache[showId] = episodes;
      state.episodes = episodes;
      render();
    })
    .catch(function () {
      rootElem.innerHTML = "Sorry, there was a problem loading episodes.";
    });
}

//fetches shows
function setup() {
  render();
}

// creates episode cards
function makePageForEpisodes(episodeList) {
  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const card = document.createElement("article");
    card.id = episode.id;

    let card;
    if (template && template.content) {
      card = template.content.firstElementChild.cloneNode(true);
      card.id = episode.id;
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
