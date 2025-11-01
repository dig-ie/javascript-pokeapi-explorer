# 🔍 Pokédex com PokeAPI

Uma Pokédex interativa que consome dados da **PokeAPI**, exibindo informações de diversos Pokémon em tempo real com sistema de busca flexível e otimizado.

🔗 **Deploy:**  
[https://diegodebarros.github.io/js-my-pokedex/](https://dig-ie.github.io/javascript-pokeapi-explorer/)

## Pesquisa na poke api implementada:
<img width="219" height="184" alt="image" src="https://github.com/user-attachments/assets/d3ae5c56-20d2-49d9-8c04-c48bcf92f2db" />




## ![Preview da Pokédex](image.png)

## ⚙️ Funcionalidades

### Funcionalidades Principais

- **Listagem Paginada de Pokémon**: Carregamento progressivo de Pokémon com botão "Carregar +"
- **Busca Flexível em Tempo Real**: Sistema de pesquisa que encontra Pokémon por correspondência parcial do nome
- **Cache Inteligente**: Sistema de cache para otimizar requisições à API
- **Debounce**: Redução de requisições desnecessárias durante a digitação
- **Interface Responsiva**: Design adaptável com Bootstrap e CSS customizado

### Detalhes Técnicos das Funcionalidades

#### 1. Sistema de Busca Flexível

A busca funciona através de **correspondência parcial** (partial matching) do nome do Pokémon:

- Case-insensitive (não diferencia maiúsculas/minúsculas)
- Busca substrings (ex: "bulba" encontra "bulbasaur")
- Limite de 20 resultados por busca para otimização
- Restauração automática da lista completa quando o campo é limpo

**EXEMPLOS de uso:**

- Digite `"pika"` → encontra `"pikachu"`
- Digite `"char"` → encontra `"charmander"`, `"charmeleon"`, `"charizard"`
- Digite `"bulba"` → encontra `"bulbasaur"` 

#### 2. Sistema de Cache

Implementação de cache em memória para melhorar performance:

```javascript
// Cache global armazenado após primeira busca
let allPokemonsCache = null;

pokeApi.getAllPokemonsList = () => {
  if (allPokemonsCache) {
    return Promise.resolve(allPokemonsCache);
  }
  // Busca inicial e armazenamento em cache
};
```

**Benefícios:**

- Reduz requisições desnecessárias à API
- Melhora significativamente a velocidade das buscas subsequentes
- Cache persiste durante a sessão do usuário

#### 3. Debounce Implementation

Sistema de debounce com delay de 300ms para otimizar requisições:

```javascript
searchTimeout = setTimeout(() => {
  searchPokemon(searchTerm);
}, 300);
```

**Como funciona:**

- Aguarda 300ms após o usuário parar de digitar
- Cancela requisições pendentes se o usuário continuar digitando
- Se o campo for limpo, restaura a lista imediatamente (sem delay)

---

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilização customizada com classes Bootstrap
- **JavaScript (ES6+)**:
  - Async/Await patterns com Promises
  - Fetch API para requisições HTTP
  - Manipulação de DOM nativa
  - Event Listeners
- **Bootstrap 5**: Framework CSS para componentes UI
- **PokeAPI**: API REST pública para dados de Pokémon
- **Normalize.css**: Reset de estilos cross-browser

---

## 📁 Estrutura do Projeto

```
javascript-pokeapi-explorer/
│
├── assets/
│   ├── global.css          # Estilos globais
│   ├── pokedex.css          # Estilos específicos da Pokédex
│   └── imgs/
│       └── pokeball-icon.jpg
│
├── source/
│   ├── pokemon-model.js     # Classe modelo Pokemon
│   ├── poke-api.js          # Lógica de comunicação com API
│   └── main.js              # Lógica principal e manipulação de DOM
│
├── index.html               # Arquivo principal HTML
├── image.png               # Preview do projeto
└── README.md               # Documentação
```

---

## 🏗️ Arquitetura e Componentes

### 1. Modelo de Dados (`pokemon-model.js`)

Classe `Pokemon` que representa a estrutura de dados:

```javascript
class Pokemon {
  name; // Nome do Pokémon
  number; // Número/ID na Pokédex
  types; // Array de tipos (ex: ["fire", "flying"])
  type; // Tipo principal (primeiro tipo)
  photo; // URL da imagem do Pokémon
}
```

### 2. Camada de API (`poke-api.js`)

Módulo `pokeApi` com as seguintes funções:

#### `convertToPokemonModel(pokemonDetailed)`

- **Função**: Converte objeto da API para modelo simplificado
- **Parâmetros**: `pokemonDetailed` (objeto retornado pela PokeAPI)
- **Retorno**: Instância da classe `Pokemon`

#### `getPokemonDetails(pokemon)`

- **Função**: Busca detalhes completos de um Pokémon
- **Parâmetros**: `pokemon` (objeto com propriedade `url`)
- **Retorno**: Promise que resolve em um objeto `Pokemon`

#### `getPokemons(offset, limit)`

- **Função**: Busca lista paginada de Pokémon
- **Parâmetros**:
  - `offset`: Número de Pokémon para pular
  - `limit`: Quantidade de Pokémon para retornar
- **Retorno**: Promise que resolve em array de `Pokemon`
- **Uso**: Carregamento incremental da lista

#### `getPokemonByNameOrId(nameOrId)`

- **Função**: Busca exata de um Pokémon por nome ou ID
- **Parâmetros**: `nameOrId` (string ou número)
- **Retorno**: Promise que resolve em array com um único `Pokemon`
- **Observação**: Retorna array vazio se não encontrar

#### `getAllPokemonsList()`

- **Função**: Busca lista completa de todos os Pokémon (com cache)
- **Parâmetros**: Nenhum
- **Retorno**: Promise que resolve em array de objetos básicos (com `name` e `url`)
- **Otimização**: Implementa cache para evitar requisições repetidas

#### `searchPokemonsByPartialName(searchTerm)`

- **Função**: Busca flexível por correspondência parcial do nome
- **Parâmetros**: `searchTerm` (string para buscar)
- **Retorno**: Promise que resolve em array de `Pokemon` (máximo 20)
- **Fluxo**:
  1. Busca lista completa (usa cache se disponível)
  2. Filtra Pokémon cujo nome contém o termo pesquisado
  3. Limita a 20 resultados
  4. Busca detalhes completos apenas dos Pokémon filtrados

### 3. Lógica Principal (`main.js`)

#### Variáveis de Estado

```javascript
let offsetV = 0; // Offset atual para paginação
let limitV = 5; // Limite de itens por página
let isSearching = false; // Flag indicando se está em modo busca
let searchTimeout = null; // Timeout do debounce
```

#### Funções Principais

**`listTypes(pokemon)`**

- Gera HTML dos tipos do Pokémon
- Retorna string HTML com `<li>` elementos

**`convertPokemonsToLi(pokemon)`**

- Converte objeto `Pokemon` para elemento HTML `<li>`
- Inclui imagem, nome e tipos
- Retorna template string HTML

**`loadMore(offset, limit)`**

- Carrega mais Pokémon na lista
- Atualiza `offsetV` incrementando em 5
- Adiciona novos itens ao DOM (não substitui)

**`searchPokemon(searchTerm)`**

- Gerencia o estado da busca
- Restaura lista completa se `searchTerm` estiver vazio
- Exibe feedback visual durante a busca
- Oculte/mostra botão "Carregar +" conforme necessário

#### Event Listeners

1. **`btnLoadMore.addEventListener('click')`**

   - Carrega mais Pokémon quando não estiver em modo busca

2. **`searchInput.addEventListener('input')`**
   - Pesquisa em tempo real com debounce
   - Restaura lista se campo estiver vazio
   - Delay de 300ms após parar de digitar

---

## 🔄 Fluxo de Funcionamento

### Fluxo de Carregamento Inicial

1. Página carrega → `loadMore(0, 5)` é chamado
2. `pokeApi.getPokemons(0, 5)` busca 5 Pokémon da API
3. Para cada Pokémon, busca detalhes completos
4. Converte para modelo `Pokemon`
5. Renderiza no DOM usando `convertPokemonsToLi()`

### Fluxo de Busca

1. Usuário digita no campo de busca
2. Debounce aguarda 300ms após parar de digitar
3. `searchPokemon()` é chamado com o termo
4. Se campo vazio → restaura lista completa
5. Se há termo:
   - `pokeApi.searchPokemonsByPartialName()` é chamado
   - Verifica cache de lista completa
   - Se cache vazio → busca lista completa da API
   - Filtra Pokémon por correspondência parcial
   - Busca detalhes apenas dos filtrados
   - Renderiza resultados

### Fluxo de Cache

1. Primeira busca → `getAllPokemonsList()` busca lista completa
2. Lista é armazenada em `allPokemonsCache`
3. Buscas subsequentes usam cache diretamente
4. Não há requisições adicionais à API para lista completa

---

## 🚀 Como Executar Localmente

### Pré-requisitos

- Navegador moderno com suporte a ES6+
- Servidor local (recomendado) ou abrir diretamente no navegador

### Opção 1: Servidor Local (Recomendado)

1. Clone o repositório:

```bash
git clone https://github.com/diegodebarros/js-my-pokedex.git
```

2. Acesse a pasta do projeto:

```bash
cd js-my-pokedex
```

3. Inicie um servidor HTTP local:

**Com Python:**

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Com Node.js (http-server):**

```bash
npx http-server -p 8000
```

**Com PHP:**

```bash
php -S localhost:8000
```

4. Acesse no navegador: `http://localhost:8000`

### Opção 2: Abrir Diretamente

1. Clone o repositório (mesmos passos acima)
2. Abra o arquivo `index.html` diretamente no navegador
   - ⚠️ **Nota**: Alguns navegadores podem bloquear requisições CORS ao abrir arquivo diretamente

---

## 📊 Endpoints da PokeAPI Utilizados

### Base URL

```
https://pokeapi.co/api/v2/
```

### Endpoints Específicos

1. **Lista de Pokémon (paginada)**

   ```
   GET /pokemon/?offset={offset}&limit={limit}
   ```

   - Usado para carregamento inicial e paginação
   - Retorna array de objetos com `name` e `url`

2. **Lista Completa de Pokémon**

   ```
   GET /pokemon?limit=2000
   ```

   - Usado para busca flexível
   - Retorna todos os Pokémon disponíveis (até 2000)

3. **Detalhes de um Pokémon**

   ```
   GET /pokemon/{id or name}
   ```

   - Usado para obter informações completas
   - Aceita ID numérico ou nome do Pokémon

4. **Detalhes via URL**
   ```
   GET {pokemon.url}
   ```
   - Cada Pokémon na lista tem uma propriedade `url`
   - Usado para buscar detalhes individuais

---

## 🎯 Otimizações Implementadas

### 1. Cache de Lista Completa

- Lista completa é buscada apenas uma vez
- Armazenada em memória para acesso rápido
- Reduz carga na API

### 2. Debounce na Busca

- Reduz requisições durante digitação
- Delay de 300ms otimiza UX e performance
- Cancela requisições obsoletas

### 3. Limitação de Resultados

- Máximo de 20 resultados por busca
- Reduz carga de renderização
- Melhora performance visual

### 4. Lazy Loading de Detalhes

- Detalhes completos são buscados apenas dos Pokémon filtrados
- Não busca dados desnecessários
- Reduz tráfego de rede

### 5. Carregamento Incremental

- Lista inicial pequena (5 itens)
- Carregamento sob demanda via botão
- Reduz tempo de carregamento inicial

---

## 🐛 Tratamento de Erros

### Erros Tratados

1. **Pokémon não encontrado na busca**

   - Exibe mensagem amigável ao usuário
   - Não quebra o fluxo da aplicação

2. **Erro de rede/API**

   - Catch em todas as promises
   - Log de erro no console para debug
   - Retorna array vazio para não quebrar renderização

3. **Validação de entrada**
   - Trim de espaços em branco
   - Case-insensitive para melhor UX
   - Validação de campo vazio

---

## 📚 Aprendizados Técnicos

### Conceitos Aplicados

- **Async/Await e Promises**: Manipulação assíncrona de dados
- **Fetch API**: Requisições HTTP modernas
- **DOM Manipulation**: Criação dinâmica de elementos
- **Event Handling**: Gerenciamento de eventos do usuário
- **Debounce Pattern**: Otimização de performance
- **Cache Strategy**: Armazenamento em memória
- **Template Strings**: Geração dinâmica de HTML
- **Array Methods**: `map()`, `filter()`, `slice()`, `join()`
- **Error Handling**: Try/catch e tratamento de promises rejeitadas

### Boas Práticas Implementadas

- ✅ Separação de responsabilidades (Model, API, View)
- ✅ Código modular e reutilizável
- ✅ Nomenclatura descritiva de variáveis e funções
- ✅ Comentários explicativos no código
- ✅ Tratamento de erros consistente
- ✅ Otimização de requisições HTTP
- ✅ Feedback visual ao usuário

---

## 🎯 Melhorias Futuras

- [ ] Modal com detalhes estendidos do Pokémon (stats, habilidades, etc.)
- [ ] Filtros por tipo de Pokémon
- [ ] Ordenação (nome, ID, tipo)
- [ ] Favoritos/LocalStorage
- [ ] Dark mode 🌙
- [ ] Animações de transição
- [ ] PWA (Progressive Web App)
- [ ] Testes unitários
- [ ] Internacionalização (i18n)
- [ ] Gráficos de estatísticas do Pokémon

---

## 📄 Licença

Este projeto é de código aberto e está disponível para fins educacionais.

---

## 👾 Sobre o Projeto

Projeto desenvolvido como prática de front-end vanilla (HTML5, CSS3, JavaScript ES6+) com foco em:

- Consumo de API REST pública
- Manipulação assíncrona de dados
- Otimizações de performance
- Experiência do usuário (UX)
- Código limpo e manutenível

---

**Desenvolvido com ❤️ usando JavaScript puro e a [PokeAPI](https://pokeapi.co/)**
