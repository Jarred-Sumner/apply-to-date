import FormField from "../FormField";

export default ({ required = true, value, onChange, disabled = false }) => (
  <FormField
    label="Page"
    required={required}
    name="username"
    value={value}
    disabled={disabled}
    onChange={onChange}
    placeholder="username"
  >
    <input
      type="url"
      tabIndex={-1}
      name="url"
      value={process.env.SHARE_DOMAIN + "/"}
      readOnly
    />

    <style jsx>{`
      input[type="url"] {
        border: 0;
        display: flex;
        outline: 0;
        appearance: none;
        box-shadow: none;
        border: 0;
        font-size: 14px;
        font-weight: 400;
        font-family: Lucida Grande, Open Sans, sans-serif;
        opacity: 0.75;
        background-color: #f0f2f7;
        margin-top: -12px;
        margin-bottom: -12px;
        margin-left: -22px;
        padding-left: 22px;
        cursor: default;
        margin-right: 12px;
        border-right: 1px solid #e3e8f0;
        border-top-left-radius: 100px;
        border-bottom-left-radius: 100px;
      }
    `}</style>
  </FormField>
);
