import fs from 'node:fs';
import axios from 'axios';
import * as cheerio from 'cheerio';

const url = 'https://memegen-link-examples-upleveled.netlify.app/';
const mq = 10;

const folderName = './memes';
try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
} catch (err) {
  console.error(err);
}

async function scrapeData() {
  try {
    // Fetch HTML of the target website
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    // Initialise array
    const arr = [];
    // Extract each image source and push to array
    $('img', data).each(function () {
      const image = $(this).attr('src');
      arr.push(image);
    });
    // Do something to each of the first 10 image sources
    for (let i = 0; i < mq; i++) {
      const image = await axios({
        url: arr[i],
        method: 'GET',
        responseType: 'stream',
      });
      const path = `./memes/img0${i}.jpg`;
      const writer = fs.createWriteStream(path);

      image.data.pipe(writer);
    }
  } catch (err) {
    console.error(err);
  }
}

await scrapeData();
