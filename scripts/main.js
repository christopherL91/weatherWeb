(function() {
    let config = ((data,fromDate,toDate) => {
        var labels = []
        var datasets = [{
            label: 'Current weather data from SMHI',
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,0.8)",
            highlightFill: "rgba(151,187,205,0.75)",
            highlightStroke: "rgba(151,187,205,1)",
            data: []
        }];
        let series = data.timeseries;
        for (var i = 0; i < series.length; i++) {
            let validTime = series[i].validTime;
            let date = new Date(validTime);
            if(fromDate <= date.getDate() && toDate >= date.getDate()) {
                labels.push(validTime);
                datasets[0].data.push(series[i].t);
            }
        }
        return {labels,datasets};
    });

    let getURL = ((position) => {
        let latitude = Math.round(position.coords.latitude * 100) / 100;
        let longitude = Math.round(position.coords.longitude * 100) / 100;
        return `http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/${latitude}/lon/${longitude}/data.json`;
    });

    let locationPromise = new Promise((resolve,reject) => {
        navigator.geolocation.getCurrentPosition((position,err) => {
            if(err) {
                reject(err);
            }
            resolve(position);
        });
    });

    locationPromise
        .then((position) => {
            return fetch(getURL(position));
        })
        .then(response => response.json())
        .then(data => {
            let ctx = document.getElementById("myChart").getContext("2d");
            let today = new Date().getDate();
            let tomorrow = today + 1;
            let myNewChart = new Chart(ctx).Line(config(data,today,tomorrow),{
                responsive: true,
                showTooltips: false,
                scaleIntegersOnly: false
            });
            let footer = document.getElementById('footer');
            footer.innerHTML += 'Christopher Lillthors 2015';
            footer.className = 'footer'
        })
        .catch(err => {
            console.log(err);
        });
})();