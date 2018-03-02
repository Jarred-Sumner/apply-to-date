import Text from "./Text";

const COLORS = {
  blue: "#4BB1E1"
};

export default ({ children, color }) => {
  return (
    <div className="Tag">
      <Text
        color="white"
        weight="bold"
        casing="uppercase"
        lineHeight="17px"
        size="12px"
        wrap={false}
      >
        {children}
      </Text>

      <style jsx>{`
        .Tag {
          padding: 4px 21px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: ${COLORS[color]};
          width: auto;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};
