import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import onClickOutside from "react-onclickoutside";

class InlineDatePicker extends React.Component {
  handleClickOutside = () => {
    this.props.onHide();
  };

  render() {
    const { onHide, ...otherProps } = this.props;

    return (
      <div className="Container">
        <div className="InlineDatePicker">
          <DatePicker inline {...otherProps} />
        </div>

        <style jsx>{`
          .Container {
            position: relative;
            z-index: 999;
          }

          .InlineDatePicker {
            position: absolute;
            z-index: 999;
          }
        `}</style>
      </div>
    );
  }
}

export default onClickOutside(InlineDatePicker);
