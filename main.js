const audioPlayer = document.getElementById("audioPlayer");
const titleElement = document.getElementById("song-title");
const artistElement = document.getElementById("song-artist");
const remainingDurationElement = document.querySelector(".remaining-duration");
const totalDurationElement = document.querySelector(".total-duration");
const loopBtn = document.querySelector(".repeat");
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
const audio = new Audio();
// obj

function createSongObject(img, src) {
  return {
    img: img,
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
            playListArray.push(createSongObject(songData.img, audio.src));
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

// btn clicks

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

loopBtn.addEventListener("click", () => {
  if (loop === false) {
    audioPlayer.loop = true;
    loop = true;
  } else {
    loop = false;
    audioPlayer.loop = false;
  }
});

// update

function updateSong() {
  console.log(activeSong);
  audioPlayer.src = currentSongLink;
  audioPlayer.play();
  loadMetaData();
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

// gui like images title singer bla bla
function loadMetaData() {
  audio.src = currentSongLink;
  audio.addEventListener("loadedmetadata", () => {
    titleElement.textContent = audio.title || "No Title";
    artistElement.textContent = audio.artist || "Unknown Author";
    let img = undefined;
    playListArray.forEach((element) => {
      if (element.src === currentSongLink) {
        img = element.img;
      }
    });
    document.querySelector(".banner").style.backgroundImage = `url(${img})`;
  });
}
