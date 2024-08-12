import React from "react";

const ConfirmChangeUserStatusModal = ({ isOpen, onClose, onConfirm, description }) => {
  if (!isOpen) return null;
  return (

    <div className="modal-backdrop" onClick={onClose}>
      <div className="deletion-modal" onClick={(e) => e.stopPropagation()}>
        <div className="deletion-modal-body">
          <h1>Confirm Change User Status</h1>
          <p>{description}</p>
          <div className="botton-deletion">
            <button className="btn-edit" onClick={onConfirm}>
              Confirm
            </button>
            <button className="btn-delete" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmChangeUserStatusModal;
