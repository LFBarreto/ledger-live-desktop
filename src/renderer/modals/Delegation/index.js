// @flow

import React, { PureComponent } from "react";

import { getMainAccount } from "@ledgerhq/live-common/lib/account";

import Modal from "~/renderer/components/Modal";
import perFamily from "~/renderer/generated/DelegationModal";
import type { StepId } from "./types";

type State = {
  stepId: StepId,
};

class DelegationModal extends PureComponent<{}, State> {
  state = {
    stepId: "starter",
  };

  handleReset = () => this.setState({ stepId: "starter" });

  handleStepChange = (stepId: StepId) => {
    this.setState({ stepId });
  };

  render() {
    const { account, parentAccount } = this.props;
    const mainAccount = getMainAccount(account, parentAccount);
    const PerFamily = perFamily[mainAccount.currency.family];

    console.log(mainAccount, perFamily);

    const { stepId } = this.state;
    const isModalLocked = !["account", "confirmation"].includes(stepId);

    return (
      PerFamily && (
        <Modal
          name="MODAL_DELEGATE"
          centered
          refocusWhenChange={stepId}
          onHide={this.handleReset}
          preventBackdropClick={isModalLocked}
          render={({ onClose, data }) => (
            <PerFamily
              stepId={stepId}
              onClose={onClose}
              onChangeStepId={this.handleStepChange}
              params={data || {}}
            />
          )}
        />
      )
    );
  }
}

export default DelegationModal;
