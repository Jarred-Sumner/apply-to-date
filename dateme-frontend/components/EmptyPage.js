import Page from "./Page";
import Text from "./Text";
import Head from "./head";

class EmptyPage extends React.Component {
  render() {
    const {
      title,
      description,
      graphic,
      actions,
      footerText,
      headTitle
    } = this.props;

    return (
      <Page size="small">
        <div className="Container">
          <Head title={headTitle} />
          <div className="Title">
            <Text type="PageTitle">{title}</Text>
          </div>
          {description && (
            <div className="Description">
              <Text size="18px" lineHeight="24px" align="center">
                {description}
              </Text>
            </div>
          )}
          {graphic && <div className="Graphic">{graphic}</div>}
          {actions && <div className="Actions">{actions}</div>}
        </div>
        <style jsx>{`
          .Container {
            display: grid;
            margin-top: 4rem;
            grid-template-rows: auto auto auto auto;
            grid-row-gap: 28px;
            justify-content: center;
            height: 100%;
            text-align: center;
          }

          .FooterText {
            margin-top: 14px;
          }

          .Actions {
            margin-top: 14px;
            margin-left: auto;
            margin-right: auto;
          }
        `}</style>
      </Page>
    );
  }
}

export default EmptyPage;
