import feedparser

class newsfeed:
    def __init__(self, articles):
        self.articles = articles
    def update(self):
        feed = []
        for article in self.articles:
            resp = feedparser.parse(article).entries
            for story in resp:
                feed.append({
                    "title": story.title,
                    "link": story.link,
                    "description": story.description.split('<')[0]
                })
        return feed
