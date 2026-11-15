
const songs = [
  {
    id: 1,
    title: "Peaceful Morning",
    artist: "MelodyFlow",
    cover: "https://placehold.co/300x300/183b2b/ffffff?text=Morning",
    audio: ""
  },
  {
    id: 2,
    title: "Dream Journey",
    artist: "MelodyFlow",
    cover: "https://placehold.co/300x300/302050/ffffff?text=Dream",
    audio: ""
  },
  {
    id: 3,
    title: "Summer Vibes",
    artist: "MelodyFlow",
    cover: "https://placehold.co/300x300/504020/ffffff?text=Summer",
    audio: ""
  },
  {
    id: 4,
    title: "Night Sky",
    artist: "MelodyFlow",
    cover: "https://placehold.co/300x300/202040/ffffff?text=Night",
    audio: ""
  }
];

const audio = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playBtn");
const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");
const musicGrid = document.getElementById("musicGrid");
const libraryMessage = document.getElementById("libraryMessage");

let currentIndex = -1;
let favourites = JSON.parse(
  localStorage.getItem("melodyflow-favourites") || "[]"
);

let searchInput;

function saveFavourites() {
  localStorage.setItem(
    "melodyflow-favourites",
    JSON.stringify(favourites)
  );
}

function renderSongs(list = songs) {
  musicGrid.innerHTML = "";

  if (list.length === 0) {
    musicGrid.textContent = "No songs found.";
    return;
  }

  list.forEach(song => {
    const card = document.createElement("div");
    card.className = "music-card";

    const img = document.createElement("img");
    img.src = song.cover;
    img.alt = song.title;

    const title = document.createElement("h3");
    title.textContent = song.title;

    const artist = document.createElement("p");
    artist.textContent = song.artist;

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.justifyContent = "space-between";
    actions.style.marginTop = "12px";

    const selectBtn = document.createElement("button");
    selectBtn.textContent = "▶ Play";
    selectBtn.onclick = () => selectSong(song.id);

    const favBtn = document.createElement("button");
    favBtn.textContent = favourites.includes(song.id)
      ? "♥"
      : "♡";
    favBtn.style.color = "#1ed760";
    favBtn.onclick = () => toggleFavourite(song.id);

    actions.append(selectBtn, favBtn);
    card.append(img, title, artist, actions);
    musicGrid.appendChild(card);
  });
}

function selectSong(id) {
  currentIndex = songs.findIndex(song => song.id === id);

  if (currentIndex === -1) return;

  const song = songs[currentIndex];

  songTitle.textContent = song.title;
  artistName.textContent = song.artist;

  if (song.audio) {
    audio.src = song.audio;
    audio.play().then(() => {
      playBtn.textContent = "Ⅱ";
    }).catch(() => {
      playBtn.textContent = "▶";
    });
  } else {
    playBtn.textContent = "▶";
    alert("Music catalogue connection is coming next.");
  }
}

playBtn.addEventListener("click", () => {
  if (currentIndex === -1) {
    alert("Please select a song first.");
    return;
  }

  if (!audio.src) {
    alert("Licensed music playback is not connected yet.");
    return;
  }

  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});

audio.addEventListener("play", () => {
  playBtn.textContent = "Ⅱ";
});

audio.addEventListener("pause", () => {
  playBtn.textContent = "▶";
});

function nextSong() {
  if (currentIndex === -1) return;
  const nextIndex = (currentIndex + 1) % songs.length;
  selectSong(songs[nextIndex].id);
}

function previousSong() {
  if (currentIndex === -1) return;
  const prevIndex =
    (currentIndex - 1 + songs.length) % songs.length;
  selectSong(songs[prevIndex].id);
}

function toggleFavourite(id) {
  if (favourites.includes(id)) {
    favourites = favourites.filter(item => item !== id);
  } else {
    favourites.push(id);
  }

  saveFavourites();
  renderSongs(searchInput.value ? filterSongs(searchInput.value) : songs);
  updateLibrary();
}

function updateLibrary() {
  const likedSongs = songs.filter(song =>
    favourites.includes(song.id)
  );

  libraryMessage.textContent = likedSongs.length
    ? "Your favourites: " +
      likedSongs.map(song => song.title).join(", ")
    : "Your favourite music will appear here.";
}

function filterSongs(query) {
  const value = query.toLowerCase();

  return songs.filter(song =>
    song.title.toLowerCase().includes(value) ||
    song.artist.toLowerCase().includes(value)
  );
}

// Create search box
const searchSection = document.createElement("section");
searchSection.className = "section";

const searchHeading = document.createElement("h2");
searchHeading.textContent = "Search Music";

searchInput = document.createElement("input");
searchInput.type = "search";
searchInput.placeholder = "Search songs or artists...";
searchInput.style.width = "100%";
searchInput.style.padding = "14px";
searchInput.style.borderRadius = "8px";
searchInput.style.border = "1px solid #444";
searchInput.style.background = "#282828";
searchInput.style.color = "white";

searchInput.addEventListener("input", () => {
  renderSongs(filterSongs(searchInput.value));
});

searchSection.append(searchHeading, searchInput);

document.querySelector("main").prepend(searchSection);

// Initial setup
renderSongs();
updateLibrary();

console.log("MelodyFlow initialized successfully!");
