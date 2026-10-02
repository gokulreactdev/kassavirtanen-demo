import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Project, Task, TaskPayload, User } from "./types";
import { openCreateModal, openEditModal } from "./uiSlice";

interface TasksState {
  items: Task[];
  projects: Project[];
  users: User[];
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  saveStatus: "idle" | "saving" | "succeeded" | "failed";
  error: string | null; // list / delete errors
  saveError: string | null; // form errors
}

const initialState: TasksState = {
  items: [],
  projects: [],
  users: [],
  listStatus: "idle",
  saveStatus: "idle",
  error: null,
  saveError: null,
};

const resetSave = (state: TasksState) => {
  state.saveStatus = "idle";
  state.saveError = null;
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    fetchTasksRequest(state) {
      state.listStatus = "loading";
      state.error = null;
    },
    fetchTasksSuccess(state, { payload }: PayloadAction<Task[]>) {
      state.listStatus = "succeeded";
      state.items = payload;
    },
    fetchTasksFailure(state, { payload }: PayloadAction<string>) {
      state.listStatus = "failed";
      state.error = payload;
    },

    fetchMetaRequest() {},
    fetchMetaSuccess(
      state,
      { payload }: PayloadAction<{ projects: Project[]; users: User[] }>,
    ) {
      state.projects = payload.projects;
      state.users = payload.users;
    },
    fetchMetaFailure(state, { payload }: PayloadAction<string>) {
      state.error = payload;
    },

    createTaskRequest(state, _action: PayloadAction<TaskPayload>) {
      state.saveStatus = "saving";
      state.saveError = null;
    },
    createTaskSuccess(state, { payload }: PayloadAction<Task>) {
      state.saveStatus = "succeeded";
      state.items.push(payload);
    },
    createTaskFailure(state, { payload }: PayloadAction<string>) {
      state.saveStatus = "failed";
      state.saveError = payload;
    },

    updateTaskRequest(
      state,
      _action: PayloadAction<{ id: string; data: TaskPayload }>,
    ) {
      state.saveStatus = "saving";
      state.saveError = null;
    },
    updateTaskSuccess(state, { payload }: PayloadAction<Task>) {
      state.saveStatus = "succeeded";
      state.items = state.items.map((t) => (t.id === payload.id ? payload : t));
    },
    updateTaskFailure(state, { payload }: PayloadAction<string>) {
      state.saveStatus = "failed";
      state.saveError = payload;
    },

    deleteTaskRequest(state, _action: PayloadAction<string>) {
      state.error = null;
    },
    deleteTaskSuccess(state, { payload }: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.id !== payload);
    },
    deleteTaskFailure(state, { payload }: PayloadAction<string>) {
      state.error = payload;
    },
  },
  // Opening the modal always starts with a clean form state
  extraReducers: (builder) => {
    builder
      .addCase(openCreateModal, resetSave)
      .addCase(openEditModal, resetSave);
  },
});

export const {
  fetchTasksRequest,
  fetchTasksSuccess,
  fetchTasksFailure,
  fetchMetaRequest,
  fetchMetaSuccess,
  fetchMetaFailure,
  createTaskRequest,
  createTaskSuccess,
  createTaskFailure,
  updateTaskRequest,
  updateTaskSuccess,
  updateTaskFailure,
  deleteTaskRequest,
  deleteTaskSuccess,
  deleteTaskFailure,
} = tasksSlice.actions;

export default tasksSlice.reducer;
