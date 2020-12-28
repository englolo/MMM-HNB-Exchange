/* Magic Mirror
 * Node Helper: MMM-HNB-Exchange
 *
 * By Lolo
 * MIT Licensed.
 */
const NodeHelper = require('node_helper');
const request = require('request');
var self;


module.exports = NodeHelper.create({
	
	start: function() {
		self = this;
		console.log("Starting node_helper for: " + this.name);			
	},

	getHNB: function() {
        var self = this;
		if (self.config.currency.length == 0){
		var url = self.config.url ;
		}
		else {
		var url = self.config.url+ self.getCurrency(); 	
		}
		request({
            url: url,
            method: 'GET'
            }, (error, response, body) => {
			    if (!error && response.statusCode == 200) {
				    var result = JSON.parse(body);
				
				console.log(response.statusCode + result);
					self.sendSocketNotification('HNB_RESULT', result);		
			}
		});
	},
    
	getCurrency: function() {
     var currency =self.config.currency.map(function(ele) {
	     return "&valuta=" + ele ;
		  }).join("").replace('&','?'); 
		return currency
	},

	socketNotificationReceived: function (notification, payload) {
        if (notification === 'GET_HNB') {
			self.config = payload
			this.getHNB();
		}
	}
});