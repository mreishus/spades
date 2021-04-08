import React, { Component, useState, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import useProfile from "../../hooks/useProfile";
import useIsLoggedIn from "../../hooks/useIsLoggedIn";
import { getCurrentFace } from "./Helpers";
import { MenuBarUser } from "./MenuBarUser";
import { MenuBarDataContainer } from "./MenuBarDataContainer";
import { GROUPSINFO, sectionToLoadGroupId, sectionToDiscardGroupId } from "./Constants";
import store from "../../store";
import { setGame } from "./gameUiSlice";

const cardDB = require('../../cardDB/playringsCardDB.json');


export const downloadGameAsJson = () => {
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
}



export const MenuBar = React.memo(({
    setShowSpawn,
    handleBrowseSelect,
    gameBroadcast,
    chatBroadcast,
    playerN,
    observingPlayerN,
    setObservingPlayerN,
  }) => {
    const isLoggedIn = useIsLoggedIn();
    const myUser = useProfile();
    const myUserID = myUser?.id;  

    const createdByStore = state => state.gameUi.created_by;
    const createdBy = useSelector(createdByStore);
    const host = myUserID === createdBy;
    
    const dispatch = useDispatch();
    const inputFileDeck = useRef(null);
    const inputFileGame = useRef(null);
    console.log("rendering menubar")

    const handleMenuClick = (data) => {
      if (!playerN) {
        alert("Please sit at the table first.");
        return;
      }
      console.log(data);
      if (data.action === "reset_game") {
        gameBroadcast("reset_game",{});
        chatBroadcast("game_update", {message: "reset the game."});
      } else if (data.action === "load_deck") {
        loadFileDeck();
      } else if (data.action === "spawn_card") {
        setShowSpawn(true);
      } else if (data.action === "look_at") {
        handleBrowseSelect(data.groupId);
      } else if (data.action === "download") {
        downloadGameAsJson();
      } else if (data.action === "upload") {
        loadFileGame();
      } else if (data.action === "num_players") {
        const num = data.value;
        gameBroadcast("game_action", {action: "update_values", options: {paths: [["numPlayers"], ["layout"]], values: [num, "layout" + num]}});
        chatBroadcast("game_update", {message: "set the number of players to: " + num});
      }
    }

    const loadFileDeck = () => {
      inputFileDeck.current.click();
    }

    const loadFileGame = () => {
      inputFileGame.current.click();
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
                cardRow['discardgroupid'] = sectionToDiscardGroupId(sectionName,playerN);
                loadList.push({'cardRow': cardRow, 'quantity': quantity, 'groupId': sectionToLoadGroupId(sectionName,playerN)})
              }
            })
          })
          gameBroadcast("load_cards",{load_list: loadList});
          chatBroadcast("game_update",{message: "loaded a deck."});
        })
      }
      reader.readAsText(event.target.files[0]);
    }

    const uploadGameAsJson = async(event) => {
      event.preventDefault();
      const reader = new FileReader();
      reader.onload = async (event) => { 
        const gameObj = JSON.parse(event.target.result);
        dispatch(setGame(gameObj));
        gameBroadcast("game_action", {action: "update_values", options:{paths: [["game"]], values: [gameObj]}})
        chatBroadcast("game_update", {message: "uploaded a game."});
      }
      reader.readAsText(event.target.files[0]);
    }

    return(
      <div className="h-full">
        <ul className="top-level-menu float-left">
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
              <li key={"load"}>
                <a href="#" onClick={() => handleMenuClick({action:"load_deck"})} href="#">Load Deck</a>
                <input type='file' id='file' ref={inputFileDeck} style={{display: 'none'}} onChange={loadDeck}/>
              </li>
              <li key={"spawn"}><a  onClick={() => handleMenuClick({action:"spawn_card"})} href="#">Spawn Card</a></li>
              <li key={"reset"}>
                  <a href="#">Reset Game</a>
                  <ul className="third-level-menu">
                      <li key={"Confirm"}><a onClick={() => handleMenuClick({action:"reset_game"})} href="#">Confirm</a></li>
                  </ul>
              </li>
              <li key={"download"}><a  onClick={() => handleMenuClick({action:"download"})} href="#">Download game</a></li>
              <li key={"upload"}>
                <a  onClick={() => handleMenuClick({action:"upload"})} href="#">Upload game</a>
                <input type='file' id='file' ref={inputFileGame} style={{display: 'none'}} onChange={uploadGameAsJson}/>
              </li>
            </ul>
        </li>
        <li>
        <div className="h-full flex text-xl items-center justify-center" href="#">View</div>
          <ul className="second-level-menu">
              <li key={"Shared"}>
                <a href="#">Shared</a>
                  <ul className="third-level-menu">
                    {Object.keys(GROUPSINFO).map((groupId, index) => {
                      if (groupId.startsWith("shared"))
                        return(<li key={groupId}><a onClick={() => handleMenuClick({action:"look_at",groupId:groupId})} href="#">{GROUPSINFO[groupId].name}</a></li>) 
                      else return null;
                    })}
                </ul>
              </li>
              <li key={"Player1"}>
                <a href="#">Player 1</a>
                  <ul className="third-level-menu">
                    {Object.keys(GROUPSINFO).map((groupId, index) => {
                      if (groupId.startsWith("player1"))
                        return(<li key={groupId}><a onClick={() => handleMenuClick({action:"look_at",groupId:groupId})} href="#">{GROUPSINFO[groupId].name}</a></li>) 
                      else return null;
                    })}
                </ul>
              </li>
              <li key={"Player2"}>
                <a href="#">Player 2</a>
                  <ul className="third-level-menu">
                    {Object.keys(GROUPSINFO).map((groupId, index) => {
                      if (groupId.startsWith("player2"))
                        return(<li key={groupId}><a onClick={() => handleMenuClick({action:"look_at",groupId:groupId})} href="#">{GROUPSINFO[groupId].name}</a></li>) 
                      else return null;
                    })}
                </ul>
              </li>
              <li key={"Player3"}>
                <a href="#">Player 3</a>
                  <ul className="third-level-menu">
                    {Object.keys(GROUPSINFO).map((groupId, index) => {
                      if (groupId.startsWith("player3"))
                        return(<li key={groupId}><a onClick={() => handleMenuClick({action:"look_at",groupId:groupId})} href="#">{GROUPSINFO[groupId].name}</a></li>) 
                      else return null;
                    })}
                </ul>
              </li>
              <li key={"Player4"}>
                  <a href="#">Player 4</a>
                    <ul className="third-level-menu">
                      {Object.keys(GROUPSINFO).map((groupId, index) => {
                        if (groupId.startsWith("player4"))
                          return(<li key={groupId}><a onClick={() => handleMenuClick({action:"look_at",groupId:groupId})} href="#">{GROUPSINFO[groupId].name}</a></li>) 
                        else return null;
                      })}
                  </ul>
              </li>
          </ul>
        </li>
      </ul>
      <MenuBarDataContainer
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
        observingPlayerN={observingPlayerN}
        setObservingPlayerN={setObservingPlayerN}
      />
    </div>
  )
})