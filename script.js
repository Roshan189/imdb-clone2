const input = document.querySelector(".search input");
const btn = document.querySelector(".search button");
const main_grid_title = document.querySelector(".favourites h1");
const main_grid = document.querySelector(".favourites .movies-grid");
// const apiBaseUrl = "https://api.themoviedb.org/3";
const apiKey = "6a99993790f9a37bf25e7a5fe5f74147";
const imageBaseUrl = "https://image.tmdb.org/t/p/w300";
const popup_container = document.querySelector(".popup-container");
const trending = document.querySelector(".trending .movies-grid");

function addClickEffectToCard(cards) {
  cards.forEach((card) => {
    card.addEventListener("click", () => showPopup(card));
  });
}

//search movies
async function getMovieBySearch(query) {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`
  );

  const data = await res.json();
  const movies = data.results;
  // console.log(movies);
  return movies;
}

btn.addEventListener("click", add_movie_to_dom);

// getMovieBySearch("action");

async function add_movie_to_dom() {
  const data = await getMovieBySearch(input.value);
  // console.log(data);

  main_grid_title.innerText = `Search Results...`;
  main_grid.innerHTML = data
    .map((e) => {
      // console.log(e.title);
      return `
    <div class="card" data-id="${e.id}">
    <div class="img">
      <img src="${imageBaseUrl + e.poster_path}" alt="">
    </div>
    <div class="info">
      <h2>${e.title}</h2>
      <div class="single-info">
        <span>Rate:</span>
        <span>${e.vote_average}
        /10</span>
      </div>
      <div class="single-info">
        <span>Release Time:</span>
        <span>${e.release_date}</span>
      </div>
    </div>
  </div>
  `;
    })
    .join("");

  //when we click in the movie card we want to show a popup with the movie info
  const cards = document.querySelectorAll(".card");
  addClickEffectToCard(cards);
}

//popup
async function getMovieById(id) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
  );

  const data = await res.json();
  // console.log(data);
  // const movies = data.results;
  return data;
}

// getMovieById(33300);

async function getMovieByTrailer(id) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`
  );

  const data = await res.json();
  const movies = data.results[0].key;
  // console.log(movies);
  return movies;
}
// getMovieByTrailer(414906);

async function showPopup(card) {
  // console.log("showup", card);
  popup_container.classList.add("show-popup");
  const movie_id = card.getAttribute("data-id");
  // console.log(movie_id);
  const movie = await getMovieById(movie_id);
  const movieTrailer = await getMovieByTrailer(movie_id);
  // console.log(imageBaseUrl + movie.poster_path);

  console.log(movie);

  popup_container.style.background = `linear-gradient(rgba(0, 0, 0, .8), rgba(0, 0, 0, 0.1)), url(${
    imageBaseUrl + movie.poster_path
  })`;

  popup_container.innerHTML = `
    <span class="x-icon">&#10006;</span>
    <div class="content">
      <div class="left">
        <div class="poster-img">
          <img src="${imageBaseUrl + movie.poster_path}">
        </div>
        <div class="single-info">
          <span>Add to Favourites:</span>
          <span class="heart-icon">&#9829;</span>
        </div>
      </div>

      <div class="right">
        <h1>${movie.title}</h1>
        <h3>${movie.tagline}</h3>
        <div class="single-info-conatainer">
          <div class="single-info">
            <span>Language:</span>
            <span>${movie.spoken_languages[0].name}</span>
          </div>
          <div class="single-info">
            <span>Length:</span>
            <span>${movie.runtime} minutes</span>
          </div>
          <div class="single-info">
            <span>Rate:</span>
            <span>${movie.vote_average} /10</span>
          </div>
          <div class="single-info">
            <span>Budget</span>
            <span>${movie.budget}$</span>
          </div>
          <div class="single-info">
            <span>Release Date</span>
            <span>${movie.release_date}</span>
          </div>
        </div>

        <div class="genres">
          <h2>Genres</h2>
          <ul>
            <li>${movie.genres[0].name}</li>
            <li>${movie.genres[1].name}</li>
            <li>${movie.genres[2].name}</li>
          </ul>
        </div>

        <div class="overview">
          <h2>Overview</h2>
          <p>${movie.overview}</p>
        </div>

        <div class="trailer">
          <h2>Trailer</h2>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/${movieTrailer}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
      </div>
    </div>
  `;

  //added functionality to x-icon
  const x_icon = document.querySelector(".x-icon");
  x_icon.addEventListener("click", () =>
    popup_container.classList.remove("show-popup")
  );

  //added functionality to ❤️ icon
  const heart_icon = document.querySelector(".heart-icon");

  const movie_ids = get_LS();
  for (let i = 0; i <= movie_ids.length; i++) {
    if (movie_ids[i] == movie_id) heart_icon.classList.add("change-color");
  }

  heart_icon.addEventListener("click", () => {
    //now check if heart-icon has change color class. if yes remove it,if not add it
    //but first create it in css
    // console.log("Heart icon clicked");
    if (heart_icon.classList.contains("change-color")) {
      removeToLS(movie_id);
      heart_icon.classList.remove("change-color");
    } else {
      addToLS(movie_id);
      heart_icon.classList.add("change-color");
    }

    fetch_favourite_movies();
  });
}

//LocalStorage
function get_LS() {
  const movie_ids = JSON.parse(localStorage.getItem("movie-id"));
  //that means if there is n ids just return empty array else return movie ids
  return movie_ids === null ? [] : movie_ids;
}

function addToLS(id) {
  const movie_ids = get_LS();
  localStorage.setItem("movie-id", JSON.stringify([...movie_ids, id]));
}

// addToLS(33000);

function removeToLS(id) {
  const movie_ids = get_LS();
  localStorage.setItem(
    "movie-id",
    JSON.stringify(movie_ids.filter((e) => e !== id))
  );
}

//lets create a function that fetches the LS everytime we add a movie to favourites or remove from it
//we want to call this fn immediately when we get to website
//and everytime we make changes to heart-icon. Remove or add it
fetch_favourite_movies();
async function fetch_favourite_movies() {
  main_grid.innerHTML = "";
  const movies_LS = await get_LS();
  const movies = [];

  for (let i = 0; i < movies_LS.length; i++) {
    const movie_id = movies_LS[i];
    let movie = await getMovieById(movie_id);
    add_favourites_to_dom_from_LS(movie);
    movies.push(movie);
  }
}

function add_favourites_to_dom_from_LS(movie_data) {
  main_grid.innerHTML += `
  <div class="card" data-id="${movie_data.id}">
    <div class="img">
      <img src="${imageBaseUrl + movie_data.poster_path}" alt="">
    </div>
    <div class="info">
      <h2>${movie_data.title}</h2>
      <div class="single-info">
        <span>Rate:</span>
        <span>${movie_data.vote_average}
        /10</span>
      </div>
      <div class="single-info">
        <span>Release Time:</span>
        <span>${movie_data.release_date}</span>
      </div>
    </div>
  </div>
  `;
  const cards = document.querySelectorAll(".card");
  addClickEffectToCard(cards);
}

getTrendingMovies();
async function getTrendingMovies() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`
  );

  const data = await res.json();
  const movies = data.results;
  // console.log("data", data);
  return movies;
}

add_trending_movie_to_Dom();
async function add_trending_movie_to_Dom() {
  const data = await getTrendingMovies();
  console.log(data);

  //this will give us only 5 results of trending movies
  trending.innerHTML = data
    .slice(0, 20)
    .map((e) => {
      // console.log(e);
      return `
    <div class="card" data-id="${e.id}">
    <div class="img">
      <img src="${imageBaseUrl + e.poster_path}" alt="">
    </div>
    <div class="info">
      <h2>${e.title}</h2>
      <div class="single-info">
        <span>Rate:</span>
        <span>${e.vote_average}
        /10</span>
      </div>
      <div class="single-info">
        <span>Release Time:</span>
        <span>${e.release_date}</span>
      </div>
    </div>
  </div>
  `;
    })
    .join("");
}
