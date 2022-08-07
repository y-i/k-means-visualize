export class Drawer {
  #svg;
  #oldLabels;
  #oldCenters;
  #colorCategoryScale;

  constructor() {
    const width = document.getElementById("d3").clientWidth;
    const height = document.getElementById("d3").clientHeight;
    this.#svg = d3
      .select("#d3")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    this.#colorCategoryScale = d3.scaleOrdinal(d3.schemeCategory10);

    this.reset();
  }

  /**
   * @param {number[][]} pos
   * @param {number[]} label
   * @param {number[][]} centers
   */
  draw(pos, label, centers) {
    this.#svg.selectAll("rect").remove();
    this.#svg.selectAll("circle").remove();

    const width = document.getElementById("d3").clientWidth;
    const height = document.getElementById("d3").clientHeight;
    const xScale = d3.scaleLinear().domain([-5, 105]).range([0, width]);
    const yScale = d3.scaleLinear().domain([-5, 105]).range([height, 0]);
    const colorCategoryScale = this.#colorCategoryScale;

    const data = pos.map((p, idx) => [
      p[0],
      p[1],
      label[idx],
      this.#oldLabels.length > 0 && label[idx] != this.#oldLabels[idx],
    ]);
    const oldCenterData = this.#oldCenters.map((oldCenter, idx) => [
      oldCenter[0],
      oldCenter[1],
      idx,
    ]);
    const centerData = centers.map((center, idx) => [
      center[0],
      center[1],
      idx,
    ]);

    // Points
    this.#svg
      .selectAll("points")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return xScale(d[0]);
      })
      .attr("cy", function (d) {
        return yScale(d[1]);
      })
      .attr("r", 7)
      .attr("stroke", "black")
      .attr("stroke-width", function (d) {
        return d[3] ? 2 : 0;
      })
      .attr("fill", function (d) {
        return colorCategoryScale(d[2]);
      });

    // OldCenters
    this.#svg
      .selectAll("oldCenters")
      .data(oldCenterData)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return xScale(d[0]);
      })
      .attr("y", function (d) {
        return yScale(d[1]);
      })
      .attr("width", 10)
      .attr("height", 10)
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("fill", function (d) {
        return colorCategoryScale(d[2]);
      });

    // CurrentCenters
    this.#svg
      .selectAll("currentCenters")
      .data(centerData)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return xScale(d[0]);
      })
      .attr("y", function (d) {
        return yScale(d[1]);
      })
      .attr("width", 20)
      .attr("height", 20)
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("fill", function (d) {
        return colorCategoryScale(d[2]);
      });

    this.#oldLabels = structuredClone(label);
    this.#oldCenters = structuredClone(centers);
  }

  reset() {
    this.#oldLabels = [];
    this.#oldCenters = [];
  }
}
