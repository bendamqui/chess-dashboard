const throng = require("throng");
const got = require("got");
const { APP_URL, IMPORT_KEY } = process.env;
const importUrl = `${APP_URL}api/import/sibelephant/${IMPORT_KEY}`;
const sleepLength = 1000 * 60 * 15;

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
throng(1, async id => {
  while (true) {
    console.log(`worker id ${id}`);
    got(importUrl)
      .then(({ body }) => {
        console.log(body);
      })
      .catch(console.log);
    await sleep(sleepLength);
  }
});
