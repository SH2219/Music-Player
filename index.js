let progress = document.getElementById("progress");
let song = document.getElementById("song");
let cntrlIcon = document.getElementById("cntrlIcon");
let isUserInteracted = false;

song.onloadedmetadata = () => {
  progress.max = song.duration;
  progress.value = song.currentTime;
};

async function playPause() {
  if (song.paused && !isUserInteracted) {
    // Check if the user has interacted before attempting to play
    return;
  }
  cntrlIcon.classList.toggle("fa-play", song.paused);
  cntrlIcon.classList.toggle("fa-pause", !song.paused);

  song.paused ? await song.play() : song.pause();
}
document.addEventListener("click", () => {
  // Set the flag to indicate user interaction
  isUserInteracted = true;
  // You can also add more logic here if needed
});

if (song.play()) {
  setInterval(() => {
    progress.value = song.currentTime;
  }, 500);
}

progress.onchange = () => {
  // Check if the song is defined before attempting to play
  if (song) {
    song.play();
    song.currentTime = progress.value;
  }
};

async function fetchData() {
    const url =
      "https://shazam.p.rapidapi.com/shazam-events/list?artistId=73406786&l=en-US&from=2022-12-31&limit=50&offset=0";
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "bd90ec153dmshd196f5d1c845421p119d6ejsn9eb1ab3e84f2",
        "X-RapidAPI-Host": "shazam.p.rapidapi.com",
      },
    };
  
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Check if data.events is defined before accessing its elements
      if (data.events && data.events.length > 0) {
        const firstEvent = data.events[0];
        const imageURL = firstEvent.metadata.song.images.default;
        const songURL = firstEvent.metadata.song.url;
        const title = firstEvent.metadata.song.title;
        const artist = firstEvent.metadata.song.subtitle;
  
        const songImage = document.querySelector(".song-img");
        songImage.src = imageURL;
  
        const songAudio = document.getElementById("song");
        songAudio.src = songURL;
  
        const songTitle = document.getElementById("songTitle");
        songTitle.innerText = title;
  
        const artistElement = document.getElementById("artist");
        artistElement.innerText = artist;
      } else {
        throw new Error("No events found");
      }
    } catch (error) {
      console.error(error);
    }
  }
  