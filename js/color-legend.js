class ColorLegend {
  constructor({ el, scale }) {
    this.el = el;
    this.scale = scale;
    this.init();
  }

  init() {
    this.radius = 10;
    this.paddingLeft = 4;
    this.gap = 24;
    this.width = this.el.clientWidth;
    this.height = 48;

    this.circles = [1000, 800, 600, 400, 200, 1].map((d, i) => ({
      value: d,
      cx: this.paddingLeft + this.radius + i * (this.radius * 2 + this.gap),
      cy: 16,
      r: this.radius,
      fill: this.scale(d),
    }));

    this.svg = d3
      .select(this.el)
      .append("svg")
      .attr("class", "legend")
      .attr("width", this.width)
      .attr("height", this.height);

    this.render();
  }

  render() {
    this.svg
      .selectAll("circle")
      .data(this.circles)
      .join("circle")
      .attr("cx", (d) => d.cx)
      .attr("cy", (d) => d.cy)
      .attr("r", (d) => d.r)
      .attr("fill", (d) => d.fill);

    this.svg
      .selectAll("text")
      .data(this.circles)
      .join("text")
      .attr("x", (d) => d.cx)
      .attr("y", this.height - 4)
      .attr("text-anchor", "middle")
      .attr("fill", "currentColor")
      .text((d) => d.value);
  }
}
