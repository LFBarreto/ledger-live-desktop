// @flow

import React, { PureComponent } from "react";
import Modal from "~/renderer/components/Modal";
import Body from "./Body";
import logger from "~/logger";
import type { StepId } from "./types";
type State = {
  stepId: StepId,
  isAddressVerified: ?boolean,
  verifyAddressError: ?Error,
};

const INITIAL_STATE = {
  stepId: "amount",
  isAddressVerified: null,
  verifyAddressError: null,
};
class UnfreezeModal extends PureComponent<{ name: string }, State> {
  state = INITIAL_STATE;

  handleReset = () => this.setState({ ...INITIAL_STATE });

  handleStepChange = (stepId: StepId) => this.setState({ stepId });

  handleChangeAddressVerified = (isAddressVerified: ?boolean, err: ?Error) => {
    if (err && err.name !== "UserRefusedAddress") {
      logger.critical(err);
    }
    this.setState({ isAddressVerified, verifyAddressError: err });
  };

  handleReset = () =>
    this.setState({
      stepId: "amount",
    });

  handleStepChange = (stepId: StepId) => this.setState({ stepId });

  render() {
    const { stepId, isAddressVerified, verifyAddressError } = this.state;

    const isModalLocked = !["device", "confirmation"].includes(stepId);

    return (
      <Modal
        name={this.props.name}
        centered
        refocusWhenChange={stepId}
        onHide={this.handleReset}
        preventBackdropClick={isModalLocked}
        render={({ onClose, data }) => (
          <Body
            stepId={stepId}
            onClose={onClose}
            onChangeStepId={this.handleStepChange}
            params={data || {}}
            name={this.props.name}
            isAddressVerified={isAddressVerified}
            verifyAddressError={verifyAddressError}
            onChangeAddressVerified={this.handleChangeAddressVerified}
          />
        )}
      />
    );
  }
}

export default UnfreezeModal;
