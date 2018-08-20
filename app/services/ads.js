var admobModule = require("nativescript-admob");
var testing = false;

exports.showFullBanner = function() {
    this.createBanner(admobModule.AD_SIZE.FULL_BANNER);
}

exports.showLargeBanner = function() {
    this.createBanner(admobModule.AD_SIZE.LARGE_BANNER);
}

exports.showLeaderboard = function() {
    this.createBanner(admobModule.AD_SIZE.LEADERBOARD);
}

exports.showMediumRectangle = function() {
    this.createBanner(admobModule.AD_SIZE.MEDIUM_RECTANGLE);
}

exports.showSmartBanner = function() {
    this.createBanner(admobModule.AD_SIZE.SMART_BANNER);
}

exports.createBanner = function(size) {
    admobModule.createBanner({
        testing: testing,
        size: size,
        iosBannerId: "ca-app-pub-9484566351690102/1276905300",
        androidBannerId: "ca-app-pub-9484566351690102/1276905300",
        iosTestDeviceIds: ["yourTestDeviceUDIDs"],
        margins: {
            bottom: 0
        }
    }).then(function() {
        console.log("admob createBanner done.");
    }, function(error) {
        console.log("admob createBanner error: " + error);
    });
}

exports.hideBanner = function() {
    admobModule.hideBanner().then(function() {
        console.log("admob hideBanner done");
    }, function(error) {
        console.log("admob hideBanner error: " + error);
    });
}

exports.showInterstitial = function() {
    admobModule.createInterstitial({
        testing: testing,
        iosInterstitialId: "ca-app-pub-9484566351690102/7016317144",
        androidInterstitialId: "ca-app-pub-9484566351690102/7016317144",
        iosTestDeviceIds: ["yourTestDeviceUDIDs"]
    }).then(function() {
        console.log("admob createInterstitial done");
    }, function(error) {
        console.log("admob createInterstitial error: " + error);
    });
}
