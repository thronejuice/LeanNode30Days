const { EventEmitter, once } = require("node:events");

class OrderService extends EventEmitter {
	create(order) {
		const createdOrder = { ...order, status: "created" };
		console.log(`สร้าง order ${createdOrder.id}`);
		this.emit("order:created", createdOrder);
		return createdOrder;
	}

	pay(order) {
		const paidOrder = { ...order, status: "paid" };
		this.emit("order:paid", paidOrder);
		return paidOrder;
	}

	cancel(order, reason) {
		const cancelledOrder = { ...order, status: "cancelled", reason };
		this.emit("order:cancelled", cancelledOrder);
		return cancelledOrder;
	}

	fail(message) {
		this.emit("error", new Error(message));
	}
}

class SimpleEmitter {
	constructor() {
		this.listeners = new Map();
	}

	on(eventName, listener) {
		const listeners = this.listeners.get(eventName) || [];
		listeners.push(listener);
		this.listeners.set(eventName, listeners);
		return this;
	}

	off(eventName, listener) {
		const listeners = this.listeners.get(eventName) || [];
		this.listeners.set(eventName, listeners.filter((item) => item !== listener));
		return this;
	}

	emit(eventName, ...args) {
		const listeners = this.listeners.get(eventName) || [];
		for (const listener of [...listeners]) listener(...args);
		return listeners.length > 0;
	}
}

function attachOrderListeners(orders) {
	const sendEmail = (order) => console.log(`ส่งอีเมลถึงลูกค้า ${order.email}`);
	const updateStock = (order) => console.log(`ตัดสต็อก: ${order.items.join(", ")}`);
	const writeLog = (order) => console.log(`บันทึก log: ${order.id} -> ${order.status}`);

	orders.on("order:created", sendEmail);
	orders.on("order:created", updateStock);
	orders.on("order:created", writeLog);
	orders.on("order:paid", writeLog);
	orders.on("order:cancelled", (order) => console.log(`แจ้งยกเลิก order ${order.id}: ${order.reason}`));
	orders.once("order:paid", (order) => console.log(`ออกใบเสร็จให้ ${order.id}`));

	return () => {
		orders.off("order:created", sendEmail);
		orders.off("order:created", updateStock);
		orders.off("order:created", writeLog);
		orders.off("order:paid", writeLog);
	};
}

async function waitForPaidOrder(orders, order) {
	const paidOrder = once(orders, "order:paid");
	setTimeout(() => orders.pay(order), 10);
	const [paid] = await paidOrder;
	console.log(`await รอ event สำเร็จ: ${paid.id} มีสถานะ ${paid.status}`);
}

async function runOrderExample() {
	console.log("=== OrderService: EventEmitter ===");
	const orders = new OrderService();
	const detachListeners = attachOrderListeners(orders);
	orders.on("error", (error) => console.log(`จัดการ error แล้ว: ${error.message}`));

	const order = orders.create({ id: "order-001", email: "a@b.com", items: ["book"] });
	await waitForPaidOrder(orders, order);
	orders.cancel(order, "ลูกค้าขอยกเลิก");
	orders.fail("ชำระเงินไม่สำเร็จในตัวอย่าง");

	detachListeners();
	console.log(`listener order:created ที่เหลือ: ${orders.listenerCount("order:created")}`);
}

function runSimpleEmitterExample() {
	console.log("\n=== SimpleEmitter: on, emit, off ===");
	const emitter = new SimpleEmitter();
	const listener = (name) => console.log(`สวัสดี ${name}`);
	emitter.on("hello", listener);
	emitter.emit("hello", "น้อง Node");
	emitter.off("hello", listener);
	emitter.emit("hello", "ข้อความนี้ไม่มี listener แล้ว");
	console.log("ถอด listener สำเร็จ");
}

runOrderExample()
	.then(runSimpleEmitterExample)
	.catch((error) => {
		console.error(`โปรแกรมมีข้อผิดพลาด: ${error.message}`);
		process.exitCode = 1;
	});
