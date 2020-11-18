# homebridge-sonos-starter-trackuri
[Homebridge](https://github.com/nfarina/homebridge) Accessory to start presets via [node-sonos-http-api](https://github.com/jishi/node-sonos-http-api).

## Usecase
Automate regular playback in Homekit e.g. start a favorite playlist or radio in a specific room at a specific volume with Siri.


**planetWayne - TrackURI variation**

This modified version take the idea of using the TrackURI to see if the Sonos is actually playing a track that you have optionally defined in the preset. The idea being that if you have multiple of these devices set up, they all appear as switches, you want to know if a particular 'switch' is on / playing. For use when you are streaming radio channels and may have multiple set up.

What I was finding was if I had multiple 'presets' defined with differnet streaming channels, each time you switched to another preset you ended up with a row of 'on' switches and no way of knowing what was actually playing. Then if you turned one off, they would all go off. This version looks at the TrackURI setting and compairs that to your config, and only reporting as being 'on' if the track matched. It will also 'turn off' the other switches in homekit.

To get the URI for your config, either to configure the preset in 'Node-Sonos-HTTP-API' and then to match in your homebridge config.json, load up your desired streaming channel, get it playing, then use the /state URL with '..HTTP-API' and look for the section 'TrackUri' and copy its data. Paste that into your Config.json file.

NOTE: 
This is functionally the same as the original work done by [Dirk Winkler](https://github.com/stickcgn/homebridge-sonos-starter.git) and is pretty much a drop in replacement, the only thing to note is the accessory name needs to be changed to use this version. If you already have a comprehensive setup then you can keep that config and not worry about a value for the TrackURI for it to work in the same way.


<s>At this point - there is no NPM - haven't figured that out yet!!</s> [Yes there is now!] (https://www.npmjs.com/package/homebridge-sonos-starter-track)


## Prerequisites

[Homebridge](https://github.com/nfarina/homebridge) and [node-sonos-http-api](https://github.com/jishi/node-sonos-http-api) are installed.

## Installation

Clone this repository, change into that forlder and execute the following
```
npm install
npm link
```

## Configuration

Add accessory to `~/.homebridge/config.json` of [Homebridge](https://github.com/nfarina/homebridge) like this:

```
...
"accessories": [
    ...
    {
        "accessory": "SonosStarterTrack",
        "name": "Morning Music",
        "apiBaseUrl": "http://localhost:5005",
        "preset": "workday-morning"
        "trackURI": "x-sonosapi-stream:...{GetDetails from sonosapi/state}"
    },
    ...
```

- `accessory` needs to be `SonosStarterTrack`
- `name` is the name that HomeKit will use
- `apiBaseUrl` is the base URL where [node-sonos-http-api](https://github.com/jishi/node-sonos-http-api) lives
- `preset` is the [node-sonos-http-api](https://github.com/jishi/node-sonos-http-api)-preset that should be started
- `trackURI` *Optional* this is the trackUri taken from the /stats page of [node-sonos-http-api](https://github.com/jishi/node-sonos-http-api) - this is used to see if a particular track or stream is playing. The idea being that you can have visualisation and within HomeKit that the track you have in your 'preset' is indeed the track playing. 

## Finally

Restart [Homebridge](https://github.com/nfarina/homebridge) and that's it. Tested with node 6 on a raspi.
