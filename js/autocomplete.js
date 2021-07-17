class AutoComplete {
  constructor({ el, options, onSelect }) {
    this.el = el;
    this.options = options;
    this.onSelect = onSelect;
    this.highlight = this.highlight.bind(this);
    this.init();
  }

  init() {
    d3.select(this.el)
      .append("svg")
      .style("display", "none")
      .append("defs")
      .selectAll("symbol")
      .data([
        {
          id: "movie",
          innerHTML:
            '<path fill="currentColor" d="M18,9H16V7H18M18,13H16V11H18M18,17H16V15H18M8,9H6V7H8M8,13H6V11H8M8,17H6V15H8M18,3V5H16V3H8V5H6V3H4V21H6V19H8V21H16V19H18V21H20V3H18Z" />',
        },
        {
          id: "person",
          innerHTML:
            '<path fill="currentColor" d="M16 17V19H2V17S2 13 9 13 16 17 16 17M12.5 7.5A3.5 3.5 0 1 0 9 11A3.5 3.5 0 0 0 12.5 7.5M15.94 13A5.32 5.32 0 0 1 18 17V19H22V17S22 13.37 15.94 13M15 4A3.39 3.39 0 0 0 13.07 4.59A5 5 0 0 1 13.07 10.41A3.39 3.39 0 0 0 15 11A3.5 3.5 0 0 0 15 4Z" />',
        },
      ])
      .join("symbol")
      .attr("id", (d) => d.id)
      .attr("viewBox", [0, 0, 24, 24])
      .html((d) => d.innerHTML);

    this.autoComplete = new autoComplete({
      selector: () => this.el,
      data: {
        src: this.options,
        keys: ["text"],
        cache: true,
      },
      placeHolder: "Type to search...",
      resultsList: {
        element: (list, data) => {
          const info = document.createElement("p");
          info.classList.add("result-summary");
          if (data.results.length > 0) {
            info.innerHTML = `Displaying <strong>${data.results.length}</strong> out of <strong>${data.matches.length}</strong> results`;
          } else {
            info.innerHTML = `Found <strong>${data.matches.length}</strong> matching results for <strong>"${data.query}"</strong>`;
          }
          list.prepend(info);
        },
        noResults: true,
        maxResults: 20,
        tabSelect: true,
      },
      resultItem: {
        element: (item, data) => {
          item.classList.add("result-item");
          item.innerHTML = `
          <span class="result-item__text">
            ${data.match}
          </span>
          <span class="result-item__category">
            <svg class="result-item__category-icon">
              <use xlink:href="#${data.value.category}" />
            </svg>
          </span>`;
        },
        highlight: true,
      },
    });
    this.autoComplete.input.addEventListener("selection", (event) => {
      this.onSelect({
        id: event.detail.selection.value.value,
        category: event.detail.selection.value.category,
      });
    });
  }

  highlight({ movies, people }) {
    let text;
    if (people.length) {
      text = people[0].name;
    } else if (movies.length) {
      text = movies[0].title;
    }
    this.autoComplete.input.value = text;
  }
}
