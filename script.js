const apiKey = "44d1c077bd83e6a6818db464e5aaf872";
    let currentCategory = "popular";
    let currentPage = 1;

    function setCategory(category) {
      currentCategory = category;
      currentPage = 1;
      fetchMovies(category, true);
    }

    async function fetchMovies(category, reset = false) {
      let url = "";
      if (["popular", "top_rated", "upcoming", "now_playing"].includes(category)) {
        url = `https://api.themoviedb.org/3/movie/${category}?api_key=${apiKey}&language=en-US&page=${currentPage}`;
      } else {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${category}&page=${currentPage}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      displayMovies(data.results, reset);
    }

    function displayMovies(movies, reset = false) {
      const container = document.getElementById("movies");
      if (reset) container.innerHTML = "";
      container.innerHTML += movies.map(movie => `
        <div class="movie-card" onclick="showDetails('${movie.id}')">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
          <h3>${movie.title}</h3>
        </div>
      `).join("");
    }

    async function showDetails(movieId) {
      const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;
      const res = await fetch(url);
      const movie = await res.json();

      const modalContent = document.getElementById("modalContent");
      modalContent.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <h2>${movie.title}</h2>
        <p><strong>Release Date:</strong> ${movie.release_date}</p>
        <p><strong>Rating:</strong> ⭐ ${movie.vote_average}/10</p>
        <p>${movie.overview}</p>
      `;

      document.getElementById("movieModal").style.display = "flex";
    }

    function closeModal() {
      document.getElementById("movieModal").style.display = "none";
    }

    async function searchMovies() {
      const query = document.getElementById("searchInput").value;
      if (!query) return;
      currentCategory = "search";
      currentPage = 1;

      const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=${currentPage}`;
      const res = await fetch(url);
      const data = await res.json();
      displayMovies(data.results, true);
    }

    function loadMore() {
      currentPage++;
      if (currentCategory === "search") {
        searchMovies();
      } else {
        fetchMovies(currentCategory);
      }
    }

    // Load popular movies by default
    fetchMovies("popular");