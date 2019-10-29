import React from "react";
import { Link } from "react-router-dom";
import cx from "classnames";
import useUser from "../../hooks/useUser";

interface Props {
  className?: string;
}

export const ProfileLink: React.FC<Props> = ({ className }) => {
  const user = useUser();
  if (user == null) {
    return null;
  }
  const { alias } = user;
  return (
    <Link to="/" className={cx(className)}>
      {alias}
    </Link>
  );
};
export default ProfileLink;
