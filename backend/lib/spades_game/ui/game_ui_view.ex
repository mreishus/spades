defmodule SpadesGame.GameUIView do
  @moduledoc """
  One level on top of GameUI.
  Censors hands.
  Considers which user id we're sending info to
  and shows their hand if appropriate.
  """
  alias SpadesGame.{GameUI, GameUIView, Deck}

  @derive Jason.Encoder
  defstruct [:game_ui, :my_hand]

  @type t :: %GameUIView{
          game_ui: GameUI.t(),
          my_hand: Deck.t()
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

    %GameUIView{
      game_ui: GameUI.censor_hands(game_ui),
      my_hand: my_hand
    }
  end

  defp hand_for(%GameUI{} = game_ui, user_id) do
    game_ui |> IO.inspect(label: "hand_for: game_ui")

    cond do
      user_id == game_ui.seats.east ->
        game_ui.game.east.hand

      user_id == game_ui.seats.west ->
        game_ui.game.west.hand

      user_id == game_ui.seats.north ->
        game_ui.game.north.hand

      user_id == game_ui.seats.south ->
        game_ui.game.south.hand

      true ->
        []
    end
  end
end
