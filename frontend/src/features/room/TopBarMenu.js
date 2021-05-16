import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import useProfile from "../../hooks/useProfile";
import { sectionToLoadGroupId, sectionToDiscardGroupId } from "./Constants";
import store from "../../store";
import { setGame } from "./gameUiSlice";
import { processLoadList, processPostLoad } from "./Helpers";

const cardDB = require('../../cardDB/playringsCardDB.json');

export const TopBarMenu = React.memo(({
    setShowSpawn,
    gameBroadcast,
    chatBroadcast,
    playerN,
}) => {
  const myUser = useProfile();
  const myUserID = myUser?.id;

  const createdByStore = state => state.gameUi.created_by;
  const createdBy = useSelector(createdByStore);
  const optionsStore = state => state.gameUi.options;
  const options = useSelector(optionsStore);
  const host = myUserID === createdBy;
  
  const dispatch = useDispatch();
  const inputFileDeck = useRef(null);
  const inputFileGame = useRef(null);

  useEffect(() => {
    console.log(options);
    if (options["ringsDbId"]) {
      const ringsDbId = options["ringsDbId"];
      const ringsDbType = options["ringsDbType"];
      const urlBase = "https://www.ringsdb.com/api/"
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
                const loadGroupId = (type === "Hero" || type === "Contract") ? playerN+"Play1" : playerN+"Deck";
                cardRow['loadgroupid'] = loadGroupId;
                cardRow['discardgroupid'] = sectionToDiscardGroupId(playerN+"Discard",playerN);
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
          const quantity = slots[slot];
          const slotUrl = urlBase+"public/card/"+slot+".json"
          fetches.push(fetch(slotUrl)
            .then(response => response.json())
            .then((slotJsonData) => {
              // jsonData is parsed json object received from url
              var cardRow = cardDB[slotJsonData.octgnid];
              if (cardRow) {
                const type = slotJsonData.type_name;
                const loadGroupId = playerN+"Sideboard";
                cardRow['loadgroupid'] = loadGroupId;
                cardRow['discardgroupid'] = sectionToDiscardGroupId(playerN+"Discard",playerN);
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
          loadList = processLoadList(loadList, playerN);
          gameBroadcast("game_action", {action: "load_cards", options: {load_list: loadList}});
          chatBroadcast("game_update",{message: "loaded a deck."});
          processPostLoad(loadList, playerN, gameBroadcast, chatBroadcast);
        });
      })
      .catch((error) => {
        // handle your errors here
        alert("Error loading deck. If you are attempting to load an unpublished deck, make sure you have link sharing turned on in your RingsDB profile settings.")
      })
      gameBroadcast("game_action", {action: "update_values", options: {updates: [["options", "ringsDbId", null],["options", "ringsDbType", null]]}})
    }
  }, [options]);

  const handleMenuClick = (data) => {
    if (!playerN) {
      alert("Please sit at the table first.");
      return;
    }
    if (data.action === "reset_game") {
      gameBroadcast("game_action", {action: "reset_game", options: {}});
      chatBroadcast("game_update", {message: "reset the game."});
    } else if (data.action === "load_deck") {
      loadFileDeck();
    } else if (data.action === "spawn_card") {
      setShowSpawn(true);
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
        <li key={"load_deck"}>
          <a href="#" onClick={() => handleMenuClick({action:"load_deck"})} href="#">Load deck</a>
          <input type='file' id='file' ref={inputFileDeck} style={{display: 'none'}} onChange={loadDeck}/>
        </li>
        <li key={"load_game"}>
          <a  onClick={() => handleMenuClick({action:"load_game"})} href="#">Load game</a>
          <input type='file' id='file' ref={inputFileGame} style={{display: 'none'}} onChange={uploadGameAsJson}/>
        </li>
        <li key={"download"}><a  onClick={() => handleMenuClick({action:"download"})} href="#">Download game</a></li>
        <li key={"spawn"}><a  onClick={() => handleMenuClick({action:"spawn_card"})} href="#">Spawn card</a></li>
        <li key={"reset"}>
            <a href="#">Reset Game</a>
            <ul className="third-level-menu">
                <li key={"Confirm"}><a onClick={() => handleMenuClick({action:"reset_game"})} href="#">Confirm</a></li>
            </ul>
        </li>
      </ul>
    </li>
  )
})