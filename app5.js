const express = require("express");

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

const candidates = [
  { id: 1, name: "A", score: 85 },
  { id: 2, name: "B", score: 62 },
  { id: 3, name: "C", score: 45 }
];

function requireApiKey(request, response, next) {
  const apiKey = request.headers["x-api-key"];

  if (apiKey !== "nodejs-secret") {
    return response.status(401).json({
      message: "Unauthorized"
    });
  }

  next();
}

app.get("/", (request, response) => {
  response.json({
    message: "Candidate API with Express"
  });
});

app.get("/candidates", requireApiKey, (request, response) => {
  response.json(candidates);
});

app.get("/candidates/passed", requireApiKey, (request, response) => {
  const passedCandidates = candidates.filter(
    candidate => candidate.score >= 60
  );

  response.json(passedCandidates);
});

app.use((request, response) => {
  response.status(404).json({
    message: "Route not found"
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});