"use strict";

(function () {
    var config = function config(data, fromDate, toDate) {
        var labels = [];
        var datasets = [{
            label: "Current weather data from SMHI",
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,0.8)",
            highlightFill: "rgba(151,187,205,0.75)",
            highlightStroke: "rgba(151,187,205,1)",
            data: []
        }];
        var series = data.timeseries;
        for (var i = 0; i < series.length; i++) {
            var validTime = series[i].validTime;
            var date = new Date(validTime);
            if (fromDate <= date.getDate() && toDate >= date.getDate()) {
                labels.push(validTime);
                datasets[0].data.push(series[i].t);
            }
        }
        return { labels: labels, datasets: datasets };
    };

    var getURL = function getURL(position) {
        var latitude = Math.round(position.coords.latitude * 100) / 100;
        var longitude = Math.round(position.coords.longitude * 100) / 100;
        return "http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/" + latitude + "/lon/" + longitude + "/data.json";
    };

    var locationPromise = new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(function (position, err) {
            if (err) {
                reject(err);
            }
            resolve(position);
        });
    });

    locationPromise.then(function (position) {
        return fetch(getURL(position));
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        var ctx = document.getElementById("myChart").getContext("2d");
        var today = new Date().getDate();
        var tomorrow = today + 1;
        var myNewChart = new Chart(ctx).Line(config(data, today, tomorrow), {
            responsive: true,
            showTooltips: false,
            scaleIntegersOnly: false
        });
        var footer = document.getElementById("footer");
        footer.innerHTML += "Christopher Lillthors 2015";
        footer.className = "footer";
    })["catch"](function (err) {
        console.log(err);
    });
})();

//# sourceMappingURL=compiled.js.map