import { Drawer } from "./drawer.js";
import { KMeans } from "./kmeans.js";

const kmeans = new KMeans(200, 10, false);
const drawer = new Drawer();

let cnt = 0;
const nextBtn = document.getElementById("nextBtn");
nextBtn.addEventListener("click", () => {
  nextBtn.disabled = true;
  autoBtn.disabled = true;

  const isUpdated = kmeans.update();
  drawer.draw(kmeans.pos, kmeans.label, kmeans.centers);
  ++cnt;

  if (isUpdated) {
    nextBtn.disabled = false;
    autoBtn.disabled = false;
  }

  console.log(cnt, isUpdated);
});
const autoBtn = document.getElementById("autoBtn");
autoBtn.addEventListener("click", () => {
  nextBtn.disabled = true;
  autoBtn.disabled = true;

  const intervalId = setInterval(() => {
    const isUpdated = kmeans.update();
    drawer.draw(kmeans.pos, kmeans.label, kmeans.centers);
    ++cnt;

    console.log(cnt, isUpdated);

    if (!isUpdated) {
      nextBtn.disabled = false;
      autoBtn.disabled = false;
      clearInterval(intervalId);
    }
  }, 1000);
});
const changeParamsBtn = document.getElementById("changeParamsBtn");
changeParamsBtn.addEventListener("click", (e) => {
  e.preventDefault();

  drawer.reset();

  const n = Number(document.getElementById("n").value);
  const k = Number(document.getElementById("k").value);
  const implValue = document.getElementById("inputs").impl.value;
  kmeans.resetParams(n, k, implValue === "k-means-plus-plus");
  drawer.draw(kmeans.pos, kmeans.label, kmeans.centers);

  cnt = 0;
  nextBtn.disabled = false;
});
const changeCenterBtn = document.getElementById("changeCenterBtn");
changeCenterBtn.addEventListener("click", (e) => {
  e.preventDefault();

  drawer.reset();

  kmeans.resetCenters();
  drawer.draw(kmeans.pos, kmeans.label, kmeans.centers);

  cnt = 1;
  nextBtn.disabled = false;
});

drawer.draw(kmeans.pos, kmeans.label, kmeans.centers);
