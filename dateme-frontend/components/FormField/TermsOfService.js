import FormField from "../FormField";

export default ({
  label = "I agree to the terms of service and privacy policy",
  name = "termsOfService",
  required = true,
  onChange,
  value,
  showBorder = false,
  checked
}) => (
  <FormField
    type="checkbox"
    name={name}
    required
    onChange={onChange}
    showBorder={false}
    checkboxes={[
      {
        checked: checked,
        label: label,
        name: name,
        size: "small"
      }
    ]}
  />
);
