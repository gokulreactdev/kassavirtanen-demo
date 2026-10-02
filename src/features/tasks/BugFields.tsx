import { useFieldArray, useFormContext } from 'react-hook-form';
import Field from '../../components/Field';
import { SEVERITIES } from './constants';
import type { FormValues } from './formUtils';

export default function BugFields() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'subtasks' });

  return (
    <>
      <Field label="Severity" htmlFor="severity" required error={errors.severity}>
        <select
          id="severity"
          className="control"
          {...register('severity', { required: 'Severity is required' })}
        >
          {SEVERITIES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Steps to Reproduce"
        htmlFor="stepsToReproduce"
        error={errors.stepsToReproduce}
      >
        <textarea
          id="stepsToReproduce"
          rows={4}
          className="control"
          {...register('stepsToReproduce', {
            maxLength: { value: 1000, message: 'Steps must be at most 1000 characters' },
          })}
        />
      </Field>

      <div className="field">
        <span className="field-label">Subtasks</span>

        {fields.map((field, index) => {
          const err = errors.subtasks?.[index]?.title;
          return (
            <div key={field.id}>
              <div className="list-row">
                <input
                  type="checkbox"
                  aria-label="Completed"
                  {...register(`subtasks.${index}.completed`)}
                />
                <input
                  className={`control${err ? ' invalid' : ''}`}
                  placeholder="Subtask title"
                  {...register(`subtasks.${index}.title`, {
                    validate: (v) => v.trim() !== '' || 'Subtask title is required',
                  })}
                />
                <button type="button" className="btn btn-dark" onClick={() => remove(index)}>
                  Remove
                </button>
              </div>
              {err && <span className="field-error">{err.message}</span>}
            </div>
          );
        })}

        <div>
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => append({ title: '', completed: false })}
          >
            Add Subtask
          </button>
        </div>
      </div>
    </>
  );
}