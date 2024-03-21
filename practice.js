const arr = [1, 2, 3, 4, 5];

const forEachArr = arr.forEach((v, i) => {
  return v * 2;
});

const mapArr = arr.map((v, i) => {
  return v * 2;
});
console.log(forEachArr);
console.log(mapArr);
