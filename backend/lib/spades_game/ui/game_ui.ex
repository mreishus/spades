defmodule SpadesGame.GameUI do
  @moduledoc """
  One level on top of Game.
  """

  alias SpadesGame.{Game, GameUI, GameOptions}

  @derive Jason.Encoder
  defstruct [:game, :game_name, :options, :created_at, :seats]

  @type t :: %GameUI{
          game: Game.t(),
          game_name: String.t(),
          options: GameOptions.t(),
          created_at: DateTime.t(),
          seats: %{
            west: nil | integer,
            north: nil | integer,
            east: nil | integer,
            south: nil | integer
          }
        }

  @spec new(String.t(), GameOptions.t()) :: GameUI.t()
  def new(game_name, %GameOptions{} = options) do
    game = Game.new(game_name, options)

    %GameUI{
      game: game,
      game_name: game_name,
      options: options,
      created_at: DateTime.utc_now(),
      seats: %{
        west: nil,
        north: nil,
        east: nil,
        south: nil
      }
    }
  end

  @spec discard(GameUI.t()) :: GameUI.t()
  def discard(gameui) do
    game = Game.discard(gameui.game)
    %{gameui | game: game}
  end

  @doc """
  sit/3: User is attempting to sit in a seat.
  Let them do it if no one is in the seat, and they are not
  in any other seats.  Otherwise return the game unchanged.
  --> sit(gameui, userid, which_seat)
  """
  @spec sit(GameUI.t(), integer, String.t()) :: GameUI.t()
  def sit(gameui, userid, "north"), do: do_sit(gameui, userid, :north)
  def sit(gameui, userid, "south"), do: do_sit(gameui, userid, :south)
  def sit(gameui, userid, "east"), do: do_sit(gameui, userid, :east)
  def sit(gameui, userid, "west"), do: do_sit(gameui, userid, :west)
  def sit(gameui, _userid, _), do: gameui

  @spec do_sit(GameUI.t(), integer, :north | :south | :east | :west) :: GameUI.t()
  defp do_sit(gameui, userid, which) do
    if check_sit(gameui, userid, which) do
      seats = gameui.seats |> Map.put(which, userid)
      %GameUI{gameui | seats: seats}
    else
      gameui
    end
  end

  # Is this user allowed to sit in this seat?
  @spec check_sit(GameUI.t(), integer, :north | :south | :east | :west) :: boolean
  defp check_sit(gameui, userid, which) do
    !already_sitting(gameui, userid) && seat_empty(gameui, which)
  end

  # Is this user sitting in a seat?
  @spec seat_empty(GameUI.t(), integer) :: boolean
  defp already_sitting(gameui, userid) do
    gameui.seats |> Map.values() |> Enum.member?(userid)
  end

  # Is this seat empty?
  @spec seat_empty(GameUI.t(), :north | :south | :east | :west) :: boolean
  defp seat_empty(gameui, which), do: gameui.seats[which] == nil

  @doc """
  left/2: Userid just left the table.  If they were seated, mark
  their seat as vacant.
  """
  @spec left(GameUI.t(), integer) :: GameUI.t()
  def left(gameui, userid) do
    seats = for {k, v} <- gameui.seats, into: %{}, do: {k, if(v == userid, do: nil, else: v)}
    %{gameui | seats: seats}
  end
end
