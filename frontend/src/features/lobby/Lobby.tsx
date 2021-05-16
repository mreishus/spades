import React, { useState, useCallback, useEffect } from "react";
import { ChatMessage } from "elixir-backend";
import { Link } from "react-router-dom";
import CreateRoomModal from "./CreateRoomModal";
import LobbyTable from "./LobbyTable";
import Button from "../../components/basic/Button";
import Container from "../../components/basic/Container";
import AdminContact from "../../components/AdminContact";
import Chat from "../chat/Chat";
import useDataApi from "../../hooks/useDataApi";
import useChannel from "../../hooks/useChannel";
import useProfile from "../../hooks/useProfile";
import useIsLoggedIn from "../../hooks/useIsLoggedIn";

interface Props {}

const isNormalInteger = (str: string) => {
  var n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n >= 0;
}

const filterArrayForPositiveInt = (arr: Array<string>) => {
  const newArr = [];
  for (var s of arr) {
    if (isNormalInteger(s)) {
      newArr.push(s);
    }
  }
  return newArr;
}

export const Lobby: React.FC = () => {
  const isLoggedIn = useIsLoggedIn();
  const myUser = useProfile();
  const myUserID = myUser?.id;

  const [showModal, setShowModal] = useState(false);
  const [ringsDbIds, setRingsDbIds] = useState<Array<string>>([]);
  const [ringsDbType, setRingsDbType] = useState("");
  const [typing, setTyping] = useState<Boolean>(false);
  const { isLoading, isError, data, setData } = useDataApi<any>(
    "/be/api/rooms",
    null
  );

  useEffect(() => {
    const url = window.location.href;
    if (url.includes("newroom")) {

      if (url.includes("ringsdb")) {
        console.log("here")
        var splitUrl = url.split( '/' );
        console.log(splitUrl);
        const ringsdbIndex = splitUrl.findIndex((e) => e === "ringsdb")
        setRingsDbType(splitUrl[ringsdbIndex + 1])
        var intArray = splitUrl.slice(ringsdbIndex + 2, splitUrl.length)
        intArray = filterArrayForPositiveInt(intArray);
        setRingsDbIds(intArray);
      }
      setShowModal(true);
    }
  }, []);

  const onChannelMessage = useCallback(
    (event, payload) => {
      if (event === "rooms_update" && payload.rooms != null) {
        setData({ data: payload.rooms });
      }
    },
    [setData]
  );

  const [messages, setMessages] = useState<Array<ChatMessage>>([]);
  const onChatMessage = useCallback((event, payload) => {
    if (
      event === "phx_reply" &&
      payload.response != null &&
      payload.response.messages != null
    ) {
      setMessages(payload.response.messages);
    }
  }, []);
  const chatBroadcast = useChannel(`chat:Lobby`, onChatMessage);


  useChannel("lobby:lobby", onChannelMessage);
  const rooms = data != null && data.data != null ? data.data : [];

  const handleCreateRoomClick = () => {
    if (myUser?.email_confirmed_at) setShowModal(true);
    else alert("You must confirm your email before you can start a game.")
  }

  return (
      <div className="w-full" style={{fontFamily:"Roboto"}}>
        <div className="mt-4 mx-auto" style={{width: "400px"}}>
            <h1 className="mb-4 text-center">Lobby</h1>
            {isLoading && <div className="text-white text-center">Connecting to server...</div>}
            {isError && <div className="text-white text-center">Error communicating with server...</div>}
            {(!isLoading && !isError) &&
              <div className="mb-6">
                {/* <h3 className="mb-2 font-semibold text-center">New Game</h3> */}
                <div className="mx-auto w-48">
                  {isLoggedIn && (
                    <Button isPrimary onClick={() => handleCreateRoomClick()}>
                      Create Room
                    </Button>
                  )}
                  {!isLoggedIn && (
                    <span className="p-2 text-white bg-gray-700 rounded">
                      <Link to="/login" className="mr-1 text-white">
                        Log In
                      </Link>
                      to create a room
                    </span>
                  )}
                </div>
              </div>
            }
            {(!isLoading && !isError) &&
              <div className="mb-6 w-full">
                <h3 className="mb-2 font-semibold text-center">Current Games</h3>
                <div className="mb-4 w-full">
                  <LobbyTable rooms={rooms} />
                </div>
              </div>
            }
            <h3 className="mt-6 font-semibold text-center">About</h3>
            <div className="max-w-none">
              <p className="mb-2">
                DragnCards is a{" "}
                <span className="font-semibold">
                  free online multiplayer card game platfrom
                </span>, and is not affiliated with or endorsed by FFG or any other company in any way.
              </p>
              <p className="mb-2">
                If you have any suggestions or encounter any problems, please report them on <a href="https://github.com/seastan/DragnCards">GitHub</a>.
              </p>
            </div>
            <CreateRoomModal
              isOpen={showModal}
              isLoggedIn={isLoggedIn}
              closeModal={() => setShowModal(false)}
              ringsDbIds={ringsDbIds}
              ringsDbType={ringsDbType}
            />
          </div>
        {/* <div className="w-full mb-4 lg:w-1/4 xl:w-2/6">
          <div className="flex items-end h-full">
            <Chat chatBroadcast={chatBroadcast} messages={messages} setTyping={setTyping} />
          </div>
        </div> */}
      </div>
  );
};
export default Lobby;
