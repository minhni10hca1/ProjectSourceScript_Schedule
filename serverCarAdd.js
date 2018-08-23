var cron = require('node-cron');

const unirest = require('unirest'); //get
var https = require("http"); //post carpo
//log
var logger = require("./logger");

//end log
cron.schedule('*/1 * * * *', function () {
    getTracking();    
});

//lấy vị trí xe hiện tại
function getTracking() {
    unirest.get("http://gpsthk.net/apim/tracking/getlivetrack?username=nextmarketing&password=123@")
        .strictSSL(false)
        .end(function (res) {
            if (res.error) {
                logger.info('GET error', res.error);
            } else {
                result = JSON.parse(JSON.stringify(res.body));
                //console.log('result body:' + JSON.stringify(res.body) );
                if (result.data != []) {
                    var data = [];
                    // console.log('tracking' , tracking);
                    result.data.forEach(function (tracking) {
                        var element = {};
                        var district = '';
                        try {
                            console.log('address begin:' + tracking.Address);
                            if(tracking.Address == null){
                                tracking.Address = '';
                            }
                            if (tracking.Address != '') {
                                var address_parse = tracking.Address.split(',');
                               // console.log('address before:' + address_parse);
                                district = address_parse[address_parse.length - 2];
                               // console.log('address after:' + district );
                            }
                        } catch (error) {
                            district = '';
                        }

                        var status = tracking.Status;
                        var speed = tracking.Speed;
                        if (status.includes('Chạy')) {
                            element.device_id = tracking.Id;
                            // element.location_lat = tracking.Y;
                            // element.location_long = tracking.X;
                            element.location_lat = tracking.x;
                            element.location_long = tracking.y;
                            element.type = "1";
                            // logger.info("tracking.Address:" + tracking.Address);
                            // logger.info("district:" + district);
                            if(district != undefined)
                                element.district_name = district.trim();
                            else
                                element.district_name = '';
                            // element.status = status;
                            element.status = 1;
                            element.speed = speed;
                            element.heading = 1;//tracking.Heading;
                            // element.distance = tracking.Distances;
                            element.distance = tracking.Distances*1000;
                            if(tracking.Address != undefined)
                                element.address = tracking.Address.trim();
                            else
                                element.address = '';
                            
                            data.push(element);
                        }
                    });
                    if (data.length > 0) {
                       console.log('data insert tracking: ' + JSON.stringify(data) );
                       // gọi api của ní để insert tracking many
                        //post lên mongodb carpo api
                        try {
                            var requestBody = "listObj=" + JSON.stringify(data);
                            // var options = {
                            //     host: "172.16.160.3",
                            //     port: 8080,
                            //     path: "/API_CARPO/insert-tracking-gps-box-many",
                            //     method: "POST",
                            //     headers: {
                            //         "Content-Type": "application/x-www-form-urlencoded",
                            //         "AuthorizationGPS": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwOTgyMjIyMjIiLCJleHAiOjE1MTQ3MTQyNDR9.EHYx79kTlQyvLhZPfWGumGRAWC1z9LkE086n0zgGfxaQXUghdgC3SnPyqneurgyRyvk7_Nxn8KnyY_T1AavYVQ"
                            //     }
                            // };

                            var options = {
                                host: "192.168.1.184",
                                port: 8080,
                                path: "/insert-tracking-gps-box-many",
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded",
                                    "AuthorizationGPS": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwOTgyMjIyMjIiLCJleHAiOjE1MTQ3MTQyNDR9.EHYx79kTlQyvLhZPfWGumGRAWC1z9LkE086n0zgGfxaQXUghdgC3SnPyqneurgyRyvk7_Nxn8KnyY_T1AavYVQ"
                                }
                            };

                            
                            // var options = {
                            //     host: "172.16.160.3",
                            //     port: 8080,
                            //     path: "/API_CARPO_TEST/insert-tracking-gps-box-many",
                            //     method: "POST",
                            //     headers: {
                            //         "Content-Type": "application/x-www-form-urlencoded",
                            //         "AuthorizationGPS": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwOTgyMjIyMjIiLCJleHAiOjE1MTQ3MTQyNDR9.EHYx79kTlQyvLhZPfWGumGRAWC1z9LkE086n0zgGfxaQXUghdgC3SnPyqneurgyRyvk7_Nxn8KnyY_T1AavYVQ"
                            //     }
                            // };

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
                                        logger.info("Thêm Thành công caradd!!!");
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