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

const categorySummary = products.reduce((acc, product) => {
  if (!acc[product.category]) {
    acc[product.category] = { totalPrice: 0, productCount: 0 };
  }

  acc[product.category].totalPrice += product.price;
  acc[product.category].productCount += 1;
  return acc;
}, {});

const averagePriceByCategory = Object.fromEntries(
  Object.entries(categorySummary).map(([category, summary]) => [
    category,
    summary.totalPrice / summary.productCount
  ])
);

console.log("สินค้าที่หมดสต็อก:", outOfStock);
console.log("มูลค่าสต็อกรวม:", totalStockValue);
console.log("ราคาเฉลี่ยต่อ category:", averagePriceByCategory);