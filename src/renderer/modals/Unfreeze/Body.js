// @flow
import React, { useState, useCallback, useEffect } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Trans, withTranslation } from "react-i18next";
import { createStructuredSelector } from "reselect";
import SyncSkipUnderPriority from "~/renderer/components/SyncSkipUnderPriority";
import Track from "~/renderer/analytics/Track";

import type { StepId, StepProps, St } from "./types";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";

import { getCurrentDevice } from "~/renderer/reducers/devices";
import { accountsSelector } from "~/renderer/reducers/accounts";
import { closeModal } from "~/renderer/actions/modals";

import Stepper from "~/renderer/components/Stepper";
import StepAmount, { StepAmountFooter } from "./steps/StepAmount";
import StepConnectDevice, { StepConnectDeviceFooter } from "./steps/StepConnectDevice";
import StepConfirmation from "./steps/StepConfirmation";

type OwnProps = {|
  stepId: StepId,
  onClose: () => void,
  onChangeStepId: StepId => void,
  isAddressVerified: ?boolean,
  verifyAddressError: ?Error,
  onChangeAddressVerified: (isAddressVerified: ?boolean, err: ?Error) => void,
  params: {
    account: ?AccountLike,
    parentAccount: ?Account,
    startWithWarning?: boolean,
    receiveTokenMode?: boolean,
  },
  name: string,
|};

type StateProps = {|
  t: TFunction,
  device: ?Device,
  accounts: Account[],
  device: ?Device,
  closeModal: string => void,
|};

type Props = {|
  ...OwnProps,
  ...StateProps,
|};

const createSteps = (): Array<St> => [
  {
    id: "amount",
    label: <Trans i18nKey="unfreeze.steps.amount.title" />,
    component: StepAmount,
    noScroll: true,
    footer: StepAmountFooter,
  },
  {
    id: "connectDevice",
    label: <Trans i18nKey="unfreeze.steps.connectDevice.title" />,
    component: StepConnectDevice,
    footer: StepConnectDeviceFooter,
    onBack: ({ transitionTo }: StepProps) => transitionTo("account"),
  },
  {
    id: "confirmation",
    label: <Trans i18nKey="unfreeze.steps.confirmation.title" />,
    component: StepConfirmation,
  },
];

const mapStateToProps = createStructuredSelector({
  device: getCurrentDevice,
  accounts: accountsSelector,
});

const mapDispatchToProps = {
  closeModal,
};

const Body = ({
  t,
  stepId,
  device,
  accounts,
  closeModal,
  onChangeStepId,
  isAddressVerified,
  verifyAddressError,
  onChangeAddressVerified,
  params,
  name,
}: Props) => {
  const [steps] = useState(createSteps);
  const [account, setAccount] = useState(() => (params && params.account) || accounts[0]);
  const [parentAccount, setParentAccount] = useState(() => params && params.parentAccount);
  const [disabledSteps, setDisabledSteps] = useState([]);
  const [token, setToken] = useState(null);

  const handleChangeAccount = useCallback(
    (account, parentAccount) => {
      setAccount(account);
      setParentAccount(parentAccount);
    },
    [setParentAccount, setAccount],
  );

  const handleCloseModal = useCallback(() => {
    closeModal(name);
  }, [closeModal, name]);

  const handleStepChange = useCallback(e => onChangeStepId(e.id), [onChangeStepId]);

  const handleResetSkip = useCallback(() => {
    setDisabledSteps([]);
  }, [setDisabledSteps]);

  const handleRetry = useCallback(() => {
    onChangeAddressVerified(null, null);
  }, [onChangeAddressVerified]);

  const handleSkipConfirm = useCallback(() => {
    const connectStepIndex = steps.findIndex(step => step.id === "device");
    if (connectStepIndex > -1) {
      onChangeAddressVerified(false, null);
      setDisabledSteps([connectStepIndex]);
    }
    onChangeStepId("confirmation");
  }, [onChangeAddressVerified, setDisabledSteps, steps, onChangeStepId]);

  useEffect(() => {
    const stepId =
      params && params.startWithWarning ? "warning" : params.receiveTokenMode ? "account" : null;
    if (stepId) onChangeStepId(stepId);
  }, [onChangeStepId, params]);

  useEffect(() => {
    if (!account) {
      if (!params && params.account) {
        handleChangeAccount(params.account, params.parentAccount);
      } else {
        handleChangeAccount(accounts[0], null);
      }
    }
  }, [accounts, account, params, handleChangeAccount]);

  const errorSteps = verifyAddressError ? [2] : [];

  const stepperProps = {
    title: t("unfreeze.title"),
    device,
    account,
    parentAccount,
    stepId,
    steps,
    errorSteps,
    disabledSteps,
    receiveTokenMode: !!params.receiveTokenMode,
    hideBreadcrumb: false,
    token,
    isAddressVerified,
    verifyAddressError,
    closeModal: handleCloseModal,
    onRetry: handleRetry,
    onSkipConfirm: handleSkipConfirm,
    onResetSkip: handleResetSkip,
    onChangeAccount: handleChangeAccount,
    onChangeToken: setToken,
    onChangeAddressVerified,
    onStepChange: handleStepChange,
    onClose: handleCloseModal,
  };

  return (
    <Stepper {...stepperProps}>
      <SyncSkipUnderPriority priority={100} />
      <Track onUnmount event="CloseModalUnFreeze" />
    </Stepper>
  );
};

const C: React$ComponentType<OwnProps> = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(Body);

export default C;
