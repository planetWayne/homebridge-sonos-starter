# homebridge-sonos-starter-track

[![verified-by-homebridge](https://badgen.net/badge/homebridge/verified/purple)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins)


[Homebridge](https://github.com/nfarina/homebridge) Accessory to start presets via [node-sonos-http-api](https://github.com/jishi/node-sonos-http-api). 


## Version 1.0.19 Update
We've been verified! How cool is that! - now have the right to display the verified-by-Homebridge badge!
Oh, and for some stupid reason, I'd got my version numbers wrong in the ReadMe and ChangeLog (10. instead of 1.) - which has been corrected - Doh!

Previous versions listed in CHANGELOG.md


## Use-case
Automate regular playback in Homekit e.g. start a favourite playlist or radio / streaming service in a specific room at a specific volume with Siri.


## **planetWayne - Track variation**

This modified version takes the idea of using the TrackURI to see if the Sonos is actually playing a track that you have optionally defined in a preset. The idea being that if you have multiple of these devices set up, they all appear as switches, you want to know if a particular 'switch' is on / playing. For use when you are streaming radio channels and may have multiple set up.

What I was finding is if I had multiple 'presets' defined with different streaming channels, each time you switched to another preset you ended up with a row of 'on' switches and no way of knowing what was actually playing. Then if you turned one off, they would all go off. This version looks at the TrackURI setting and comparers that to your config, and only reporting as being 'on' if the track matched. It will also 'turn off' the other switches in Homekit.

To get the URI for your config, either to configure the preset in 'Node-Sonos-HTTP-API' and then to match in your Homebridge config.json, load up your desired streaming channel, get it playing, then use the /state URL with '..HTTP-API' and look for the section 'TrackUri' and copy its data. Paste that into your Config.json file.

NOTE: 
This is functionally the same as the original work done by [Dirk Winkler](https://github.com/stickcgn/homebridge-sonos-starter.git) and is pretty much a drop in replacement, the only thing to note is the accessory name needs to be changed to use this version. If you already have a comprehensive setup then you can keep that config and not worry about a value for the TrackURI for it to work in the same way, just update the accessory name.


<s>At this point - there is no NPM - haven't figured that out yet!!</s> [Yes there is now!](https://www.npmjs.com/package/homebridge-sonos-starter-track)



## Prerequisites

[Homebridge](https://github.com/nfarina/homebridge) and [node-sonos-http-api](https://github.com/jishi/node-sonos-http-api) are installed.

## Installation

### Install via Homebridge Config UI X

1. Search for `Sonos Starter Track` on the Plug-ins tab of [Homebridge Config UI](https://www.npmjs.com/package/homebridge-config-ui-x).
2. Install the `Homebridge Sonos Starter Track` plug-in and use the form to set up your configuration.


### Manual Installation

Clone this repository, change into that folder and execute the following
```
npm install
npm link
```
Or directly from NPM
```
sudo npm -g install homebridge-sonos-starter-track
```

## Configuration

Add accessory to `~/.homebridge/config.json` of [Homebridge](https://github.com/nfarina/homebridge) like this:

```
...
"accessories": [
    ...
    {
        "accessory": "SonosStarterTrack",
        "name": "Kitchen BBC Radio 2",
        "apiBaseUrl": "http://localhost:5005",
        "preset": "Kitchen-Radio2"
        "trackURI": "x-sonosapi-stream:...{GetDetails from sonosapi/state}"
        "onPauseWhat": ["Kitchen","Bedroom","Lounge"]
    },
    ...
```

You can have multiple accessories with different presets, just duplicate the accessory section and change the name, preset, trackURI and onPauseWhat accordingly.


- `accessory` needs to be `SonosStarterTrack`
- `name` is the name that HomeKit will use
- `apiBaseUrl` is the base URL where [node-sonos-http-api](https://github.com/jishi/node-sonos-http-api) lives
- `preset` is the [node-sonos-http-api](https://github.com/jishi/node-sonos-http-api) - preset that should be started
- `trackURI` *Optional* this is the 'trackUri' taken from the /stats page of [node-sonos-http-api](https://github.com/jishi/node-sonos-http-api) - this is used to see if a particular track or stream is playing. The idea being that you can have visualisation within HomeKit that the track you have in your 'preset' is indeed the track playing.
- `onPauseWhat` *Optional* This is an array / list of Zones that you want to pause when a device gets turned 'off'. The idea being that now you can pause specific players / Zones instead of pausing your whole Sonos system.
    *At present - ~~due to lack of understanding on may part, there is a bug where it doesnt work if there is more than one entry in the array, but instead of scrapping the whole thing, you can pause ONE zone or player.~~ Hopefully that bug is now fixed in v1.0.15 but I have no way to test it! - feedback Welcomed*


## Finally

Restart [Homebridge](https://github.com/nfarina/homebridge) and that's it. Original DW version Tested with node 6 on a ras-pi, this version also running with Homebridge on OSX
