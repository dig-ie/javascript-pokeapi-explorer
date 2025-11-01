const pokemonList = document.getElementById("pokemonsList");
const btnLoadMore = document.getElementById("btnLoadMore");
const searchInput = document.getElementById("searchInput");
const body = document.body;

let offsetV = 0;
let limitV = 5;
let isSearching = false;
let searchTimeout = null;

function listTypes(pokemon) {
  const liPokemons = pokemon.types
    .map((type) => {
      return `<li class="${type}"> 
                  ${type}
    </li>  `;
    })
    .join("");
  return liPokemons;
}

function convertPokemonsToLi(pokemon) {
  return ` <li class="pokemon${pokemon.type}">    
          <div class="pokemonCardImgConteiner">
              <img class="pokemonCardImg" id="${pokemon.name}Img" src=${
    pokemon.photo
  } alt="">            
          </div>
          <div class="pokemonDetails">
            <span class="pokemonCardName">${pokemon.name}</span>
            <ol class="types">
              ${listTypes(pokemon)}
            </ol>
          </div>
          <div class="overlay"></div>
          </li>
        `;
}

function loadMore(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonsToLi).join("");
    pokemonList.innerHTML += newHtml;
    offsetV += 5;
  });
}

function searchPokemon(searchTerm) {
  if (!searchTerm || searchTerm.trim() === "") {
    // Se o campo estiver vazio, recarrega a lista normal
    offsetV = 0;
    pokemonList.innerHTML = "";
    isSearching = false;
    loadMore(offsetV, limitV);
    btnLoadMore.style.display = "block";
    return;
  }

  isSearching = true;
  btnLoadMore.style.display = "none";
  pokemonList.innerHTML =
    '<li style="text-align: center; padding: 20px;">Buscando...</li>';

  // Usa busca parcial para resultados flexíveis
  pokeApi
    .searchPokemonsByPartialName(searchTerm.trim())
    .then((pokemons = []) => {
      if (pokemons.length === 0) {
        pokemonList.innerHTML =
          '<li style="text-align: center; padding: 20px; color: red;">Nenhum Pokemon encontrado! Tente novamente.</li>';
      } else {
        const newHtml = pokemons.map(convertPokemonsToLi).join("");
        pokemonList.innerHTML = newHtml;
      }
    });
}

// Carregar pokemons iniciais
loadMore(offsetV, limitV);

// Event listener para o botão "Carregar mais"
btnLoadMore.addEventListener("click", () => {
  if (!isSearching) {
    loadMore(offsetV, limitV);
  }
});

// Event listener para pesquisa em tempo real com debounce
searchInput.addEventListener("input", () => {
  // Limpa o timeout anterior se existir
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  const searchTerm = searchInput.value.trim();

  // Se o campo estiver vazio, restaura a lista normal imediatamente
  if (searchTerm === "") {
    searchPokemon("");
    return;
  }

  // Aguarda 300ms após o usuário parar de digitar antes de fazer a busca
  searchTimeout = setTimeout(() => {
    searchPokemon(searchTerm);
  }, 300);
});
