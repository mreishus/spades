import React from "react";
import { useHistory } from "react-router-dom";
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import Container from "../../components/basic/Container";
import Button from "../../components/basic/Button";
import useProfile from "../../hooks/useProfile";
import useDataApi from "../../hooks/useDataApi";
import { parseISO, format, formatDistanceToNow } from "date-fns";
import useForm from "../../hooks/useForm";

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
  const { inputs, handleSubmit, handleInputChange } = useForm(async () => {
    console.log("use form")
  });
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

      <Container>
        <div className="bg-gray-100 p-4 rounded-lg max-w-xl shadow">
        <form action="POST" onSubmit={handleSubmit}>
          <fieldset disabled={isLoading} aria-busy={isLoading}>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">
                Background image url
              </label>
              <input
                name="background_url"
                className="form-control w-full"
                onChange={handleInputChange}
                value={inputs.background || ""}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">
                Player card back image url
              </label>
              <input
                name="player_card_url"
                className="form-control w-full"
                onChange={handleInputChange}
                value={inputs.player_card_url || ""}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">
                Encounter card back image url
              </label>
              <input
                name="encounter_card_url"
                className="form-control w-full"
                onChange={handleInputChange}
                value={inputs.encounter_card_url || ""}
              />
            </div>
            <div className="flex items-center justify-between">
              <Button isSubmit isPrimary className="mx-2">
                Update
              </Button>
            </div>
          </fieldset>
        </form>
        </div>
      </Container>

      {data && 
          <div className="p-4">
          <MUIDataTable
            title={"Replays"}
            data={data.data}
            columns={columns}
            options={options}
          />
        </div>
      }
    </>
  );
};
export default Profile;
