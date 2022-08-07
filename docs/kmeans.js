export class KMeans {
  #n;
  #k;
  #range;
  #pos;
  #label;
  #centers;

  /**
   * @param {number} n
   * @param {number} k
   */
  constructor(n = 200, k = 10) {
    this.#n = n;
    this.#k = k;
    this.#range = 100;
    this.#pos = Array.from(new Array(n)).map((_) => [
      Math.random() * this.#range,
      Math.random() * this.#range,
    ]);
    this.#label = Array.from(new Array(n)).map((_, idx) => idx % k);
    this.#centers = Array.from(new Array(k)).map((_) => [
      Math.random() * this.#range,
      Math.random() * this.#range,
    ]);
  }

  get n() {
    return this.#n;
  }

  get k() {
    return this.#k;
  }

  get pos() {
    return structuredClone(this.#pos);
  }

  get label() {
    return structuredClone(this.#label);
  }

  get centers() {
    return structuredClone(this.#centers);
  }

  /**
   * @returns {boolean}
   */
  update() {
    const isUpdated = this.#updateLabel();
    this.#updateG();

    return isUpdated;
  }

  resetCenters() {
    this.#centers = Array.from(new Array(this.#k)).map((_) => [
      Math.random() * this.#range,
      Math.random() * this.#range,
    ]);
    this.update();
  }

  /**
   * @param {number} n
   * @param {number} k
   */
  resetNumbers(n, k) {
    this.#n = n;
    this.#k = k;

    this.#pos = Array.from(new Array(n)).map((_) => [
      Math.random() * this.#range,
      Math.random() * this.#range,
    ]);
    this.#label = Array.from(new Array(n)).map((_, idx) => idx % k);
    this.#centers = Array.from(new Array(this.#k)).map((_) => [
      Math.random() * this.#range,
      Math.random() * this.#range,
    ]);
  }

  /**
   * @returns {void}
   */
  #updateG() {
    const cnts = new Array(this.#k).fill(0);
    const sums = Array.from(new Array(this.#k)).map((_) => [0, 0]);
    for (let i = 0; i < this.#n; ++i) {
      const idx = this.#label[i];
      cnts[idx] += 1;
      sums[idx][0] += this.#pos[i][0];
      sums[idx][1] += this.#pos[i][1];
    }
    for (let i = 0; i < this.#k; ++i) {
      if (cnts[i] > 0)
        this.#centers[i] = [sums[i][0] / cnts[i], sums[i][1] / cnts[i]];
    }
  }

  /**
   * @returns {boolean} isUpdated
   */
  #updateLabel() {
    let isUpdated = false;
    for (let i = 0; i < this.#n; ++i) {
      let nearest = this.#label[i];
      let mind = Math.sqrt(
        Math.pow(this.#pos[i][0] - this.#centers[this.#label[i]][0], 2) +
          Math.pow(this.#pos[i][1] - this.#centers[this.#label[i]][1], 2)
      );
      for (let j = 0; j < this.#k; ++j) {
        const d = Math.sqrt(
          Math.pow(this.#pos[i][0] - this.#centers[j][0], 2) +
            Math.pow(this.#pos[i][1] - this.#centers[j][1], 2)
        );
        if (d < mind) {
          nearest = j;
          mind = d;
        }
      }

      if (nearest !== this.#label[i]) {
        isUpdated = true;
        this.#label[i] = nearest;
      }
    }

    return isUpdated;
  }
}
