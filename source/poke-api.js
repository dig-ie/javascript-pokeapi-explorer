const pokeApi = {};

//converting api object fields to simple model class pokemon fields
function convertToPokemonModel(pokemonDetailed) {
  const pokemon = new Pokemon();

  pokemon.name = pokemonDetailed.name;
  pokemon.number = pokemonDetailed.order;
  pokemon.photo = pokemonDetailed.sprites.other.dream_world.front_default;
  pokemon.types = pokemonDetailed.types.map((typeSlot) => typeSlot.type.name);
  pokemon.type = pokemonDetailed.types.map((typeSlot) => typeSlot.type.name)[0];
  return pokemon;
}

pokeApi.getPokemonDetails = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json())
    .then((responseJson) => convertToPokemonModel(responseJson));
};

pokeApi.getPokemons = (offset, limit) => {
  const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;

  return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetails))
    .then((detailRequests) => Promise.all(detailRequests))
    .then((pokemonsDetails) => {
      console.log(pokemonsDetails);
      return pokemonsDetails;
    });
};

pokeApi.getPokemonByNameOrId = (nameOrId) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${nameOrId.toLowerCase()}`;

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Pokemon não encontrado");
      }
      return response.json();
    })
    .then((pokemonDetailed) => {
      const pokemon = convertToPokemonModel(pokemonDetailed);
      return [pokemon]; // Retorna como array para manter consistência
    })
    .catch((error) => {
      console.error("Erro ao buscar pokemon:", error);
      return []; // Retorna array vazio em caso de erro
    });
};

// Cache para armazenar a lista de todos os pokemons
let allPokemonsCache = null;

pokeApi.getAllPokemonsList = () => {
  // Se já temos o cache, retorna ele
  if (allPokemonsCache) {
    return Promise.resolve(allPokemonsCache);
  }

  // Caso contrário, busca todos os pokemons
  const url = `https://pokeapi.co/api/v2/pokemon?limit=2000`;

  return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => {
      // Armazena no cache
      allPokemonsCache = jsonBody.results;
      return allPokemonsCache;
    })
    .catch((error) => {
      console.error("Erro ao buscar lista de pokemons:", error);
      return [];
    });
};

pokeApi.searchPokemonsByPartialName = (searchTerm) => {
  // Primeiro busca a lista de todos os pokemons (ou usa o cache)
  return pokeApi.getAllPokemonsList().then((allPokemons) => {
    if (!allPokemons || allPokemons.length === 0) {
      return [];
    }

    // Filtra pokemons que contenham o termo pesquisado no nome
    const searchTermLower = searchTerm.toLowerCase().trim();
    const filteredPokemons = allPokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTermLower)
    );

    // Limita a 20 resultados para não sobrecarregar
    const limitedResults = filteredPokemons.slice(0, 20);

    // Se não houver resultados, retorna array vazio
    if (limitedResults.length === 0) {
      return [];
    }

    // Busca os detalhes apenas dos pokemons filtrados
    return Promise.all(
      limitedResults.map((pokemon) => pokeApi.getPokemonDetails(pokemon))
    );
  });
};
