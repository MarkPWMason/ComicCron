const dbObj = require('./db');
const cron = require('node-cron');
const md5 = require('md5');
const moment = require('moment');
require('dotenv').config();

const pub = process.env.MARVEL_PUB_KEY;
const pri = process.env.MARVEL_PRI_KEY;

const storeData = (data: any[]) => {
  dbObj.storeCharacters(
    data,
    () => {
      console.log('stored values');
    },
    (error: any) => {
      console.error('there was an error', error);
    }
  );
};

const fetchData = (offset: number, total: number, results: any[]) => {
  const limit = 100;
  try {
    const ts = new moment().unix();
    const hash = md5(ts + pri + pub);
    const url = `http://gateway.marvel.com/v1/public/characters?apikey=${pub}&hash=${hash}&ts=${ts}&limit=${limit}&offset=${offset}`;
    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        total = data.data.total;
        const APIresults = data.data.results.map((result: any) => {
          return [result.id, result.name];
        });
        const newResults = [...results, ...APIresults];

        if (offset + limit < total) {
          offset += limit;
          fetchData(offset, total, newResults);
        } else {
          storeData(newResults);
        }
      });
  } catch (err) {
    console.error(err);
  }
};

cron.schedule('1 0 * * *', () => {
  fetchData(0, 1, []);
});

fetchData(0, 1, []);
