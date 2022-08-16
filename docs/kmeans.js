export class KMeans {
  #n;
  #k;
  #range;
  #pos;
  #label;
  #centers;
  #isPlusPlus;

  /**
   * @param {number} n
   * @param {number} k
   * @param {boolean} isPlusPlus
   */
  constructor(n = 200, k = 10, isPlusPlus) {
    this.#n = n;
    this.#k = k;
    this.#isPlusPlus = isPlusPlus;
    this.#range = 100;
    this.#pos = Array.from(new Array(n)).map((_) => [
      Math.random() * this.#range,
      Math.random() * this.#range,
    ]);
    this.#label = Array.from(new Array(n)).map((_, idx) => idx % k);
    this.#setCenter();
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
   * Update labels and centers once
   * @returns {boolean}
   */
  update() {
    const isUpdated = this.#updateLabels();
    this.#updateCenters();

    return isUpdated;
  }

  /**
   * Reset centers
   */
  resetCenters() {
    this.#setCenter();
    this.update();
  }

  /**
   * Reset params and centers
   * @param {number} n
   * @param {number} k
   * @param {boolean} isPlusPlus
   */
  resetParams(n, k, isPlusPlus) {
    this.#n = n;
    this.#k = k;
    this.#isPlusPlus = isPlusPlus;

    this.#pos = Array.from(new Array(n)).map((_) => [
      Math.random() * this.#range,
      Math.random() * this.#range,
    ]);
    this.#label = Array.from(new Array(n)).map((_, idx) => idx % k);
    this.#setCenter();
  }

  /**
   * Set initial centers by specified algorithm
   */
  #setCenter() {
    if (this.#isPlusPlus) {
      this.#centers = [];
      const idx = Math.floor(Math.random() * this.#n);
      this.#centers.push(this.#pos[idx]);
      while (this.#centers.length < this.#k) {
        const ds = [];

        for (let i = 0; i < this.#n; ++i) {
          let mind = Infinity;
          for (let j = 0; j < this.#centers.length; ++j) {
            const d = Math.sqrt(
              Math.pow(this.#pos[i][0] - this.#centers[j][0], 2) +
                Math.pow(this.#pos[i][1] - this.#centers[j][1], 2)
            );
            if (d < mind) {
              mind = d;
            }
          }

          ds.push(mind ** 2);
        }

        const dsum = ds.reduce((sum, d) => sum + d, 0);
        const normalizedDs = ds.map((d) => d / dsum);
        let sum = 0;
        const rand = Math.random();
        for (let i = 0; i < this.#n; ++i) {
          sum += normalizedDs[i];
          if (rand < sum) {
            this.#centers.push(this.#pos[i]);
            break;
          }
        }
      }
    } else {
      this.#centers = Array.from(new Array(this.#k)).map((_) => [
        Math.random() * this.#range,
        Math.random() * this.#range,
      ]);
    }
  }

  /**
   * Update centers from labels
   * @returns {void}
   */
  #updateCenters() {
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
   * Update labels to the nearest center
   * @returns {boolean} isUpdated
   */
  #updateLabels() {
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
