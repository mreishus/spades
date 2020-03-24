import React from "react";
import Container from "../../components/basic/Container";
import useProfile from "../../hooks/useProfile";
import { parseISO, format, formatDistanceToNow } from "date-fns";

interface Props {}

export const Profile: React.FC<Props> = () => {
  const user = useProfile();
  if (user == null) {
    return null;
  }
  const insertedDate = parseISO(user.inserted_at);
  const insertedAbsolute = format(insertedDate, "yyyy-MM-dd hh:mm bb");
  const insertedRelative = formatDistanceToNow(insertedDate, {
    addSuffix: true,
  });
  return (
    <Container>
      <div className="bg-gray-100 p-4 rounded-lg max-w-xl shadow">
        <h1 className="font-semibold mb-4">{user.alias}</h1>
        <div>
          <span className="font-semibold">Account created</span>:{" "}
          {insertedAbsolute} ({insertedRelative})
        </div>
        <div>
          <span className="font-semibold">Email</span>: {user.email}
        </div>
        <div>
          <span className="font-semibold">Email confirmed</span>:{" "}
          {user.email_confirmed_at == null && "No."}
          {user.email_confirmed_at != null && "Yes."}
        </div>
      </div>
    </Container>
  );
};
export default Profile;
