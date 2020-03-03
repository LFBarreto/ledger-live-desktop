// @flow

import React, { useCallback } from "react";
import { useDispatch } from "react-redux";

import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";

import { openModal } from "~/renderer/actions/modals";
import Box from "~/renderer/components/Box";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import Button from "~/renderer/components/Button";

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

  console.log(rest);

  return (
    <Modal
      name={name}
      centered
      render={({ onClose, data }) => (
        <ModalBody
          onClose={onClose}
          onBack={undefined}
          title={title}
          noScroll
          render={() => (
            <>
              <Box>
                <Box>
                  <Button onClick={() => onSelectAction("MODAL_FREEZE", onClose)}>Freeze</Button>
                </Box>
                <Box>
                  <Button onClick={() => onSelectAction("MODAL_UNFREEZE", onClose)}>
                    Unfreeze
                  </Button>
                </Box>
                <Box>
                  <Button onClick={() => onSelectAction("MODAL_DELEGATE", onClose)}>Vote</Button>
                </Box>
              </Box>
            </>
          )}
          renderFooter={undefined}
        />
      )}
      {...rest}
    />
  );
};

export default ManageModal;
