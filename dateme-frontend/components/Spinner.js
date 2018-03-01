export default ({ color = "#666", size = 18 }) => (
  <div className="Spinner">
    <style jsx>{`
      .Spinner {
        display: flex;
        content: "";
        height: ${size}px;
        width: ${size}px;
        animation: rotate 1s infinite linear;
        border: ${Math.floor(size / 2)}px solid ${color};
        border-right-color: transparent;
        border-radius: 50%;
      }

      @keyframes rotate {
        0% {
          transform: rotate(0deg);
        }

        100% {
          transform: rotate(360deg);
        }
      }
    `}</style>
  </div>
);
