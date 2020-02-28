// @flow

import React, { PureComponent } from "react";
import Modal from "~/renderer/components/Modal";
import Body from "./Body";
import type { StepId } from "./types";

class ClaimRewardsModal extends PureComponent<{}, { stepId: StepId }> {
  state = {
    stepId: "rewards",
  };

  handleReset = () =>
    this.setState({
      stepId: "rewards",
    });

  handleStepChange = (stepId: StepId) => this.setState({ stepId });

  render() {
    const { stepId } = this.state;

    const isModalLocked = !["device", "confirmation"].includes(stepId);

    return (
      <Modal
        name="MODAL_CLAIM_REWARDS"
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
          />
        )}
      />
    );
  }
}

export default ClaimRewardsModal;
