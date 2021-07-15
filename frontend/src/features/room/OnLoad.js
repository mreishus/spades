import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { sectionToDiscardGroupId } from "./Constants";
import { GROUPSINFO } from "./Constants";
import { processLoadList, processPostLoad } from "./Helpers";
import { cardDB } from "../../cardDB/cardDB";

export const OnLoad = React.memo(({
    setLoaded,
    gameBroadcast,
    chatBroadcast,
}) => {
  setLoaded(true);
  const optionsStore = state => state.gameUi?.options;
  const options = useSelector(optionsStore);  
  const groupByIdStore = state => state.gameUi?.game.groupById;
  const groupById = useSelector(groupByIdStore);

  console.log("Rendering OnLoad");
  useEffect(() => {

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
        const urlBase = options["ringsDbDomain"] === "test" ? "https://www.test.ringsdb.com/api/" : "https://www.ringsdb.com/api/"
        const url = ringsDbType === "decklist" ? urlBase+"public/decklist/"+ringsDbId+".json" : urlBase+"oauth2/deck/load/"+ringsDbId;
        console.log("Fetching ", url);
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
                  cardRow['discardgroupid'] = playerI+"Discard";
                  if (cardRow['sides']['A']['keywords'].includes("Encounter")) cardRow['discardgroupid'] = "sharedEncounterDiscard";
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
                  cardRow['discardgroupid'] = playerI+"Discard";
                  if (cardRow['sides']['A']['keywords'].includes("Encounter")) cardRow['discardgroupid'] = "sharedEncounterDiscard";
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
    } // End if ringsDb
    // Shuffle all decks if setting was set
    if (options["loadShuffle"]) {
      // Turn off trigger
      const updates = [["options", "loadShuffle", false]];
      gameBroadcast("game_action", {action: "update_values", options: {updates: updates}});
      //dispatch(setValues({updates: updates}));
      Object.keys(groupById).forEach((groupId) => {
        const group = groupById[groupId];
        if (group.type === "deck" && group.stackIds.length > 0) {
          gameBroadcast("game_action", {action: "shuffle_group", options: {group_id: groupId}})
          chatBroadcast("game_update", {message: " shuffled " + GROUPSINFO[groupId].name+"."})
        }
      })
    }
  }, []);

  return;
})