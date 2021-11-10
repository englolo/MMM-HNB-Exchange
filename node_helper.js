/* Magic Mirror
 * Node Helper: MMM-HNB-Exchange
 *
 * By Lolo
 * MIT Licensed.
 */
const NodeHelper = require('node_helper');
const fetch = require('node-fetch');
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
		fetch(url)
		.then(res => {
            if (!res.ok) {
                throw Error(res.statusText);
            }
			console.log(res.status);
            return res.json();
        })
        .then(result => {
            result.sort((a, b) => {
                return self.config.currency.indexOf(a.valuta) - self.config.currency.indexOf(b.valuta);
            })
            self.sendSocketNotification('HNB_RESULT', result);
        })
        .catch(error => console.error(`${this.name} ${error.code} ${url}`))
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
