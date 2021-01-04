# Welcome to Homebridge-Display, the pretty display for Homebridge

[![NPM](https://nodei.co/npm/homebridge-display.png?compact=true)](https://nodei.co/npm/homebridge-display/)

[![NPM Downloads](https://img.shields.io/npm/dt/homebridge-display)](https://www.npmjs.com/package/homebridge-display)
[![Stars](https://img.shields.io/github/stars/EricAndrechek/homebridge-display)](https://github.com/EricAndrechek/homebridge-display/stargazers)
[![Open Issues](https://img.shields.io/github/issues-raw/EricAndrechek/homebridge-display)](https://github.com/EricAndrechek/homebridge-display/issues?q=is%3Aopen+is%3Aissue)
[![Closed Issues](https://img.shields.io/github/issues-closed-raw/EricAndrechek/homebridge-display)](https://github.com/EricAndrechek/homebridge-display/issues?q=is%3Aissue+is%3Aclosed)
[![PayPal](https://img.shields.io/badge/PayPal-Donate-green)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=eric%40andrechek.com&currency_code=USD&source=url)
[![GitHub Sponsors](https://img.shields.io/badge/GitHub%20Sponsors-Donate-green)](https://github.com/sponsors/EricAndrechek)
[![Discord](https://img.shields.io/discord/432663330281226270)](https://discord.gg/6u3uvj5)

Homebridge is amazing, but don't you wish there was a way to view it in a prettier, less developer focused dashboard?

![Preview of Homebridge-Display in action](https://i.postimg.cc/DzgvPyNr/demo.jpg)

With Homebridge-Display, you can control and view Spotify, see the weather forecast and current conditions, see news articles, control some homebridge devices, and much, much more!

## Installation
Using the [Config UI X Plugin](https://github.com/oznu/homebridge-config-ui-x#readme) search for "homebridge display" and install it. 

Alternatively, install it from npm using `sudo -E -n npm install homebridge-display@latest`

## Setup
All of the default values in the config are set up so that it will run properly (displaying only blank widgets) when you first run the server. 

When changing the widget settings, if there are additional config settings listed below the widget selection they must be configured in order for the server to start and run properly. Here is an example of what these additional config values look like:

![Additional Widget Config Settings](https://i.postimg.cc/gcDg9qmp/image.png)

**When you are done making changes and have restarted homebridge, navigate to your homebridge's IP address with the port listed in the config after it. This defaults to `http://homebridge.local:6969` or `http://(your-homebridge-server-ip):6969` with "6969" being the custom port in config.**

## Usage
Currently, this works best on an iPad with a screen resolution of 1024px by 768px, but other resolutions will work. Please note that screen resolutions that are either excessively wide or tall will likely have trouble displaying things properly, but a fix is in progress.

For best results, **add this web app to your iOS device's homescreen so that it may display in fullscreen**.

## Features, Bugs, and Widgets

For all features, bugs, and widgets, you can view their progress in their respective [project boards](https://github.com/EricAndrechek/homebridge-display/projects).

**If you would like to increase the priority of an issue, add a 👍 to the initial issue creation comment. The more 👍 an issue has, the higher priority it will be on my list of things to work on.**

You can also subscribe to a specific issue (feature request, bug report, or widget request) to be notified of when I begin working on it, how the progress is going, and when it is finished.

### [Feature Request/Bug Fixes](https://github.com/EricAndrechek/homebridge-display/projects/1)
Start a [bug report](https://github.com/EricAndrechek/homebridge-display/issues/new?assignees=&labels=bug&template=bug_report.md&title=) or [feature request](https://github.com/EricAndrechek/homebridge-display/issues/new?assignees=&labels=&template=feature-request.md&title=)


### Widgets

#### [Widgets in Development](https://github.com/EricAndrechek/homebridge-display/projects/2)
Pitch an idea for a new widget to be added [here](https://github.com/EricAndrechek/homebridge-display/issues/new?assignees=&labels=widget+request&template=widget-request.md&title=)

#### Current Widgets:
* [Accessory Control](https://github.com/EricAndrechek/homebridge-display/wiki/Accessory-Control)
* [Blank](https://github.com/EricAndrechek/homebridge-display/wiki/Blank)
* [Calculator](https://github.com/EricAndrechek/homebridge-display/wiki/Calculator)
* [Lyrics](https://github.com/EricAndrechek/homebridge-display/wiki/Lyrics)
* [News](https://github.com/EricAndrechek/homebridge-display/wiki/News)
* [Spotify](https://github.com/EricAndrechek/homebridge-display/wiki/Spotify)
* [Weather](https://github.com/EricAndrechek/homebridge-display/wiki/Weather)

#### Future Widgets:
Click [here](https://github.com/EricAndrechek/homebridge-display/projects/2) to see my GitHub Projects Board for widgets I'm in the process of adding or have future plans to add.

#### Widget Request:
If your widget idea is not already listed as a future widget request, click [here](https://github.com/EricAndrechek/homebridge-display/issues/new?assignees=&labels=widget+request&template=widget-request.md&title=) to add a new one.

## Contributors
<a href="https://github.com/EricAndrechek/homebridge-display/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=EricAndrechek/homebridge-display" />
</a>

## Support
If you would like to support this project please feel free to create a pull request, create an issue to submit and idea or feature request, or **[donate via PayPal](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=eric%40andrechek.com&currency_code=USD&source=url)** or **[GitHub Sponsors](https://github.com/sponsors/EricAndrechek)**! (*Note, with GitHub Sponsors you have the ability to have your name added to the contributors list and even bring specific features or fixes to the top of my development queue. For more info, see the tier information on my GitHub sponsors page.)