// @flow

import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import { Trans } from "react-i18next";

import FormattedVal from "~/renderer/components/FormattedVal";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import { BigNumber } from "bignumber.js";
import Box from "~/renderer/components/Box/Box";
import Text from "~/renderer/components/Text";

const Wrapper: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: row;
  border-top: 1px solid ${p => p.theme.colors.palette.text.shade10};
  margin-top: ${p => p.theme.space[4]}px;
  padding: ${p => p.theme.space[5]}px;
  padding-bottom: 0;
`;

const BalanceDetail = styled(Box).attrs(() => ({
  flex: 1,
  vertical: true,
  alignItems: "start",
}))``;

const Title = styled(Text)``;

type Props = {
  account: any,
  countervalue: any,
};

const Header = ({ account, countervalue }: Props) => {
  const {
    frozen: {
      bandwidth: { amount: bandwidthAmount } = {},
      energy: { amount: energyAmount } = {},
    } = {},
    energy,
    bandwidth: { freeUsed, freeLimit, gainedUsed, gainedLimit } = {},
  } = account.tronResources;

  const spendableBalance = formatCurrencyUnit(account.unit, account.spendableBalance, {
    disableRounding: true,
    alwaysShowSign: false,
    showCode: true,
  });

  const frozenAmount = formatCurrencyUnit(
    account.unit,
    BigNumber(bandwidthAmount || 0).plus(BigNumber(energyAmount || 0)),
    {
      disableRounding: true,
      alwaysShowSign: false,
      showCode: true,
    },
  );

  const formatedEnergy = energy;

  const formatedBandwidth = freeLimit + gainedLimit - gainedUsed - freeUsed;

  return (
    <Wrapper>
      <BalanceDetail>
        <Title>
          <Trans i18nKey="account.availableBalance" />
        </Title>
        <Text>{spendableBalance}</Text>
      </BalanceDetail>
      <BalanceDetail>
        <Title>
          <Trans i18nKey="account.frozenAssets" />
        </Title>
        <Text>{frozenAmount}</Text>
      </BalanceDetail>
      <BalanceDetail>
        <Title>
          <Trans i18nKey="account.bandwidth" />
        </Title>
        <Text>{formatedBandwidth}</Text>
      </BalanceDetail>
      <BalanceDetail>
        <Title>
          <Trans i18nKey="account.energy" />
        </Title>
        <Text>{formatedEnergy}</Text>
      </BalanceDetail>
    </Wrapper>
  );
};

export default Header;
