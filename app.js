const candidates = [
  { name: "A", score: 85 },
  { name: "B", score: 62 },
  { name: "C", score: 45 }
];

function getPassedCandidates(candidates) {
  return candidates.filter(candidate => candidate.score >= 60);
}

console.log(getPassedCandidates(candidates));