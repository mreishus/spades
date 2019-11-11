declare module "elixir-backend" {
  export type Seat = "west" | "east" | "south" | "north";

  export declare class Room {
    public id: number;
    public name: string;
    public slug: string;
  }

  export declare class GameUIView {
    public game_ui: GameUI;
    public my_hand: Array<Card>;
    public my_seat: null | Seat;
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
    status: "staging" | "playing" | "done";
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
    east: any; // GamePlayer
    game_name: string;
    north: any; // GamePlayer
    options: any;
    south: any; // GamePlayer
    spades_broken: boolean;
    status: "bidding" | "playing";
    trick: Array<TrickCard>;
    turn: null | Seat;
    west: any; // GamePlayer
    when_trick_full: null | string; // timestamp
    score: GameScore;
    round_number: number;
  }

  export declare class GamePlayer {
    bid: null | number;
    hand: Array<Card>;
    tricks_won: number;
  }

  export declare class GameScore {
    north_south_rounds: Array<GameScoreRoundTeam>;
    north_south_score: number;
    east_west_rounds: Array<GameScoreRoundTeam>;
    east_west_score: number;
  }

  export declare class GameScoreRoundTeam {
    before_score: number;
    before_bags: number;
    bid: number;
    won: number;
    adj_successful_nil: number;
    adj_failed_nil: number;
    adj_successful_bid: number;
    adj_failed_bid: number;
    adj_bags: number;
    bag_penalty: number;
    after_score: number;
    after_bags: number;
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
    bottomPlayer: any;
    topPlayer: any;
    rightPlayer: any;
    leftPlayer: any;
  }
}
