var cron = require('node-cron');

const unirest = require('unirest'); //get
var https = require("http"); //post carpo
//log
var logger = require("./logger");

//end log
cron.schedule('*/1 * * * * *', function () {
    getTracking();
});

//lấy vị trí xe hiện tại
function getTracking() {
    unirest.get("http://gps.xtracking.vn/api/tracking/getlivetrack?username=phunguyen&password=123@")
        .strictSSL(false)
        .end(function (res) {
            if (res.error) {
                logger.info('GET error', res.error);
            } else {
                result = JSON.parse(JSON.stringify(res.body));
                var consolee = 'statusCode:' + res.statusCode + ' total:' + result.total + ' running:' + result.running + ' stop:' + result.stop + ' gps:' + result.gps + ' off:' + result.off;
                logger.info('consolee',  consolee);
                console.log('1s', consolee);        
            }
        });
}