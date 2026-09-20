const http = require("node:http");
const { isMainThread, parentPort, Worker, workerData } = require("node:worker_threads");
const { performance } = require("node:perf_hooks");

const PORT = Number(process.env.PORT) || 3000;
const BLOCK_DURATION_MS = 5_000;

function busyWait(durationMs) {
	const end = performance.now() + durationMs;
	while (performance.now() < end) {
		// ตั้งใจใช้ CPU เพื่อจำลองงานหนักที่บล็อก event loop
	}
}

function runEventLoopSet(label, schedule) {
	console.log(`\n--- ${label} ---`);
	console.log("คำอธิบาย: nextTick ถูกระบายก่อน Promise และ timer จะรอรอบ event loop ถัดไป");
	schedule();
}

function runEventLoopExamples() {
	console.log("=== ทดลองลำดับคิว: อ่านคำอธิบายก่อนดูผลจริง ===");

	runEventLoopSet("ชุดที่ 1: งาน sync เทียบกับ nextTick, Promise, setTimeout", () => {
		console.log("ชุดที่ 1: sync");
		setTimeout(() => console.log("ชุดที่ 1: setTimeout"), 0);
		Promise.resolve().then(() => console.log("ชุดที่ 1: Promise"));
		process.nextTick(() => console.log("ชุดที่ 1: nextTick"));
	});

	runEventLoopSet("ชุดที่ 2: timer สร้างคิวใหม่", () => {
		setTimeout(() => {
			console.log("ชุดที่ 2: timer ด้านนอก");
			process.nextTick(() => console.log("ชุดที่ 2: nextTick ด้านใน timer"));
			Promise.resolve().then(() => console.log("ชุดที่ 2: Promise ด้านใน timer"));
			setTimeout(() => console.log("ชุดที่ 2: setTimeout ด้านใน timer"), 0);
		}, 0);
	});

	runEventLoopSet("ชุดที่ 3: Promise สร้าง nextTick และ timer", () => {
		Promise.resolve().then(() => {
			console.log("ชุดที่ 3: Promise ด้านนอก");
			process.nextTick(() => console.log("ชุดที่ 3: nextTick ที่สร้างจาก Promise"));
			setTimeout(() => console.log("ชุดที่ 3: setTimeout ที่สร้างจาก Promise"), 0);
		});
		process.nextTick(() => console.log("ชุดที่ 3: nextTick ด้านนอก"));
	});
}

function startServer() {
	const server = http.createServer((request, response) => {
		if (request.url === "/fast") {
			response.writeHead(200, { "content-type": "application/json; charset=utf-8" });
			response.end(JSON.stringify({ route: "/fast", message: "ตอบได้ทันที" }));
			return;
		}

		if (request.url === "/block") {
			console.log("/block เริ่มทำงานบน main thread: จะบล็อก route อื่นประมาณ 5 วินาที");
			busyWait(BLOCK_DURATION_MS);
			response.writeHead(200, { "content-type": "application/json; charset=utf-8" });
			response.end(JSON.stringify({ route: "/block", message: "ทำงานเสร็จบน main thread" }));
			return;
		}

		if (request.url === "/worker") {
			console.log("/worker ส่งงานหนักไป worker thread");
			const worker = new Worker(__filename, { workerData: BLOCK_DURATION_MS });
			worker.once("message", (message) => {
				response.writeHead(200, { "content-type": "application/json; charset=utf-8" });
				response.end(JSON.stringify({ route: "/worker", message }));
			});
			worker.once("error", (error) => {
				response.writeHead(500, { "content-type": "application/json; charset=utf-8" });
				response.end(JSON.stringify({ error: error.message }));
			});
			return;
		}

		response.writeHead(404, { "content-type": "application/json; charset=utf-8" });
		response.end(JSON.stringify({ error: "ไม่พบ route" }));
	});

	server.listen(PORT, () => {
		console.log(`\nServer พร้อมที่ http://localhost:${PORT}`);
		console.log(`ทดลองบล็อก: curl http://localhost:${PORT}/block และเรียกอีก terminal ด้วย curl http://localhost:${PORT}/fast`);
		console.log(`ทดลองแก้ด้วย worker: curl http://localhost:${PORT}/worker และเรียก /fast พร้อมกัน`);
	});
}

if (!isMainThread) {
	busyWait(workerData);
	parentPort.postMessage("ทำงานเสร็จใน worker thread โดยไม่บล็อก main thread");
} else {
	runEventLoopExamples();
	startServer();
}