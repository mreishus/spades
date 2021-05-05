import React, {useState} from "react";
import ReactModal from "react-modal";

const cardDb = require('../../cardDB/playringsCardDB.json');

export const SpawnCardModal = React.memo(({
    setShowSpawn,
    gameBroadcast,
    chatBroadcast,
}) => {

    const [spawnFilteredIDs, setSpawnFilteredIDs] = useState(Object.keys(cardDb));

    const handleSpawnClick = (cardID) => {
        const cardRow = cardDb[cardID];
        if (!cardRow) return;
        const loadList = [{'cardRow': cardRow, 'quantity': 1, 'groupId': "sharedStaging"}]
        gameBroadcast("game_action", {action: "load_cards", options: {load_list: loadList}});
        chatBroadcast("game_update", {message: "spawned "+cardRow["sides"]["A"]["printName"]+"."});
    }

    const handleSpawnTyping = (event) => {
        //setSpawnCardName(event.target.value);
        const filteredName = event.target.value;
        const filteredIDs = []; //Object.keys(cardDB);
        Object.keys(cardDb).map((cardID, index) => {
          const sideA = cardDb[cardID]["sides"]["A"]
          const cardName = sideA["name"];
          if (cardName.toLowerCase().includes(filteredName.toLowerCase())) filteredIDs.push(cardID);
        })
        setSpawnFilteredIDs(filteredIDs);
    }

    return(
      <ReactModal
        closeTimeoutMS={200}
        isOpen={true}
        onRequestClose={() => setShowSpawn(false)}
        contentLabel="Create New Game"
        overlayClassName="fixed inset-0 bg-black-50 z-10000"
        className="insert-auto overflow-auto p-5 bg-gray-700 border max-w-lg mx-auto my-12 rounded-lg outline-none"
      >
        <h1 className="mb-2">Spawn a card</h1>
        <input style={{width:"50%"}} type="text" id="name" name="name" className="mb-6 mt-5" placeholder=" Card name..." onChange={handleSpawnTyping}></input>
        {(spawnFilteredIDs.length) ? 
          (spawnFilteredIDs.length>15) ?
            <div className="text-white">Too many results</div> :
            <table className="table-fixed rounded-lg w-full">
              <thead>
                <tr className="text-white bg-gray-800">
                  <th className="w-1/2">Name</th>
                  <th className="w-1/2">Set</th>
                </tr>
              </thead>
              {spawnFilteredIDs.map((cardId, index) => {
                const card = cardDb[cardId];
                const sideA = cardDb[cardId]["sides"]["A"];
                const printName = sideA.printname;
                return(
                  <tr className="bg-gray-600 text-white cursor-pointer hover:bg-gray-500 hover:text-black" onClick={() => handleSpawnClick(cardId)}>
                    <td className="p-1">{printName}</td>
                    <td>{card.cardpackname}</td>
                  </tr>
                );
              })}
            </table> :
            <div className="text-white">No results</div>
        }
      </ReactModal>
    )
})