import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { Group } from "./Group";
import { Browse } from "./Browse";

const layout1 = [
  {
    regions: [
      {id: "sharedMainQuest", width: "12%"},
      {id: "sharedActive", width: "9%"},
      {id: "sharedStaging", width: "64%", style: "shaded", boxShadow: "true"},
      {id: "sharedEncounterDeck", width: "7.5%"},
      {id: "sharedEncounterDiscard", width: "7.5%"},
    ]
  },
  {
    regions: [
      {id: "player1Engaged", width: "100%"},
    ]
  },
  {
    regions: [
      {id: "player1Play1", width: "100%"},
    ]
  },
  {
    regions: [
      {id: "player1Play2", width: "90%"},
      {id: "player1Event", width: "10%"},
    ]
  },
  {
    regions: [
      {id: "Hand", width: "60%", style: "shaded"},
      {id: "Deck", width: "7.5%", style: "shaded"},
      {id: "Discard", width: "7.5%", style: "shaded"},
    ]
  },
]

const layout4 = [
  {
    regions: [
      {id: "sharedMainQuest", width: "8%"},
      {id: "sharedActive", width: "9%"},
      {id: "sharedStaging", width: "68%", style: "shaded", boxShadow: "true"},
      {id: "sharedEncounterDeck", width: "7.5%"},
      {id: "sharedEncounterDiscard", width: "7.5%"},
    ]
  },
  {
    regions: [
      {id: "player1Engaged", width: "25%"},
      {id: "player2Engaged", width: "25%"},
      {id: "player3Engaged", width: "25%"},
      {id: "player4Engaged", width: "25%"},
    ]
  },
  {
    regions: [
      {id: "player1Play1", width: "25%"},
      {id: "player2Play1", width: "25%"},
      {id: "player3Play1", width: "25%"},
      {id: "player4Play1", width: "25%"},
    ]
  },
  {
    regions: [
      {id: "player1Play2", width: "25%"},
      {id: "player2Play2", width: "25%"},
      {id: "player3Play2", width: "25%"},
      {id: "player4Play2", width: "25%"},
    ]
  },
  {
    regions: [
      {id: "player1Play3", width: "25%"},
      {id: "player2Play3", width: "25%"},
      {id: "player3Play3", width: "25%"},
      {id: "player4Play3", width: "25%"},
    ]
  },
  {
    regions: [
      {id: "player1Play4", width: "17%"},
      {id: "player1Event", width: "8%"},
      {id: "player2Play4", width: "17%"},
      {id: "player2Event", width: "8%"},
      {id: "player3Play4", width: "17%"},
      {id: "player3Event", width: "8%"},
      {id: "player4Play4", width: "17%"},
      {id: "player4Event", width: "8%"},
    ]
  },
  {
    regions: [
      {id: "Hand", width: "60%", style: "shaded"},
      {id: "Deck", width: "7.5%", style: "shaded"},
      {id: "Discard", width: "7.5%", style: "shaded"},
    ]
  },
]

export const TableRegion = React.memo(({
  region,
  cardSize,
  observingPlayerN,
  gameBroadcast,
  chatBroadcast,
  playerN,
  browseGroupId,
  setBrowseGroupId,
  setBrowseGroupTopN,
}) => {
  const groupId = ["Hand", "Deck", "Discard"].includes(region.id) ? observingPlayerN + region.id : region.id;
  const beingBrowsed = groupId === browseGroupId;
  return (
    <div
      className="h-full float-left"
      style={{
        width: region.width,
        padding: "0 0 0 0.5vw",
        background: (region.style == "shaded") ? "rgba(0, 0, 0, 0.3)" : "",
        MozBoxShadow: (region.boxShadow) ? '0 10px 10px 5px rgba(0,0,0,0.3)' : "",
        WebkitBoxShadow: (region.boxShadow) ? '0 10px 10px 5px rgba(0,0,0,0.3)' : "",
        boxShadow: (region.boxShadow) ? '0 10px 10px 5px rgba(0,0,0,0.3)' : "",
      }}
    >
      {beingBrowsed ? null :
        <Group
          groupId={groupId}
          cardSize={cardSize}
          gameBroadcast={gameBroadcast} 
          chatBroadcast={chatBroadcast}
          playerN={playerN}
          browseGroupId={browseGroupId}
          setBrowseGroupId={setBrowseGroupId}
          setBrowseGroupTopN={setBrowseGroupTopN}
        />
      }
    </div>
  )
})

export const TableLayout = React.memo(({
  observingPlayerN,
  gameBroadcast,
  chatBroadcast,
  playerN,
  browseGroupId,
  setBrowseGroupId,
  browseGroupTopN,
  setBrowseGroupTopN,
}) => {
  const numPlayersStore = state => state.gameUi.numPlayers;
  const numPlayers = useSelector(numPlayersStore);
  const [layout, setLayout] = useState(layout4);
  const numRows = layout.length;
  const rowHeight = Math.floor(100/numRows);
  const finalRowHeight = 100-((numRows-1)*rowHeight); // Is this necessay?
  const cardSize = 26/numRows;
  console.log("rendering layout");
  console.log(rowHeight, finalRowHeight);
  return (
    layout.map((row, rowIndex) => (
      (browseGroupId && rowIndex === numRows - 2) ? 
        <div 
          className="flex flex-1 bg-gray-700 border rounded-lg outline-none w-full" 
          style={{
            minHeight: (rowIndex === numRows - 1) ? `${finalRowHeight}%` : `${rowHeight}%`, 
            height:    (rowIndex === numRows - 1) ? `${finalRowHeight}%` : `${rowHeight}%`, 
            maxHeight: (rowIndex === numRows - 1) ? `${finalRowHeight}%` : `${rowHeight}%`,
          }}>
          <Browse
            groupId={browseGroupId}
            cardSize={cardSize}
            gameBroadcast={gameBroadcast}
            chatBroadcast={chatBroadcast}
            playerN={playerN}
            browseGroupTopN={browseGroupTopN}
            setBrowseGroupId={setBrowseGroupId}
            setBrowseGroupTopN={setBrowseGroupTopN}
          />
          </div>
        :
          <div 
            className="w-full" 
            style={{
              minHeight: (rowIndex === numRows - 1) ? `${finalRowHeight}%` : `${rowHeight}%`, 
              height:    (rowIndex === numRows - 1) ? `${finalRowHeight}%` : `${rowHeight}%`, 
              maxHeight: (rowIndex === numRows - 1) ? `${finalRowHeight}%` : `${rowHeight}%`,
            }}>
            {row.regions.map((region, regionIndex) => (
              <TableRegion
                region={region}
                cardSize={cardSize}
                observingPlayerN={observingPlayerN}
                gameBroadcast={gameBroadcast} 
                chatBroadcast={chatBroadcast}
                playerN={playerN}
                browseGroupId={browseGroupId}
                setBrowseGroupId={setBrowseGroupId}
                setBrowseGroupTopN={setBrowseGroupTopN}
              />
            ))}
          </div>
    ))
  )
})