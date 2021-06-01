import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import Container from "../../components/basic/Container";
import ProfileSettings from "./ProfileSettings";
import useProfile from "../../hooks/useProfile";
import useDataApi from "../../hooks/useDataApi";
import { parseISO, format, formatDistanceToNow } from "date-fns";
import useForm from "../../hooks/useForm";
import axios from "axios";

const columns = [
  {name: "uuid", label: "UUID", options: { filter: false, display: false }},
  {name: "encounter", label: "Encounter", options: { filter: false, sort: true }},
  {name: "rounds", label: "Rounds", options: { filter: false, sort: false }},
  {name: "num_players", label: "Players", options: { filter: true, sort: false }},
  {name: "player1_heroes", label: "Player 1", options: { filter: false, sort: false }},
  {name: "player2_heroes", label: "Player 2", options: { filter: false, sort: false }},
  {name: "player3_heroes", label: "Player 3", options: { filter: false, sort: false }},
  {name: "player4_heroes", label: "Player 4", options: { filter: false, sort: false }},
  {name: "updated_at", label: "Date", options: { filter: false, sort: true }},
 ];

interface Props {}

export const Profile: React.FC<Props> = () => {
  const user = useProfile();
  const history = useHistory();
  const { isLoading, isError, data, setData } = useDataApi<any>(
    "/be/api/replays/"+user?.id,
    null
  );
  const { inputs, handleSubmit, handleInputChange, setInputs } = useForm(async () => {
    console.log(inputs);
    const data = {
      user: {
        id: user?.id,
        background_url: inputs.background_url,
        player_back_url: inputs.player_back_url,
        encounter_back_url: inputs.encounter_back_url,
      },
    };
    const res = await axios.post("/be/api/v1/profile/update", data);
  });
  useEffect(() => {
    if (user) {
      setInputs((inputs) => ({
        ...inputs,
        background_url: user.background_url || "",
        player_back_url: user.player_back_url || "",
        encounter_back_url: user.encounter_back_url || "",
      }));
    }
  }, [user]);
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
  console.log(inputs)
  return (
    <>
      <Container>
        <div className="bg-gray-100 p-4 rounded max-w-xl shadow">
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
          <div>
            <span className="font-semibold">Patreon supporter level</span>: {user.supporter_level ? user.supporter_level : 0}
          </div>
        </div>
      </Container>

      <ProfileSettings/>

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
