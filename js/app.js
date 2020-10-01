$(document).ready(function(){
  // GLOBAL VAR
  currentPolarityAvg = 0;
  $.ajax({
    url: "URL TO data.php",
    method: "GET",
    success: function(data) {
      var player = [];
      var score = [];

      for(var i in data) {
		timestamp = data[i].timestamp;
		pushTime = timestamp.split(" ");
        player.push(pushTime[1]);
        score.push(Math.ceil((data[i].polarity -.20)* 100) / 100);
      }
	  
	  currentPolarityAvg = score[19];

      var chartdata = {
        labels: player,
        datasets : [
          {
            label: 'Live Twitter Mood Value (Updates Every 15 Minutes)',
            backgroundColor: 'rgba(200, 200, 200, 0.75)',
            borderColor: 'rgba(200, 200, 200, 0.75)',
            hoverBackgroundColor: 'rgba(200, 200, 200, 1)',
            hoverBorderColor: 'rgba(200, 200, 200, 1)',
            data: score
          }
        ]
      };

      var ctx = $("#mycanvas");

      var barGraph = new Chart(ctx, {
        type: 'line',
        data: chartdata,
		options: {
			scales: {
				xAxes: [{
                ticks: {
                    autoSkip: false,
                    maxRotation: 90,
                    minRotation: 50
					}
				}],
				yAxes: [{
					ticks: {
						suggestedMin: -.5,
						suggestedMax: .5,
					}
				}]
			}
			
		}
      });
	 
		// UPDATE CHART
		setInterval(function()
		{
			
			
			$.ajax({
				url: "URL TO datalive.php",
				method: "GET",
				success:function(data)
				{

					for(var i in data) {
						timestamp = data[i].timestamp;
						pushTime = timestamp.split(" ");
						player.push(pushTime[1]);
						score.push(Math.ceil((data[i].polarity -.20)* 100) / 100);
						barGraph.data.datasets[i].data.shift();
						barGraph.data.labels.shift();
						barGraph.update();
					}
					currentPolarityAvg = score[19];
					updateTableGauge();
				}
			});
		}, 900000);
		
		function updateTableGauge() {
			$.ajax({
				url: "URL TO trendingpolarity.txt",
					method: "GET",
					success:function(data)
					{
						data = data.split("\n");
						trend = [];
						polarity = [];
						
						for(var i in data) {
							if (isNaN(data[i])) {
								trend.push(data[i]);
								//htmlList += "<tr><td scope='col' id=i>" + data[i] + "</td></tr>";
							} else {
								if(i < 20) {
									polarity.push(Math.ceil(data[i] * 100) / 100);
									console.log(data[i]);
								}
							}
						}
						htmlList = "";
						for(var i in trend) {
							polarityScore = polarity[i];
								
							if (polarityScore >= .15 && polarityScore <= .25) {
								htmlList += "<tr><td scope='col' style='background-color: #FFFF00;'>" + trend[i] + "</td></tr>";
							} else if (polarityScore >= .26 && polarityScore <= .30){
								htmlList += "<tr><td scope='col' style='background-color: #7FFF00;'>" + trend[i] + "</td></tr>";
							} else if (polarityScore >= .31) {
								htmlList += "<tr><td scope='col' style='background-color: #00FF00;'>" + trend[i] + "</td></tr>";
							} else if (polarityScore >= .10 && polarityScore <= .14) {
								htmlList += "<tr><td scope='col' style='background-color: #FF7F00;'>" + trend[i] + "</td></tr>";
							} else if (polarityScore <= .09) {
								htmlList += "<tr><td scope='col' style='background-color: #FF0000;'>" + trend[i] + "</td></tr>";
							}
						}

						document.getElementById("table0").innerHTML = htmlList;
						
						const loader = document.querySelector(".loader");
						gaugeDegrees = (Math.abs(currentPolarityAvg) * 720) - 45;
						if(currentPolarityAvg >= .25 || currentPolarityAvg <= -.25) {
							loader.style.setProperty("--rotation", `135deg`);
						} else {
							loader.style.setProperty("--rotation", `${gaugeDegrees}deg`);
						}
						
					}

				});
			}
			
			updateTableGauge();
		},
		
    error: function(data) {
      console.log(data);
    }
  })

});
