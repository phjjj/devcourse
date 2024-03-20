let http = require("http");

function onRequest(req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("hi nodejs");
  res.end();
}

http.createServer(onRequest).listen(9999);
