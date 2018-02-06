import classNames from "classnames";

export default ({
  font = "sans-serif",
  type,
  className,
  children,
  size = "16px",
  color = "#3A405B",
  componentType = "div",
  weight = "regular"
}) => {
  const classes = classNames("Text", {
    "Text--bold": weight === "bold",
    "Text--medium": weight === "medium",
    "Text--regular": weight === "regular",
    "Text--sans-serif": font === "sans-serif",
    "Text--serif": font === "serif",
    "Text--paragraph": type === "paragraph",
    "Text--title": type === "title",
    "Text--pageTitle": type === "pageTitle"
  });

  return (
    <div className={classes}>
      <style jsx>{`
        .Text {
          color: ${color};
          display: inline;
          letter-spacing: 0;
          line-height: 19px;
          font-size: ${size};
        }

        .Text--paragraph {
          line-height: 30px;
          white-space: normal;
          word-wrap: break-word;
          word-break: break-word;
        }

        .Text--pageTitle {
          line-height: 39px;
          white-space: nowrap;
          word-wrap: none;
          word-break: none;
        }

        .Text--title {
          line-height: 30px;
          white-space: nowrap;
          word-wrap: none;
          word-break: none;
        }

        .Text--serif {
          font-family: Cochin, serif;
        }

        .Text--sans-serif {
          font-family: Lato, sans-serif;
        }

        .Text--serif.Text--bold {
          font-weight: 700;
        }

        .Text--serif.Text--bold {
          font-weight: 700;
        }

        .Text--sans-serif.Text--bold {
          font-weight: 700;
        }
      `}</style>

      {React.createElement(componentType, {}, children)}
    </div>
  );
};
