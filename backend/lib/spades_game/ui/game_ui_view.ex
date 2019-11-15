defmodule SpadesGame.GameUIView do
  @moduledoc """
  One level on top of GameUI.
  Censors hands.
  Considers which user id we're sending info to
  and shows their hand if appropriate.
  """
  alias SpadesGame.{GameUI, GameUIView, Deck}

  @derive Jason.Encoder
  defstruct [:game_ui, :my_hand, :my_seat]

  @type t :: %GameUIView{
          game_ui: GameUI.t(),
          my_hand: Deck.t(),
          my_seat: nil | :east | :west | :north | :south
        }

  @spec view_for(nil | GameUI.t(), integer) :: GameUIView.t()
  def view_for(nil, _user_id), do: nil

  def view_for(%GameUI{} = game_ui, user_id) do
    my_hand =
      if game_ui.status != :staging do
        hand_for(game_ui, user_id)
      else
        []
      end

    my_seat = seat_for(game_ui, user_id)

    %GameUIView{
      game_ui: GameUI.censor_hands(game_ui),
      my_hand: my_hand,
      my_seat: my_seat
    }
  end

  defp hand_for(%GameUI{} = game_ui, user_id) do
    cond do
      user_id == game_ui.seats.east.sitting ->
        game_ui.game.east.hand

      user_id == game_ui.seats.west.sitting ->
        game_ui.game.west.hand

      user_id == game_ui.seats.north.sitting ->
        game_ui.game.north.hand

      user_id == game_ui.seats.south.sitting ->
        game_ui.game.south.hand

      true ->
        []
    end
  end

  def seat_for(%GameUI{} = game_ui, user_id) do
    cond do
      user_id == game_ui.seats.east.sitting ->
        :east

      user_id == game_ui.seats.west.sitting ->
        :west

      user_id == game_ui.seats.north.sitting ->
        :north

      user_id == game_ui.seats.south.sitting ->
        :south

      true ->
        nil
    end
  end
end
