class Beeswarm {
  constructor({ el, data, onSelect, onReset }) {
    this.el = el;
    this.data = data;
    this.onSelect = onSelect;
    this.onReset = onReset;
    this.highlight = this.highlight.bind(this);
    this.init();
  }

  init() {
    this.highlighted = [];
    this.margin = {
      top: 32,
      right: 48,
      bottom: 96,
      left: 48,
    };
    this.width = 800;
    this.height = 2400;
    this.maxRadius = 32;
    this.tickRadius = 24;

    this.color = d3
      .scaleLinear()
      .domain([this.data.length, 1])
      .range(["#f4f4f4", "#F5C518"])
      .interpolate(d3.interpolateHsl);

    new ColorLegend({
      el: document.querySelector("#color-legend"),
      scale: this.color,
    });

    this.r = d3
      .scaleSqrt()
      .domain([0, d3.max(this.data, (d) => d.votes)])
      .range([0, this.maxRadius]);

    new SizeLegend({
      el: document.querySelector("#size-legend"),
      scale: this.r,
    });

    this.y = d3
      .scaleLinear()
      .domain(d3.extent(this.data, (d) => d.year))
      .range([this.margin.top, this.height - this.margin.bottom]);

    this.container = d3.select(this.el).classed("beeswam", true);
    this.svg = this.container
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .on("click", () => {
        this.onReset();
      });
    this.gYAxis = this.svg.append("g").attr("class", "axis axis--y");
    this.gHighlight = this.svg.append("g").attr("class", "highlighted-circles");
    this.gCircles = this.svg.append("g").attr("class", "circles");

    this.tooltip = new Tooltip({
      el: this.el,
    });

    this.render();
  }

  render() {
    this.renderYAxis();
    this.renderCircles();
    this.renderHighlight();
  }

  renderYAxis() {
    this.gYAxis
      .attr("transform", `translate(${this.width / 2},0)`)
      .selectAll(".tick")
      .data(this.y.ticks())
      .join((enter) =>
        enter
          .append("text")
          .attr("class", "tick")
          .attr("text-anchor", "middle")
          .attr("dy", "0.32em")
          .attr("y", (d) => this.y(d))
          .text((d) => d)
      );
  }

  renderCircles() {
    this.circle = this.gCircles
      .selectAll(".circle")
      .data(this.data, (d) => d.id)
      .join((enter) =>
        enter
          .append("circle")
          .attr("class", "circle")
          .attr("r", (d) => this.r(d.votes))
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y)
          .attr("fill", (d) => this.color(d.rank))
          .on("mouseenter", (event, d) => {
            this.tooltip.show(this.tooltipContent(d), event.currentTarget);
            this.tooltip.tooltip.selectAll(".t-person").on("click", (event) => {
              this.tooltip.hide();
              this.onSelect({ id: event.currentTarget.dataset.id });
            });
          })
          .on("mouseleave", this.tooltip.hide)
      );
  }

  renderHighlight() {
    this.circle.classed(
      "is-muted",
      (d) => this.highlighted.length && !this.highlighted.includes(d)
    );

    this.gHighlight
      .selectAll(".highlighted-circle")
      .data(this.highlighted, (d) => d.id)
      .join((enter) =>
        enter
          .append("circle")
          .attr("class", "highlighted-circle")
          .attr("r", (d) => this.r(d.votes))
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y)
          .attr("fill", "none")
          .attr("stroke-width", 8)
      );
  }

  tooltipContent(d) {
    let content = "";
    // Rank, title, year
    content += `
    <div class="t-header">
      <span class="t-header-rank">${d.rank}. </span>
      <a href="https://www.imdb.com/title/${d.id}" target="_blank" class="t-header-title">${d.title}</a>
      <span class="t-header-year"> (${d.year})</span>
    </div>
    `;

    // Rating, votes
    content += `
    <div class="t-rating">
      <div class="t-rating-star">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path d="M12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"></path></svg>
      </div>
      <div>
        <div class="t-rating-score">
          <span class="t-rating-score__value">${d.rating}</span>
          <span>/10</span>
        </div>
        <div class="t-rating-votes">${d3.format(".3~s")(d.votes)}</div>
      </div>
    </div>
    `;

    // Certificate, runtime, genres
    content += `
      <div class="t-info">
        ${
          d.certificate
            ? `<div class="t-info__item">${d.certificate}</div>`
            : null
        }
        <div class="t-info__item">${d.runtime} min</div>
        <div class="t-info__item">${d.genres.join(", ")}</div>
      </div>
    `;

    // Blurb
    content += `<div>${d.blurb}</div>`;

    // Directors
    content += `
      <div>${d.directors.length > 1 ? "Directors" : "Director"}: ${d.directors
      .map((p) => `<span class="t-person" data-id="${p.id}">${p.name}</span>`)
      .join(", ")}</div>
    `;

    // Stars
    content += `
      <div>Stars: ${d.actors
        .map((p) => `<span class="t-person" data-id="${p.id}">${p.name}</span>`)
        .join(", ")}</div>
    `;

    return content;
  }

  highlight({ movies, people }) {
    this.highlighted = movies;
    this.renderHighlight();
  }
}
