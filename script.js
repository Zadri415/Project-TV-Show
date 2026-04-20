//You can edit ALL of the code here
let allEpisodes = [];

function setup() {
  allEpisodes = getAllEpisodes();

  setupSearch();
  setupSelect();

  renderEpisodes(allEpisodes);
  updateCount(allEpisodes.length);
}
function renderEpisodes(episodes) {
  const root = document.getElementById("root");
  root.innerHTML = "";

  episodes.forEach((ep) => {
    root.appendChild(createEpisodeCard(ep));
  });

  root.appendChild(createCredit());
}

function createEpisodeCard(episode) {
  const div = document.createElement("div");
  div.className = "episode";
  div.id = episode.id;

  const code = formatEpisodeCode(episode);
  const imageUrl = episode.image?.medium || "";

  div.innerHTML = `
    <h3>${episode.name} - ${code}</h3>
    <img src="${imageUrl}" alt="${episode.name}" />
    <p>${episode.summary}</p>
  `;

  return div;
}

function formatEpisodeCode(ep) {
  const season = String(ep.season).padStart(2, "0");
  const number = String(ep.number).padStart(2, "0");
  return `S${season}E${number}`;
}

function createCredit() {
  const p = document.createElement("p");
  p.innerHTML = `Data originally from <a href="https://www.tvmaze.com/api">TVMaze API</a>`;
  return p;
}

function setupSearch() {
  const searchInput = document.getElementById("search");

  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();

    const filtered = allEpisodes.filter(
      (ep) =>
        ep.name.toLowerCase().includes(term) ||
        ep.summary.toLowerCase().includes(term),
    );

    renderEpisodes(filtered);
    updateCount(filtered.length);
  });
}

function updateCount(count) {
  const countElem = document.getElementById("count");
  countElem.textContent = `${count} episode(s) found`;
}

function setupSelect() {
  const select = document.getElementById("episode-select");

  
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "All Episodes";
  select.appendChild(defaultOption);

  allEpisodes.forEach((ep) => {
    const option = document.createElement("option");
    option.value = ep.id;
    option.textContent = `${formatEpisodeCode(ep)} - ${ep.name}`;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    const selectedId = select.value;

    if (selectedId === "") {
      renderEpisodes(allEpisodes);
      updateCount(allEpisodes.length);
      return;
    }

    const chosen = allEpisodes.find((ep) => ep.id == selectedId);

    renderEpisodes([chosen]);
    updateCount(1);
  });
}
window.onload = setup;
