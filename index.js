import axios from 'axios';
import * as cheerio from 'cheerio';

const url = 'https://memegen-link-examples-upleveled.netlify.app/';

async function scrapeData() {
  try {
    // Fetch HTML of the target website
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    // Select all images
    const imageList = $('#images ul li');
    imageList.each(function (idx, li) {
      let image = $(li).find('img').attr('src');
      console.log(image);
    });
  } catch (err) {
    console.error(err);
  }
}

scrapeData();
