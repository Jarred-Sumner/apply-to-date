import Subheader from "../Subheader";
import Text from "../Text";
import SharableSocialLink from "../SharableSocialLink";
import CopyURLForm from "../CopyURLForm";

export default ({ dateEvent, isOwnedByCurrentUser = false }) => (
  <Subheader showLeftBorder bottom={false} center>
    <div className="Subheader">
      <div className="Subheader-text Subheader-text--desktop">
        <Text align="right" wrap={false} weight="bold" size="14px">
          {isOwnedByCurrentUser ? "Get more people to ask you out" : "Share"}
        </Text>
      </div>
      <div className="Subheader-text Subheader-text--mobile">
        <Text align="right" wrap={false} weight="bold" size="14px">
          Share
        </Text>
      </div>
      <div className="Subheader-urlWrapper">
        <CopyURLForm hideInputOnMobile url={dateEvent.url} />
      </div>
      <div className="Subheader-buttons">
        <SharableSocialLink
          provider="twitter"
          width="36px"
          height="36px"
          url={dateEvent.url}
        />

        <SharableSocialLink
          provider="facebook"
          width="36px"
          height="36px"
          url={dateEvent.url}
        />
      </div>
    </div>

    <style jsx>{`
      .Subheader-buttons {
        display: grid;
        grid-auto-flow: column dense;
        grid-column-gap: 14px;
        grid-template-columns: 38px 38px;
        align-self: center;
      }

      .Subheader-urlWrapper {
        display: grid;
        width: 100%;
      }

      .Subheader {
        display: grid;
        grid-auto-flow: column;
        grid-column-gap: 14px;
        align-items: center;
        width: 100%;
        justify-content: center;
        grid-template-columns: 1fr minmax(200, 500px) 1fr;
      }

      .Subheader-text {
        text-align: right;
      }

      .Subheader-text--mobile {
        display: none;
      }

      @media (max-width: 1080px) {
        .Subheader-text--mobile {
          display: block;
        }

        .Subheader-text--desktop {
          display: none;
        }
      }
    `}</style>
  </Subheader>
);
