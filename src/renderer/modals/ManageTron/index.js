// @flow

import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { Trans } from "react-i18next";

import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";

import { openModal } from "~/renderer/actions/modals";
import Box from "~/renderer/components/Box";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import Button from "~/renderer/components/Button";

const ManageButton = styled(Button)`
  padding: 16px;
  margin: 5px 0;
  box-sizing: content-box;
  border-radius: 4px;
  border: 2px solid ${p => p.theme.colors.palette.divider};
`;

type Props = {
  name?: string,
  title: string,
  actions: {
    icon: ?string,
    title: string,
    description: string,
    modalName: string,
  }[],
  account: AccountLike,
  parentAccount: ?Account,
  ...
};

const ManageModal = ({ name, title, actions = [], account, parentAccount, ...rest }: Props) => {
  const dispatch = useDispatch();

  // {
  //             title: "Freeze",
  //             description: "FreezeDesc",
  //             modalName: "MODAL_FREEZE",
  //           },
  //           {
  //             title: "UnFreeze",
  //             description: "UnFreezeDesc",
  //             modalName: "MODAL_UNFREEZE",
  //           },
  //           {
  //             title: "Vote",
  //             description: "VoteDesc",
  //             modalName: "MODAL_DELEGATE",
  //           },

  const onSelectAction = useCallback(
    (name, onClose) => {
      onClose();
      dispatch(
        openModal(name, {
          parentAccount,
          account,
        }),
      );
    },
    [dispatch, account, parentAccount],
  );

  return (
    <Modal
      {...rest}
      name={name}
      centered
      render={({ onClose, data }) => (
        <ModalBody
          onClose={onClose}
          onBack={undefined}
          title={<Trans i18nKey="tron.manage.title" />}
          noScroll
          render={() => (
            <>
              <Box>
                <ManageButton onClick={() => onSelectAction("MODAL_FREEZE", onClose)}>
                  <Trans i18nKey="tron.manage.freeze.title" />
                </ManageButton>
                <ManageButton onClick={() => onSelectAction("MODAL_UNFREEZE", onClose)}>
                  <Trans i18nKey="tron.manage.unfreeze.title" />
                </ManageButton>
                <ManageButton onClick={() => onSelectAction("MODAL_DELEGATE", onClose)}>
                  <Trans i18nKey="tron.manage.vote.title" />
                </ManageButton>
              </Box>
            </>
          )}
          renderFooter={undefined}
        />
      )}
    />
  );
};

export default ManageModal;
