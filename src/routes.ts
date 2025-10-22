import { Hono } from "hono";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from "./notesService";
import type { CreateNoteRequest, UpdateNoteRequest } from "./types";

function createSuccessResponse(data: unknown) {
  return {
    success: true,
    data,
    ...(Array.isArray(data) && { count: data.length }),
  };
}

function createErrorResponse(error: string) {
  return {
    success: false,
    error,
  };
}

function validateCreateNoteRequest(body: any): body is CreateNoteRequest {
  return (
    body &&
    typeof body.title === "string" &&
    body.title.trim().length > 0 &&
    typeof body.content === "string" &&
    body.content.trim().length > 0
  );
}

function validateUpdateNoteRequest(body: any): body is UpdateNoteRequest {
  if (!body || typeof body !== "object") {
    return false;
  }

  const hasTitle = body.title !== undefined;
  const hasContent = body.content !== undefined;

  if (!hasTitle && !hasContent) {
    return false;
  }

  if (
    hasTitle &&
    (typeof body.title !== "string" || body.title.trim().length === 0)
  ) {
    return false;
  }

  if (
    hasContent &&
    (typeof body.content !== "string" || body.content.trim().length === 0)
  ) {
    return false;
  }

  return true;
}

export const notesRouter = new Hono();

notesRouter.get("/", (c) => {
  const notes = getAllNotes();
  return c.json(createSuccessResponse(notes));
});

notesRouter.get("/:id", (c) => {
  const id = c.req.param("id");
  const note = getNoteById(id);

  if (!note) {
    return c.json(createErrorResponse("Note not found"), 404);
  }

  return c.json(createSuccessResponse(note));
});

notesRouter.post("/", async (c) => {
  try {
    const body = await c.req.json();

    if (!validateCreateNoteRequest(body)) {
      return c.json(
        createErrorResponse(
          "Title and content are required and must be non-empty strings"
        ),
        400
      );
    }

    const note = createNote({
      title: body.title.trim(),
      content: body.content.trim(),
    });

    return c.json(createSuccessResponse(note), 201);
  } catch (error) {
    return c.json(createErrorResponse(JSON.stringify(error)), 400);
  }
});

notesRouter.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();

    if (!validateUpdateNoteRequest(body)) {
      return c.json(
        createErrorResponse(
          "At least one field (title or content) must be provided as a non-empty string"
        ),
        400
      );
    }

    const updateData: UpdateNoteRequest = {};
    if (body.title !== undefined) {
      updateData.title = body.title.trim();
    }
    if (body.content !== undefined) {
      updateData.content = body.content.trim();
    }

    const updatedNote = updateNote(id, updateData);

    if (!updatedNote) {
      return c.json(createErrorResponse("Note not found"), 404);
    }

    return c.json(createSuccessResponse(updatedNote));
  } catch (error) {
    return c.json(createErrorResponse(JSON.stringify(error)), 400);
  }
});

notesRouter.delete("/:id", (c) => {
  const id = c.req.param("id");
  const deleted = deleteNote(id);

  if (!deleted) {
    return c.json(createErrorResponse("Note not found"), 404);
  }

  return c.json({
    success: true,
    message: "Note deleted successfully",
  });
});
