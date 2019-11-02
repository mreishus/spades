defmodule SpadesGame.GameUIView do
  @moduledoc """
  One level on top of GameUI.
  Censors hands.
  """
  alias SpadesGame.{GameUI, GameUIView, Deck}

  @derive Jason.Encoder
  defstruct [:gameui, :my_hand]

  @type t :: %GameUIView{
          gameui: GameUI.t(),
          my_hand: Deck.t()
        }

  @spec view_for(GameUI.t(), integer) :: GameUIView.t()
  def view_for(gameui, user_id) do
    my_hand =
      cond do
        user_id == gameui.seats.east ->
          gameui.game.east.hand

        user_id == gameui.seats.west ->
          gameui.game.west.hand

        user_id == gameui.seats.north ->
          gameui.game.north.hand

        user_id == gameui.seats.south ->
          gameui.game.south.hand

        true ->
          []
      end

    %GameUIView{
      gameui: GameUI.censor_hands(gameui),
      my_hand: my_hand
    }
  end
end
