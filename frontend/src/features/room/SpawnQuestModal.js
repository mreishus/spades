import React, {useState} from "react";
import ReactModal from "react-modal";
import { loadDeckFromXmlText } from "./Helpers";

function requireAll( requireContext ) {
  return requireContext.keys().map( requireContext );
}
const quests_OCTGN = requireAll( require.context("../../../../../Lord-of-the-Rings/o8g/Decks/Quests/", true, /.o8d$/) );

const isStringInQuestName = (str, questName) => {
  const cleanQuest = cleanQuestName(questName)
  const lowerCaseString = str.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const lowerCaseQuestName = cleanQuest.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  // const strippedString = lowerCaseString.replace(/[^A-z]/ig, "");
  // const strippedDeckName = lowerCaseQuestName.replace(/[^A-z]/ig, "");
  return lowerCaseQuestName.includes(lowerCaseString);
}

const cleanQuestName = (questName) => {
  var name = questName.split("/").pop();
  var mode = name.split('.').reverse()[3];
  const firstChar = mode.charAt(0);
  if (firstChar === "E") mode = "Easy";
  else if (firstChar === "N") mode = "Nightmare";
  else mode = "";
  name = name.split('.').reverse()[2];
  name = name.slice(2);
  name = name.replace(/-/ig, " ");
  return name + (mode? " ("+mode+")" : "");
}

export const SpawnQuestModal = React.memo(({
    playerN,
    setTyping,
    setShowModal,
    gameBroadcast,
    chatBroadcast,
}) => {
    console.log("Rendering SpawnQuestModal");
    console.log(quests_OCTGN)
    const [filteredIndices, setFilteredIndices] = useState([]);

    const handleSpawnClick = async(index) => {
      console.log(quests_OCTGN[index])

      const res = await fetch(quests_OCTGN[index]);
      const xmlText = await res.text();
      loadDeckFromXmlText(xmlText, playerN, gameBroadcast, chatBroadcast);
      setShowModal(null);
    }
      // reader.readAsText(quests_OCTGN[index]);

    const handleSpawnTyping = (event) => {
      //setSpawnCardName(event.target.value);
      const searchString = event.target.value;
      const filtered = []; //Object.keys(cardDB);
      for (var i=0; i<quests_OCTGN.length; i++) {
        const questName = quests_OCTGN[i];
        if (isStringInQuestName(searchString, questName)) filtered.push(i);
        setFilteredIndices(filtered);
      }
    }
 
    return(
      <ReactModal
        closeTimeoutMS={200}
        isOpen={true}
        onRequestClose={() => setShowModal(null)}
        contentLabel="Load quest"
        overlayClassName="fixed inset-0 bg-black-50 z-10000"
        className="insert-auto overflow-auto p-5 bg-gray-700 border max-w-lg mx-auto my-12 rounded-lg outline-none"
      >
        <h1 className="mb-2">Load a quest</h1>
        <input 
          autoFocus
          style={{width:"50%"}} 
          type="text"
          id="name" 
          name="name" 
          className="mb-6 mt-5" 
          placeholder=" Quest name..." 
          onChange={handleSpawnTyping}
          onFocus={event => setTyping(true)}
          onBlur={event => setTyping(false)}/>
        {(filteredIndices.length) ? 
          (filteredIndices.length>25) ?
            <div className="text-white">Too many results</div> :
            <table className="table-fixed rounded-lg w-full">
              <thead>
                <tr className="text-white bg-gray-800">
                  <th className="w-1/2">Name</th>
                </tr>
              </thead>
              {filteredIndices.map((filteredIndex, index) => {
                const questName = quests_OCTGN[filteredIndex];
                return(
                  <tr className="bg-gray-600 text-white cursor-pointer hover:bg-gray-500 hover:text-black" onClick={() => handleSpawnClick(filteredIndex)}>
                    <td className="p-1">{cleanQuestName(questName)}</td>
                  </tr>
                );
              })}
            </table> :
            <div className="text-white">No results</div>
        }
      </ReactModal>
    )
})