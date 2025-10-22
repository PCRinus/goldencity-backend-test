import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { getNotesCount } from "./notesService";
import { notesRouter } from "./routes";

const app = new OpenAPIHono();

app.use("*", logger());
app.use("*", cors());

app.doc("/doc", {
	openapi: "3.0.0",
	info: {
		version: "1.0.0",
		title: "Notes API",
		description: "A simple CRUD API for managing notes",
	},
	tags: [
		{
			name: "Notes",
			description: "Operations related to notes management",
		},
	],
});

app.get("/ui", swaggerUI({ url: "/doc" }));

app.get("/", (c) => {
	return c.json({
		message: "Notes API is running!",
		version: "1.0.0",
		totalNotes: getNotesCount(),
		documentation: {
			openapi: "/doc",
			swaggerUI: "/ui",
		},
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
