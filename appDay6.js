const { mkdir, readFile, readdir, rename, stat, watch, writeFile } = require("node:fs/promises");
const path = require("node:path");

const ROOT_DIR = __dirname;
const NOTES_FILE = path.join(ROOT_DIR, "notes.json");

async function loadNotes() {
	try {
		return JSON.parse(await readFile(NOTES_FILE, "utf8"));
	} catch (error) {
		if (error.code === "ENOENT") return [];
		throw error;
	}
}

async function saveNotes(notes) {
	await writeJson(NOTES_FILE, notes);
}

async function writeJson(file, value) {
	const content = JSON.stringify(value, null, 2) + "\n";
	await writeFile(file, content, "utf8");
}

async function addNote(text) {
	if (!text) throw new Error('ตัวอย่าง: node appDay6.js add "อ่านเรื่อง fs/promises"');
	const notes = await loadNotes();
	const note = { id: Date.now(), text, createdAt: new Date().toISOString() };
	notes.push(note);
	await saveNotes(notes);
	console.log(`เพิ่ม note #${note.id}: ${note.text}`);
}

async function listNotes() {
	const notes = await loadNotes();
	if (notes.length === 0) {
		console.log("ยังไม่มี note");
		return;
	}
	for (const note of notes) console.log(`#${note.id} ${note.text}`);
}

async function removeNote(idText) {
	const id = Number(idText);
	if (!Number.isSafeInteger(id)) throw new Error("ต้องระบุ id เป็นตัวเลข");
	const notes = await loadNotes();
	const remainingNotes = notes.filter((note) => note.id !== id);
	if (remainingNotes.length === notes.length) {
		console.log(`ไม่พบ note #${id}`);
		return;
	}
	await saveNotes(remainingNotes);
	console.log(`ลบ note #${id} แล้ว`);
}

async function searchNotes(keyword) {
	if (!keyword) throw new Error("ตัวอย่าง: node appDay6.js search fs");
	const notes = await loadNotes();
	const matches = notes.filter((note) => note.text.toLowerCase().includes(keyword.toLowerCase()));
	if (matches.length === 0) {
		console.log(`ไม่พบ note ที่มีคำว่า "${keyword}"`);
		return;
	}
	for (const note of matches) console.log(`#${note.id} ${note.text}`);
}

async function scanDirectory(directory) {
	const absoluteDirectory = path.resolve(directory);
	try {
		const entries = await readdir(absoluteDirectory, { recursive: true, withFileTypes: true });
		const files = entries.filter((entry) => entry.isFile());
		const results = await Promise.all(files.map(async (entry) => {
			const filePath = path.resolve(entry.parentPath || absoluteDirectory, entry.name);
			const details = await stat(filePath);
			return { path: path.relative(ROOT_DIR, filePath) || entry.name, size: details.size };
		}));
		for (const file of results.sort((left, right) => left.path.localeCompare(right.path))) {
			console.log(`${file.size.toString().padStart(10)} bytes  ${file.path}`);
		}
		console.log(`รวม ${results.length} ไฟล์`);
	} catch (error) {
		if (error.code === "ENOENT") throw new Error(`ไม่พบโฟลเดอร์: ${absoluteDirectory}`);
		throw error;
	}
}

function categoryForExtension(fileName) {
	const extension = path.extname(fileName).toLowerCase().slice(1);
	return extension || "no-extension";
}

async function organizeDirectory(sourceDirectory, shouldApply) {
	const source = path.resolve(sourceDirectory);
	const entries = await readdir(source, { withFileTypes: true });
	const files = entries.filter((entry) => entry.isFile());
	if (files.length === 0) {
		console.log("ไม่พบไฟล์สำหรับจัดกลุ่ม");
		return;
	}

	for (const entry of files) {
		const category = categoryForExtension(entry.name);
		const targetDirectory = path.join(source, category);
		const from = path.join(source, entry.name);
		const to = path.join(targetDirectory, entry.name);
		console.log(`${shouldApply ? "ย้าย" : "จะย้าย"}: ${entry.name} -> ${category}/`);
		if (shouldApply) {
			await mkdir(targetDirectory, { recursive: true });
			await rename(from, to);
		}
	}
	if (!shouldApply) console.log("ยังไม่ย้ายไฟล์จริง ใช้ --apply เพื่อยืนยัน");
}

async function watchDirectory(directory) {
	const absoluteDirectory = path.resolve(directory);
	console.log(`กำลังดูการเปลี่ยนแปลงใน ${absoluteDirectory} (กด Ctrl+C เพื่อหยุด)`);
	for await (const event of watch(absoluteDirectory)) {
		console.log(`${event.eventType}: ${event.filename || "ไม่ทราบชื่อไฟล์"}`);
	}
}

function printHelp() {
	console.log(`คำสั่ง:
  node appDay6.js add "ข้อความ"       เพิ่ม note
  node appDay6.js list                  แสดง note ทั้งหมด
  node appDay6.js remove <id>           ลบ note ตาม id
  node appDay6.js search <keyword>      ค้นหา note
  node appDay6.js scan <folder>         สแกนไฟล์และแสดงขนาด
  node appDay6.js organize <folder> [--apply]
                                        จัดไฟล์ตามนามสกุล
  node appDay6.js watch <folder>        ดูการเปลี่ยนแปลงของไฟล์`);
}

async function main() {
	const [, , command, ...args] = process.argv;
	if (command === "add") return addNote(args.join(" "));
	if (command === "list") return listNotes();
	if (command === "remove") return removeNote(args[0]);
	if (command === "search") return searchNotes(args.join(" "));
	if (command === "scan") return scanDirectory(args[0] || ".");
	if (command === "organize") return organizeDirectory(args[0] || ".", args.includes("--apply"));
	if (command === "watch") return watchDirectory(args[0] || ".");
	printHelp();
}

main().catch((error) => {
	console.error(`เกิดข้อผิดพลาด: ${error.message}`);
	process.exitCode = 1;
});
