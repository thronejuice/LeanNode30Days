const candidates = [
  { name: "A", score: 85 },
  { name: "B", score: 62 },
  { name: "C", score: 45 },
  { name: "D", score: 78 }
];

function summarizeCandidates(candidates) {
  if (candidates.length === 0) {
    return {
      total: 0,
      passed: 0,
      averageScore: 0,
      highestScore: null
    };
  }

  const passedCandidates = candidates.filter(
    candidate => candidate.score >= 60
  );

  const totalScore = candidates.reduce(
    (sum, candidate) => sum + candidate.score,
    0
  );

  const highestScore = candidates.reduce((highest, candidate) => {
    return candidate.score > highest.score ? candidate : highest;
  });

  return {
    total: candidates.length,
    passed: passedCandidates.length,
    averageScore: totalScore / candidates.length,
    highestScore
  };
}

console.log(summarizeCandidates(candidates));