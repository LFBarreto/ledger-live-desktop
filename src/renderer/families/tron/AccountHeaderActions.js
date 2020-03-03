// @flow

import React, { useCallback } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";

import { Trans } from "react-i18next";

import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box/Box";
import IconChartLine from "~/renderer/icons/ChartLine";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import { openModal } from "~/renderer/actions/modals";

const ButtonBase = styled(Button)`
  height: 34px;
  padding-top: 0;
  padding-bottom: 0;
`;

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
};

const AccountHeaderActions = ({ account, parentAccount }: Props) => {
  const dispatch = useDispatch();
  const { tronResources: { tronPower } = {} } = account;

  const onClick = useCallback(() => {
    if (tronPower > 0) {
      dispatch(
        openModal("MODAL_MANAGE_TRON", {
          parentAccount,
          account,
        }),
      );
    } else {
      dispatch(
        openModal("MODAL_DELEGATE", {
          parentAccount,
          account,
        }),
      );
    }
  }, [dispatch, tronPower, account, parentAccount]);

  if (parentAccount) return null;

  return (
    <ButtonBase primary onClick={onClick}>
      <Box horizontal flow={1} alignItems="center">
        {tronPower > 0 ? (
          <CryptoCurrencyIcon inactive currency={account.currency} size={16} />
        ) : (
          <IconChartLine size={16} />
        )}
        <Box>
          <Trans i18nKey={tronPower > 0 ? "tron.voting.manageTP" : "delegation.title"} />
        </Box>
      </Box>
    </ButtonBase>
  );
};

export default AccountHeaderActions;
