export const GetPlayerN = (playerIDs, id) => {
  var PlayerN = null;
  Object.keys(playerIDs).forEach(PlayerI => {
    if (playerIDs[PlayerI] === id) PlayerN = PlayerI;
  })
  return PlayerN;
}

