import { formatTitle } from "../../helpers/dateEvent";
import Text from "../Text";
import Divider from "../Divider";
import Button from "../Button";
import Icon from "../Icon";
import { SPACING, COLORS } from "../../helpers/styles";

export default ({ onEdit, category, profile }) => (
  <div className="Title">
    <Text align="center" type="ProfilePageTitle">
      {formatTitle({
        profile,
        category
      })}
    </Text>
    <Divider width={`${SPACING.NORMAL}px`} color="transparent" />
    <Button
      icon={<Icon type="edit" size="18px" color={COLORS.WHITE} />}
      onClick={onEdit}
      color="blue"
      circle
      fill
      inline
    />

    <style jsx>{`
      .Title {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `}</style>
  </div>
);
