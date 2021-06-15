import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import useProfile from "../../hooks/useProfile";
import { sectionToLoadGroupId, sectionToDiscardGroupId } from "./Constants";
import store from "../../store";
import { setGame } from "./gameUiSlice";
import { processLoadList, processPostLoad } from "./Helpers";
import { cardDB } from "../../cardDB/cardDB";
import { loadDeckFromXmlText } from "./Helpers";


export const TopBarMenu = React.memo(({
    setShowModal,
    gameBroadcast,
    chatBroadcast,
    playerN,
}) => {
  const myUser = useProfile();
  const myUserID = myUser?.id;
  const history = useHistory();

  const createdByStore = state => state.gameUi?.created_by;
  const createdBy = useSelector(createdByStore);
  const optionsStore = state => state.gameUi?.options;
  const options = useSelector(optionsStore);
  const roundStore = state => state.gameUi?.game.roundNumber;
  const round = useSelector(roundStore);
  const host = myUserID === createdBy;
  
  const dispatch = useDispatch();
  const inputFileDeck = useRef(null);
  const inputFileGame = useRef(null);

  useEffect(() => {
    console.log(options);
    if (options["ringsDbIds"]) {
      // Turn off trigger
      gameBroadcast("game_action", {action: "update_values", options: {updates: [["options", "ringsDbIds", null],["options", "ringsDbType", null]]}})
      // Load ringsdb decks by ids
      const ringsDbIds = options["ringsDbIds"];
      const numDecks = ringsDbIds.length;
      if (numDecks>1 && numDecks<=4) {
        gameBroadcast("game_action", {action: "update_values", options: {updates: [["game", "numPlayers", numDecks]]}});
        chatBroadcast("game_update", {message: "set the number of players to: " + numDecks});
      }
      for (var i=0; i<numDecks; i++) {
        const playerI = "player"+(i+1);
        chatBroadcast("game_update",{message: "is loading a deck from RingsDb..."});
        const ringsDbId = ringsDbIds[i];
        const ringsDbType = options["ringsDbType"];
        const urlBase = options["ringsDbDomain"] === "test" && 0 ? "https://www.test.ringsdb.com/api/" : "https://www.ringsdb.com/api/"
        const url = ringsDbType === "decklist" ? urlBase+"public/decklist/"+ringsDbId+".json" : urlBase+"oauth2/deck/load/"+ringsDbId;
        fetch(url)
        .then(response => response.json())
        .then((jsonData) => {
          // jsonData is parsed json object received from url
          const slots = jsonData.slots;
          const sideslots = jsonData.sideslots;
          var loadList = [];
          var fetches = [];
          Object.keys(slots).forEach((slot, slotIndex) => {
            const quantity = slots[slot];
            const slotUrl = urlBase+"public/card/"+slot+".json"
            fetches.push(fetch(slotUrl)
              .then(response => response.json())
              .then((slotJsonData) => {
                // jsonData is parsed json object received from url
                var cardRow = cardDB[slotJsonData.octgnid];
                if (cardRow && !slotJsonData.name.includes("MotK")) {
                  const type = slotJsonData.type_name;
                  const loadGroupId = (type === "Hero" || type === "Contract") ? playerI+"Play1" : playerI+"Deck";
                  cardRow['loadgroupid'] = loadGroupId;
                  cardRow['discardgroupid'] = sectionToDiscardGroupId(playerI+"Discard",playerI);
                  loadList.push({'cardRow': cardRow, 'quantity': quantity, 'groupId': loadGroupId});
                }
              })
              .catch((error) => {
                // handle your errors here
                console.error("Could not find card", slot);
              })
            )
          })
          Object.keys(sideslots).forEach((slot, slotIndex) => {
            const quantity = sideslots[slot];
            const slotUrl = urlBase+"public/card/"+slot+".json"
            fetches.push(fetch(slotUrl)
              .then(response => response.json())
              .then((slotJsonData) => {
                // jsonData is parsed json object received from url
                var cardRow = cardDB[slotJsonData.octgnid];
                if (cardRow) {
                  const type = slotJsonData.type_name;
                  const loadGroupId = playerI+"Sideboard";
                  cardRow['loadgroupid'] = loadGroupId;
                  cardRow['discardgroupid'] = sectionToDiscardGroupId(playerI+"Discard",playerI);
                  loadList.push({'cardRow': cardRow, 'quantity': quantity, 'groupId': loadGroupId});
                }
              })
              .catch((error) => {
                // handle your errors here
                console.error("Could not find card", slot);
              })
            )
          })
          Promise.all(fetches).then(function() {
            // Automate certain things after you load a deck, like Eowyn, Thurindir, etc.
            loadList = processLoadList(loadList, playerI);
            gameBroadcast("game_action", {action: "load_cards", options: {load_list: loadList, for_player_n: playerI}});
            chatBroadcast("game_update",{message: "loaded a deck."});
            processPostLoad(loadList, playerI, gameBroadcast, chatBroadcast);
          });
        })
        .catch((error) => {
          // handle your errors here
          alert("Error loading deck. If you are attempting to load an unpublished deck, make sure you have link sharing turned on in your RingsDB profile settings.")
        })
      // Deck loaded
      }
      // Loop over decks complete
    } 
  }, [options]);

  const handleMenuClick = (data) => {
    if (!playerN) {
      alert("Please sit at the table first.");
      return;
    }
    if (data.action === "reset_game") {
      // Mark status
      chatBroadcast("game_update", {message: "marked game as "+data.state+"."});
      gameBroadcast("game_action", {action: "update_values", options: {updates: [["game", "victoryState", data.state]]}});
      // Save replay
      if (round > 0) {
        gameBroadcast("game_action", {action: "save_replay", options: {}});
        chatBroadcast("game_update",{message: "saved the replay to their profile."});
      }
      // Reset game
      gameBroadcast("game_action", {action: "reset_game", options: {}});
      chatBroadcast("game_update", {message: "reset the game."});
    } else if (data.action === "close_room") {
      // Mark status
      chatBroadcast("game_update", {message: "marked game as "+data.state+"."});
      gameBroadcast("game_action", {action: "update_values", options: {updates: [["game", "victoryState", data.state]]}});
      // Save replay
      if (round > 0) {
        gameBroadcast("game_action", {action: "save_replay", options: {}});
        chatBroadcast("game_update",{message: "saved the replay to their profile."});
      }
      // Close room
      history.push("/profile");
      chatBroadcast("game_update", {message: "closed the room."});
      gameBroadcast("close_room", {});
    } else if (data.action === "load_deck") {
      loadFileDeck();
    } else if (data.action === "unload_my_deck") {
      // Delete all cards you own
      chatBroadcast("game_update",{message: "unloaded their deck."});
      gameBroadcast("game_action", {
        action: "action_on_matching_cards", 
        options: {
            criteria:[["owner", playerN]], 
            action: "delete_card", 
        }
      });
      // Set threat to 00
      chatBroadcast("game_update",{message: "reset their deck."});
      gameBroadcast("game_action", {action: "update_values", options: {updates: [["game", "playerData", playerN, "threat", 0]]}});

    } else if (data.action === "unload_encounter_deck") {
      // Delete all cards from encounter
      chatBroadcast("game_update",{message: "unloaded the encounter deck."});
      gameBroadcast("game_action", {
        action: "action_on_matching_cards", 
        options: {
            criteria:[["owner", "shared"]], 
            action: "delete_card", 
        }
      });
    } else if (data.action === "spawn_existing") {
      setShowModal("card");
    } else if (data.action === "spawn_custom") {
      setShowModal("custom");
    } else if (data.action === "spawn_quest") {
      setShowModal("quest");
    } else if (data.action === "download") {
      downloadGameAsJson();
    } else if (data.action === "load_game") {
      loadFileGame();
    } else if (data.action === "num_players") {
      const num = data.value;
      gameBroadcast("game_action", {action: "update_values", options: {updates: [["game", "numPlayers", num]]}});
      chatBroadcast("game_update", {message: "set the number of players to: " + num});
    } else if (data.action === "layout") {
      gameBroadcast("game_action", {action: "update_values", options: {updates: [["game", "layout", data.value]]}});
    }
  }

  const loadFileDeck = () => {
    inputFileDeck.current.click();
  }

  const loadFileGame = () => {
    inputFileGame.current.click();
  }

  const loadRingsDb = async(event) => {
    event.preventDefault();
    const reader = new FileReader();
    reader.onload = async (event) => { 
      const xmltext = (event.target.result)
      var parseString = require('xml2js').parseString;
      parseString(xmltext, function (err, deckJSON) {
        if (!deckJSON) return;
        const sections = deckJSON.deck.section;
        var loadList = [];
        sections.forEach(section => {
          const sectionName = section['$'].name;
          const cards = section.card;
          if (!cards) return;
          cards.forEach(card => {
            const cardDbId = card['$'].id;
            const quantity = parseInt(card['$'].qty);
            var cardRow = cardDB[cardDbId];
            if (cardRow) {
              const loadGroupId = sectionToLoadGroupId(sectionName,playerN);
              cardRow['loadgroupid'] = loadGroupId;
              cardRow['discardgroupid'] = sectionToDiscardGroupId(sectionName,playerN);
              loadList.push({'cardRow': cardRow, 'quantity': quantity, 'groupId': loadGroupId})
            }
          })
        })
        // Automate certain things after you load a deck, like Eowyn, Thurindir, etc.
        loadList = processLoadList(loadList, playerN);
        gameBroadcast("game_action", {action: "load_cards", options: {load_list: loadList}});
        chatBroadcast("game_update",{message: "loaded a deck."});
        processPostLoad(loadList, playerN, gameBroadcast, chatBroadcast);
      })
    }
    reader.readAsText(event.target.files[0]);
  }

  const loadDeck = async(event) => {
    event.preventDefault();
    const reader = new FileReader();
    reader.onload = async (event) => { 
      const xmlText = (event.target.result)
      loadDeckFromXmlText(xmlText, playerN, gameBroadcast, chatBroadcast);
    }
    reader.readAsText(event.target.files[0]);
  }

  const uploadGameAsJson = async(event) => {
    event.preventDefault();
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const gameObj = JSON.parse(event.target.result);
        if (gameObj) {
          dispatch(setGame(gameObj));
          gameBroadcast("game_action", {action: "update_values", options: {updates: [["game", gameObj]]}})
          chatBroadcast("game_update", {message: "uploaded a game."});
          gameBroadcast("game_action", {action: "update_values", options: {updates: [["game", "replayStep", 0]]}})
        }
      } catch(e) {
          alert("Game must be a valid JSON file."); // error in the above string (in this case, yes)!
      }
    }
    reader.readAsText(event.target.files[0]);
  }

  const downloadGameAsJson = () => {
    const state = store.getState();
    const exportObj = state.gameUi.game;
    const exportName = state.gameUi.gameName;
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    chatBroadcast("game_update", {message: "downloaded the game."});
  }

  return(
    <li key={"Menu"}><div className="h-full flex text-xl items-center justify-center" href="#">Menu</div>
      <ul className="second-level-menu">
        {host &&
          <li key={"numPlayers"}>
            <a href="#">Number of Players</a>
            <ul className="third-level-menu">
                <li key={"numPlayers1"}><a onClick={() => handleMenuClick({action:"num_players", value: 1})} href="#">1</a></li>
                <li key={"numPlayers2"}><a onClick={() => handleMenuClick({action:"num_players", value: 2})} href="#">2</a></li>
                <li key={"numPlayers3"}><a onClick={() => handleMenuClick({action:"num_players", value: 3})} href="#">3</a></li>
                <li key={"numPlayers4"}><a onClick={() => handleMenuClick({action:"num_players", value: 4})} href="#">4</a></li>
            </ul>
          </li>
        }
        {host &&
          <li key={"layout"}>
            <a href="#">Layout</a>
            <ul className="third-level-menu">
                <li key={"standard"}><a onClick={() => handleMenuClick({action:"layout", value: "standard"})} href="#">Standard</a></li>
                <li key={"extra"}><a onClick={() => handleMenuClick({action:"layout", value: "extra"})} href="#">Extra staging areas / map</a></li>
            </ul>
          </li>                
        }
        <li key={"load"}>
          <a href="#">Load</a>
          <ul className="third-level-menu">
            <li key={"load_quest"}><a href="#" onClick={() => handleMenuClick({action:"spawn_quest"})} href="#">Load quest</a></li>
            <li key={"load_deck"}>
              <a href="#" onClick={() => handleMenuClick({action:"load_deck"})} href="#">Load deck (.o8d)</a>
              <input type='file' id='file' ref={inputFileDeck} style={{display: 'none'}} onChange={loadDeck}/>
            </li>
            <li key={"load_game"}>
              <a  onClick={() => handleMenuClick({action:"load_game"})} href="#">Load game (.json)</a>
              <input type='file' id='file' ref={inputFileGame} style={{display: 'none'}} onChange={uploadGameAsJson}/>
            </li>
          </ul>
        </li> 
        <li key={"unload"}>
          <a href="#">Unload</a>
          <ul className="third-level-menu">        
            <li key={"unload_my_deck"}><a  onClick={() => handleMenuClick({action:"unload_my_deck"})} href="#">Unload my deck</a></li>
            <li key={"unload_encounter_deck"}><a  onClick={() => handleMenuClick({action:"unload_encounter_deck"})} href="#">Unload encounter</a></li>
          </ul>
        </li>
        <li key={"spawn"}>
          <a href="#">Spawn card</a>
          <ul className="third-level-menu">
            <li key={"spawn_existing"}><a onClick={() => handleMenuClick({action:"spawn_existing"})} href="#">Existing</a></li>
            <li key={"spawn_custom"}><a onClick={() => handleMenuClick({action:"spawn_custom"})} href="#">Custom</a></li>
          </ul>
        </li> 
        <li key={"download"}><a onClick={() => handleMenuClick({action:"download"})} href="#">Download game</a></li>
        {host &&
          <li key={"reset"}>
              <a href="#">Reset Game</a>
              <ul className="third-level-menu">
                <li key={"reset_victory"}><a onClick={() => handleMenuClick({action:"reset_game", state: "victory"})} href="#">Mark as victory</a></li>
                <li key={"reset_defeat"}><a onClick={() => handleMenuClick({action:"reset_game", state: "defeat"})} href="#">Mark as defeat</a></li>
                <li key={"reset_incomplete"}><a onClick={() => handleMenuClick({action:"reset_game", state: "incomplete"})} href="#">Mark as incomplete</a></li>
              </ul>
          </li> 
        }       
        {host &&
          <li key={"shut_down"}>
              <a href="#">Close room</a>
              <ul className="third-level-menu">
                <li key={"close_victory"}><a onClick={() => handleMenuClick({action:"close_room", state: "victory"})} href="#">Mark as victory</a></li>
                <li key={"close_defeat"}><a onClick={() => handleMenuClick({action:"close_room", state: "defeat"})} href="#">Mark as defeat</a></li>
                <li key={"close_incomplete"}><a onClick={() => handleMenuClick({action:"close_room", state: "incomplete"})} href="#">Mark as incomplete</a></li>
              </ul>
          </li> 
        }
      </ul>
    </li>
  )
})