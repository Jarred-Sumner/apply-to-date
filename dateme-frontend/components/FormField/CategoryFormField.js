import {
  PUBLIC_CATEGORIES,
  LABELS_BY_CATEGORY,
  EMOJI_BY_CATEGORY
} from "../../helpers/dateEvent";
import FormField from "../FormField";

export default ({ onChange, value, label = "What do you want to do?" }) => (
  <FormField
    label={label}
    onChange={onChange}
    type="pill"
    inline
    showBorder={false}
    value={value}
    radios={_.keys(PUBLIC_CATEGORIES).map(category => ({
      label: `${LABELS_BY_CATEGORY[category]} ${EMOJI_BY_CATEGORY[category]}`,
      value: category
    }))}
  />
);
