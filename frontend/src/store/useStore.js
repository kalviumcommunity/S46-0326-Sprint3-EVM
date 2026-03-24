import { create } from "zustand";

export const useElectionStore = create((set) => ({
  student: null,
  admin: null,
  conductStatus: "",
  setStudent: (student) => set({ student }),
  setAdmin: (admin) => set({ admin }),
  setConductStatus: (conductStatus) => set({ conductStatus }),
  clearState: () =>
    set({
      student: null,
      admin: null,
      conductStatus: ""
    })
}));