import FormField from "../FormField";

export default ({ value, onChange, required = false, disabled = false }) => (
  <FormField
    label="Password"
    required={required}
    name="password"
    value={value}
    required={required}
    disabled={disabled}
    minLength={3}
    type="password"
    onChange={onChange}
  />
);
