var figlet = require("./node_modules/figlet");

function first() {
  console.log("첫 번째");
}

function second() {
  console.log("두 번째");
}

function third() {
  console.log("세 번째");
}

first();
setTimeout(second, 1000);
third();

figlet("Park Hae Jun", function (err, data) {
  if (err) {
    console.log("err");
    return;
  }
  console.log(data);
});
// output :
// 첫번째
// 세번째
// 두번째
