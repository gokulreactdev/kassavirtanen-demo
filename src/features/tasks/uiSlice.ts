import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Filters } from "./types";

export const emptyFilters: Filters = {
  search: "",
  projectId: "",
  assigneeId: "",
  status: "",
  type: "",
};

interface UiState {
  filters: Filters;
  modal: { isOpen: boolean; taskId: string | null }; // taskId === null -> create mode
}

const initialState: UiState = {
  filters: { ...emptyFilters },
  modal: { isOpen: false, taskId: null },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setFilter(
      state,
      { payload }: PayloadAction<{ key: keyof Filters; value: string }>,
    ) {
      state.filters[payload.key] = payload.value;
    },
    clearFilters(state) {
      state.filters = { ...emptyFilters };
    },
    openCreateModal(state) {
      state.modal = { isOpen: true, taskId: null };
    },
    openEditModal(state, { payload }: PayloadAction<string>) {
      state.modal = { isOpen: true, taskId: payload };
    },
    closeModal(state) {
      state.modal = { isOpen: false, taskId: null };
    },
  },
});

export const {
  setFilter,
  clearFilters,
  openCreateModal,
  openEditModal,
  closeModal,
} = uiSlice.actions;
export default uiSlice.reducer;
