const allBreedsData = [
    { id: 1, name: "Gir" },
    { id: 2, name: "Sahiwal" },
    { id: 3, name: "Tharparkar" },
    { id: 4, name: "Red Sindhi" },
    { id: 5, name: "Ongole" },
    { id: 6, name: "Kangayam" },
    //{ id: 7, name: "Hallikar" },
    //{ id: 8, name: "Amritmahal" },
    { id: 7, name: "Vechur" },
    //{ id: 10, name: "Malvi" }
    { id: 8, name: "kankrej" },
    { id: 9, name: "hariana" },
    // { id: 10, name: "thaparkar" },
    { id: 11, name: "ponwar" },
    { id: 12, name: "punganur" },
    { id: 13, name: "rathi" },
    { id: 14, name: "gaolao" },
    { id: 15, name: "dangi" },
    { id: 16, name: "kenkatha" },
    { id: 17, name: "deoni" },
    { id: 18, name: "nimari" },
    { id: 19, name: "bargur" },
    { id: 20, name: "khillari" },
    
  ];
  
  const breedsPerLoad = 20;
  let loadedIndex = 0;
  let displayedBreeds = [];
  
  const breedGrid = document.getElementById('breed-grid');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const searchInput = document.getElementById('search-input');
  const modal = document.getElementById('breed-modal');
  const modalBody = document.getElementById('modal-body');
  
  // Get data from Wikipedia
  async function fetchBreedInfo(breedName) {
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(breedName + ' cattle')}`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('No data');
      const data = await response.json();
      return {
        description: data.extract || "No description available.",
        image: data.thumbnail ? data.thumbnail.source : "https://upload.wikimedia.org/wikipedia/commons/2/28/Cow_female_black_white.jpg"
      };
    } catch {
      return {
        description: "No info available.",
        image: "https://upload.wikimedia.org/wikipedia/commons/2/28/Cow_female_black_white.jpg"
      };
    }
  }
  
  // Render cards
  async function displayBreeds(breeds) {
    breedGrid.innerHTML = '';
  
    for (const breed of breeds) {
      const info = await fetchBreedInfo(breed.name);
  
      const card = document.createElement('div');
      card.classList.add('breed-card');
      card.innerHTML = `
        <img src="${info.image}" alt="${breed.name}" />
        <h3>${breed.name}</h3>
        <p>${info.description.substring(0, 100)}...</p>
        <button onclick="showBreedDetails(${breed.id})">Learn More</button>
      `;
      breedGrid.appendChild(card);
    }
  
    loadMoreBtn.style.display = loadedIndex < allBreedsData.length ? 'block' : 'none';
  }
  
  // Load more breeds (no duplicates)
  function loadMoreBreeds() {
    const nextBatch = allBreedsData.slice(loadedIndex, loadedIndex + breedsPerLoad);
    displayedBreeds = displayedBreeds.concat(nextBatch);
    loadedIndex += breedsPerLoad;
    displayBreeds(displayedBreeds);
  }
  
  // Search breeds
  function searchBreeds() {
    const term = searchInput.value.toLowerCase().trim();
    const filtered = allBreedsData.filter(b =>
      b.name.toLowerCase().includes(term)
    );
    displayedBreeds = [...filtered];
    loadedIndex = allBreedsData.length; // disable load more for search
    displayBreeds(displayedBreeds);
  }
  
  // Show modal
  async function showBreedDetails(id) {
    const breed = allBreedsData.find(b => b.id === id);
    if (!breed) return;
    const info = await fetchBreedInfo(breed.name);
  
    modalBody.innerHTML = `
      <h2>${breed.name}</h2>
      <img src="${info.image}" alt="${breed.name}" class="modal-image">
      <p>${info.description}</p>
      <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(breed.name + ' cattle')}" target="_blank">Read more</a>
    `;
    modal.style.display = 'flex';
  }
  
  function closeModal() {
    modal.style.display = 'none';
  }
  
  // Listeners
  searchInput.addEventListener('input', searchBreeds);
  loadMoreBtn.addEventListener('click', loadMoreBreeds);
  window.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
  
  // Initial load
  loadMoreBreeds();
  