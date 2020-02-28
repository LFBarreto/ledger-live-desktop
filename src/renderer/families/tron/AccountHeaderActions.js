// @flow

import React from "react";
import styled from "styled-components";

import { Trans } from "react-i18next";

import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box/Box";
import IconChartLine from "~/renderer/icons/ChartLine";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";

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
  if (parentAccount) return null;

  const { tronResources: { tronPower } = {} } = account;

  return (
    <ButtonBase primary onClick={() => {}}>
      <Box horizontal flow={1} alignItems="center">
        {tronPower > 0 ? (
          <CryptoCurrencyIcon inactive currency={account.currency} size={16} />
        ) : (
          <IconChartLine size={16} />
        )}
        <Box>
          <Trans
            i18nKey={tronPower > 0 ? "tron.voting.manageTP" : "tron.voting.claimAvailableRewards"}
          />
        </Box>
      </Box>
    </ButtonBase>
  );
};

export default AccountHeaderActions;
