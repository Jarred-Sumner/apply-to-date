import FormField from "../FormField";

export default ({
  label = "Gender",
  required = true,
  onChange,
  value,
  showBorder = false,
  name = "sex"
}) => (
  <FormField
    label={label}
    type="radio"
    required={required}
    name={name}
    value={value}
    onChange={onChange}
    showBorder={showBorder}
    radios={[
      {
        label: "Male",
        value: "male"
      },
      {
        label: "Female",
        value: "female"
      },
      {
        label: "Other",
        value: "other"
      }
    ]}
  />
);
