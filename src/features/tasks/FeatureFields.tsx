import { useFieldArray, useFormContext } from 'react-hook-form';
import type { FormValues } from './formUtils';

export default function FeatureFields() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'acceptanceCriteria' });

  return (
    <div className="field">
      <span className="field-label">Acceptance Criteria</span>

      {fields.map((field, index) => {
        const err = errors.acceptanceCriteria?.[index]?.text;
        return (
          <div key={field.id}>
            <div className="list-row">
              <input
                className={`control${err ? ' invalid' : ''}`}
                placeholder="e.g. User can toggle the theme"
                {...register(`acceptanceCriteria.${index}.text`, {
                  validate: (v) => v.trim() !== '' || 'Criteria cannot be empty',
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
        <button type="button" className="btn btn-dark" onClick={() => append({ text: '' })}>
          Add Criteria
        </button>
      </div>
    </div>
  );
}