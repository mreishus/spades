declare module "elixir-backend" {
  export type Seat = "player1" | "player2" | "player3" | "player4";
  export type SittingPlayer = null | number | "bot";

  export declare class Room {
    public id: number;
    public name: string;
    public slug: string;
    public player1: null | number;
    public player2: null | number;
    public player3: null | number;
    public player4: null | number;
  }

  export declare class GameUIView {

    public game_ui: GameUI;
    public my_hand: Array<Card>;
    public my_seat: null | Seat;

  }

  // One side of a card
  export declare class CardFace {
    public name: string;
    public src: sring;
    public width: number;
    public height: number;
  }

  export declare class Card {
    public id: string;
    public rotation: number;
    public exhausted: boolean;
    public tokens: Tokens;
    public owner: number;
    public controller: number;

    public CurrentSide: string;
    public Sides: { [id: string] : CardFace; };
  }

  export declare class CardAndLoc {
    card: Card;
    groupID: String;
    stackIndex: number;
    cardIndex: number;
  }

  export declare class Tokens {
    public resource: number;
    public progress: number;
    public damage: number;
    public time: number;
    public threat: number;
    public willpower: number;
    public attack: number;
    public defense: number;
  }

  export declare class Group {
    id: string;
    name: string;
    type: string;
    controller: string;
    cards: Array<Card>;
    updated: boolean;
    stacks: Array<Stack>;
  }

  export declare class Groups {
    [key:string]: Group
  }

  export declare class Stack {
    controller: string;
    cards: Array<Card>;
  }

  export declare class GameUI {
    created_at: any;
    game: Game;
    game_name: string;
    options: any;
    seats: GameUISeats;
    status: "staging" | "playing" | "done";
    when_seats_full: null | string; // timestamp
    player1: any; // GamePlayer
    player2: any; // GamePlayer
    player3: any; // GamePlayer
    player4: any; // GamePlayer
  }

  export declare class GameUISeats {
    player1: GameUISeat;
    player2: GameUISeat;
    player3: GameUISeat;
    player4: GameUISeat;
  }

  export declare class GameUISeat {
    sitting: SittingPlayer;
    recently_sitting: SittingPlayer;
    when_left_seat: null | string; // Actually contains a timestamp
  }

  export declare class Game {
    first_player: 1 | 2 | 3 | 4; // "player1"
    options: any;
    round_number: number;
    phase: String;
    phase_part: String;
    groups: Groups;
  }

  export declare class GamePlayer {
    bid: null | number;
    hand: Array<Card>;
    tricks_won: number;
  }

  // game_ui.game.trick --> array TrickCard
  export declare class TrickCard {
    card: Card;
    seat: Seat;
  }

  export declare class RotateTableContextType {
    bottomSeat: Seat;
    topSeat: Seat;
    rightSeat: Seat;
    leftSeat: Seat;
    bottomPlayer: GamePlayer;
    topPlayer: GamePlayer;
    rightPlayer: GamePlayer;
    leftPlayer: GamePlayer;
    bottomUserId: SittingPlayer;
    topUserId: SittingPlayer;
    rightUserId: SittingPlayer;
    leftUserId: SittingPlayer;
  }

  // Profile: Private information about your own account.
  export declare class Profile {
    public id: number;
    public email: string;
    public alias: string;
    public inserted_at: string; // Actually contains a timestamp
    public email_confirmed_at: null | string; // Actually contains a timestamp
  }

  // User: Public information about other users.
  export declare class User {
    public id: number;
    public alias: string;
  }

  export declare class ChatMessage {
    public text: string;
    public sent_by: number | null;
    public when: string; // Actually a timestamp
    public shortcode: string;
    public game_update: boolean;
  }
}
