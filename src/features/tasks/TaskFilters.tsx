import type { ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { STATUSES, TASK_TYPES } from "./constants";
import {
  selectFilters,
  selectHasActiveFilters,
  selectProjects,
  selectUsers,
} from "./selectors";
import type { Filters } from "./types";
import { clearFilters, setFilter } from "./uiSlice";

export default function TaskFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const projects = useAppSelector(selectProjects);
  const users = useAppSelector(selectUsers);
  const hasActive = useAppSelector(selectHasActiveFilters);

  const onChange =
    (key: keyof Filters) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      dispatch(setFilter({ key, value: e.target.value }));

  return (
    <section className="panel filters">
      <input
        className="control"
        type="search"
        placeholder="Search tasks..."
        value={filters.search}
        onChange={onChange("search")}
      />

      <select
        className="control"
        value={filters.projectId}
        onChange={onChange("projectId")}
      >
        <option value="">All Projects</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <select
        className="control"
        value={filters.assigneeId}
        onChange={onChange("assigneeId")}
      >
        <option value="">All Assignees</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>

      <select
        className="control"
        value={filters.status}
        onChange={onChange("status")}
      >
        <option value="">All Statuses</option>
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <select
        className="control"
        value={filters.type}
        onChange={onChange("type")}
      >
        <option value="">All Types</option>
        {TASK_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      <button
        className="btn btn-secondary"
        disabled={!hasActive}
        onClick={() => dispatch(clearFilters())}
      >
        Clear Filters
      </button>
    </section>
  );
}
