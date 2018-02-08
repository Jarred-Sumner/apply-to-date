import classNames from "classnames";

export default class EditableText extends React.PureComponent {
  render() {
    const {
      className,
      width = "auto",
      minWidth,
      maxWidth,
      type,
      ...otherProps
    } = this.props;

    return (
      <React.Fragment>
        <input
          className={classNames(className, {
            "EditableText--ProfilePageTitle": type === "ProfilePageTitle",
            "EditableText--Tagline": type === "Tagline"
          })}
          type="text"
          {...otherProps}
        />
        <style jsx>{`
          input {
            display: inline-flex;
            padding-bottom: 4px;
            appearance: none;

            margin: 0;
            padding: 0;
            border: 0;
            border-bottom: 1px dashed #b9bed1;
            width: ${width};
            min-width: ${minWidth || "unset"};
            max-width: ${maxWidth || "unset"};
            box-shadow: none;
          }

          input:focus,
          select:focus,
          textarea:focus,
          button:focus {
            outline: none;
          }

          .EditableText--ProfilePageTitle {
            font-family: Frank Ruhl Libre, serif;
            color: #000;
            font-size: 36px;
            line-height: 35px;
            font-weight: 700;
          }

          .EditableText--Tagline {
            font-family: Frank Ruhl Libre, serif;
            color: #000;
            font-size: 18px;
            line-height: 19px;
            text-align: center;
            font-weight: 400;
          }
        `}</style>
      </React.Fragment>
    );
  }
}
