// @flow

import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const Wrapper: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: row;
  padding: 16px 20px;
  color: red;
  font-weight: bold;
`;

const Header = () => {
  return <Wrapper>account body header</Wrapper>;
};

export default Header;
