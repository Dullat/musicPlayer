const audioPlayer = document.getElementById("audioPlayer");
const titleElement = document.getElementById("song-title");
const artistElement = document.getElementById("song-artist");
const remainingDurationElement = document.querySelector(".remaining-duration");
const totalDurationElement = document.querySelector(".total-duration");
const repeatBtn = document.querySelector(".repeat");
const prevBtn = document.querySelector(".skip-previous");
const nextBtn = document.querySelector(".skip-next");
const playBtn = document.querySelector(".play");
const shuffleBtn = document.querySelector(".shuffle");
const playlist = document.getElementById("playlist");
const progressBar = document.getElementById("progress");
let playListArray = [];
let listItems = undefined;
let activeSong = 0;
let songObj = undefined;
let loop = false;
let currentSongLink = undefined;

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

  setTimeout(function () {
    const listItems = document.querySelectorAll("#playlist li");
    console.log(listItems);
    listItems.forEach((item) => {
      item.addEventListener("click", () => {
        currentSongLink = item.getAttribute("data-src");
        updateSong();
        console.log(currentSongLink);
      });
    });
  }, 1000);
});

playBtn.addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
  } else audioPlayer.pause();
});

nextBtn.addEventListener("click", () => {
  playNextSong();
});

prevBtn.addEventListener("click", () => {
  if (activeSong > 0) {
    activeSong--;
    currentSongLink = playListArray[activeSong].src;
  } else {
    activeSong = 0;
    currentSongLink = playListArray[activeSong].src;
  }
  updateSong();
});

function updateSong() {
  console.log(activeSong);
  audioPlayer.src = currentSongLink;
  audioPlayer.play();
}

audioPlayer.addEventListener("ended", function () {
  if (loop === false) {
    playNextSong();
  }
});

function playNextSong() {
  if (activeSong < playListArray.length - 1) {
    activeSong++;
    currentSongLink = playListArray[activeSong].src;
  } else {
    activeSong = 0;
    currentSongLink = playListArray[activeSong].src;
  }
  updateSong();
}

// progress bar

audioPlayer.addEventListener("timeupdate", function () {
  remainingDurationElement.textContent = formatTime(
    Math.floor(audioPlayer.duration - audioPlayer.currentTime)
  );
  totalDurationElement.textContent = formatTime(
    Math.floor(audioPlayer.duration)
  );
  const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100 || 0;
  progressBar.value = progress;
});
