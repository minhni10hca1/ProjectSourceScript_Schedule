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
cron.schedule('*/30 * * * * *', function () {
    savehomecustomerdb();
});


function savehomecustomerdb() {
    var options = {
        host: "45.119.81.181",
        port: 8080,
        path: "/API_CARPO/save-home-customer-db",
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
                logger.info("Cập nhật Save Home Customer Thành công!!!");
            } else {
                logger.info("Cập nhật Save Home Customer Thất bại!!!");
            }
        });
    });
    authRequest.end();
}