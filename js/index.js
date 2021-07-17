d3.json("data/imdb-1000-positioned.json").then((movies) => {
  const dispatch = d3.dispatch("highlight");

  const vis = new Beeswarm({
    el: document.querySelector("#chart-container"),
    data: movies,
    onSelect: ({ id }) => {
      dispatch.call("highlight", null, { id, category: "person" });
    },
  });

  const { movieMap, personMap, options } = processData(movies);

  const search = new AutoComplete({
    el: document.querySelector("#movie-person-search"),
    options,
    onSelect: ({ id, category }) => {
      dispatch.call("highlight", null, { id, category });
    },
  });

  dispatch.on("highlight", ({ id, category }) => {
    const people = [];
    const movies = [];
    if (category === "movie") {
      movies.push(movieMap.get(id));
    } else if (category === "person") {
      const person = personMap.get(id);
      people.push(person);
      person.movies.forEach((movieId) => {
        movies.push(movieMap.get(movieId));
      });
    }
    const highlight = {
      people,
      movies,
    };

    vis.highlight(highlight);
    search.highlight(highlight);
  });
});
