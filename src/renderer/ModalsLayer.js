// @flow
import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector, createSelector } from "reselect";
import { modalsStateSelector } from "~/renderer/reducers/modals";
import modals from "~/renderer/modals";

const ModalsLayer = ({ visibleModals }: *) =>
  visibleModals.map(({ name, data }) => {
    const ModalComponent = modals[name];
    if (!ModalComponent) return null;
    return <ModalComponent key={name} {...data} />;
  });

const visibleModalsSelector = createSelector(modalsStateSelector, state =>
  Object.entries(state)
    .filter(([name, { isOpened }]) => !!modals[name] && isOpened)
    .map(([name, data]) => ({ name, ...data })),
);

const mapStateToProps = createStructuredSelector({
  visibleModals: visibleModalsSelector,
});

// $FlowFixMe
export default connect(mapStateToProps)(ModalsLayer);
