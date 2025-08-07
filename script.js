// tableau ou on mes les film
let films = [];

// la cle api pour OMDB
let cleApi = "d84e7330";

// on prend les truc du html
let filmInput = document.getElementById("filmInput");
let filmList = document.getElementById("filmList");
let addBtn = document.getElementById("addBtn");
let clearBtn = document.getElementById("clearBtn");
let searchInput = document.getElementById("searchInput");

// bouton pour OMDB
let omdbBtn = document.createElement("button");
omdbBtn.textContent = "Rechercher sur OMDB";
omdbBtn.id = "omdbBtn";
searchInput.insertAdjacentElement("afterend", omdbBtn); // bouton juste après le champ de recherche

// zone pour aficher les info du film
let omdbResult = document.createElement("div");
omdbResult.id = "omdbResult";
document.querySelector(".container").appendChild(omdbResult);

// compteur de film
let compteur = document.createElement("p");
compteur.id = "compteur";
document.querySelector(".container").appendChild(compteur);

// quand on clique sur ajouter
function ajouterFilm() {
  let titre = filmInput.value.trim();
  if (titre === "") return;

  films.push(titre);
  filmInput.value = "";
  afficherFilms();
}

// pour afficher les films filtrés
function afficherFilms(filtre = "") {
  filmList.innerHTML = "";

  let filmsFiltres = films.filter((film) =>
    film.toLowerCase().includes(filtre.toLowerCase())
  );

  for (let i = 0; i < filmsFiltres.length; i++) {
    let film = filmsFiltres[i];

    let li = document.createElement("li");
    li.textContent = film;

    let btnSupprimer = document.createElement("button");
    btnSupprimer.textContent = "Supprimer";
    btnSupprimer.className = "supprimer";
    btnSupprimer.onclick = function () {
      let index = films.indexOf(film);
      if (index !== -1) {
        films.splice(index, 1);
        afficherFilms(searchInput.value); // on garde le filtre actif
      }
    };

    li.appendChild(btnSupprimer);
    filmList.appendChild(li);
  }

  compteur.textContent = "Nombre de film : " + films.length;
}

// pour vider tout
function viderListe() {
  films = [];
  afficherFilms();
}

// pour chercher sur OMDB avec le champ de recherche
function rechercherOMDB() {
  let titre = searchInput.value.trim();

  if (titre === "") {
    omdbResult.innerHTML = "<p>Faut écrire un titre</p>";
    return;
  }

  let url = "https://www.omdbapi.com/?t=" + encodeURIComponent(titre) + "&apikey=" + cleApi;

  fetch(url)
    .then((reponse) => reponse.json())
    .then((data) => {
      if (data.Response === "True") {
        omdbResult.innerHTML = `
          <h3>${data.Title} (${data.Year})</h3>
          <p><strong>Genre :</strong> ${data.Genre}</p>
          <img src="${data.Poster}" alt="Affiche du film" style="max-width:200px;">
        `;
      } else {
        omdbResult.innerHTML = "<p>Film pas trouvé </p>";
      }
    })
    .catch((erreur) => {
      omdbResult.innerHTML = "<p>Erreur dans la recherche </p>";
      console.log(erreur);
    });
}

// les bouton qui font les truc
addBtn.addEventListener("click", ajouterFilm);
clearBtn.addEventListener("click", viderListe);
omdbBtn.addEventListener("click", rechercherOMDB); // bouton OMDB actif

// filtre les films ajoutés quand on tape
searchInput.addEventListener("input", function () {
  afficherFilms(searchInput.value);
});

// lance la recherche OMDB quand on appuie sur Entrée
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    rechercherOMDB();
  }
});
