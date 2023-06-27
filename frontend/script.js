const data = [0, 0];

const ctx = document.getElementById("myChart").getContext("2d");
const myChart = new Chart(ctx, {
	type: "bar",
	data: {
		labels: ["Zóna Apple", "Zóna Samsung"],
		datasets: [
			{
				label: "Počet návštěvníků v zóně",
				data: [1, 3],
				backgroundColor: "rgb(226, 0, 98)",
			},
		],
	},
	options: {
		scales: {
			y: {
				beginAtZero: true,
				max: 20,
			},
		},
	},
});

const evtSource = new EventSource("https://tmobile.up.railway.app/data");

const vytizenost = document.getElementById("curr");
const currPpl = document.getElementById("currPpl");
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

	res += (parseInt(seconds) % 60) + " SEKUND";

	return res;
};

evtSource.addEventListener("message", function (event) {
	console.log(event.data);
	const {
		currentVisitors,
		averageTime,
		favoriteZone,
		totalVisits,
		countA,
		countB,
	} = JSON.parse(event.data);

	vytizenost.textContent = parseInt((currentVisitors / 10) * 100);

	avgTime.textContent = getStringFromSeconds(averageTime);

	const isFavoriteB = favoriteZone == "B";

	samsung.style.display = isFavoriteB ? "block" : "none";
	apple.style.display = !isFavoriteB ? "block" : "none";

	currPpl.textContent = totalVisits;

	myChart.data.datasets[0].data = [countA, countB];

	myChart.options.scales.y = {
		max: Math.max(countA, countB) + 1,
		beginAtZero: true,
	};

	myChart.update();
});
