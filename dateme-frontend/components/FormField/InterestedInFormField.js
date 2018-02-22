import FormField from "../FormField";

export default ({
  onChange,
  required = false,
  interestedInMen = false,
  interestedInWomen = false,
  interestedInOther = false
}) => (
  <FormField
    label="Interested in"
    type="checkbox"
    required={required}
    name="interestedIn"
    onChange={onChange}
    showBorder={false}
    checkboxes={[
      {
        checked: interestedInMen,
        label: "Men",
        name: "interestedInMen"
      },
      {
        checked: interestedInWomen,
        label: "Women",
        name: "interestedInWomen"
      },
      {
        checked: interestedInOther,
        label: "Other",
        name: "interestedInOther"
      }
    ]}
  />
);
