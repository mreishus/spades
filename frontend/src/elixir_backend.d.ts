declare module "elixir-backend" {
  export declare class Room {
    public id: number;
    public name: string;
    public slug: string;
  }

  export declare class GameUIView {
    public game_ui: any;
    public my_hand: Array<Card>;
  }

  export declare class Card {
    public rank: number;
    public suit: "s" | "c" | "h" | "d";
  }

  export declare class GameUI {
    created_at: any;
    game: Game;
    game_name: string;
    options: any;
    seats: GameUISeats;
    status: string; // staging, playing, done
    when_seats_full: null | string; // timestamp
  }

  export declare class GameUISeats {
    east: null | number;
    west: null | number;
    north: null | number;
    south: null | number;
  }

  export declare class Game {
    dealer: string; // "north"
    discard: Array<any>;
    draw: Array<any>;
    east: any; // GamePlayer
    game_name: string;
    north: any; // GamePlayer
    options: any;
    south: any; // GamePlayer
    spades_broken: boolean;
    status: string; // "bidding"
    trick: Array<any>;
    turn: string; // "east"
    west: any; // GamePlayer
  }
}
