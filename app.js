// 박해준
const express = require("express");
const rootRouter = require("./routers/rootRouter");
const bookRouter = require("./routers/bookRouter");
const cartRouter = require("./routers/cartRouter");
const likesRouter = require("./routers/likesRouter");
const categoryRouter = require("./routers/categoryRouter");
const ordersRotuer = require("./routers/ordersRouter");
const cors = require("cors");
const app = express();
app.use(express.json());
const dotenv = require("dotenv").config();
const PORT = process.env.PORT;
// Access-Control-Allow-Origin 설정

// 밑 구문을 cors()을 사용
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    exposedHeaders: ["Authorization"],
  })
);

const handleListening = () => console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);

app.use("/users", rootRouter);
app.use("/books", bookRouter);
app.use("/category", categoryRouter);
app.use("/carts", cartRouter);
app.use("/likes", likesRouter);
app.use("/orders", ordersRotuer);
