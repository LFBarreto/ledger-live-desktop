// @flow
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { disableLock } from "~/renderer/actions/application";

type Props = {
  /** set to true if lock should be guarded */
  when: boolean,
};

const LockGuard = ({ when }: Props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(disableLock(when));
  }, [dispatch, when]);

  return null;
};

export default LockGuard;
