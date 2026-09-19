const fs = require("node:fs");
const { promisify } = require("node:util");

function readFilePromise(path, encoding = "utf8") {
  return new Promise((resolve, reject) => {
    fs.readFile(path, encoding, (error, data) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(data);
    });
  });
}

const readFileWithPromisify = promisify(fs.readFile);

async function retry(fn, times, delay) {
  let lastError;

  for (let attempt = 1; attempt <= times; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < times) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms);
  });

  return Promise.race([promise, timeout]);
}

async function fetchJson(path) {
  const response = await fetch(`https://jsonplaceholder.typicode.com${path}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${path}`);
  }
  return response.json();
}

async function compareFetches(paths) {
  const parallelStart = performance.now();
  const parallelResults = await Promise.all(paths.map(fetchJson));
  const parallelTime = performance.now() - parallelStart;

  const sequentialStart = performance.now();
  const sequentialResults = [];
  for (const path of paths) {
    sequentialResults.push(await fetchJson(path));
  }
  const sequentialTime = performance.now() - sequentialStart;

  console.log(`พร้อมกัน: ${parallelTime.toFixed(0)}ms (${parallelResults.length} รายการ)`);
  console.log(`ทีละตัว: ${sequentialTime.toFixed(0)}ms (${sequentialResults.length} รายการ)`);
}

async function main() {
  const filePath = `${__dirname}/package.json`;
  const manual = await readFilePromise(filePath);
  const promisified = await readFileWithPromisify(filePath, "utf8");
  console.log("อ่านไฟล์ด้วย Promise ที่เขียนเอง:", manual.length, "ตัวอักษร");
  console.log("อ่านไฟล์ด้วย util.promisify:", promisified.length, "ตัวอักษร");

  await compareFetches(["/posts/1", "/users/1", "/todos/1"]);

  let attempts = 0;
  const retriedResult = await retry(() => {
    attempts += 1;
    if (attempts < 3) throw new Error("ลองใหม่อีกครั้ง");
    return "สำเร็จ";
  }, 3, 200);
  console.log(`retry: ${retriedResult} หลังลอง ${attempts} ครั้ง`);

  try {
    await withTimeout(new Promise((resolve) => setTimeout(resolve, 100)), 50);
  } catch (error) {
    console.log("withTimeout:", error.message);
  }
}

main().catch((error) => {
  console.error("เกิดข้อผิดพลาด:", error.message);
  process.exitCode = 1;
});