defmodule SpadesGame.GameUI do
  @moduledoc """
  One level on top of Game.
  """

  alias SpadesGame.{Game, GameUI, GameOptions}

  @derive Jason.Encoder
  defstruct [:game, :game_name, :options, :created_at, :status, :seats, :when_seats_full]

  @type t :: %GameUI{
          game: Game.t(),
          game_name: String.t(),
          options: GameOptions.t(),
          created_at: DateTime.t(),
          status: :staging | :playing | :done,
          seats: %{
            west: nil | integer,
            north: nil | integer,
            east: nil | integer,
            south: nil | integer
          },
          when_seats_full: nil | DateTime.t()
        }

  @spec new(String.t(), GameOptions.t()) :: GameUI.t()
  def new(game_name, %GameOptions{} = options) do
    game = Game.new(game_name, options)

    %GameUI{
      game: game,
      game_name: game_name,
      options: options,
      created_at: DateTime.utc_now(),
      status: :staging,
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
  checks/1
  Generally, all "checks" we append to all outputs.
  These are all derived state updates.  If something
  needs to fire off a timer or something, it will be here.
  It's always safe to call this function.
  """
  @spec checks(GameUI.t()) :: GameUI.t()
  def checks(gameui) do
    gameui
    |> check_full_seats
    |> check_status_advance
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
  def sit(gameui, _userid, _), do: gameui |> checks

  @spec do_sit(GameUI.t(), integer, :north | :south | :east | :west) :: GameUI.t()
  defp do_sit(gameui, userid, which) do
    if check_sit(gameui, userid, which) do
      seats = gameui.seats |> Map.put(which, userid)

      %GameUI{gameui | seats: seats}
      |> checks
    else
      gameui
      |> checks
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
    |> checks
  end

  @doc """
  check_full_seats/1
  When the last person sits down and all of the seats are full, put a timestamp
  on ".when_seats_full".
  If there is a timestamp set, and someone just stood up, clear the timestamp.
  """
  @spec check_full_seats(GameUI.t()) :: GameUI.t()
  def check_full_seats(%GameUI{} = gameui) do
    cond do
      everyone_sitting?(gameui) and gameui.when_seats_full == nil ->
        %{gameui | when_seats_full: DateTime.utc_now()}

      not everyone_sitting?(gameui) and gameui.when_seats_full != nil ->
        %{gameui | when_seats_full: nil}

      true ->
        gameui
    end
  end

  @doc """
  check_status_advance/1: Move a game's status when appropriate.
  :staging -> :playing -> :done
  """
  @spec check_status_advance(GameUI.t()) :: GameUI.t()
  def check_status_advance(%GameUI{status: :staging} = gameui) do
    if everyone_sitting?(gameui) and seat_full_countdown_finished?(gameui) do
      %{gameui | status: :playing}
    else
      gameui
    end
  end

  ## Don't have winners yet
  # def check_status_advance(%GameUI{status: :playing, game: %Game{winner: winner}} = gameui)
  #     when not is_nil(winner) do
  #   %{gameui | status: :done}
  # end

  def check_status_advance(gameui) do
    gameui
  end

  @spec everyone_sitting?(GameUI.t()) :: boolean
  def everyone_sitting?(gameui) do
    [:north, :west, :south, :east]
    |> Enum.reduce(true, fn seat, acc ->
      acc and gameui.seats[seat] != nil
    end)
  end

  @doc """
  seat_full_countdown_finished?/1
  Is the "when_seats_full" timestamp at least 10 seconds old?
  """
  @spec seat_full_countdown_finished?(GameUI.t()) :: boolean
  def seat_full_countdown_finished?(%GameUI{when_seats_full: nil}) do
    false
  end

  def seat_full_countdown_finished?(%GameUI{when_seats_full: when_seats_full}) do
    time_elapsed = DateTime.diff(DateTime.utc_now(), when_seats_full, :millisecond)
    # 10 seconds
    time_elapsed >= 10 * 1000
  end
end
