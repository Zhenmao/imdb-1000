class Tooltip {
  constructor({ el }) {
    this.el = el;
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.init();
  }

  init() {
    this.tooltip = d3
      .select(this.el)
      .append("div")
      .attr("class", "tooltip")
      .on("mouseenter", () => {
        this.tooltip.classed("visible", true);
      })
      .on("mouseleave", () => {
        this.tooltip.classed("visible", false);
      });
  }

  show(content, target) {
    this.tooltip.html(content);
    this.tooltip.classed("visible", true);
    this.move(target);
  }

  hide() {
    this.tooltip.classed("visible", false);
  }

  move(target) {
    const xPadding = 16;

    const elRect = this.el.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const tooltipRect = this.tooltip.node().getBoundingClientRect();

    let x = targetRect.x + targetRect.width / 2 - tooltipRect.width / 2;
    const xMin = elRect.x + xPadding;
    const xMax = elRect.x + elRect.width - xPadding - tooltipRect.width;
    x = Math.max(xMin, Math.min(x, xMax));

    let y = targetRect.y - tooltipRect.height;
    if (y < elRect.y) {
      y = targetRect.y + targetRect.height;
    }

    this.tooltip.style(
      "transform",
      `translate(${x - elRect.x}px,${y - elRect.y}px)`
    );
  }
}
