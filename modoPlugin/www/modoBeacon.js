var exec = require('cordova/exec');

function ModoBeaconPlugin() {}

/**
 * @param string baseUrl - eg. https://demo.modopayments.com/beacon_service/api/
 * @return null|string - error message
 -(void)setup:(CDVInvokedUrlCommand*)command;
 /**
 * @param float latitude
 * @param float longitude
 * @return null|string - error message
 -(void)setLocation:(CDVInvokedUrlCommand*)command;
 /**
 * @return dictionary|string - error message, or a dictionary of "area"=area ID, "x", "y"
 -(void)startScan:(CDVInvokedUrlCommand*)command;
 /**
 * @return null|string - error message
 -(void)stopScan:(CDVInvokedUrlCommand*)command;
 /**
 * @return null|string - error message
 -(void)startBroadcast:(CDVInvokedUrlCommand*)command;
 /**
 * @return null|string - error message
 -(void)stopBroadcast:(CDVInvokedUrlCommand*)command;

 /**
 * @return int|string - error message
 -(void)getRequestTimeout:(CDVInvokedUrlCommand*)command;
 /**
 * @param int timeout Must be greater than or equal to 0
 * @return int|string - error message
 -(void)setRequestTimeout:(CDVInvokedUrlCommand*)command;
 /**
 * @return float|string - error message
 -(void)getNavigationThreshold:(CDVInvokedUrlCommand*)command;
 /**
 * @param float threshold Must be between 0 and 1
 * @return float|string - error message
 -(void)setNavigationThreshold:(CDVInvokedUrlCommand*)command;
 /**
 * @return bool|string - error message
 -(void)isInitialized:(CDVInvokedUrlCommand*)command;
 /**
 * @return string - error message, or image data in the form "data:image/png;base64,..."
 -(void)getMapImage:(CDVInvokedUrlCommand*)command;
 /**
 * @return string - error message, or the ID of the map
 -(void)getMapId:(CDVInvokedUrlCommand*)command;
 /**
 * @return string - error message, or the name of the map
 -(void)getMapName:(CDVInvokedUrlCommand*)command;
 */

ModoBeaconPlugin.prototype.setup = function(cbsuccess, cbfail, baseUrl) {
    cordova.exec(cbsuccess, cbfail, "ModoBeaconPlugin", "setup", [baseUrl]);
};

ModoBeaconPlugin.prototype.setLocation = function(cbsuccess, cbfail, latitude, longitude) {
    cordova.exec(cbsuccess, cbfail, "ModoBeaconPlugin", "setLocation", [latitude, longitude]);
};

ModoBeaconPlugin.prototype.startScan = function(cbsuccess, cbfail) {
    cordova.exec(cbsuccess, cbfail, "ModoBeaconPlugin", "startScan", []);
};

ModoBeaconPlugin.prototype.stopScan = function(cbsuccess, cbfail) {
    cordova.exec(cbsuccess, cbfail, "ModoBeaconPlugin", "stopScan", []);
};

ModoBeaconPlugin.prototype.startBroadcast = function(cbsuccess, cbfail) {
    cordova.exec(cbsuccess, cbfail, "ModoBeaconPlugin", "startBroadcast", []);
};

ModoBeaconPlugin.prototype.stopBroadcast = function(cbsuccess, cbfail) {
    cordova.exec(cbsuccess, cbfail, "ModoBeaconPlugin", "stopBroadcast", []);
};

ModoBeaconPlugin.prototype.getRequestTimeout = function(cbsuccess, cbfail) {
    cordova.exec(cbsuccess, cbfail, "ModoBeaconPlugin", "getRequestTimeout", []);
};

ModoBeaconPlugin.prototype.setRequestTimeout = function(cbsuccess, cbfail, timeout) {
    cordova.exec(cbsuccess, cbfail, "ModoBeaconPlugin", "setRequestTimeout", [timeout]);
};

ModoBeaconPlugin.prototype.getNavigationThreshold = function(cbsuccess, cbfail) {
    cordova.exec(cbsuccess, cbfail, "ModoBeaconPlugin", "getNavigationThreshold", []);
};

ModoBeaconPlugin.prototype.setNavigationThreshold = function(cbsuccess, cbfail, threshold) {
    cordova.exec(cbsuccess, cbfail, "ModoBeaconPlugin", "setNavigationThreshold", [threshold]);
};

ModoBeaconPlugin.prototype.isInitialized = function(cbsuccess, cbfail) {
    cordova.exec(cbsuccess, cbfail, "ModoBeaconPlugin", "isInitialized", []);
};

ModoBeaconPlugin.prototype.getMapImage = function(cbsuccess, cbfail) {
    cordova.exec(cbsuccess, cbfail, "ModoBeaconPlugin", "getMapImage", []);
};

ModoBeaconPlugin.prototype.getMapId = function(cbsuccess, cbfail) {
    cordova.exec(cbsuccess, cbfail, "ModoBeaconPlugin", "getMapId", []);
};

ModoBeaconPlugin.prototype.getMapName = function(cbsuccess, cbfail) {
    cordova.exec(cbsuccess, cbfail, "ModoBeaconPlugin", "getMapName", []);
};

module.exports = new ModoBeaconPlugin();