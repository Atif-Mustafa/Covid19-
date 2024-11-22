const ctx = document.getElementById('myChart');
let covidChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: "Covid19 Cases",
            data: [],
            borderColor: '#ff6b6b', // Color for the line
            fill: false,
        }],
    },
    options: {
        scales: {
            y: {
                title: {
                    display: true,
                    text: "Cases",
                    font: {
                        size: 14
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: "Date",
                    font: {
                        size: 14
                    }
                }
            }
        }
    }
});

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Smooth entry animation for the chart container
anime({
    targets: '#chart-container',
    opacity: [0, 1],
    translateY: [-30, 0],
    easing: 'easeOutExpo',
    duration: 1500
});

async function fetchCovidData() {
    try {
        let response = await fetch("https://disease.sh/v3/covid-19/historical/all");
        let data = await response.json();

        // Processing date labels
        let dates = Object.keys(data.cases).map((date) => {
            let d = new Date(date);
            return `${d.getDate()} ${months[d.getMonth()].substring(0, 3)}, ${d.getFullYear()}`;
        });

        // Retrieving cases data
        let cases = Object.values(data.cases);

        // Animate the data being loaded into the chart
        anime({
            targets: cases,
            easing: 'easeInOutQuad',
            duration: 3000,
            round: 1, // Round numbers to whole
            update: function(anim) {
                // During animation, gradually add data to the chart
                covidChart.data.labels = dates.slice(0, anim.currentTime / 30); // Adjust slicing speed if needed
                covidChart.data.datasets[0].data = cases.slice(0, anim.currentTime / 30);
                covidChart.update('none'); // Disable default animation
            },
            complete: function() {
                // When animation completes, set the full dataset
                covidChart.data.labels = dates;
                covidChart.data.datasets[0].data = cases;
                covidChart.update();
            }
        });
    } catch (e) {
        console.log(e);
    }
}

fetchCovidData();
