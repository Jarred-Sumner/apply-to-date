import Modal from "react-responsive-modal/lib/css";
import Button from "./Button";

export const ConfirmAndCloseButtons = ({
  onConfirm,
  onCancel,
  confirmLabel = "Save",
  cancelLabel = "Cancel",
  isConfirmPending = false
}) => {
  return (
    <div className="Container">
      <Button componentType="div" fill={false} onCancel={onCancel}>
        {cancelLabel}
      </Button>

      <div className="spacer" />

      <Button
        componentType="div"
        pending={isConfirmPending}
        onClick={onConfirm}
      >
        {confirmLabel}
      </Button>

      <style jsx>{`
        .Container {
          display: flex;
          justify-content: flex-end;
          margin-left: auto;
        }

        .spacer {
          padding-left: 12px;
        }
      `}</style>
    </div>
  );
};

const ModalHeader = ({ children }) => {
  return (
    <div className="Header">
      {children}
      <style jsx>{`
        .Header {
          padding: 14px 22px;
          background-color: white;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
          display: flex;
          align-items: center;
          width: auto;
          border-bottom: 1px solid #e4e9f0;
        }
      `}</style>
    </div>
  );
};
const ModalFooter = ({ children }) => {
  return (
    <div className="Footer">
      {children}
      <style jsx>{`
        .Footer {
          padding: 14px 22px;
          background-color: white;
          border-bottom-left-radius: 4px;
          border-bottom-left-radius: 4px;
          display: flex;
          align-items: center;
          width: auto;
          border-top: 1px solid #e4e9f0;
        }
      `}</style>
    </div>
  );
};

export default ({
  open,
  onClose,
  children,
  little,
  renderHeader,
  renderFooter,
  overlayColor = "rgba(0, 0, 0, 0.75)",
  showCloseIcon = true,
  animationDuration = 300
}) => {
  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={onClose}
        showCloseIcon={showCloseIcon}
        little={little}
        styles={{
          overlay: {
            background: overlayColor
          }
        }}
        animationDuration={animationDuration}
      >
        {renderHeader && <ModalHeader>{renderHeader()}</ModalHeader>}
        {children}
        {renderFooter && <ModalFooter>{renderFooter()}</ModalFooter>}
      </Modal>
      <style jsx global>{`
        .react-responsive-modal-overlay {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow-y: auto;
          overflow-x: hidden;
          z-index: 1000;
        }
        .react-responsive-modal-overlay-little {
          align-items: center;
        }
        .react-responsive-modal-modal {
          max-width: 800px;
          position: relative;
          background: #ffffff;
          border-radius: 4px;
          margin: 14px 22px;
          border-radius: 4px;
          background-clip: padding-box;
          box-shadow: 0 12px 15px 0 rgba(0, 0, 0, 0.25);
        }
        .react-responsive-modal-close-icon {
          position: absolute;
          top: 14px;
          right: 14px;
          cursor: pointer;
        }
        .react-responsive-modal-transition-enter {
          opacity: 0.01;
        }
        .react-responsive-modal-transition-enter-active {
          opacity: 1;
          transition: opacity 500ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .react-responsive-modal-transition-exit {
          opacity: 1;
        }
        .react-responsive-modal-transition-exit-active {
          opacity: 0.01;
          transition: opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
        }

        @media (max-width: 500px) {
          .react-responsive-modal-overlay-little {
            align-items: flex-start;
          }
        }
      `}</style>
    </React.Fragment>
  );
};
