declare module "elixir-backend" {
  export declare class Room {
    public id: number;
    public name: string;
    public slug: string;
  }
  export declare class GameUIView {
    public game_ui: any;
    public my_hand: Array<any>;
  }
}
