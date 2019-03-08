require('dotenv').config();
const fs = require('fs');
const https = require('https');
const zlib = require('zlib');
const imdb = require('imdb-api')

const { API_KEY, IMDB_RATINGS, DATASET_PATH } = process.env;
const client = new imdb.Client({ apiKey: API_KEY });

class IMDB {

    init() {
        return new Promise(async (resolve, reject) => {
            console.log('Downloading dataset ...');
            const data = await this.fetchDataSet(IMDB_RATINGS);
            if (!data) reject('Could not fetch dataset ...');
            const save = await this.saveDataSet(data, DATASET_PATH);
            if (!save) reject('Could not save dataset ...');

            resolve('Datasets saved !');
        });
    }

    saveDataSet(data, name) {
        return new Promise(resolve => {
            const json = data.split('\n').map(row => {
                const cols = row.split('\t');
                return {
                    id: cols[0],
                    rating: parseFloat(cols[1]),
                    votes: parseFloat(cols[2])
                }
            });
            json.shift();

            fs.writeFile(`./${DATASET_PATH}`, JSON.stringify(json), err => {
                if (err) resolve(false);
                else resolve(true);
            });
        });
    }

    fetchDataSet(url) {
        return new Promise(resolve => {
            let buffer = [];
            https.get(url, res => {
                var gunzip = zlib.createGunzip();
                res.pipe(gunzip);

                gunzip.on('data', (data) => {
                    buffer.push(data.toString())
                }).on("end", () => {
                    resolve(buffer.join(""));
                }).on("error", (e) => {
                    resolve(null);
                })
            });
        });
    }

    getItems(rating, skip = 0, limit = 30) {
        return new Promise(resolve => {
            fs.readFile(`./${DATASET_PATH}`, (err, data) => {
                if (err) resolve(null);
                const items = JSON.parse(data).filter(row => {
                    return (row.rating >= rating && row.rating < rating + 1)
                });

                items.sort((a, b) => {
                    return (b.votes - a.votes);
                });
                
                resolve(items.slice(skip, limit + skip));
            });
        });
    }

    getMeta(imdb_id) {
        return new Promise(resolve => {
            client.get({ id: imdb_id }).then(imdb_meta => {
                const { title, year, genres, director, actors, plot, poster, rating, imdbid, type } = imdb_meta;
                const meta = {
                    id: imdbid,
                    type: type,
                    name: title,
                    description: plot,
                    director: [director],
                    cast: actors.split(','),
                    year: year,
                    releaseInfo: year,
                    genre: genres.split(','),
                    genres: genres.split(','),
                    imdbRating: rating,
                    poster: poster,
                    background: poster
                };

                resolve(meta);
            }).catch(e => {
                resolve({});
            });
        });
    }
}

module.exports = IMDB;