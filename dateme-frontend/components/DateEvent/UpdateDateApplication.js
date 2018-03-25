import Text from "../Text";
import TextArea from "../TextArea";
import { COLORS, SPACING } from "../../helpers/styles";
import Button from "../Button";
import Divider from "../Divider";
import { updateDateEventApplication } from "../../api";
import { bindActionCreators } from "redux";
import Alert, { handleApiError } from "../Alert";
import { connect } from "react-redux";
import {
  dateEventApplicationSelector,
  updateEntities
} from "../../redux/store";

const UpdateDateEventApplication = ({ why, onChangeWhy, isSaving, onSave }) => (
  <div className="Container">
    <Text align="center" type="subtitle">
      Why do you want to go on a date with me?
    </Text>

    <Divider height={`${SPACING.SMALL}px`} color="transparent" />

    <TextArea
      rows={3}
      cols={5}
      type="WhyDateEvent"
      value={why}
      placeholder="Leaving a note here is a great way to increase your chances"
      onChange={onChangeWhy}
    />

    <Divider height={`${SPACING.NORMAL}px`} color="transparent" />

    <div className="ButtonContainer">
      <Button maxWidth="150px" onClick={onSave} pending={isSaving}>
        Save
      </Button>
    </div>

    <style jsx>{`
      .Container {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-self: center;
        align-content: center;
      }

      .ButtonContainer {
        margin-left: auto;
        margin-right: auto;
      }
    `}</style>
  </div>
);

class UpdateDateEventApplicationContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isUpdating: false,
      why: _.get(props, "dateEventApplication.sections.why") || ""
    };
  }
  handleSaveWhy = () => {
    if (this.state.isUpdating) {
      return;
    }

    this.setState({
      isUpdating: true
    });

    const { id, sections } = this.props.dateEventApplication;
    updateDateEventApplication({
      id,
      sections: {
        ...sections,
        why: this.state.why
      }
    })
      .then(response => {
        this.setState({ isUpdating: false });
        this.props.updateEntities(response.body);

        Alert.success("Saved.");
      })
      .catch(exception => {
        handleApiError(exception);
        this.setState({ isUpdating: false });
      });
  };
  handleChangeWhy = why => this.setState({ why });

  render() {
    return (
      <UpdateDateEventApplication
        why={this.state.why}
        isUpdating={this.state.isUpdating}
        onChangeWhy={this.handleChangeWhy}
        onSave={this.handleSaveWhy}
      />
    );
  }
}

export default connect(
  (state, props) => {
    return {
      dateEventApplication: dateEventApplicationSelector(props.applicationId)(
        state
      )
    };
  },
  dispatch => bindActionCreators({ updateEntities }, dispatch)
)(UpdateDateEventApplicationContainer);
