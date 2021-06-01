import React from "react";
import { useHistory } from "react-router-dom";
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import Container from "../../components/basic/Container";
import useProfile from "../../hooks/useProfile";
import useDataApi from "../../hooks/useDataApi";
import { parseISO, format, formatDistanceToNow } from "date-fns";

const columns = [
  {
   name: "uuid",
   label: "UUID",
   options: {
    display: false,
   }
  },
  {
   name: "encounter",
   label: "Encounter",
   options: {
    filter: false,
    sort: true,
   }
  },
  {
   name: "rounds",
   label: "Rounds",
   options: {
    filter: false,
    sort: false,
   }
  },
  {
   name: "num_players",
   label: "Players",
   options: {
    filter: true,
    sort: false,
   }
  },
  {
   name: "player1_heroes",
   label: "Player 1",
   options: {
    filter: false,
    sort: false,
   }
  },
  {
   name: "player2_heroes",
   label: "Player 2",
   options: {
    filter: false,
    sort: false,
   }
  },
  {
   name: "player3_heroes",
   label: "Player 3",
   options: {
    filter: false,
    sort: false,
   }
  },
  {
   name: "player4_heroes",
   label: "Player 4",
   options: {
    filter: false,
    sort: false,
   }
  },
  {
   name: "updated_at",
   label: "Date",
   options: {
    filter: false,
    sort: false,
   }
  },
 ];

interface Props {}

export const Profile: React.FC<Props> = () => {
  const user = useProfile();
  const history = useHistory();
  const { isLoading, isError, data, setData } = useDataApi<any>(
    "/be/api/replays/"+user?.id,
    null
  );
  if (user == null) {
    return null;
  }
  const insertedDate = parseISO(user.inserted_at);
  const insertedAbsolute = format(insertedDate, "yyyy-MM-dd hh:mm bb");
  const insertedRelative = formatDistanceToNow(insertedDate, {
    addSuffix: true,
  });
  const openReplay = (rowData: any) => {
    console.log(rowData);
    history.push("/newroom/replay/"+rowData[0]);
  }
  const options: MUIDataTableOptions = {
    filterType: "checkbox",
    onRowClick: rowData => openReplay(rowData)
  };
  console.log('Rendering Profile');
  console.log(data)
  return (
    <>
      <Container>
        <div className="bg-gray-100 p-4 rounded-lg max-w-xl shadow">
          <h1 className="font-semibold mb-4 text-black">{user.alias}</h1>
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

      {data && 
        <MUIDataTable
          title={"Replays"}
          data={data.data}
          columns={columns}
          options={options}
        />
      }
    </>
  );
};
export default Profile;
