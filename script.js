const ctx = document.getElementById('myChart');
        let covidChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: "Covid19 Cases",
                    data: [],
                    

                }]
            }
        })
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      
   

        // Smooth entry animation for the chart container
anime({
    targets: '#chart-container',
    opacity: [0, 1],
    translateY: [-30, 0],
    easing: 'easeOutExpo',
    duration: 1500
});


// function highlightUpdate() {
//     anime({
//         targets: '#chart-container',
//         backgroundColor: ['#fff', '#ffeb3b', '#fff'], // Flash to yellow and back to white
//         easing: 'easeInOutQuad',
//         duration: 1000,
//         loop:true
//     });
// }




async function fetchCovidData() {
    try {
        let response = await fetch("https://disease.sh/v3/covid-19/historical/all");
        let data = await response.json();

        let dates = Object.keys(data.cases).map((date) => {
            let d = new Date(date);
            return `${d.getDate()} ${months[d.getMonth()].substring(0, 3)}, ${d.getFullYear()}`;
        });

        let cases = Object.values(data.cases);

        anime({
            targets: { count: 0 },
            count: cases[cases.length - 1],
            easing: 'easeInOutQuad',
            duration: 2000,
            update: function(anim) {
                covidChart.data.labels = dates;
                covidChart.data.datasets[0].data = cases.map((val, index) => {
                    return index === cases.length - 1 ? Math.round(anim.animations[0].currentValue) : val;
                });
                covidChart.update('none');
            },
            complete: function() {
                covidChart.data.labels = dates;
                covidChart.data.datasets[0].data = cases;
                covidChart.update();
                highlightUpdate(); // Call highlight after update
            }
        });
    } catch (e) {
        console.log(e);
    }
}

fetchCovidData()