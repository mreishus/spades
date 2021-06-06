import React, {useState} from "react";
import ReactModal from "react-modal";
import { CSSTransition } from 'react-transition-group';
import { faArrowUp, faArrowDown, faRandom, faChevronRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { loadDeckFromXmlText } from "./Helpers";
import { CYCLEORDER, CYCLEINFO } from "./Constants";
import { calcHeightCommon, DropdownItem, GoBack } from "./DropdownMenuHelpers";
import zIndex from "@material-ui/core/styles/zIndex";

function requireAll( requireContext ) {
  return requireContext.keys().map( requireContext );
}
const questsOCTGN = requireAll( require.context("../../../../../Lord-of-the-Rings/o8g/Decks/Quests/", true, /.o8d$/) );

const isStringInQuestName = (str, questName) => {
  const cleanQuest = getQuestNameFromPath(questName)
  const lowerCaseString = str.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const lowerCaseQuestName = cleanQuest.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  // const strippedString = lowerCaseString.replace(/[^A-z]/ig, "");
  // const strippedDeckName = lowerCaseQuestName.replace(/[^A-z]/ig, "");
  return lowerCaseQuestName.includes(lowerCaseString);
}

const getQuestNameFromPath = (questName) => {
  var name = questName.split("/").pop();
  var mode = name.split('.').reverse()[3];
  name = name.split('.').reverse()[2];
  name = name.slice(2);
  name = name.replace(/-/ig, " ");
  return name;
}

const getQuestIdFromPath = (questName) => {
  const name = questName.split("/").pop();
  const id = name.split("-")[0];
  return id.slice(1); // Remove the "Q" in "Q01.01"
}

const getModeLetterFromPath = (questName) => {
  const name = questName.split("/").pop();
  const id = name.split("-")[0];
  return id.charAt(0); // Remove the "01.01" in "Q01.01"
}

const getModeLetterQuestIdFromPath = (questName) => {
  const name = questName.split("/").pop();
  const id = name.split("-")[0];
  return getModeLetterFromPath(questName) + getQuestIdFromPath(questName);
}

const getCycleIdFromPath = (questName) => {
  const questId = getQuestIdFromPath(questName);
  return questId.slice(0,2); // Remove the ".03" in "01.03"
}

const getModeNameFromPath = (questName) => {
  const cycleId = getCycleIdFromPath(questName);
  const modeLetter = getModeLetterFromPath(questName);
  return getModeNameFromModeLetter(modeLetter) + (cycleId === "0C" ? " Campaign" : "");
}

const getModeNameFromModeLetter = (modeLetter) => {
  if (modeLetter === "E") return "Easy";
  else if (modeLetter === "N") return "Nightmare";
  else return "Normal";
}

const getQuestNameAndModeFromPath = (questName) => {
  return getQuestNameFromPath(questName) + " (" + getModeNameFromPath(questName) + ")";
}

const getIndexFromModeAndId = (modeAndId) => { // modeAndId is "N01.01" or "Q01.01" or "E01.01"
  for (var i=0; i<questsOCTGN.length; i++) {
    const questPath = questsOCTGN[i];
    if (questPath.includes(modeAndId)) return i;
  }
  return -1;
}

export const SpawnQuestModal = React.memo(({
    playerN,
    setTyping,
    setShowModal,
    gameBroadcast,
    chatBroadcast,
}) => {
    const [filteredIndices, setFilteredIndices] = useState([]);
    const [activeMenu, setActiveMenu] = useState("main");
    const [menuHeight, setMenuHeight] = useState(null);
    const [searchString, setSearchString] = useState("");

    console.log("Rendering SpawnQuestModal", searchString);
    const handleSpawnClick = async(index) => {
      console.log(questsOCTGN[index])

      const res = await fetch(questsOCTGN[index]);
      const xmlText = await res.text();
      loadDeckFromXmlText(xmlText, playerN, gameBroadcast, chatBroadcast);
      setShowModal(null);
    }
      // reader.readAsText(questsOCTGN[index]);

    const handleSpawnTyping = (event) => {
      //setSpawnCardName(event.target.value);
      const newSearchString = event.target.value;
      setSearchString(newSearchString);
      const filtered = []; //Object.keys(cardDB);
      for (var i=0; i<questsOCTGN.length; i++) {
        const questName = questsOCTGN[i];
        if (isStringInQuestName(newSearchString, questName)) filtered.push(i);
        setFilteredIndices(filtered);
      }
    }

    const handleDropdownClick = (props) => {
      console.log(props);
      setActiveMenu(props.goToMenu);
    }

    const calcHeight = (el) => {
      calcHeightCommon(el, setMenuHeight);
    }

    return(
      <ReactModal
        closeTimeoutMS={200}
        isOpen={true}
        onRequestClose={() => setShowModal(null)}
        contentLabel="Load quest"
        overlayClassName="fixed inset-0 bg-black-50 z-10000"
        className="insert-auto overflow-scroll p-5 bg-gray-700 border max-w-lg max-h-lg mx-auto my-2 rounded-lg outline-none"
        style={{
          content: {
            maxHeight: "680px"
          }
        }}
      >
        <h1 className="mb-2">Load a quest</h1>
        <input 
          autoFocus
          style={{width:"50%"}} 
          type="text"
          id="name" 
          name="name" 
          className="mb-2 rounded-md" 
          placeholder=" Quest name..." 
          onChange={handleSpawnTyping}
          onFocus={event => setTyping(true)}
          onBlur={event => setTyping(false)}/>

        {/* Table */}
        {searchString &&
          ((filteredIndices.length === 0) ?
            <div className="text-white">No results</div>
            :
            (filteredIndices.length>25) ?
              <div className="text-white">Too many results</div> 
              :
              <table className="table-fixed rounded-lg w-full">
                <thead>
                  <tr className="text-white bg-gray-800">
                    <th className="w-1/2">Name</th>
                  </tr>
                </thead>
                {filteredIndices.map((filteredIndex, index) => {
                  const questName = questsOCTGN[filteredIndex];
                  return(
                    <tr className="bg-gray-600 text-white cursor-pointer hover:bg-gray-500 hover:text-black" onClick={() => handleSpawnClick(filteredIndex)}>
                      <td className="p-1">{getQuestNameAndModeFromPath(questName)}</td>
                    </tr>
                  );
                })}
              </table>
          )
        }

        {/* Menu */}
        {searchString === "" &&
          <div 
          className="modalmenu bg-gray-800" 
          style={{ height: menuHeight}}
          >
          {/* Cycle Menu */}
          {activeMenu === "main" &&
            <div className="menu">
              {CYCLEORDER.map((cycleId, index) => {
                return(
                  <DropdownItem
                    rightIcon={<FontAwesomeIcon icon={faChevronRight}/>}
                    goToMenu={cycleId}
                    clickCallback={handleDropdownClick}>
                    {CYCLEINFO[cycleId].name}
                  </DropdownItem>
                )
              })}
            </div>
          }
          {/* Quest Menu */}
          {CYCLEORDER.map((cycleId, index) => {
            return(<>
              {activeMenu === cycleId &&
                <div className="menu">
                  <GoBack goToMenu="main" clickCallback={handleDropdownClick}/>
                  {questsOCTGN.map((questPath, index) => {
                    if (questPath.includes("Q"+cycleId)) return(
                      <DropdownItem
                        rightIcon={<FontAwesomeIcon icon={faChevronRight}/>}
                        goToMenu={getQuestIdFromPath(questPath)}
                        clickCallback={handleDropdownClick}>
                        {getQuestNameFromPath(questPath)}
                      </DropdownItem>
                    )
                  })}
                </div>
              }
            </>)
          })}
          {/* Difficulty menu */}
          {questsOCTGN.map((questPath, _) => {
            const questId = getQuestIdFromPath(questPath);
            const modeLetter = getModeLetterFromPath(questPath);
            const cycleId = getCycleIdFromPath(questPath);
            if (modeLetter === "Q") return(<>
              {activeMenu === questId &&
                <div className="menu">
                  <GoBack goToMenu={cycleId} clickCallback={handleDropdownClick}/>
                  {["E","Q","N"].map((modeLetter, letterIndex) => {
                    const selectedIndex = getIndexFromModeAndId(modeLetter+questId);
                    const selectedPath = questsOCTGN[selectedIndex];
                    if (selectedIndex >= 0) return(
                      <DropdownItem
                        action={selectedIndex}
                        clickCallback={handleDropdownClick}>
                        {getModeNameFromPath(selectedPath)}
                      </DropdownItem>
                    )
                  })}
                </div>
              }
            </>)
          })}
          </div>
        }
      </ReactModal>
    )
})