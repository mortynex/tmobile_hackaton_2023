var data = [50, 30, 70, 20, 80, 60];

        // Nastavení sloupcového grafu
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['9-11', '11-13', '13-15', '15-17', '17-19', '19-21'],
                datasets: [{
                    label: 'Hodnoty',
                    data: data,
                    backgroundColor: 'rgba(0, 123, 255, 0.5)' // Barva sloupců
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100 // Maximální hodnota na ose Y
                    }
                }
            }
        });