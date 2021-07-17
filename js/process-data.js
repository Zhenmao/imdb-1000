function processData(movies) {
  const movieMap = new Map(movies.map((d) => [d.id, d]));

  const personMap = new Map();
  movies.forEach((movie) => {
    movie.directors.forEach((director) => {
      let d = personMap.get(director.id);
      if (!d) {
        d = {
          id: director.id,
          name: director.name,
          movies: new Set(),
          roles: new Set(),
        };
        personMap.set(director.id, d);
      }
      d.movies.add(movie.id);
      d.roles.add("director");
    });
    movie.actors.forEach((actor) => {
      let d = personMap.get(actor.id);
      if (!d) {
        d = {
          id: actor.id,
          name: actor.name,
          movies: new Set(),
          roles: new Set(),
        };
        personMap.set(actor.id, d);
      }
      d.movies.add(movie.id);
      d.roles.add("actor");
    });
  });

  const options = [
    ...movies.map((movie) => ({
      value: movie.id,
      text: movie.title,
      category: "movie",
    })),
    ...Array.from(personMap.values(), (person) => ({
      value: person.id,
      text: person.name,
      category: "person",
    })),
  ];

  return {
    movieMap,
    personMap,
    options,
  };
}
