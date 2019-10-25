defmodule SpadesGame.GameRegistry do
  @moduledoc """
  Keeps track of games.
  """
  require Logger
  alias SpadesGame.{GameUI}
  alias Spades.Rooms
  alias Spades.Rooms.Room

  def add(_game_name, %GameUI{} = gameui) do
    gameui
    |> to_room_param()
    |> Rooms.create_room()
  end

  def update(game_name, %GameUI{} = gameui) do
    room = Rooms.get_room_by_name(game_name)

    case room do
      %Room{} -> Rooms.update_room(room, to_room_param(gameui))
      _ -> nil
    end
  end

  def remove(game_name) do
    room = Rooms.get_room_by_name(game_name)

    case room do
      %Room{} -> Rooms.delete_room(room)
      _ -> nil
    end
  end

  defp to_room_param(%GameUI{} = gameui) do
    # created_at: DateTime.t()
    %{
      name: gameui.game_name
    }
  end
end
