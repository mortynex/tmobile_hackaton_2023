const evtSource = new EventSource("https://tmobile.up.railway.app/data");

const vytizenost = document.getElementById("curr");
const avgTime = document.getElementById("avgTime");
const samsung = document.getElementById("samsung");
const apple = document.getElementById("apple");

const getStringFromSeconds = (seconds) => {
	const hours = parseInt(seconds / 3600);
	const minutes = parseInt(seconds / 60);

	let res = "";

	if (hours > 0) {
		res += hours + " hodin ";
	}
	if (minutes > 0) {
		res += minutes + " minut ";
	}

	res += (parseInt(seconds) % 60) + " sekund";

	return res;
};

evtSource.addEventListener("message", function (event) {
	console.log(event.data);
	const { currentVisitors, averageTime, favoriteZone } = JSON.parse(event.data);

	vytizenost.textContent = parseInt((currentVisitors / 10) * 100);

	avgTime.textContent = getStringFromSeconds(averageTime);

	const isFavoriteB = favoriteZone == "B";

	samsung.style.display = isFavoriteB ? "block" : "none";
	apple.style.display = !isFavoriteB ? "block" : "none";
});

const data = [50, 30, 70, 20, 80, 60];

// Nastavení sloupcového grafu
const ctx = document.getElementById("myChart").getContext("2d");
const myChart = new Chart(ctx, {
	type: "bar",
	data: {
		labels: ["9-11", "11-13", "13-15", "15-17", "17-19", "19-21"],
		datasets: [
			{
				label: "Hodnoty",
				data: data,
				backgroundColor: "rgba(0, 123, 255, 0.5)", // Barva sloupců
			},
		],
	},
	options: {
		scales: {
			y: {
				beginAtZero: true,
				max: 100, // Maximální hodnota na ose Y
			},
		},
	},
});
