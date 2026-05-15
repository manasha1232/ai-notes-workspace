import { create } from "zustand";
import api from "../api/client";

export const useNoteStore = create((set) => ({
  notes: [],
  activeNote: null,
  loading: false,

  fetchNotes: async (params = {}) => {
    set({ loading: true });
    const { data } = await api.get("/api/notes", { params });
    set({ notes: data, loading: false });
  },

  createNote: async (noteData = {}) => {
    const { data } = await api.post("/api/notes", noteData);
    set((s) => ({ notes: [data, ...s.notes], activeNote: data }));
    return data;
  },

  updateNote: async (id, updates) => {
    const { data } = await api.patch(`/api/notes/${id}`, updates);
    set((s) => ({
      notes: s.notes.map((n) => (n.id === id ? data : n)),
      activeNote: s.activeNote?.id === id ? data : s.activeNote,
    }));
    return data;
  },

  deleteNote: async (id) => {
    await api.delete(`/api/notes/${id}`);
    set((s) => ({
      notes: s.notes.filter((n) => n.id !== id),
      activeNote: s.activeNote?.id === id ? null : s.activeNote,
    }));
  },

  setActiveNote: (note) => set({ activeNote: note }),

  summarize: async (id) => {
    const { data } = await api.post(`/api/notes/${id}/summarize`);
    return data;
  },

  generateFlashcards: async (id) => {
    const { data } = await api.post(`/api/notes/${id}/flashcards`);
    return data;
  },

  generateQuiz: async (id) => {
    const { data } = await api.post(`/api/notes/${id}/quiz`);
    return data;
  },

  shareNote: async (id) => {
    const { data } = await api.post(`/api/notes/${id}/share`);
    return data;
  },
}));
