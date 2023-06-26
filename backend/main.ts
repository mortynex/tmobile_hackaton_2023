import express from "express";
import { PrismaClient } from "@prisma/client";

let currentVisitors = 0;
let countA = 0;
let countB = 0;
let updated = false;

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.get("/listen", async (req, res) => {
	res.set({
		"Cache-Control": "no-cache",
		"Content-Type": "text/event-stream",
		Connection: "keep-alive",
	});
	res.flushHeaders();

	updated = false;

	res.write("retry: 10000\n\n");

	const sendUpdate = () => {
		const data = {};
	};

	setInterval(() => {
		if (updated) {
			res.write(`data: \n\n`);
		}
	}, 500);
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
	const data = req.body;
	const id = data.id;

	data[id] = undefined;

	await prisma.visit.upsert({
		where: {
			id: data.id,
		},
		update: {
			...data,
		},
		create: {
			...data,
		},
	});

	updated = true;

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

const server = app.listen(3034);
