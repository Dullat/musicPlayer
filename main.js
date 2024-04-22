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
let shuffleStatus = false;
const audio = new Audio();

// obj
function createSongObject(title, artist, img, src) {
  return {
    title: title,
    artist: artist,
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
  function loadSongsFromJSON() {
    fetch("songs.json")
      .then((response) => response.json())
      .then((songs) => {
        let fsong = undefined;
        songs.forEach((songData) => {
          const audio = new Audio();
          audio.src = songData.src;
          const listItem = document.createElement("li");
          const songBar = document.createElement("div");
          songBar.classList.add("song-bar");
          audio.addEventListener("loadedmetadata", function () {
            const title = songData.title || "Unknown Title";
            const artist = songData.artist || "Unknown Artist";
            const img = songData.img;
            const dur = formatTime(audio.duration);
            listItem.setAttribute("data-src", audio.src);
            songBar.innerHTML = `<p>${title}</p><small>${dur}</small>`;
            listItem.appendChild(songBar);
            playlist.appendChild(listItem);

            //calling
            playListArray.push(
              createSongObject(title, artist, songData.img, audio.src)
            );
            console.log(playListArray);
          });
          if (fsong === undefined) {
            fsong = audio.src;
            songObj = songData;
          }
        });
        updateSong(false);
        // audioPlayer.src = songObj.src;
      })
      .catch((error) => console.error("Error loading songs:", error));
  }

  loadSongsFromJSON();

  setTimeout(function () {
    const listItems = document.querySelectorAll("#playlist li");
    console.log(listItems);
    listItems.forEach((item) => {
      item.addEventListener("click", () => {
        playListArray.forEach((element) => {
          if (item.getAttribute("data-src") === element.src) {
            songObj = element;
          }
        });
        updateSong();
      });
    });
  }, 1000);
});

// btn clicks
playBtn.addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pause</title><path d="M13,19V6H17V19H13M6,19V6H10V19H6M7,7V18H9V7H7M14,7V18H16V7H14Z" /></svg>`;
  } else {
    audioPlayer.pause();
    playBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>play</title><path d="M18.4,12.5L9,18.38L8,19V6L18.4,12.5M16.5,12.5L9,7.8V17.2L16.5,12.5Z" /></svg>`;
  }
});

nextBtn.addEventListener("click", () => {
  playNextSong();
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

loopBtn.addEventListener("click", () => {
  if (loop === false) {
    audioPlayer.loop = true;
    loop = true;
  } else {
    loop = false;
    audioPlayer.loop = false;
  }
  loopBtn.classList.toggle("active");
});

shuffleBtn.addEventListener("click", () => {
  if (shuffleStatus === false) {
    shuffleStatus = true;
    console.log("sfl on");
  } else {
    shuffleStatus = false;
  }
  shuffleBtn.classList.toggle("active");
});

// update
function updateSong(play = true) {
  console.log(activeSong);
  audioPlayer.src = songObj.src;
  if (play === true) {
    audioPlayer.play();
  }
  loadMetaData();
}

audioPlayer.addEventListener("ended", function () {
  if (loop === false) {
    playNextSong();
  }
});

function playNextSong() {
  if (activeSong < playListArray.length - 1) {
    if (shuffleStatus === true) {
      activeSong = Math.floor(Math.random() * playListArray.length);
    } else activeSong++;
    songObj = playListArray[activeSong];
  } else {
    activeSong = 0;
    songObj = playListArray[activeSong];
  }
  updateSong();
}

// progress bar and time updating
audioPlayer.addEventListener("timeupdate", function () {
  if (!isNaN(audioPlayer.duration) && !isNaN(audioPlayer.currentTime)) {
    remainingDurationElement.textContent = formatTime(
      Math.max(0, Math.floor(audioPlayer.duration - audioPlayer.currentTime))
    );
    totalDurationElement.textContent = formatTime(
      Math.floor(audioPlayer.duration)
    );
    const progress =
      (audioPlayer.currentTime / audioPlayer.duration) * 100 || 0;
    progressBar.value = progress;
  }
});

// gui like images title singer
function loadMetaData() {
  titleElement.textContent = songObj.title || "No Title";
  artistElement.textContent = songObj.artist || "Unknown Author";
  document.querySelector(
    ".banner"
  ).style.backgroundImage = `url(${songObj.img})`;
}

// bar Click and Drag
function handleMouseDown(event) {
  // claculate mouse rlative to bar
  const rect = progressBar.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;

  // % of progress bar clicked
  const progressBarWidth = progressBar.offsetWidth;
  const progressPercentage = (offsetX / progressBarWidth) * 100;

  // update audioPlayer
  const duration = audioPlayer.duration;
  audioPlayer.currentTime = (duration * progressPercentage) / 100;

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
}

function handleMouseMove(event) {
  const rect = progressBar.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;

  //dragged by mouse, position
  const progressBarWidth = progressBar.offsetWidth;
  const progressPercentage = (offsetX / progressBarWidth) * 100;

  // update audioPlayer
  const duration = audioPlayer.duration;
  audioPlayer.currentTime = (duration * progressPercentage) / 100;
}

function handleMouseUp() {
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
}

progressBar.addEventListener("mousedown", handleMouseDown);
