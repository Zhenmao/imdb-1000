class SizeLegend {
  constructor({ el, scale }) {
    this.el = el;
    this.scale = scale;
    this.init();
  }

  init() {
    this.paddingLeft = 0;
    this.gap = 24;
    this.width = this.el.clientWidth;
    this.height = 86;

    let x = this.paddingLeft;
    this.circles = [2e6, 1e6, 5e5, 1e5, 5e4].map((d, i) => {
      const r = this.scale(d);
      const cx = (x += r);
      x += r + this.gap;
      return {
        value: d,
        cx,
        cy: 64 - r,
        r,
      };
    });

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
      .attr("fill", "none")
      .attr("stroke", "#f4f4f4")
      .attr("stroke-dasharray", "4 2");

    this.svg
      .selectAll("text")
      .data(this.circles)
      .join("text")
      .attr("x", (d) => d.cx)
      .attr("y", this.height - 4)
      .attr("text-anchor", "middle")
      .attr("fill", "currentColor")
      .text((d) => d3.format("~s")(d.value));
  }
}
