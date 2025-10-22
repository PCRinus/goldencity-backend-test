import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { getNotesCount } from "./notesService";
import { notesRouter } from "./routes";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.get("/", (c) => {
	return c.json({
		message: "Notes API is running!",
		version: "1.0.0",
		totalNotes: getNotesCount(),
	});
});

app.route("/notes", notesRouter);

app.notFound((c) => {
	return c.json(
		{
			success: false,
			error: "Endpoint not found",
		},
		404,
	);
});

app.onError((err, c) => {
	console.error("Error:", err);
	return c.json(
		{
			success: false,
			error: "Internal server error",
		},
		500,
	);
});

serve(
	{
		fetch: app.fetch,
		port: 3000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
