import Text from "./Text";
import Button from "./Button";
import Icon from "./Icon";
import Subheader from "./Subheader";

export default class RateApplication extends React.Component {
  render() {
    const { name, onYes, onNo, isMobile } = this.props;

    if (isMobile) {
      return (
        <Subheader bottom center>
          <div className="Container">
            <div>
              <Text weight="bold" size="16px" lineHeight="14px">
                Go on a date with {name}?
              </Text>
            </div>

            <div className="Buttons">
              <Button circle onClick={onNo} color="red">
                <Icon type="x" size="16px" />
              </Button>
              <Button circle onClick={onYes} color="green">
                <Icon type="check" size="24px" />
              </Button>
            </div>
          </div>

          <style jsx>{`
            .Container {
              padding: 14px 0;
              display: grid;
              grid-auto-flow: row;
              grid-row-gap: 14px;
            }

            .Buttons {
              display: grid;
              grid-auto-flow: column;
              justify-content: center;
              grid-column-gap: 42px;
            }
          `}</style>
        </Subheader>
      );
    } else {
      return (
        <div className="RateApplication">
          <Text weight="bold" size="14px" lineHeight="22px">
            Would you go on a date with {name}?
          </Text>

          <div className="Buttons">
            <Button circle onClick={onYes} color="green">
              <Icon type="check" size="24px" />
            </Button>
            <Button circle onClick={onNo} color="red">
              <Icon type="x" size="16px" />
            </Button>
          </div>

          <style jsx>{`
            .RateApplication {
              display: grid;
              text-align: center;
              margin-top: 14px;

              grid-template-rows: min-content 124px;
              width: 100%;
              min-width: min-content;
              max-width: 200px;
              margin-right: auto;
              grid-auto-flow: row;
              grid-row-gap: 28px;

              justify-content: center;
            }

            .Buttons {
              display: flex;
              flex-direction: column;
              justify-content: space-around;
              align-items: center;
            }
          `}</style>
        </div>
      );
    }
  }
}
