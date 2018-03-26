import FormField, { CategoryFormField } from "../FormField";
import {
  CATEGORIES,
  LABELS_BY_CATEGORY,
  EMOJI_BY_CATEGORY,
  LOCATION_LABEL_MAPPING,
  PUBLIC_CATEGORIES
} from "../../helpers/dateEvent";
import { SPACING } from "../../helpers/styles";
import _ from "lodash";
import TextArea from "../TextArea";
import Text from "../Text";
import Divider from "../Divider";
import moment from "moment-timezone";
import InlineDatePicker from "../InlineDatePicker";

const buildDayOptions = selectedDay => {
  const days = [
    {
      label: "Tomorrow",
      value: moment()
        .add(1, "day")
        .startOf("day")
        .toDate()
        .toISOString()
    }
  ];

  _.range(2, 6)
    .map(offset =>
      moment()
        .add(offset, "day")
        .startOf("day")
    )
    .forEach(date =>
      days.push({
        label: date.format("dddd"),
        value: date.toDate().toISOString()
      })
    );

  const areNoneHighlighted = !days.find(
    ({ value }) =>
      moment(selectedDay)
        .toDate()
        .toISOString() === value
  );

  const isCustomDaySelected =
    areNoneHighlighted && moment(selectedDay).isValid();

  days.push({
    label: isCustomDaySelected
      ? moment(selectedDay).format("MM/DD/YYYY")
      : "Custom",
    value: "custom"
  });

  return {
    days,
    isCustomDaySelected
  };
};

export default class UpdateDateEvent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      occursOnDay: props.occursOnDay,
      showDatePicker: false,
      ...buildDayOptions(props.occursOnDay)
    };
  }

  handleChangeOccursOn = occursOnDay => {
    if (occursOnDay === "custom") {
      this.setState({
        occursOnDay: "custom",
        showDatePicker: true
      });
    } else {
      this.props.onChangeOccursOnDay(occursOnDay);
      this.setState({
        showDatePicker: false
      });
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.occursOnDay !== this.props.occursOnDay) {
      this.setState({
        occursOnDay: this.props.occursOnDay,
        showDatePicker: false,
        ...buildDayOptions(this.props.occursOnDay)
      });
    }
  }

  handleHideDatePicker = () => {
    if (this.state.occursOnDay === "custom") {
      this.setState({ showDatePicker: false, occursOnDay: null });
    } else {
      this.setState({ showDatePicker: false });
    }
  };

  render() {
    const {
      category,
      location,
      summary,
      onChangeCategory,
      onChangeLocation,
      locations
    } = this.props;
    const { days, occursOnDay, isCustomDaySelected } = this.state;

    return (
      <div className="Container">
        <CategoryFormField onChange={onChangeCategory} value={category} />

        <Divider height={`${SPACING.LARGE}px`} color="transparent" />

        <div className="Date">
          <FormField
            label="What day?"
            onChange={this.handleChangeOccursOn}
            type="pill"
            inline
            showBorder={false}
            value={isCustomDaySelected ? "custom" : occursOnDay}
            radios={days}
          />

          {this.state.showDatePicker && (
            <InlineDatePicker
              onHide={this.handleHideDatePicker}
              minDate={moment().startOf("day")}
              maxDate={moment()
                .startOf("day")
                .add(2, "month")}
              selected={
                moment(this.props.occursOnDay).isValid()
                  ? moment(this.props.occursOnDay)
                  : moment()
                      .startOf("day")
                      .add(1, "day")
              }
              onChange={date =>
                this.props.onChangeOccursOnDay(
                  moment(date)
                    .startOf("day")
                    .toDate()
                    .toISOString()
                )
              }
            />
          )}
        </div>

        <Divider height={`${SPACING.LARGE}px`} color="transparent" />

        <FormField
          label="LOCATION"
          showBorder={false}
          onChange={onChangeLocation}
          inline
          type="pill"
          value={location}
          radios={locations.map(value => ({
            value,
            label: LOCATION_LABEL_MAPPING[value]
          }))}
        />

        <Divider height={`${SPACING.LARGE}px`} color="transparent" />

        <div className="Summary">
          <Text type="label">EVENT SUMMARY</Text>
          <Divider height={`${SPACING.SMALL}px`} color="transparent" />
          <TextArea
            rows={4}
            value={summary}
            type="DateEventSummary"
            placeholder={
              "(Optional) provide a short summary of the event to give people more context"
            }
            onChange={this.props.onChangeSummary}
          />
        </div>

        <style jsx>{`
          .Container {
            display: grid;
            max-width: 500px;
            padding: ${SPACING.LARGE}px;
          }

          .Date {
            position: relative;
          }

          .InlineDatePicker {
            position: absolute;
            z-index: 9999;
          }
        `}</style>
      </div>
    );
  }
}
