import fs from 'node:fs';
import axios from 'axios';
import * as cheerio from 'cheerio';
import cliProgress from 'cli-progress';

const url = 'https://memegen-link-examples-upleveled.netlify.app/';
const mq = 10;

// Initialise progress bar & calculate how much to increment it in the loop later
const barStep = 80 / mq;
const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_grey);
bar.start(100, 0);
bar.update(10);

// Create directory
const folderName = './memes';
try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
} catch (err) {
  console.error(err);
}

bar.update(20);

// Function to scrape & store defined number of memes
async function scrapeMemes() {
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
    // Get image data
    for (let i = 0; i < mq; i++) {
      const image = await axios({
        url: arr[i],
        method: 'GET',
        responseType: 'stream',
      });
      // Write image data to file
      const path = `./memes/img0${i}.jpg`;
      const writer = fs.createWriteStream(path);
      image.data.pipe(writer);

      bar.update(barStep);
    }
  } catch (err) {
    console.error(err);
  }
}

scrapeMemes();
bar.update(100);
bar.stop();
