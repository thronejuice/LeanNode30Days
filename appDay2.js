const { deepClone, groupBy } = require("./utils/productUtils.cjs");

const products = [
  { name: "Keyboard", price: 1200, category: "computer", stock: 8 },
  { name: "Mouse", price: 650, category: "computer", stock: 15 },
  { name: "Monitor", price: 4500, category: "computer", stock: 0 },
  { name: "Desk Lamp", price: 890, category: "home", stock: 6 },
  { name: "Notebook", price: 120, category: "stationery", stock: 30 },
  { name: "Pen Set", price: 180, category: "stationery", stock: 0 },
  { name: "Coffee Mug", price: 290, category: "home", stock: 12 },
  { name: "Backpack", price: 1500, category: "lifestyle", stock: 5 },
  { name: "Water Bottle", price: 480, category: "lifestyle", stock: 10 },
  { name: "Webcam", price: 2200, category: "computer", stock: 4 }
];

const outOfStock = products.filter(product => product.stock === 0);

const totalStockValue = products.reduce((total, product) => {
  return total + product.price * product.stock;
}, 0);

const productsByCategory = groupBy(products, "category");

const averagePriceByCategory = Object.fromEntries(
  Object.entries(productsByCategory).map(([category, categoryProducts]) => [
    category,
    categoryProducts.reduce((total, product) => total + product.price, 0) /
      categoryProducts.length
  ])
);

const manualClone = deepClone(products);
const nativeClone = structuredClone(products);
const clonesHaveSameData =
  JSON.stringify(manualClone) === JSON.stringify(nativeClone);

manualClone[0].stock = 999;
nativeClone[0].stock = 888;

console.log("สินค้าที่หมดสต็อก:", outOfStock);
console.log("มูลค่าสต็อกรวม:", totalStockValue);
console.log("ราคาเฉลี่ยต่อ category:", averagePriceByCategory);
console.log("สินค้าแยกตาม category:", productsByCategory);
console.log("deepClone เทียบค่าเท่ากับ structuredClone ก่อนแก้ไข:", clonesHaveSameData);
console.log("deepClone ไม่เปลี่ยน products ต้นฉบับ:", products[0].stock === 8);
console.log("deepClone แยก nested object:", manualClone[0] !== products[0]);