const audioPlayer = document.getElementById("audioPlayer");
const titleElement = document.getElementById("song-title");
const artistElement = document.getElementById("song-artist");
const remainingDurationElement = document.getElementById("remaining-duration");
const totalDurationElement = document.getElementById("total-duration");
const repeatBtn = document.querySelector(".repeat");
const prevBtn = document.querySelector(".skip-previous");
const nextBtn = document.querySelector(".skip-next");
const playBtn = document.querySelector(".play");
const shuffleBtn = document.querySelector(".shuffle");
const playlist = document.getElementById("playlist");
let playListArray = [];
let activeSong = 0;
let songObj = undefined;

// obj

function createSongObject(title, artist, duration, src) {
  return {
    title: title,
    artist: artist,
    duration: duration,
    src: src,
  };
}

//format time
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

document.addEventListener("DOMContentLoaded", function () {
  // Function to load songs from JSON
  function loadSongsFromJSON() {
    fetch("songs.json")
      .then((response) => response.json())
      .then((songs) => {
        let fsong = undefined;
        songs.forEach((songData) => {
          const audio = new Audio();
          audio.src = songData.src;
          if (fsong === undefined) {
            fsong = audio.src;
          }
          const listItem = document.createElement("li");
          const songBar = document.createElement("div");
          songBar.classList.add("song-bar");
          audio.addEventListener("loadedmetadata", function () {
            const title = audio.title || "Unknown Title";
            const dur = formatTime(audio.duration);
            listItem.setAttribute("data-src", audio.src);
            songBar.innerHTML = `<p>${title}</p><small>${dur}</small>`;
            listItem.appendChild(songBar);
            playlist.appendChild(listItem);

            //calling
            playListArray.push(
              createSongObject(
                audio.title,
                audio.artist,
                formatTime(audio.duration),
                audio.src
              )
            );
            console.log(playListArray);
          });
        });
        audioPlayer.src = fsong;
      })
      .catch((error) => console.error("Error loading songs:", error));
  }

  loadSongsFromJSON();
});

playBtn.addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
  } else audioPlayer.pause();
});

nextBtn.addEventListener("click", () => {
  if (activeSong < playListArray.length - 1) {
    activeSong++;
    songObj = playListArray[activeSong];
  } else {
    activeSong = 0;
    songObj = playListArray[activeSong];
  }
  updateSong();
});

prevBtn.addEventListener("click", () => {
  if (activeSong > 0) {
    activeSong--;
    songObj = playListArray[activeSong];
  } else {
    activeSong = 0;
    songObj = playListArray[activeSong];
  }
  updateSong();
});

function updateSong() {
  console.log(activeSong);
  audioPlayer.src = songObj.src;
  audioPlayer.play();
}
