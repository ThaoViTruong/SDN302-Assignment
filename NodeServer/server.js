const http = require("http");
const hostname = "127.0.0.1";
const PORT = 3000;
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Hello! Đây là Node.js Server 🚀");
});
server.listen(PORT, () => {
  console.log(`Server đang chạy tại http://${hostname}:${PORT}`);
});
