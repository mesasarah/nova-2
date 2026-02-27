import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),

      // Chat
      messages: [],
      addMessage: (msg) => set(s => ({ messages: [...s.messages, msg] })),
      clearMessages: () => set({ messages: [] }),

      // Mood
      currentMood: null,
      setMood: (mood) => set({ currentMood: mood }),
      moodLogs: [],
      addMoodLog: (log) => set(s => ({ moodLogs: [...s.moodLogs, log] })),

      // Settings
      oceanVariant: 'bioluminescence',
      setOceanVariant: (v) => set({ oceanVariant: v }),
      tonePref: 'soft',
      setTonePref: (t) => set({ tonePref: t }),
    }),
    { name: 'nova-store', partialize: (s) => ({ user: s.user, token: s.token, oceanVariant: s.oceanVariant, tonePref: s.tonePref }) }
  )
)