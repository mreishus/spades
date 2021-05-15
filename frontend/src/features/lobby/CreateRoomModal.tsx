import React, { useState } from "react";
import { Redirect } from "react-router";
import Select from 'react-select'
import axios from "axios";
import ReactModal from "react-modal";
import Button from "../../components/basic/Button";
import useProfile from "../../hooks/useProfile";
import useIsLoggedIn from "../../hooks/useIsLoggedIn";

const options = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
]

interface Props {
  isOpen: boolean;
  closeModal: () => void;
}

ReactModal.setAppElement("#root");

export const CreateRoomModal: React.FC<Props> = ({ isOpen, closeModal }) => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [privacyType, setPrivacyType] = useState(options[0]);
  const [roomSlugCreated, setRoomSlugCreated] = useState(null);
  const myUser = useProfile();
  const myUserID = myUser?.id;

  const createRoom = async () => {
    const data = { room: { name: "", user: myUserID } };
    setIsLoading(true);
    setIsError(false);
    console.log('creating room with ');
    console.log(data);
    try {
      const res = await axios.post("/be/api/v1/games", data);
      console.log(res);
      setIsLoading(false);
      if (res.status !== 201) {
        throw new Error("Room not created");
      }
      const room = res.data.success.room;
      setRoomSlugCreated(room.slug);
    } catch (err) {
      console.log('err')
      setIsLoading(false);
      setIsError(true);
    }
  };

  const handlePrivacyChange = (selectedOption: any) => {
    setPrivacyType(selectedOption);
  };

  if (roomSlugCreated != null) {
    return <Redirect push to={`/room/${roomSlugCreated}`} />;
  }

  return (
    <ReactModal
      closeTimeoutMS={200}
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Create New Game"
      overlayClassName="fixed inset-0 bg-black-50 z-50"
      className="insert-auto overflow-auto p-5 bg-gray-700 border w-80 mx-auto my-12 rounded-lg outline-none"
    >
      <h1 className="mb-2">Create Room</h1>
      <div className="">
        <Select         
          value={privacyType}
          onChange={handlePrivacyChange}
          options={options} />

        <Button onClick={createRoom} className="mt-2" disabled={isLoading}>
          Create
        </Button>
        <Button onClick={closeModal} className="mt-2">
          Cancel
        </Button>
      </div>
      {isError && (
        <div className="mt-2 bg-red-200 p-2 rounded border">
          Error creating room.
        </div>
      )}
    </ReactModal>
  );
};
export default CreateRoomModal;
