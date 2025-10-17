(function($) {
    /* "use strict" */
    var dlabChartlist = function(){
        var screenWidth = $(window).width();

        // Chart 1
        var chartBar = function(){
            var options = {
                series: [
                    {
                        name: 'Net Profit',
                        data: [15, 55, 90, 80, 25, 15, 70]
                    }, 
                    {
                        name: 'Revenue',
                        data: [60, 65, 15, 35, 30, 5, 40]
                    }
                ],
                chart: {
                    type: 'bar',
                    height: 350,
                    toolbar: {
                        show: false,
                    }
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '35%',
                        endingShape: 'rounded'
                    },
                },
                colors:['var(--secondary)', 'var(--primary)'],
                dataLabels: {
                    enabled: false,
                },
                markers: {
                    shape: "circle",
                },
                legend: {
                    show: false,
                    fontSize: '12px',
                    labels: {
                        colors: '#000000',
                    },
                    markers: {
                        width: 18,
                        height: 18,
                        strokeWidth: 0,
                        radius: 12,
                    }
                },
                stroke: {
                    show: true,
                    width: 1,
                    colors: ['transparent']
                },
                grid: {
                    borderColor: '#eee',
                },
                xaxis: {
                    categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                    labels: {
                        style: {
                            colors: '#787878',
                            fontSize: '13px',
                            fontFamily: 'poppins',
                            fontWeight: 100,
                        },
                    },
                    crosshairs: {
                        show: false,
                    }
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: '#787878',
                            fontSize: '13px',
                            fontFamily: 'poppins',
                            fontWeight: 100,
                        },
                    },
                },
                fill: {
                    opacity: 1
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return "$ " + val + " thousands";
                        }
                    }
                }
            };

            var chart = new ApexCharts(document.querySelector("#chartBar"), options);
            chart.render();
        }

        // Chart 2
        var chartBar1 = function(){
            var options = {
                series: [
                    {
                        name: 'Expenses',
                        data: [20, 35, 60, 50, 45, 20, 30]
                    },
                    {
                        name: 'Savings',
                        data: [10, 25, 30, 60, 50, 35, 45]
                    }
                ],
                chart: {
                    type: 'bar',
                    height: 350,
                    toolbar: {
                        show: false,
                    }
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '35%',
                        endingShape: 'rounded'
                    },
                },
                colors:['#FF5733', '#33FFCE'],
                dataLabels: {
                    enabled: false,
                },
                stroke: {
                    show: true,
                    width: 1,
                    colors: ['transparent']
                },
                grid: {
                    borderColor: '#eee',
                },
                xaxis: {
                    categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                    labels: {
                        style: {
                            colors: '#787878',
                            fontSize: '13px',
                            fontFamily: 'poppins',
                            fontWeight: 100,
                        },
                    },
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: '#787878',
                            fontSize: '13px',
                            fontFamily: 'poppins',
                            fontWeight: 100,
                        },
                    },
                },
                fill: {
                    opacity: 1
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return "$ " + val + " thousands";
                        }
                    }
                }
            };

            var chart = new ApexCharts(document.querySelector("#chartBar1"), options);
            chart.render();
        }

        /* Function Calling */
        chartBar();
        chartBar1();
    }

    // jQuery(window).on('load', function(){
    //     setTimeout(function(){
    //         dlabChartlist();
    //     }, 1000);
    // });

})(jQuery);
