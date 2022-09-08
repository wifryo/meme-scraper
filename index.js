import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

const url = 'https://memegen-link-examples-upleveled.netlify.app/';

async function scrapeData() {
  try {
    // Fetch HTML of the target website
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    // Select all images
    let arr = [];
    $('img')
      .attr('src')
      .each(function () {
        arr.push(this);
      });
  } catch (err) {
    console.error(err);
  }
}

scrapeData();
