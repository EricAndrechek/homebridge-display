# Welcome to Homebridge-Display, the pretty display for Homebridge

[![NPM](https://nodei.co/npm/homebridge-display.png?compact=true)](https://www.npmjs.com/package/homebridge-display)

[![NPM Downloads](https://img.shields.io/npm/dt/homebridge-display)](https://www.npmjs.com/package/homebridge-display)
[![npm (tag)](https://img.shields.io/npm/v/homebridge-display/latest)](https://www.npmjs.com/package/homebridge-display/v/latest)
[![PayPal](https://img.shields.io/badge/PayPal-Donate-green)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=eric%40andrechek.com&currency_code=USD&source=url)

Homebridge is amazing, but don't you wish there was a way to view it in a prettier, less developer focused dashboard?

![Preview of Homebridge-Display in action](https://i.postimg.cc/sx6Trhdr/demo.jpg)

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
- Move Spotify, weather, and Homebridge update requests to server side to avoid maxing out api calls when multiple clients connect
- Add support for multiple music players
- Allow more customization of what is displayed on the screen with a sort of box approach
- Support multiple screen resolutions
- Dynamically change what is on the screen as programmable events occur
- Add support for more HomeKit accessories like thermostats

### Widgets to add:
- Calculator
- Note taking integration
- Calendar integrations
- Todo list integrations
- Radar map
- Apple FindMy info/map
- Internet speed logging dashboard
- RTSP camera embedding
- Stocks and Cryptos
- Homebridge Stats (CPU and RAM usage)
- Custom API support

### Currently Supported Widgets:
- Spotify (display and control playback) - **Only works with Premium accounts and [requires you to create an API key](###Spotify)**
- Weather (show the current conditions, precipitation forecast, 48 forecast, and 7 day forecast - **[Requires you to create a free OpenWeather API key](###Weather)**
- Calculator
- News (add as many RSS feeds as you would like and it will cycle through stories)
- Lyrics (show the live lyrics to the current song you are listening to) **Not all songs have available or accurate lyrics**
- Accessory Control (control any switches connected to your Homebridge server) **Currently only works with switches and Homebridge must be running in insecure mode**

For feature requests or bugs please create an issue!

## Support
If you would like to support this project please feel free to create a pull request, create an issue to submit and idea or feature request, or **[donate](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=eric%40andrechek.com&currency_code=USD&source=url)**!