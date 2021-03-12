import React, { Component, useState, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentFace } from "./Helpers"
import { MenuBarUser } from "./MenuBarUser"
import { MenuBarSharedContainer } from "./MenuBarSharedContainer"
import { GROUPSINFO, sectionToLoadGroupId, sectionToDiscardGroupId } from "./Constants";

const cardDB = require('../../cardDB/playringsCardDB.json');

export const MenuBar = React.memo(({
    setShowSpawn,
    handleBrowseSelect,
    gameBroadcast,
    chatBroadcast,
    playerN,
    observingPlayerN,
    setObservingPlayerN,
  }) => {
    
    const inputFile = useRef(null);
    console.log("rendering menubar")

    const handleMenuClick = (data) => {
      if (!playerN) {
        alert("Please sit at the table first.");
        return;
      }
      console.log(data);
      if (data.action === "reset_game") {
          gameBroadcast("reset_game",{});
          chatBroadcast("game_update",{message: "reset the game."});
      } else if (data.action === "load_deck") {
          loadDeckFile();
      } else if (data.action === "spawn_card") {
          setShowSpawn(true);
      } else if (data.action === "look_at") {
          handleBrowseSelect(data.groupId);
      }
    }

    const loadDeckFile = () => {
      inputFile.current.click();
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
              cardRow['discardgroupid'] = sectionToDiscardGroupId(sectionName,playerN);
              if (cardRow) {
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

    return(
      <div className="h-full">
        <ul className="top-level-menu float-left">
        <li key={"Menu"}><div className="h-full flex text-xl items-center justify-center" href="#">Menu</div>
            <ul className="second-level-menu">
              <li key={"Load"}>
                <a  onClick={() => handleMenuClick({action:"load_deck"})} href="#">Load Deck</a>
                <input type='file' id='file' ref={inputFile} style={{display: 'none'}} onChange={loadDeck}/>
              </li>
              <li key={"Spawn"}><a  onClick={() => handleMenuClick({action:"spawn_card"})} href="#">Spawn Card</a></li>
              <li key={"Reset"}>
                  <a href="#">Reset Game</a>
                  <ul className="third-level-menu">
                      <li key={"Confirm"}><a onClick={() => handleMenuClick({action:"reset_game"})} href="#">Confirm</a></li>
                  </ul>
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
      <MenuBarSharedContainer/>

      <MenuBarUser
        playerN={"player1"}
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
        observingPlayerN={observingPlayerN}
        setObservingPlayerN={setObservingPlayerN}
      />
      <MenuBarUser
        playerN={"player2"}
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
        observingPlayerN={observingPlayerN}
        setObservingPlayerN={setObservingPlayerN}
      />
      <MenuBarUser
        playerN={"player3"}
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
        observingPlayerN={observingPlayerN}
        setObservingPlayerN={setObservingPlayerN}
      />
      <MenuBarUser
        playerN={"player4"}
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
        observingPlayerN={observingPlayerN}
        setObservingPlayerN={setObservingPlayerN}
      />
    </div>
  )
})