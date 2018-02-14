import classNames from "classnames";
import TextareaAutosize from "react-autosize-textarea";

export default class TextArea extends React.Component {
  handleChange = evt => {
    this.props.onChange(evt.target.value);
  };

  render() {
    const {
      name,
      value,
      placeholder,
      className,
      onChange,
      type,
      ...otherProps
    } = this.props;

    return (
      <React.Fragment>
        <TextareaAutosize
          className={classNames("TextArea", {
            "TextArea--Tagline": type === "Tagline"
          })}
          {...otherProps}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={this.handleChange}
        />
        <style jsx global>{`
          .TextArea {
            border-radius: 4px;
            border: 1px solid #e4e9f0;
            padding: 14px 22px;
            box-shadow: none;
            appearance: none;
            font-size: 21px;
            font-family: Frank Ruhl Libre, serif;
            line-height: 27px;
            width: 100%;
          }

          .TextArea::-webkit-input-placeholder {
            color: #b9bed1;
          }

          .TextArea::-moz-placeholder {
            color: #b9bed1;
          }

          .TextArea--Tagline {
            font-family: Frank Ruhl Libre, serif;
            color: #000;
            font-size: 18px;
            line-height: 19px;
            text-align: center;
            font-weight: 400;
            outline: none;
          }
        `}</style>
      </React.Fragment>
    );
  }
}
