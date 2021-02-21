declare module "elixir-backend" {

  export declare class Room {
    public id: number;
    public name: string;
    public slug: string;
    public player1: null | number;
    public player2: null | number;
    public player3: null | number;
    public player4: null | number;
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
    player_ids: { [id: string] : number; };
  }


  export declare class Game {
    first_player: String; // "player1"
    options: any;
    round_number: number;
    phase: String;
    phase_part: String;
    groups: Groups;
    player_data: { [id: string] : Player; };
  }

  export declare class Player {
    threat: number;
    willpower: number;
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
