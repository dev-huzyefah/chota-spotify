import { useField } from 'formik';

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  id?: string;
}

export function FormInput({ label, ...props }: FormInputProps) {
  const [field, meta] = useField(props);
  const showError = meta.touched && meta.error;

  return (
    <div className="auth-form__field">
      <label className="auth-form__label" htmlFor={props.id || props.name}>
        {label}
      </label>
      <input
        className={`auth-form__input ${showError ? 'auth-form__input--error' : ''}`}
        {...field}
        {...props}
      />
      {showError ? (
        <div className="auth-form__field-error">{meta.error}</div>
      ) : null}
    </div>
  );
}
