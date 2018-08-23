var cron = require('node-cron');

const unirest = require('unirest'); //get
var https = require("http"); //post carpo
//log
var logger = require("./logger");

//end log

//cứ 4 tiếng cho chạy 1 lần
// cron.schedule('0 */4 * * *', function () {
//     savehomecustomerdb();
// });

//cứ 30 giây cho chạy 1 lần
cron.schedule('0 */4 * * *', function () {
    console.log('begin call');
    updateEndPoint();
    console.log('end call');
});
function updateEndPoint() {
    var options = {
        //host: "45.119.81.181",
        host: "192.168.1.184",
        port: 8080,
        path: "/API_CARPO/update-end-point-car-in-home-calculator-km-before",
        method: "GET"
    };
    var authRequest = https.request(options, function (authResponse) {
        var responseString = "";

        authResponse.on('data', function (data) {
            responseString += data;
        });
        authResponse.on("end", function () {
            var status = JSON.parse(responseString).status; //ní
            if (status == 1) {
                logger.info("Cập nhật tọa độ cuối cùng Customer before Thành công!!!");
            } else {
                logger.error("Cập nhật tọa độ cuối cùng Home Customer before Thất bại!!!");
            }
        });
    });
    authRequest.end();
}