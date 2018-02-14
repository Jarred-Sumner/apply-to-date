import classNames from "classnames";
import Input from "react-input-autosize";

export default class EditableText extends React.PureComponent {
  render() {
    const { className, type, maxWidth, maxHeight, ...otherProps } = this.props;

    return (
      <React.Fragment>
        <Input
          inputClassName={classNames("EditableText", {
            "EditableText--ProfilePageTitle": type === "ProfilePageTitle",
            "EditableText--Tagline": type === "Tagline"
          })}
          type="text"
          maxWidth={maxWidth}
          maxHeight={maxHeight}
          {...otherProps}
        />
        <style jsx global>{`
          .EditableText {
            display: inline-flex;
            padding-bottom: 4px;
            appearance: none;

            margin: 0;
            padding: 0;
            border: 0;
            border-bottom: 1px dashed #b9bed1;
            box-shadow: none;
          }

          .EditableText:focus {
            outline: none;
          }

          .EditableText--ProfilePageTitle {
            font-family: Frank Ruhl Libre, serif;
            color: #000;
            font-size: 36px;
            line-height: 35px;
            font-weight: 700;
          }
        `}</style>
      </React.Fragment>
    );
  }
}
