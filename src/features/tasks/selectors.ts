import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

export const selectTasks = (s: RootState) => s.tasks.items;
export const selectProjects = (s: RootState) => s.tasks.projects;
export const selectUsers = (s: RootState) => s.tasks.users;
export const selectFilters = (s: RootState) => s.ui.filters;
export const selectModal = (s: RootState) => s.ui.modal;

export const selectEditingTask = createSelector(
  [selectTasks, selectModal],
  (tasks, modal) => tasks.find((t) => t.id === modal.taskId) ?? null,
);

export const selectHasActiveFilters = createSelector([selectFilters], (f) =>
  Object.values(f).some(Boolean),
);

export const selectFilteredTasks = createSelector(
  [selectTasks, selectFilters],
  (tasks, f) => {
    const q = f.search.trim().toLowerCase();
    return tasks.filter(
      (t) =>
        (!q ||
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)) &&
        (!f.projectId || t.projectId === f.projectId) &&
        (!f.assigneeId || t.assigneeId === f.assigneeId) &&
        (!f.status || t.status === f.status) &&
        (!f.type || t.type === f.type),
    );
  },
);
