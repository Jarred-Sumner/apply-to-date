import classNames from "classnames";

const Text = ({
  font = "sans-serif",
  type,
  className,
  children,
  size = "16px",
  color = "rgba(0,0,0,.84);",
  componentType = "div",
  weight = "regular",
  lineHeight = "19px",
  wrap = null
}) => {
  const classes = classNames("Text", className, {
    "Text--extraBold": weight == "extraBold",
    "Text--bold": weight === "bold",
    "Text--medium": weight === "medium",
    "Text--semiBold": weight === "semiBold",
    "Text--regular": weight === "regular",
    "Text--sans-serif": font === "sans-serif",
    "Text--serif": font === "serif",
    "Text--paragraph": type === "paragraph",
    "Text--title": type === "title",
    "Text--wrap": wrap === true,
    "Text--noWrap": wrap === false
  });

  return (
    <div className={classes}>
      <style jsx>{`
        .Text {
          color: ${color};
          display: inline;
          letter-spacing: 0;
          line-height: ${lineHeight};
          font-size: ${size};
        }

        .Text--wrap {
          white-space: normal;
          word-wrap: break-word;
          word-break: break-word;
        }

        .Text--regular {
          font-weight: 400;
        }

        .Text--hugeTitle {
          font-size: 46px;
          line-height: 54px;
          letter-spacing: 0.07px;
        }

        .Text--title {
          line-height: 30px;
          white-space: nowrap;
          word-wrap: none;
          word-break: none;
        }

        .Text--serif {
          font-family: Georgia, serif;
        }

        .Text--sans-serif {
          font-family: Lucida Grande, Open Sans, sans-serif;
        }

        .Text--sans-serif.Text--extraBold {
          font-weight: 900;
        }

        .Text--serif.Text--bold {
          font-weight: 700;
        }

        .Text--serif.Text--semiBold {
          font-weight: 600;
        }

        .Text--serif.Text--bold,
        .Text--serif strong {
          font-weight: 700;
        }

        .Text--sans-serif.Text--bold,
        .Text--sans-serif strong {
          font-weight: 700;
        }
      `}</style>

      {children}
    </div>
  );
};

export default ({ type, children, ...otherProps }) => {
  if (type === "PageTitle") {
    return (
      <Text
        {...otherProps}
        font="serif"
        color="#000"
        size="36px"
        lineHeight="35px"
        weight="bold"
      >
        {children}
      </Text>
    );
  } else if (type === "paragraph") {
    return (
      <Text
        {...otherProps}
        weight="regular"
        wrap
        font="serif"
        size="18px"
        lineHeight="30px"
      >
        {children}
      </Text>
    );
  } else if (type === "title") {
    return (
      <Text {...otherProps} font="sans-serif" size="30px" weight="extraBold">
        {children}
      </Text>
    );
  } else {
    return <Text {...otherProps}>{children}</Text>;
  }
};
