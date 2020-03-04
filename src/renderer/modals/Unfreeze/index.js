// @flow

import React, { PureComponent } from "react";
import Modal from "~/renderer/components/Modal";
import Body from "./Body";
import type { StepId } from "./types";

class UnfreezeModal extends PureComponent<{ name: string }, { stepId: StepId }> {
  state = {
    stepId: "amount",
  };

  handleReset = () =>
    this.setState({
      stepId: "amount",
    });

  handleStepChange = (stepId: StepId) => this.setState({ stepId });

  render() {
    const { stepId } = this.state;

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
          />
        )}
      />
    );
  }
}

export default UnfreezeModal;
