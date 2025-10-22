import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from "./notesService";
import {
  CreateNoteSchema,
  NoteParamsSchema,
  NoteSchema,
  UpdateNoteSchema,
} from "./types";

export const notesRouter = new OpenAPIHono();

const getAllNotesRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Notes"],
  summary: "Get all notes",
  description: "Retrieve a list of all notes",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(true),
            data: z.array(NoteSchema),
            count: z.number(),
          }),
        },
      },
      description: "List of all notes",
    },
  },
});

const getNoteByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Notes"],
  summary: "Get note by ID",
  description: "Retrieve a specific note by its ID",
  request: {
    params: NoteParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(true),
            data: NoteSchema,
          }),
        },
      },
      description: "The requested note",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(false),
            error: z.string(),
          }),
        },
      },
      description: "Note not found",
    },
  },
});

const createNoteRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Notes"],
  summary: "Create a new note",
  description: "Create a new note with title and content",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateNoteSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(true),
            data: NoteSchema,
          }),
        },
      },
      description: "Note created successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(false),
            error: z.string(),
          }),
        },
      },
      description: "Invalid request data",
    },
  },
});

const updateNoteRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["Notes"],
  summary: "Update a note",
  description: "Update an existing note's title and/or content",
  request: {
    params: NoteParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: UpdateNoteSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(true),
            data: NoteSchema,
          }),
        },
      },
      description: "Note updated successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(false),
            error: z.string(),
          }),
        },
      },
      description: "Invalid request data",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(false),
            error: z.string(),
          }),
        },
      },
      description: "Note not found",
    },
  },
});

const deleteNoteRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Notes"],
  summary: "Delete a note",
  description: "Delete an existing note by its ID",
  request: {
    params: NoteParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(true),
            message: z.string(),
          }),
        },
      },
      description: "Note deleted successfully",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(false),
            error: z.string(),
          }),
        },
      },
      description: "Note not found",
    },
  },
});

notesRouter.openapi(getAllNotesRoute, (c) => {
  const notes = getAllNotes();
  return c.json({
    success: true,
    data: notes,
    count: notes.length,
  });
});

notesRouter.openapi(getNoteByIdRoute, (c) => {
  const { id } = c.req.valid("param");
  const note = getNoteById(id);

  if (!note) {
    return c.json(
      {
        success: false,
        error: "Note not found",
      },
      404
    );
  }

  return c.json(
    {
      success: true,
      data: note,
    },
    200
  );
});

notesRouter.openapi(createNoteRoute, async (c) => {
  const body = c.req.valid("json");

  try {
    const note = createNote(body);
    return c.json(
      {
        success: true,
        data: note,
      },
      201
    );
  } catch {
    return c.json(
      {
        success: false,
        error: "Failed to create note",
      },
      400
    );
  }
});

notesRouter.openapi(updateNoteRoute, async (c) => {
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");

  try {
    const updatedNote = updateNote(id, body);

    if (!updatedNote) {
      return c.json(
        {
          success: false,
          error: "Note not found",
        },
        404
      );
    }

    return c.json(
      {
        success: true,
        data: updatedNote,
      },
      200
    );
  } catch {
    return c.json(
      {
        success: false,
        error: "Failed to update note",
      },
      400
    );
  }
});

notesRouter.openapi(deleteNoteRoute, (c) => {
  const { id } = c.req.valid("param");
  const deleted = deleteNote(id);

  if (!deleted) {
    return c.json(
      {
        success: false,
        error: "Note not found",
      },
      404
    );
  }

  return c.json(
    {
      success: true,
      message: "Note deleted successfully",
    },
    200
  );
});
