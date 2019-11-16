import React, { useState } from "react";
import useDataApi from "../hooks/useDataApi";
//import React, { useState, useEffect, useContext } from "react";
//import cx from "classnames";

interface Props {}

export const AdminContact: React.FC<Props> = () => {
  const [showEmail, setShowEmail] = useState(false);
  const { isLoading, isError, data } = useDataApi<any>(
    "/be/api/v1/admin_contact",
    null
  );
  const email = data != null && data.email != null ? data.email : "";
  if (showEmail) {
    if (isLoading) {
      return <span>Loading...</span>;
    } else if (isError) {
      return <span>Error getting admin contact email.</span>;
    } else {
      return (
        <span>
          <a href={`mailto:${email}`}>{email}</a>
        </span>
      );
    }
  }
  return (
    <span
      onClick={() => setShowEmail(true)}
      className="text-blue-600 italic underline cursor-pointer"
    >
      Click to reveal email address.
    </span>
  );
};
export default AdminContact;
