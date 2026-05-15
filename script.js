//Global DOM elements
const searchCount = document.getElementById("search-count");
const rootElem = document.getElementById("root");
const template = document.getElementById("episode-card-template");
const showSelect = document.getElementById("show-select");
const episodeSelect = document.getElementById("episode-select");

function stripHtml(html = "") {
  const d = document.createElement("div");
  d.innerHTML = html;
  return d.textContent || d.innerText || "";
}

// fetches data and sets up page on load
// function setup() {
//   rootElem.innerHTML = "Loading episodes...";

//   fetch("https://api.tvmaze.com/shows/82/episodes")
//     .then(function (response) {
//       if (!response.ok) {
//         throw new Error("Failed to load episodes");
//       }
//       return response.json();
//     })
//     .then(function (episodes) {
//       state.episodes = episodes;

//       render();
//     })
//     .catch(function () {
//       rootElem.innerHTML = "Sorry, there was a problem loading episodes.";
//     });
// }

//fetches shows
function setup() {
  rootElem.innerHTML = "Loading shows...";
  fetch("https://api.tvmaze.com/shows")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load shows");
      }
      return response.json();
    })
    .then(function (shows) {
      state.shows = shows;
      state.shows.sort((a, b) => a.name.localeCompare(b.name));
      populateShowSelect(shows);
    })
    .catch(function () {
      console.log(state.shoes);
      rootElem.innerHTML = "Sorry, there was a problem loading shows.";
    });
}

// creates episode cards
function makePageForEpisodes(episodeList) {
  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number,
    ).padStart(2, "0")}`;

    // Use template if available

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

//repopulates page
function render() {
  const filteredEpisodes = state.episodes.filter(function (episode) {
    return (
      episode.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      episode.summary.toLowerCase().includes(state.searchTerm.toLowerCase())
    );
  });
  episodeSelect.innerHTML = "";
  searchCount.textContent = `Displaying ${filteredEpisodes.length} / ${state.episodes.length} episodes`;
  populateShowSelect(shows);
  populateEpisodeSelect(filteredEpisodes);
  makePageForEpisodes(filteredEpisodes);
}

// holds state of current tv show
const state = {
  shows: [],
  episodes: [],
  episodeCache: {},
  searchTerm: "",
};

//creates episode code e.g. S01E05
function createEpisodeCode(episode) {
  const seasonNum = String(episode.season);
  const episodeNum = String(episode.number);
  return `S${seasonNum.padStart(2, 0)}E${episodeNum.padStart(2, 0)}`;
}
// populates show selection dropdown menu
function populateShowSelect(shows) {
  rootElem.innerHTML = "";
  showSelect.innerHTML = "";
  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = `${show.name}`;
    showSelect.appendChild(option);
  });
}

// populates episode selection dropdown menu
function populateEpisodeSelect(episodes) {
  episodeSelect.innerHTML = "";
  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${createEpisodeCode(episode)} - ${episode.name}`;
    episodeSelect.appendChild(option);
  });
}

// event listener for episode dropdown - scrolls to episode on select
episodeSelect.addEventListener("change", (event) => {
  const targetId = event.target.value;

  if (targetId) {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
});

// event listener for search bar
const searchInput = document.querySelector("input");
searchInput.addEventListener("keyup", function () {
  state.searchTerm = searchInput.value;
  render();
});

window.onload = setup;
