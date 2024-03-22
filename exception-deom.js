const express = require("express");
const app = express();
app.listen(1234);
app.use(express.json());

const fruits = [
  { id: 1, name: "apple" },
  { id: 2, name: "oragne" },
  { id: 3, name: "strawberry" },
];
app.get(`/fruits`, (req, res) => {
  res.json(fruits);
});

app.get(`/fruits/:id`, (req, res) => {
  let { id } = req.params;
  let findFriut = fruits.find((f) => f.id == id);
  if (findFriut) {
    res.json({ findFriut });
  } else {
    res.status(404).send({ msessage: "존재하지 않는 아이디" });
  }
});
