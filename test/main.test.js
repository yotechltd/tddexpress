
const request = require("supertest");
const baseUrl = require("../server");
async function wait(millis) {
  await new Promise(r => setTimeout(r, millis));
}
test('function', async () => {
  await wait(10000);
}, 70000);

// test('function', async () => {
//   await wait(5000);
// }, 70000);

// test('function', async () => {
//   await wait(5000);
// }, 70000);

// test('function', async () => {
//   await wait(5000);
// }, 70000);

test('Order adding issues ', async () => {
  let body = {
    items: 2,
    price: 21,
    from: "Yo Foodie"
  }
  let data = await request(baseUrl).post("/test/order")
    .send(body);
  expect(data.body.statusCode).toBe(200);
},30000);