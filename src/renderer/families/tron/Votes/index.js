// @flow
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Trans } from "react-i18next";
import styled from "styled-components";
import type { AccountLike, Account } from "@ledgerhq/live-common/lib/types";

import { getTronSuperRepresentatives, getNextVotingDate } from "@ledgerhq/live-common/lib/api/Tron";

import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import { openModal } from "~/renderer/actions/modals";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import Box, { Card } from "~/renderer/components/Box";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import IconChartLine from "~/renderer/icons/ChartLine";
import Header from "./Header";
import Row from "./Row";

import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import { BigNumber } from "bignumber.js";
import moment from "moment";
import ToolTip from "~/renderer/components/Tooltip";

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
};

const Wrapper = styled(Box).attrs(() => ({
  p: 3,
  mt: 24,
  mb: 6,
}))`
  border: 1px dashed ${p => p.theme.colors.palette.text.shade20};
  border-radius: 4px;
  justify-content: space-between;
  align-items: center;
`;

// @TODO move this to common
const useTronSuperRepresentatives = () => {
  const [sp, setSp] = useState([]);

  useEffect(() => {
    getTronSuperRepresentatives().then(setSp);
  }, []);

  return sp;
};

// @TODO move this to common
const useNewVotingDate = () => {
  const [nextVotingDate, setNextVotingDate] = useState("");
  useEffect(() => {
    getNextVotingDate().then(date => setNextVotingDate(moment(date).fromNow()));
  }, []);

  return nextVotingDate;
};

const Delegation = ({ account, parentAccount }: Props) => {
  const dispatch = useDispatch();

  const superRepresentatives = useTronSuperRepresentatives();
  const nextVotingDate = useNewVotingDate();

  const { tronResources: { votes, tronPower, unwithdrawnReward } = {} } = account;

  const formattedUnwidthDrawnReward = formatCurrencyUnit(
    account.unit,
    BigNumber(unwithdrawnReward || 0),
    {
      disableRounding: true,
      alwaysShowSign: false,
      showCode: true,
    },
  );

  const hasRewards = unwithdrawnReward > 0;

  return account.type === "ChildAccount" && !tronPower ? null : (
    <>
      <Box horizontal alignItems="center" justifyContent="space-between">
        <Text
          ff="Inter|Medium"
          fontSize={6}
          color="palette.text.shade100"
          data-e2e="title_Delegation"
        >
          <Trans i18nKey="tron.voting.header" />
        </Text>
        {tronPower > 0 && (
          <ToolTip content={hasRewards ? null : <Trans i18nKey="tron.voting.noRewards" />}>
            <Button
              disabled={!hasRewards}
              primary
              onClick={() => {
                dispatch(
                  openModal("MODAL_DELEGATE", {
                    parentAccount,
                    account,
                  }),
                );
              }}
            >
              <Box horizontal flow={1} alignItems="center">
                <IconChartLine size={12} />
                <Box>
                  <Trans
                    i18nKey={
                      hasRewards ? "tron.voting.claimAvailableRewards" : "tron.voting.claimRewards"
                    }
                    values={{ amount: formattedUnwidthDrawnReward }}
                  />
                </Box>
              </Box>
            </Button>
          </ToolTip>
        )}
      </Box>
      {tronPower > 0 && votes.length > 0 ? (
        <Card p={0} mt={24} mb={6}>
          <Header />
          {votes
            .map(({ address, ...rest }) => ({
              validator: superRepresentatives.find(sp => sp.address === address),
              address,
              ...rest,
            }))
            .map(({ validator, address, voteCount }, index) => (
              <Row
                key={index}
                validator={validator}
                address={address}
                amount={voteCount}
                duration={nextVotingDate.toString()}
                percentTP={Number((voteCount * 1e2) / tronPower).toFixed(2)}
                currency={account.currency}
              />
            ))}
        </Card>
      ) : (
        <Wrapper horizontal>
          <Box style={{ maxWidth: "65%" }}>
            <Text ff="Inter|Medium|SemiBold" color="palette.text.shade60" fontSize={4}>
              <Trans i18nKey="delegation.delegationEarn" values={{ name: account.currency.name }} />
            </Text>
            <Box mt={2}>
              <LinkWithExternalIcon
                label={<Trans i18nKey="delegation.howItWorks" />}
                onClick={() => openURL(urls.delegation)}
              />
            </Box>
          </Box>
          <Box>
            <Button
              primary
              onClick={() => {
                dispatch(
                  openModal("MODAL_DELEGATE", {
                    parentAccount,
                    account,
                  }),
                );
              }}
            >
              <Box horizontal flow={1} alignItems="center">
                <IconChartLine size={12} />
                <Box>
                  <Trans i18nKey="delegation.title" />
                </Box>
              </Box>
            </Button>
          </Box>
        </Wrapper>
      )}
    </>
  );
};

export default Delegation;
