const apiKey = "AIzaSyCufdhPZwUUCvNDqynXNOJNlhcKxXa_M1I"; // 🔐 Replace with your API Key
let nextPageToken = "";
let loadedVideoIds = new Set();
let query = "cow education";

const videoGrid = document.getElementById("videoGrid");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("videoModal");
const floatingVideo = document.getElementById("floatingVideo");
const closeModal = document.getElementById("closeModal");

// Create Load More button
const loadMoreBtn = document.createElement("button");
loadMoreBtn.innerText = "Load More Videos";
loadMoreBtn.className = "load-more-btn";
loadMoreBtn.style.display = "none";
loadMoreBtn.addEventListener("click", () => {
  fetchVideos(true);
});
document.body.appendChild(loadMoreBtn);

async function fetchVideos(loadMore = false) {
  const searchTerm = searchInput.value.trim() || query;
  const url = new URL("https://www.googleapis.com/youtube/v3/search");
url.search = new URLSearchParams({
  key: apiKey,
  q: `${searchTerm} cow conservation -cartoon -kids -funny`,  // 👈 Refined search
  part: "snippet",
  maxResults: 12,
  type: "video",
  videoCategoryId: "27", // 👈 Category: Education
  pageToken: loadMore ? nextPageToken : "",
  safeSearch: "strict"
});


  try {
    const res = await fetch(url.toString());
    const data = await res.json();
    nextPageToken = data.nextPageToken;

    let newVideos = 0;
    data.items.forEach((item) => {
      const videoId = item.id.videoId;
      if (loadedVideoIds.has(videoId)) return;

      loadedVideoIds.add(videoId);
      const title = item.snippet.title;
      addVideoCard(videoId, title);
      newVideos++;
    });

    // Show or hide "Load More" button
    loadMoreBtn.style.display = nextPageToken && newVideos > 0 ? "block" : "none";
  } catch (error) {
    console.error("Failed to fetch videos:", error);
  }
}

function addVideoCard(videoId, title) {
  const card = document.createElement("div");
  card.className = "video-card";
  card.innerHTML = `
    <iframe src="https://www.youtube.com/embed/${videoId}?controls=0&mute=1" allowfullscreen></iframe>
    <div class="video-title">${title}</div>
  `;
  card.addEventListener("click", () => openVideo(videoId));
  videoGrid.appendChild(card);
}

function openVideo(videoId) {
    modal.classList.add("show");
    modal.style.display = "flex";
    setTimeout(() => {
      modal.classList.add("show");
    }, 10); // Allow transition to trigger
    floatingVideo.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`;
    }

closeModal.addEventListener("click", () => {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
      floatingVideo.src = "";
    }, 300);
    
});

searchInput.addEventListener("input", () => {
  videoGrid.innerHTML = "";
  loadedVideoIds.clear();
  nextPageToken = "";
  fetchVideos();
});

// Initial load
fetchVideos();

