
import { 
  getDisplayName, 
  getDisplayNameFlipped, 
  getNextPlayerN, 
  leftmostNonEliminatedPlayerN, 
  getGroupIdStackIndexCardIndex,
  getStackByCardId,
  getCurrentFace,
  processTokenType,
  tokenPrintName,
  checkAlerts,
} from "./Helpers";
import { GROUPSINFO, PHASEINFO, roundStepToText, nextRoundStepPhase } from "./Constants";

const reveal = (game, deckGroupId, discardGroupId, gameBroadcast, chatBroadcast, facedown) => {
    // Check remaining cards in encounter deck
    const encounterStackIds = game.groupById[deckGroupId].stackIds;
    const encounterDiscardStackIds = game.groupById[discardGroupId].stackIds;
    const stacksLeft = encounterStackIds.length;
    // If no cards, check phase of game
    if (stacksLeft === 0) {
        // If quest phase, shuffle encounter discard pile into deck
        if (game.phase === "Quest") {
            gameBroadcast("game_action",{action:"move_stacks", options:{orig_group_id: discardGroupId, dest_group_id: deckGroupId, top_n: encounterDiscardStackIds.length, position: "s"}});
            chatBroadcast("game_update",{message: " shuffles "+GROUPSINFO[discardGroupId].name+" into "+GROUPSINFO[deckGroupId].name+"."});
            return;
        } else {
            // If not quest phase, give error message and break
            chatBroadcast("game_update",{message: " tried to reveal a card, but the encounter deck is empty and it's not the quest phase."});
            return;
        }
    }
    // Reveal card
    const topStackId = encounterStackIds[0];
    if (!topStackId) {
        chatBroadcast("game_update",{message: " tried to reveal a card, but the encounter deck is empty."});
        return;
    }
    const topStack = game.stackById[topStackId];
    const topCardId = topStack["cardIds"][0];
    const topCard = game.cardById[topCardId];        // Was shift held down? (Deal card facedown)
    const message = facedown ? "added facedown "+getDisplayName(topCard)+" to the staging area." : "revealed "+getDisplayNameFlipped(topCard)+"."
    chatBroadcast("game_update",{message: message});
    gameBroadcast("game_action", {action: "move_stack", options: {stack_id: topStackId, dest_group_id: "sharedStaging", dest_stack_index: -1, combine: false, preserve_state: facedown}})
}

export const gameAction = (action, props) => {
    const {gameUi, playerN, gameBroadcast, chatBroadcast, setActiveCardAndLoc} = props;
    if (!gameUi || !playerN) return;
    const game = gameUi.game;
    const isHost = playerN === leftmostNonEliminatedPlayerN(gameUi);

    if (action === "refresh") {
        const game = gameUi.game;
        const isHost = playerN === leftmostNonEliminatedPlayerN(gameUi);

        if (game.playerData[playerN].refreshed) {
            chatBroadcast("game_update", {message: "tried to refresh, but they already refreshed this round."})
            return;
        }
        // The player in the leftmost non-eliminated seat is the only one that does the framework game actions.
        // This prevents, for example, the token moving multiple times if players refresh at different times.
        if (isHost) {
            // Set phase
            gameBroadcast("game_action", {action: "update_values", options: {updates: [["game","roundStep", "7.R"], ["game", "phase", "Refresh"]]}});
            chatBroadcast("game_update", {message: "set the round step to "+roundStepToText("7.R")+"."})
            const firstPlayerN = game.firstPlayer;
            const nextPlayerN = getNextPlayerN(gameUi, firstPlayerN);
            // If nextPlayerN is null then it's a solo game, so don't pass the token
            if (nextPlayerN) {
                gameBroadcast("game_action", {action: "update_values", options: {updates: [["game","firstPlayer", nextPlayerN]]}});    
                chatBroadcast("game_update",{message: "moved first player token to "+nextPlayerN+"."});
            }
        }
        // Refresh all cards you control
        chatBroadcast("game_update",{message: "refreshes."});
        gameBroadcast("game_action", {
            action: "action_on_matching_cards", 
            options: {
                criteria:[["controller", playerN], ["locked", false]], 
                action: "update_card_values", 
                options: {updates: [["exhausted", false], ["rotation", 0]]}
            }
        });
        // Raise your threat
        const newThreat = game.playerData[playerN].threat+1;
        chatBroadcast("game_update", {message: "raises threat by 1 ("+newThreat+")."});
        gameBroadcast("game_action", {action: "update_values", options: {updates: [["game", "playerData", playerN, "threat", newThreat], ["game", "playerData", playerN, "refreshed", true]]}});
    } 

    else if (action === "new_round") {
        // Check if refresh is needed
        if (!game.playerData[playerN].refreshed) gameAction("refresh", props);

        // The player in the leftmost non-eliminated seat is the only one that does the framework game actions.
        // This prevents, for example, the round number increasing multiple times.
        if (isHost) {
            // Update phase
            gameBroadcast("game_action", {action: "update_values", options: {updates: [["game", "phase", "Resource"], ["game", "roundStep", "1.R"]]}})
            chatBroadcast("game_update", {message: "set the round step to "+roundStepToText("1.R")+"."})
            // Update round number
            const roundNumber = game["roundNumber"];
            const newRoundNumber = parseInt(roundNumber) + 1;
            gameBroadcast("game_action", {action: "update_values", options:{updates:[["game", "roundNumber", newRoundNumber]]}})
            chatBroadcast("game_update",{message: "increased the round number to "+newRoundNumber+"."})
        }
        // Draw a card
        for (var i = 0; i < game.playerData[playerN].cardsDrawn; i++) {
            gameBroadcast("game_action", {action: "draw_card", options: {player_n: playerN}})
            chatBroadcast("game_update",{message: "drew a card."});
        }
        // Add a resource to each hero
        gameBroadcast("game_action", {
            action: "action_on_matching_cards", 
            options: {
                criteria:[["sides","sideUp","type","Hero"],["controller",playerN], ["groupType","play"]], 
                action: "increment_token", 
                options: {token_type: "resource", increment: 1}
            }
        });
        // Reset willpower count and refresh status
        gameBroadcast("game_action", {action: "update_values", options:{updates:[["game", "playerData", playerN, "willpower", 0], ["game", "playerData", playerN, "refreshed", false]]}})
        // Add custom set tokens per round
        gameBroadcast("game_action", {
            action: "action_on_matching_cards", 
            options: {
                criteria:[["controller",playerN], ["groupType","play"]], 
                action: "apply_tokens_per_round", 
                options: {}
            }
        });
        // Uncommit all characters to the quest
        gameBroadcast("game_action", {
            action: "action_on_matching_cards", 
            options: {
                criteria:[["controller", playerN]], 
                action: "update_card_values", 
                options: {updates: [["committed", false]]}
            }
        });
        // Save replay
        gameBroadcast("game_action", {action: "save_replay", options: {}});
        chatBroadcast("game_update",{message: "saved the replay to their profile."});
        // Check for alerts
        checkAlerts();
    }

    else if (action === "reveal") {
        reveal(game, "sharedEncounterDeck", "sharedEncounterDiscard", gameBroadcast, chatBroadcast, false);
    } 

    else if (action === "reveal_facedown") {
        reveal(game, "sharedEncounterDeck", "sharedEncounterDiscard", gameBroadcast, chatBroadcast, true);
    } 

    else if (action === "reveal_second") {
        reveal(game, "sharedEncounterDeck2", "sharedEncounterDiscard2", gameBroadcast, chatBroadcast, false);
    } 

    else if (action === "reveal_second_facedown") {
        reveal(game, "sharedEncounterDeck2", "sharedEncounterDiscard2", gameBroadcast, chatBroadcast, true);
    } 
    
    else if (action === "draw") {
        // Check remaining cards in deck
        const playerDeck = game.groupById[playerN+"Deck"];
        const deckStackIds = playerDeck["stackIds"];
        const stacksLeft = deckStackIds.length;
        // If no cards, give error message and break
        if (stacksLeft === 0) {
            chatBroadcast("game_update",{message: " tried to draw a card, but their deck is empty."});
            return;
        }
        // Draw card
        chatBroadcast("game_update",{message: "drew a card."});
        gameBroadcast("game_action",{action: "draw_card", options: {player_n: playerN}});
    } 

    // Save replay
    else if (action === "save") {
        gameBroadcast("game_action", {action: "save_replay", options: {}});
        chatBroadcast("game_update", {message: "saved the replay to their profile."});
    } 
    
    else if (action === "shadows") {
        // Deal all shadow cards
        // Set phase
        gameBroadcast("game_action", {action: "update_values", options: {updates: [["game","roundStep", "6.2"], ["game", "phase", "Combat"]]}});
        chatBroadcast("game_update", {message: "set the round step to "+roundStepToText("6.2")+"."});
        gameBroadcast("game_action", {action: "deal_all_shadows", options: {}});
    } 
    
    else if (action === "discard_shadows") {
        // Discard all shadow cards
        // Set phase
        gameBroadcast("game_action", {action: "update_values", options: {updates: [["game","roundStep", "6.11"], ["game", "phase", "Combat"]]}});
        chatBroadcast("game_update", {message: "set the round step to "+roundStepToText("6.11")+"."});

        gameBroadcast("game_action", {
            action: "action_on_matching_cards", 
            options: {
                criteria:[["rotation", -30]], 
                action: "discard_card", 
                options: {}
            }
        });
        chatBroadcast("game_update", {message: "discarded all shadow cards."});
        
    } 
    
    else if (action === "undo") {
        // Undo an action
        if (game.replayStep <= 0) {
            chatBroadcast("game_update", {message: "tried to undo an action, but no previous actions exist."});
        } else {
            gameBroadcast("game_action", {action: "step_through", options: {size: "single", direction: "undo"}});
            chatBroadcast("game_update", {message: "pressed undo."});
            // Clear GiantCard
            setActiveCardAndLoc(null);
        }
    } 

    else if (action === "undo_many") {
        // Undo an action
        if (game.replayStep <= 0) {
            chatBroadcast("game_update", {message: "tried to undo an action, but no previous actions exist."});
        } else {
            gameBroadcast("game_action", {action: "step_through", options: {size: "round", direction: "undo"}});
            chatBroadcast("game_update", {message: "rewinds a round."});
            // Clear GiantCard
            setActiveCardAndLoc(null);
        }
    } 
    
    else if (action === "redo") {
        // Redo an action
        if (game.replayStep >= game.replayLength) {
            chatBroadcast("game_update", {message: "tried to redo an action, but the game is current."});
        } else {
            gameBroadcast("game_action", {action: "step_through", options: {size: "single", direction: "redo"}});
            chatBroadcast("game_update", {message: "pressed redo."});
            // Clear GiantCard
            setActiveCardAndLoc(null);
        }
    }
    
    else if (action === "redo_many") {
        // Redo an action
        if (game.replayStep >= game.replayLength) {
            chatBroadcast("game_update", {message: "tried to redo an action, but the game is current."});
        } else {
            gameBroadcast("game_action", {action: "step_through", options: {size: "round", direction: "redo"}});
            chatBroadcast("game_update", {message: "fast-forwards a round."});
            // Clear GiantCard
            setActiveCardAndLoc(null);
        }
    }
    
    else if (action === "next_step") {
        // Next step
        const nextStepPhase = nextRoundStepPhase(game.roundStep);
        if (nextStepPhase) {
            gameBroadcast("game_action", {action: "update_values", options: {updates: [["game","roundStep", nextStepPhase["roundStep"]], ["game", "phase", nextStepPhase["phase"]]]}});
            chatBroadcast("game_update", {message: "set the round step to "+roundStepToText(nextStepPhase["roundStep"])+"."});
        }
    } 

    else if (action === "mulligan") {
        if (window.confirm('Shuffle hand in deck and redraw equal number?')) {
            const hand = game.groupById[playerN+"Hand"];
            const handSize = hand.stackIds.length;
            gameBroadcast("game_action", {action: "move_stacks", options: {orig_group_id: playerN+"Hand", dest_group_id: playerN+"Deck", top_n: handSize, position: "shuffle"}})
            gameBroadcast("game_action", {action: "move_stacks", options: {orig_group_id: playerN+"Deck", dest_group_id: playerN+"Hand", top_n: handSize, position: "top"}})
            chatBroadcast("game_update", {message: "shuffled "+handSize+" cards into their deck and redrew an equal number."})
        }
    } 
    
    else if (action === "clear_targets") {
        // Remove targets from all cards you targeted
        chatBroadcast("game_update",{message: "removes all targets."});
        gameBroadcast("game_action", {
            action: "action_on_matching_cards", 
            options: {
                criteria:[["targeting", playerN, true]], 
                action: "update_card_values", 
                options: {updates: [["targeting", playerN, false]]}
            }
        });
        gameBroadcast("game_action", {
            action: "update_values", 
            options: {
                updates:[["game", "playerData", playerN, "arrows", []]], 
            }
        });
    }


}