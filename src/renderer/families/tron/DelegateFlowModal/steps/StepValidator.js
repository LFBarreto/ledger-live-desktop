// @flow
import React from "react";
import invariant from "invariant";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";

import type { StepProps } from "../types";

const StepValidator = ({
  account,
  parentAccount,
  transaction,
  transitionTo,
  onChangeTransaction,
}: StepProps) => {
  invariant(account, "account is required");

  return (
    <Box flow={4} mx={20}>
      <TrackPage category="Delegation Flow" name="Step Validator" />
    </Box>
  );
};

export default StepValidator;
