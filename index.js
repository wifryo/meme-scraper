import fs from 'node:fs';
import axios from 'axios';
import * as cheerio from 'cheerio';
import cliProgress from 'cli-progress';

let url;
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

// condition ? if true : if false
// if there is an argv[2], string 1 is argv[2], otherwise it is undefined
const string1 = process.argv[2] ? process.argv[2] : undefined;
// if there is an argv[3], string 2 is argv[3], otherwise it is '_'
const string2 = process.argv[3] ? process.argv[3] : '_';

// if there is an argv[4], string 3 is argv[4], otherwise it is '_'
const string3 = process.argv[4] ? process.argv[4] : '_';
// if both string1 and string2 exist text is string1/string2, else text is string1
let text;
if (string1 && !string2) {
  text = string1;
} else if (string1 && string2 && !string3) {
  text = `/${string1}/${string2}`;
} else if (string1 && string2 && string3) {
  text = `/${string1}/${string2}/${string3}`;
}

async function memeGen() {
  try {
    // Extract image source
    const image = await axios({
      url: url,
      method: 'GET',
      responseType: 'stream',
    });
    bar.update(50);
    const path = `./memes/${string1}.jpg`;
    const writer = fs.createWriteStream(path);
    image.data.pipe(writer);
  } catch (err) {
    console.error(err);
  }
}

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
      // Create image name
      let imgName = i + 1;
      if (imgName.toString().length > 1) {
        imgName = `img` + imgName;
      } else {
        imgName = `img0` + imgName;
      }

      // Write image data to file
      const path = `./memes/${imgName}.jpg`;
      const writer = fs.createWriteStream(path);
      image.data.pipe(writer);

      bar.update(barStep);
    }
  } catch (err) {
    console.error(err);
  }
}

if (string1 === undefined) {
  url = 'https://memegen-link-examples-upleveled.netlify.app/';
  await scrapeMemes();
} else {
  url = `https://api.memegen.link/images${text}.jpg`;
  await memeGen();
}

bar.update(100);
bar.stop();
