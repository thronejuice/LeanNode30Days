// hello.js  รันด้วย: node hello.js Somchai
const name = process.argv[2] || "World";
console.log("Hello, " + name + "!");
console.log("Node version:", process.version);
console.log("Platform:", process.platform);