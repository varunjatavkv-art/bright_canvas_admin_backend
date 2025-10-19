function sayHello(name = 'world') {
  return `Hello, ${name}!`;
}

module.exports = { sayHello };

if (require.main === module) {
  const name = process.argv[2] || 'world';
  console.log(sayHello(name));
}
