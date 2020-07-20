const Parser = require('rss-parser');
const parser = new Parser();

class newsfeed {
    constructor(feeds, log, config, api) {
        this.feeds = feeds;
        this.log = log;
        this.config = config;
        this.api = api;
    }
    update() {
        let updated = [];
        for (const url of this.feeds) {
            let feed = await parser.parseURL(url);
            feed.items.forEach(item => {
                updated.push({'title': item.title, 'link': item.link, 'description': item.description.split('<')[0]});
            });
        }
        return updated;
    }
}

module.exports = newsfeed