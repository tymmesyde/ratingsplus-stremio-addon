const { addonBuilder } = require("stremio-addon-sdk")
const IMDB = require("./imdb")
const manifest = require('./manifest.json');

const imdb = new IMDB();
const addon = new addonBuilder(manifest);

addon.defineCatalogHandler(async ({ type, id, extra }) => {
	console.log("CATALOG :", type, id, extra)
	const { genre, skip } = extra;

	let metas = [];

	if (type === 'movie' && id === 'ratings' && genre) {
		const rating = parseFloat(genre);		

		if (rating > 0 && rating < 10) {
			const items = await imdb.getItems(rating, (skip ? parseFloat(skip) : 0), 60);
			metas = await Promise.all(items.map(async item => {
				return await imdb.getMeta(item.id);
			}));

			metas = metas.filter(meta => {
				return (meta.type === 'movie')
			})
		}
	}
	
	return Promise.resolve({ metas: metas })
})

module.exports = addon.getInterface()