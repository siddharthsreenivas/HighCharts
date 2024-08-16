(async () => {
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
    ).then(response => response.json());

    // split the data set into ohlc and volume
    const ohlc = [],
        volume = [],
        dataLength = data.length,
        // set the allowed units for data grouping
        groupingUnits = [[
            'week',                         // unit name
            [1]                             // allowed multiples
        ], [
            'month',
            [1, 2, 3, 4, 6]
        ]];

    for (let i = 0; i < dataLength; i += 1) {
        ohlc.push([
            data[i][0], // the date
            data[i][4] // closing data
        ]);

        volume.push([
            data[i][0], // the date
            data[i][5] // the volume
        ]);
    }

    // create the chart
    Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 4
        },

        navigator: {
            enabled: false
        },

        title: {
            text: 'AAPL Historical'  //chart title
        },

        yAxis: [{
            labels: {
                align: 'left',
                x: 10
            },
            title: {
                text: 'Price',
            },
            height: '100%', // positioning of area chart
            lineWidth: 1,
            resize: {
                enabled: true
            }
        }, {
            labels: {
                align: 'left',
                x: 0
            },
            title: {
                text: 'Volume'
            },
            top: '70%',  //positioning of volume chart [overlapping]
            height: '25%',
            offset: 0,
            lineWidth: 0
        }],

        tooltip: {
            split: true
        },

        series: [{
            type: 'area', 
            name: 'AAPL',
            data: ohlc,
            dataGrouping: {
                units: groupingUnits
            },
            threshold: null,
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [
                        1,
                        Highcharts.color(
                            Highcharts.getOptions().colors[0]
                        ).setOpacity(0).get('rgba')
                    ]
                ]
            }
        }, {
            type: 'column',
            name: 'Volume',
            data: volume,
            yAxis: 1,
            dataGrouping: {
                units: groupingUnits
            }
        }],

        chart: {
            events: {
                selection: function (event) {
                    // Prevent the default zoom behavior
                    event.preventDefault();

                    if (event.xAxis) {
                        const min = event.xAxis[0].min; //starting date point
                        const max = event.xAxis[0].max; //ending date point

                        const selectedData = ohlc.filter(point => point[0] >= min && point[0] <= max);
                        if (selectedData.length > 1) {
                            const startDate = (Highcharts.dateFormat('%b %e, %Y', selectedData[0][0]))
                            const endDate = (Highcharts.dateFormat('%b %e, %Y', selectedData[selectedData.length - 1][0]))
                            const startPrice = selectedData[0][1];
                            const endPrice = selectedData[selectedData.length - 1][1];
                            const profitLoss = endPrice - startPrice;
                            const percentageDiff = ((profitLoss) / ((startPrice + endPrice) / 2)) * 100

                            UpdateProfitLoss(profitLoss, startDate, endDate, percentageDiff)
                        }
                    } else {
                        console.log("error")
                    }
                }
            },
            zoomType: 'x'
        }
    });

    const display = document.getElementById("profitLossDispay")
    const displayProfitLoss = document.getElementById("profitLoss")
    const displayDate = document.getElementById("profitLossDate")
    function UpdateProfitLoss(...param){
        if(param[0] >= 0)
        {
            displayProfitLoss.innerText = `${param[0].toFixed(2)} (${param[3].toFixed(2)}%)`
            displayDate.innerHTML = `${param[1]} - ${param[2]}`
            display.className = "profit";
            display.style.display = "flex"
        }
        else{
            displayProfitLoss.innerText = `${param[0].toFixed(2)} (${param[3].toFixed(2)}%)`
            displayDate.innerHTML = `${param[1]} - ${param[2]}`
            display.className = "loss";
            display.style.display = "flex"
        }
    }


})();


