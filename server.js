var cron = require('node-cron');

const unirest = require('unirest'); //get
var https = require("http"); //post carpo
//log
var logger = require("./logger");

//end log
cron.schedule('*/10 * * * * *', function () {
    getTracking();    
});

//lấy vị trí xe hiện tại
function getTracking() {
    unirest.get("https://client-api.quanlyxe.vn/v3/tracking/getvehiclestatuses?id=0&ticks=0&apikey=af0792a100734217c2694e960bad83da")
        .strictSSL(false)
        .end(function (res) {
            if (res.error) {
                logger.info('GET error', res.error);
            } else {
                result = JSON.parse(JSON.stringify(res.body));
                if (result.Data != []) {
                    var data = [];
                    // console.log('tracking' , tracking);
                    result.Data.forEach(function (tracking) {
                        var element = {};
                        var district = '';
                        try {
                            if(tracking.Address == null){
                                tracking.Address = '';
                            }
                            if (tracking.Address != '') {
                                var address_parse = tracking.Address.split(',');
                                district = address_parse[address_parse.length - 2];
                            }
                        } catch (error) {
                            district = '';
                        }

                        var status = tracking.Status;
                        var speed = tracking.Speed;
                        if (status == 1 && speed > 0) {
                            element.device_id = tracking.Id;
                            element.location_lat = tracking.Y;
                            element.location_long = tracking.X;
                            element.type = "1";
                            if(district != undefined)
                                element.district_name = district.trim();
                            else
                                element.district_name = '';
                            element.status = status;
                            element.speed = speed;
                            element.heading = tracking.Heading;
                            element.distance = tracking.Distance;
                            element.address = tracking.Address.trim();
                            data.push(element);
                        }
                    });
                    if (data.length > 0) {
                        //gọi api của ní để insert tracking many
                        //post lên mongodb carpo api
                        try {
                            var requestBody = "listObj=" + JSON.stringify(data);
                            var options = {
                                host: "172.16.160.3",
                                port: 8080,
                                path: "/API_CARPO/insert-tracking-gps-box-many",
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded",
                                    "AuthorizationGPS": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwOTgyMjIyMjIiLCJleHAiOjE1MTQ3MTQyNDR9.EHYx79kTlQyvLhZPfWGumGRAWC1z9LkE086n0zgGfxaQXUghdgC3SnPyqneurgyRyvk7_Nxn8KnyY_T1AavYVQ"
                                }
                            };
                            // console.log('data' , data);
                            // console.log('requestBody' , requestBody);
                            var authRequest = https.request(options, function (authResponse) {
                                var responseString = "";

                                authResponse.on('data', function (data) {
                                    responseString += data;
                                });
                                authResponse.on("end", function () {
                                    var status = JSON.parse(responseString).status;
                                    if (status == "1") {
                                        logger.info("Thêm Thành công!!!");
                                    }
                                });
                            });
                            authRequest.write(requestBody);
                            authRequest.end();
                            //end post
                        } catch (error) {
                            console.log('error' , error);
                            logger.info("Lỗi không insert được!!!");
                        }
                    }
                }
            }
        });
}