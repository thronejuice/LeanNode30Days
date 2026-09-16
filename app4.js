const http = require("node:http");

const candidates = [
  { id: 1, name: "A", score: 85 },
  { id: 2, name: "B", score: 62 },
  { id: 3, name: "C", score: 45 }
];

const server = http.createServer((request, response) => {
  response.setHeader("Content-Type", "application/json");

  if (request.method === "GET" && request.url === "/") {
    response.statusCode = 200;
    response.end(JSON.stringify({
      message: "Candidate API"
    }));
    return;
  }

  if (request.method === "GET" && request.url === "/candidates") {
    response.statusCode = 200;
    response.end(JSON.stringify(candidates));
    return;
  }

  if (request.method === "GET" && request.url === "/candidates/passed") {
    response.statusCode = 200;
    response.end(JSON.stringify(
      candidates.filter(candidate => candidate.score >= 60)
    ));
    return;
  }

  response.statusCode = 404;
  response.end(JSON.stringify({
    message: "Route not found"
  }));
});

const port = Number(process.env.PORT) || 3000;

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});