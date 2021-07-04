var inherits = require('util').inherits;
var Service, Characteristic, VolumeCharacteristic;

module.exports = function(homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory("homebridge-sonos-starter-track", "SonosStarterTrack", SonosAccessory);
}

const httpRequest = function(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? require('https') : require('http');
    const request = lib.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
         reject(new Error('Failed to load page, status code: ' + response.statusCode));
       }
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => resolve(body.join('')));
    });
    request.on('error', (err) => reject(err))
    })
};

function SonosAccessory(log, config) {
        this.log = log;
        this.config = config;
        this.name = config["name"];
        this.apiBaseUrl = config["apiBaseUrl"];
        this.preset = config["preset"];

        this.trackURI = config["trackURI"];
        this.log("Track Enhanced v1.0.17");
        if (this.trackURI){
	        this.log("Track URI Found = " + this.trackURI);
        } else {
        	this.log("No TrackURI defined for this instance");
        }

        
        // Look for a new field 'onPauseWhat' - this will be a json array of zones / players that you want to pause on turning
        // an item off. If found then each player / zone is sent the pause command instead of a 'pauseAll'
        this.onPauseWhat = config["onPauseWhat"];



        if (!this.apiBaseUrl) throw new Error("You must provide a config value for 'apiBaseUrl'.");
        if (!this.preset) throw new Error("You must provide a config value for 'preset'.");

        this.service = new Service.Switch(this.name);

        this.service
                .getCharacteristic(Characteristic.On)
                .on('get', this.getOn.bind(this))
                .on('set', this.setOn.bind(this));
}



SonosAccessory.prototype.getServices = function() {
	return [this.service];
}

SonosAccessory.prototype.getOn = function(callback) {
	var anyPlaying = false;
	httpRequest(this.apiBaseUrl + "/zones")
		.then((data) => {
			this.log("getting zones");
			const zones = JSON.parse(data);
			zones.forEach((zone) => {
				this.log(">  " + zone.coordinator.roomName + ": " + zone.coordinator.state.playbackState);
                                if(zone.coordinator.state.playbackState === "PLAYING") {
                                         if(this.trackURI){
                                                this.log("We have playback, but is it nominated track?");
                                                this.log("Reported Track from Sonos = " + zone.coordinator.state.currentTrack.trackUri);
                                                this.log("Track I'm Looking For = " + this.trackURI);
                                                anyPlaying = (this.trackURI === zone.coordinator.state.currentTrack.trackUri);
                                        } else {
                                                anyPlaying = true;
                                        }
                                }
			});			
			this.log("reporting playback", anyPlaying);
			callback(null, anyPlaying);
		})
		.catch((err) => {
	  		this.log("fail", err);
	  		callback(err);
		});
}

SonosAccessory.prototype.setOn = function(on, callback) {
	if (on) {
		this.log("About to start " + this.preset + "...");
		httpRequest(this.apiBaseUrl + "/preset/" + this.preset)
	  		.then((data) => {
	  			this.log("done");
				callback(null);
	  		})
	  		.catch((err) => {
	  			this.log("fail", err);
	  			callback(err);
	  		});

	} else {

		// Changes for Pause vs PauseAll
		this.log("About to stop " + this.preset + "...");

		if (typeof this.onPauseWhat === 'object') {
			// We have said we want to pause a list of players/zones

			this.log("Pausing individual Zones...");

			var zoneErrors = [];

			this.onPauseWhat.forEach(zoneName => {
					httpRequest(this.apiBaseUrl + "/" + zoneName + "/pause")
			  			.then((data) => {
		  					this.log("Paused " + zoneName);
		  					// callback(null);
					  	})
		  				.catch((err) => {
		  					zoneErrors.push("Pause failed for " + zoneName + " : API Error = " + err);
		  					this.log(zoneErrors[zoneErrors.length - 1]);
		  					
		  					// callback(err);
		  				});

				}
			);

			// Callbacks should only be called once!  Being as though we have built up a multi array of errors and players, return that
			// if there are any. If not, just call 'callback' with the default 'null'
			if (zoneErrors.length === 0) {
				callback(null);
			} else {
				callback(zoneErrors);
			}

		} else {

			httpRequest(this.apiBaseUrl + "/pauseAll")
		  		.then((data) => {
		  			this.log("Paused all");
					callback(null);
		  		})
		  		.catch((err) => {
		  			this.log("Pause All Failed : API Error = " + err);
		  			callback("Pause All Failed : API Error = " + err);
		  		});

	  	}
	}
}
