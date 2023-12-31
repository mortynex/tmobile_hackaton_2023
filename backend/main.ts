import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

let currentVisitors = 0;
let countA = 0;
let countB = 0;
let updated = true;

const prisma = new PrismaClient();
const app = express();

prisma.visit.deleteMany({});

app.use(express.json());
app.use(cors());

app.get("/data", async (req, res) => {
	res.set({
		"Cache-Control": "no-cache",
		"Content-Type": "text/event-stream",
		Connection: "keep-alive",
	});
	res.flushHeaders();
	res.write("retry: 10000\n\n");

	const sendUpdate = async () => {
		const { _avg, _count } = await prisma.visit.aggregate({
			_avg: {
				totalTime: true,
			},
			_count: {
				zoneATime: true,
				zoneBTime: true,
			},
		});

		const data = {
			currentVisitors,
			countA,
			countB,
			totalVisits: await prisma.visit.count(),
			averageTime: _avg.totalTime ?? 0,
			favoriteZone: _count.zoneATime > _count.zoneBTime ? "A" : "B",
		};

		res.write(`data: ${JSON.stringify(data)}\n\n`);
	};

	sendUpdate();

	setInterval(() => {
		if (!updated) {
			sendUpdate();

			updated = true;
		}
	}, 250);
});

/*

body: {
    visits: {
        entryTime: number,
        exitTime: number,
        zoneATime: number,
        zoneBTime: number,
        
    }[]
}

*/

app.post("/detail", async (req, res) => {
	const details: Record<string, Record<any, any>> = req.body;
	console.log({ details });
	for (const [id, detail] of Object.entries(details)) {
		await prisma.visit.upsert({
			where: {
				id,
			},
			update: {
				...detail,
			},
			create: {
				...(detail as any),
				id,
			},
		});
		updated = false;
	}

	console.log(await prisma.visit.findMany());

	res.sendStatus(200);
});

app.post("/current", async (req, res) => {
	currentVisitors = req.body.total;
	countA = req.body.countA;
	countB = req.body.countB;

	console.log({ currentVisitors });

	res.sendStatus(200);
});

if (process.env.NODE_ENV === "production") {
	app.listen((process.env.PORT as any) || 3034, "0.0.0.0", () => {
		console.log(`running on port ${process.env.PORT || 3034}`);
	});
} else {
	app.listen(process.env.PORT || 3034, () => {
		console.log(`running on port ${process.env.PORT || 3034}`);
	});
}
