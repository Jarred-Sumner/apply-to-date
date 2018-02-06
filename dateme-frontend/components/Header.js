import Brand from "./Brand";
import Sticky from "react-stickynode";
import Button from "./Button";

class Header extends React.Component {
  renderButtons = () => {
    return (
      <div className="Buttons">
        <Button href="/sign-in" fill={false}>
          Sign in
        </Button>

        <Button href="/sign-up" fill>
          Get your own site
        </Button>

        <style jsx>{`
          .Buttons {
            margin-left: auto;
            display: grid;
            grid-template-columns: auto auto;
            grid-template-rows: 1fr;
            grid-column-gap: 14px;
          }
        `}</style>
      </div>
    );
  };

  render() {
    const { isSticky = true, showChildren = false, children } = this.props;

    return (
      <Sticky enabled={isSticky}>
        <header>
          <Brand />

          {!showChildren && this.renderButtons()}
          {showChildren && children}

          <style jsx>{`
            header {
              padding: 14px 40px;
              display: flex;
              border-bottom: 1px solid #e8e8e8;
              background-color: white;
              z-index: 999;
            }
          `}</style>
        </header>
      </Sticky>
    );
  }
}

export default Header;
