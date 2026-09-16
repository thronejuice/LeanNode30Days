function fetchCandidates() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const candidates = [
        { name: "A", score: 85 },
        { name: "B", score: 62 }
      ];

      resolve(candidates);
    }, 1000);
  });
}

async function main() {
  try {
    const candidates = await fetchCandidates();
    console.log(candidates);
  } catch (error) {
    console.error("ไม่สามารถโหลดข้อมูลได้:", error.message);
  }
}

main();

