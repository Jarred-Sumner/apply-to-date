import Text from "./Text";
import Button from "./Button";
import Icon from "./Icon";

export default class RateApplication extends React.Component {
  render() {
    const { name, onYes, onNo } = this.props;

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
            position: absolute;
            left: calc(-62px + -56px);

            grid-template-rows: min-content 124px;
            width: 124px;
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
