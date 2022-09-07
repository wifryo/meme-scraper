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
    const plip = $('img').attr('src');

    console.log(plip);
  } catch (err) {
    console.error(err);
  }
}

scrapeData();
