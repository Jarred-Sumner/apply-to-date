import classNames from "classnames";

const Text = ({
  font = "sans-serif",
  type,
  className,
  children,
  size = "18px",
  color = "rgba(0,0,0,.75);",
  componentType = "div",
  weight = "regular",
  lineHeight = "19px",
  casing = "inherit",
  textDecoration = "none",
  wrap = null
}) => {
  const classes = classNames("Text", className, {
    "Text--extraBold": weight == "extraBold",
    "Text--bold": weight === "bold",
    "Text--medium": weight === "medium",
    "Text--semiBold": weight === "semiBold",
    "Text--regular": weight === "regular",
    "Text--sans-serif": font === "sans-serif",
    "Text--lucida": font === "lucida",
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
          text-transform: ${casing};
          text-decoration: ${textDecoration};
        }

        .Text--wrap {
          white-space: normal;
          word-wrap: break-word;
          word-break: break-word;
        }

        .Text--regular {
          font-weight: 400;
          line-height: 1.58;
        }

        .Text--hugeTitle {
          font-size: 46px;
          line-height: 54px;
          letter-spacing: 0.07px;
        }

        .Text--title {
          line-height: 34px;
          white-space: nowrap;
          word-wrap: none;
          word-break: none;
        }

        .Text--serif {
          font-family: Frank Ruhl Libre, serif;
        }

        .Text--sans-serif {
          font-family: Open Sans, sans-serif;
        }

        .Text--lucida {
          font-family: Lucida Grande, sans-serif;
        }

        .Text--sans-serif.Text--extraBold {
          font-weight: 900;
          margin-left: -2.13px;
          line-height: 1.15;
          letter-spacing: -0.015em;
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

        .Text :global(strong) {
          font-weight: 700;
        }
      `}</style>

      {children}
    </div>
  );
};

export default ({ type, children, ...otherProps }) => {
  if (type == "Tagline") {
    return (
      <Text {...otherProps} font="serif" color="#000" size="18px">
        {children}
      </Text>
    );
  } else if (type == "ProfilePageTitle") {
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
  } else if (type === "PageTitle") {
    return (
      <Text
        {...otherProps}
        font="sans-serif"
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
        size="21px"
        lineHeight="30px"
      >
        {children}
      </Text>
    );
  } else if (type === "title") {
    return (
      <Text {...otherProps} font="lucida" size="30px" weight="extraBold">
        {children}
      </Text>
    );
  } else if (type === "label") {
    return (
      <Text
        {...otherProps}
        casing="uppercase"
        font="sans-serif"
        size="12px"
        color="#808696"
        weight="extraBold"
      >
        {children}
      </Text>
    );
  } else if (type === "footerlink") {
    return (
      <Text
        {...otherProps}
        type={type}
        size="12px"
        letterSpacing="1px"
        lineHeight="22px"
        textDecoration="none"
        fontWeight="400"
        font="sans-serif"
        color="#000"
        casing="uppercase"
      >
        {children}
      </Text>
    );
  } else if (type === "link") {
    return (
      <Text
        {...otherProps}
        type={type}
        size="14px"
        lineHeight="26px"
        textDecoration="underline"
      >
        {children}
      </Text>
    );
  } else if (type === "muted") {
    return (
      <Text {...otherProps} size="13px">
        {children}
      </Text>
    );
  } else {
    return <Text {...otherProps}>{children}</Text>;
  }
};
