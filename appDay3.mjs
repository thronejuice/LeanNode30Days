import dayjs from "dayjs";
import { deepClone, groupBy } from "./utils/productUtils.mjs";

const products = [
  { name: "Keyboard", price: 1200, category: "computer", stock: 8 },
  { name: "Mouse", price: 650, category: "computer", stock: 15 },
  { name: "Notebook", price: 120, category: "stationery", stock: 30 }
];

const productsByCategory = groupBy(products, "category");
const clonedProducts = deepClone(products);

console.log("วันที่รัน:", dayjs().format("YYYY-MM-DD HH:mm:ss"));
console.log("สินค้าแยกตาม category:", productsByCategory);
console.log("clone ไม่อ้างอิงข้อมูลเดิม:", clonedProducts !== products);
