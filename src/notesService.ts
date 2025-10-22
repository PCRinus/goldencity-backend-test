import type { CreateNoteRequest, Note, UpdateNoteRequest } from "./types";

let notes: Note[] = [];
let nextId = 1;

function generateId(): string {
	return (nextId++).toString();
}

export function getAllNotes(): Note[] {
	return [...notes];
}

export function getNoteById(id: string): Note | undefined {
	return notes.find((note) => note.id === id);
}

export function createNote(request: CreateNoteRequest): Note {
	const now = new Date();
	const note: Note = {
		id: generateId(),
		title: request.title,
		content: request.content,
		createdAt: now.toDateString(),
		updatedAt: now.toDateString(),
	};

	notes.push(note);
	return note;
}

export function updateNote(
	id: string,
	request: UpdateNoteRequest,
): Note | null {
	const noteIndex = notes.findIndex((note) => note.id === id);

	if (noteIndex === -1) {
		return null;
	}

	const existingNote = notes[noteIndex];
	const updatedNote: Note = {
		...existingNote,
		title: request.title ?? existingNote.title,
		content: request.content ?? existingNote.content,
		updatedAt: new Date().toDateString(),
	};

	notes[noteIndex] = updatedNote;
	return updatedNote;
}

export function deleteNote(id: string): boolean {
	const noteIndex = notes.findIndex((note) => note.id === id);

	if (noteIndex === -1) {
		return false;
	}

	notes.splice(noteIndex, 1);
	return true;
}

export function getNotesCount(): number {
	return notes.length;
}

export function clearAllNotes(): void {
	notes = [];
	nextId = 1;
}
