![](https://raw.githubusercontent.com/tymmesyde/ratingsplus-stremio-addon/master/static/icon.png)
# Ratings+: Stremio Addon

Built with [stremio-addon-sdk](https://github.com/Stremio/stremio-addon-sdk)

## Install

- Install node packages: `npm install`
- Create an .env file at the root, add and update these variables:
  
```
PORT=4561
DOMAIN="{DOMAIN_URL}"
CACHE_INTERVAL=86400000
API_KEY="{OMDB_API_KEY}"
IMDB_RATINGS="https://datasets.imdbws.com/title.ratings.tsv.gz"
DATASET_PATH="cache/ratings.json"
```