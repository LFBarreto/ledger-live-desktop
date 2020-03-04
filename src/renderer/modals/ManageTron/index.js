// @flow

import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import { Trans } from "react-i18next";
import { BigNumber } from "bignumber.js";

import { getMainAccount } from "@ledgerhq/live-common/lib/account";

import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";

import { openModal } from "~/renderer/actions/modals";
import Box from "~/renderer/components/Box";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import Freeze from "~/renderer/icons/Freeze";
import Vote from "~/renderer/icons/Vote";
import Unfreeze from "~/renderer/icons/Unfreeze";
import Text from "~/renderer/components/Text";

const IconWrapper = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 32px;
  background-color: ${p => p.theme.colors.palette.action.hover};
  color: ${p => p.theme.colors.palette.primary.main};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ManageButton = styled.button`
  min-height: 88px;
  padding: 16px;
  margin: 5px 0;
  border-radius: 4px;
  border: 2px solid ${p => p.theme.colors.palette.divider};
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  ${p =>
    p.disabled
      ? css`
          pointer-events: none;
          cursor: auto;
          ${IconWrapper} {
            background-color: ${p.theme.colors.palette.action.active};
            color: ${p.theme.colors.palette.text.shade20};
          }
          ${Title} {
            color: ${p.theme.colors.palette.text.shade50};
          }
          ${Description} {
            color: ${p.theme.colors.palette.text.shade30};
          }
        `
      : `
      cursor: pointer;
      &:hover {
        background-color: ${p.theme.colors.palette.action.active};
      }
  `};
`;

const InfoWrapper = styled(Box).attrs(() => ({
  vertical: true,
  flex: 1,
  ml: 3,
  textAlign: "start",
}))``;

const Title = styled(Text).attrs(() => ({
  ff: "Inter|SemiBold",
  fontSize: 4,
}))``;

const Description = styled(Text).attrs(() => ({
  ff: "Inter|Regular",
  fontSize: 3,
  color: "palette.text.shade60",
}))``;

type Props = {
  name?: string,
  account: AccountLike,
  parentAccount: ?Account,
  ...
};

const ManageModal = ({ name, account, parentAccount, ...rest }: Props) => {
  const dispatch = useDispatch();
  const mainAccount = getMainAccount(account, parentAccount);

  const { spendableBalance, tronResources: { tronPower, frozen = {} } = {} } = mainAccount;

  const canFreeze = spendableBalance && spendableBalance.gt(0);

  const canUnfreeze =
    frozen &&
    BigNumber(frozen.bandwidth || 0)
      .plus(frozen.energy || 0)
      .gt(0);

  const canVote = tronPower > 0;

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
                <ManageButton
                  disabled={!canFreeze}
                  onClick={() => onSelectAction("MODAL_FREEZE", onClose)}
                >
                  <IconWrapper>
                    <Freeze size={16} />
                  </IconWrapper>
                  <InfoWrapper>
                    <Title>
                      <Trans i18nKey="tron.manage.freeze.title" />
                    </Title>
                    <Description>
                      <Trans i18nKey="tron.manage.freeze.description" />
                    </Description>
                  </InfoWrapper>
                </ManageButton>
                <ManageButton
                  disabled={!canUnfreeze}
                  onClick={() => onSelectAction("MODAL_UNFREEZE", onClose)}
                >
                  <IconWrapper>
                    <Unfreeze size={16} />
                  </IconWrapper>
                  <InfoWrapper>
                    <Title>
                      <Trans i18nKey="tron.manage.unfreeze.title" />
                    </Title>
                    <Description>
                      <Trans i18nKey="tron.manage.unfreeze.description" />
                    </Description>
                  </InfoWrapper>
                </ManageButton>
                <ManageButton
                  disabled={!canVote}
                  onClick={() => onSelectAction("MODAL_DELEGATE", onClose)}
                >
                  <IconWrapper>
                    <Vote size={16} />
                  </IconWrapper>
                  <InfoWrapper>
                    <Title>
                      <Trans i18nKey="tron.manage.vote.title" />
                    </Title>
                    <Description>
                      <Trans i18nKey="tron.manage.vote.description" />
                    </Description>
                  </InfoWrapper>
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
