import { FormProvider, useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import Field from "../../components/Field";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { PRIORITIES, STATUSES, TASK_TYPES } from "./constants";
import { toFormValues, toPayload } from "./formUtils";
import type { FormValues } from "./formUtils";
import { selectProjects, selectUsers } from "./selectors";
import { createTaskRequest, updateTaskRequest } from "./tasksSlice";
import type { Task } from "./types";

interface TaskFormProps {
  task: Task | null;
  onCancel: () => void;
}

export default function TaskForm({ task, onCancel }: TaskFormProps) {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectProjects);
  const users = useAppSelector(selectUsers);
  const { saveStatus, saveError } = useAppSelector((s) => s.tasks);

  const isEdit = task !== null;
  const isSaving = saveStatus === "saving";

  const methods = useForm<FormValues>({
    defaultValues: toFormValues(task),
    mode: "onTouched",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const cls = (err?: unknown) => `control${err ? " invalid" : ""}`;

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    const payload = toPayload(values);
    if (task) {
      dispatch(updateTaskRequest({ id: task.id, data: payload }));
    } else {
      dispatch(createTaskRequest(payload));
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Title" htmlFor="title" required error={errors.title}>
          <input
            id="title"
            className={cls(errors.title)}
            {...register("title", {
              required: "Title is required",
              validate: {
                notBlank: (v) => v.trim() !== "" || "Title is required",
                minLen: (v) =>
                  v.trim().length >= 3 || "Title must be at least 3 characters",
              },
              maxLength: {
                value: 100,
                message: "Title must be at most 100 characters",
              },
            })}
          />
        </Field>

        <Field label="Task Type" htmlFor="type" required error={errors.type}>
          <select
            id="type"
            className="control"
            {...register("type", { required: "Task type is required" })}
          >
            {TASK_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Priority"
          htmlFor="priority"
          required
          error={errors.priority}
        >
          <select
            id="priority"
            className="control"
            {...register("priority", { required: "Priority is required" })}
          >
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </Field>

        {isEdit && (
          <Field label="Status" htmlFor="status">
            <select id="status" className="control" {...register("status")}>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Field label="Project" htmlFor="projectId">
          <select id="projectId" className="control" {...register("projectId")}>
            <option value="">Select project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Assignee" htmlFor="assigneeId">
          <select
            id="assigneeId"
            className="control"
            {...register("assigneeId")}
          >
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Description"
          htmlFor="description"
          error={errors.description}
        >
          <textarea
            id="description"
            rows={4}
            className={cls(errors.description)}
            {...register("description", {
              maxLength: {
                value: 500,
                message: "Description must be at most 500 characters",
              },
            })}
          />
        </Field>

        <Field label="Due Date" htmlFor="dueDate">
          <input
            id="dueDate"
            type="date"
            className="control"
            {...register("dueDate")}
          />
        </Field>

        {saveStatus === "failed" && (
          <div className="banner-error">{saveError}</div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            {isSaving ? "Saving..." : isEdit ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
