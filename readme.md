# Welcome to Homebridge-Display, the pretty display for Homebridge

[![NPM](https://nodei.co/npm/homebridge-display.png?compact=true)](https://nodei.co/npm/homebridge-display/)

[![NPM Downloads](https://img.shields.io/npm/dt/homebridge-display)](https://www.npmjs.com/package/homebridge-display)
[![Stars](https://img.shields.io/github/stars/EricAndrechek/homebridge-display)](https://github.com/EricAndrechek/homebridge-display/stargazers)
[![Open Issues](https://img.shields.io/github/issues-raw/EricAndrechek/homebridge-display)](https://github.com/EricAndrechek/homebridge-display/issues?q=is%3Aopen+is%3Aissue)
[![Closed Issues](https://img.shields.io/github/issues-closed-raw/EricAndrechek/homebridge-display)](https://github.com/EricAndrechek/homebridge-display/issues?q=is%3Aissue+is%3Aclosed)
[![PayPal](https://img.shields.io/badge/PayPal-Donate-green)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=eric%40andrechek.com&currency_code=USD&source=url)
[![GitHub Sponsors](https://img.shields.io/badge/GitHub%20Sponsors-Donate-green)](https://github.com/sponsors/EricAndrechek)

Homebridge is amazing, but don't you wish there was a way to view it in a prettier, less developer focused dashboard?

![Preview of Homebridge-Display in action](https://i.postimg.cc/DzgvPyNr/demo.jpg)

With Homebridge-Display, you can control and view Spotify, see the weather forecast and current conditions, see news articles, control some homebridge devices, and much, much more!

## Installation

Using the [Config UI X Plugin](https://github.com/oznu/homebridge-config-ui-x#readme) search for "homebridge display" and install it. 

*OR*

Alternatively, install it from npm using `sudo -E -n npm install homebridge-display@latest`

## Setup

### Config
To change the image displayed as a background, upload an image to any hosting site like [Postimage](https://postimages.org/) and paste the **direct link** in the config.

### Spotify
For Spotify control, register for [a free Spotify Developer Account](https://developer.spotify.com/dashboard/applications) and create an app. Be sure to add the callback url in the Spotify application to be the same one in the callback URL field (callback URL should be the URL you use to access the homebridge-display webpage (including the port number) followed by /callback)

**Note: to utilize the Spotify widget you must have a Premium account**

### Weather
To display the weather, register for a free API Key from [OpenWeather](https://openweathermap.org/api) and add your latitude and longitude

### News
Find your favorite news site as an RSS feed - it should look something like this: http://rss.cnn.com/rss/cnn_tech.rss

You can add as many RSS feeds as you would like and can even specify the amount of time (in seconds) each story should display for.

### Accessory Control
In order to control devices via your Homebridge-Display, you will need to enable Insecure mode in Homebridge. This can be done by either adding the -I flag to your startup command or by enabling Insecure mode in Homebridge settings.

**Currently only switches can be controlled via Homebridge-Display, but adding settings for more accessories is on the roadmap!**

## Usage
Currently, this only displays properly on an iPad with screen resolution of  1024px by 768px, but other resolutions are in progress.

For best results, **add this web app to your homescreen so that it may display in fullscreen**.

## TODOs:
- [ ] Move widget update requests to server side to avoid maxing out api calls when multiple clients connect
- [x] Allow more customization of what is displayed on the screen with a sort of box approach
- [x] Support multiple screen resolutions
- [ ] Support wider screen resolutions and narrower screens like phones (maybe 4-wide for wide displays and 1-wide for phones)
- [ ] Dynamically change what is on the screen as programmable events occur
- [ ] Add support for more HomeKit accessories like thermostats
- [ ] Add instructions/help as to how the UI and controls work
- [x] Debug "N" token in JSON parsing on frontend from Spotify update (occurs when content first begins streaming)
- [ ] Basic XSS prevention
- [ ] Reroute all requests and internet through the server
- [x] Custom CSS
- [ ] Login protection to view UI
- [x] Custom homescreen webapp icon
- [ ] Fix swipe and touch control on computer version of UI
- [x] Fix weather hourly parsing issues
- [ ] Way to send links clicked or more info about something to phone or computer via Twilio or email
- [ ] Moving picture frame background (google photos or other album links to play in a slide show)
- [ ] Better way to universally ensure text is visible over the background image
- [ ] Allow support to run standalone without homebridge
- [ ] UUID generation and checking to verify the client is running on the same Homebridge instance as the server, that way if configs are updated to not support Spotify but an outdated client still tries to request Spotify data (which would normally throw an error) it will prevent the request in the first place and prompt the user for a hard refresh if a normal refresh doesn't update the cache
- [x] Automatically refresh Spotify access_token when it expires
- [ ] Spotify progress bar offset vertically

###### As I complete these TODOs I delete them from this list ***unless I am not 100% they are completed and fixed***, in which case I give them a check mark and leave them here until I know they are resolved.

### Widgets to add:
- Apple Music display and control
- Sonos display and control
- Note taking integration
- Calendar integrations
- Todo list integrations
- Radar map
- Apple FindMy info/map
- Internet speed logging dashboard
- RTSP/IP camera embedding
- Stocks and Cryptos
- Homebridge Stats (CPU and RAM usage)
- Custom API support
- Strava workout info or feed
- Apple Health data / Apple Watch activities and goals
- Chromecast/Airplay type streaming receiver (ie send YouTube videos to it)
- Mirror (just display what the camera sees)
- Show new emails, discord messages, etc (any messaging platform with an API)
- Moving picture frame widget (google photos or other album links to play in a slide show)
- Music visualization (potentially integrate with lyrics widget)

### Currently Supported Widgets:
- Spotify (display and control playback) - **Only works with Premium accounts and [requires you to create an API key](###Spotify)**
- Weather (show the current conditions, precipitation forecast, 48 forecast, and 7 day forecast - **[Requires you to create a free OpenWeather API key](###Weather)**
- Calculator
- News (add as many RSS feeds as you would like and it will cycle through stories)
- Lyrics (show the live lyrics to the current song you are listening to) **Not all songs have available or accurate lyrics**
- Accessory Control (control any switches connected to your Homebridge server) **Currently only works with switches and Homebridge must be running in insecure mode**

For feature requests or bugs please create an issue!

## Support
If you would like to support this project please feel free to create a pull request, create an issue to submit and idea or feature request, or **[donate via PayPal](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=eric%40andrechek.com&currency_code=USD&source=url)** or **[GitHub Sponsors](https://github.com/sponsors/EricAndrechek)**! (*Note, with GitHub Sponsors you have the ability to have your name added to the contributors list and even bring specific features or fixes to the top of my development queue. For more info, see the tier information on my GitHub sponsors page.)