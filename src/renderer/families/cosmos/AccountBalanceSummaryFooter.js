// @flow

import React from "react";
import styled from "styled-components";

import { Trans } from "react-i18next";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import Box from "~/renderer/components/Box/Box";
import Text from "~/renderer/components/Text";
import InfoCircle from "~/renderer/icons/InfoCircle";
import ToolTip from "~/renderer/components/Tooltip";
import FormattedVal from "~/renderer/components/FormattedVal";

const Wrapper: ThemedComponent<*> = styled(Box).attrs(() => ({
  horizontal: true,
  mt: 4,
  p: 5,
  pb: 0,
}))`
  border-top: 1px solid ${p => p.theme.colors.palette.text.shade10};
`;

const BalanceDetail = styled(Box).attrs(() => ({
  flex: "0.25 0 auto",
  vertical: true,
  alignItems: "start",
}))`
  &:nth-child(n + 3) {
    flex: 0.75;
  }
`;

const TitleWrapper = styled(Box).attrs(() => ({ horizontal: true, alignItems: "center", mb: 1 }))``;

const Title = styled(Text).attrs(() => ({
  fontSize: 4,
  ff: "Inter|Medium",
  color: "palette.text.shade60",
}))`
  line-height: ${p => p.theme.space[4]}px;
  margin-right: ${p => p.theme.space[1]}px;
`;

const AmountValue = styled(Text).attrs(() => ({
  fontSize: 6,
  ff: "Inter|SemiBold",
  color: "palette.text.shade100",
}))``;

type Props = {
  account: any,
  countervalue: any,
};

const AccountBalanceSummaryFooter = ({ account, countervalue }: Props) => {
  if (!account.cosmosResources) return null;

  const { spendableBalance, cosmosResources } = account;
  const { delegatedBalance, unboundingBalance } = cosmosResources;

  const unit = getAccountUnit(account);

  return (
    <Wrapper>
      <BalanceDetail>
        <ToolTip content={<Trans i18nKey="account.availableBalanceTooltip" />}>
          <TitleWrapper>
            <Title>
              <Trans i18nKey="account.availableBalance" />
            </Title>
            <InfoCircle size={13} />
          </TitleWrapper>
        </ToolTip>
        <AmountValue>
          <FormattedVal color="palette.text.shade100" showCode unit={unit} val={spendableBalance} />
        </AmountValue>
      </BalanceDetail>
      <BalanceDetail>
        <ToolTip content={<Trans i18nKey="account.delegatedAssetsTooltip" />}>
          <TitleWrapper>
            <Title>
              <Trans i18nKey="account.delegatedAssets" />
            </Title>
            <InfoCircle size={13} />
          </TitleWrapper>
        </ToolTip>
        <AmountValue>
          <FormattedVal
            color="palette.text.shade100"
            showCode={false}
            unit={unit}
            val={delegatedBalance}
          />
        </AmountValue>
      </BalanceDetail>
      <BalanceDetail>
        <ToolTip content={<Trans i18nKey="account.undelegatingTooltip" />}>
          <TitleWrapper>
            <Title>
              <Trans i18nKey="account.undelegating" />
            </Title>
            <InfoCircle size={13} />
          </TitleWrapper>
        </ToolTip>
        <AmountValue>
          <FormattedVal
            color="palette.text.shade100"
            showCode={false}
            unit={unit}
            val={unboundingBalance}
          />
        </AmountValue>
      </BalanceDetail>
    </Wrapper>
  );
};

export default AccountBalanceSummaryFooter;
