import Icon from "./Icon";

const Star = ({ filledIn, onMouseOver, size, onClick }) => {
  return (
    <div onClick={onClick} onMouseOver={onMouseOver}>
      <Icon type="heart" size={size * 0.5} color={"white"} />

      <style jsx>{`
        div {
          width: ${size}px;
          height: ${size}px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: ${filledIn ? "#00E7A6" : "#666"};
          border-radius: 100%;
        }
      `}</style>
    </div>
  );
};

export default Star;
