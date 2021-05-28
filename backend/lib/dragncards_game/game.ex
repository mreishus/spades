defmodule DragnCardsGame.Game do
  @moduledoc """
  Represents a game of dragncards.
  In early stages of the app, it only represents a
  some toy game used to test everything around it.
  """
  alias DragnCardsGame.{Groups, Game, PlayerData}

  @type t :: Map.t()

  @doc """
  new/1:  Create a game with specified options.
  """
  @spec new(Map.t()) :: Game.t()
  def new(%{} = options) do
    IO.puts("game new")
    game = %{
      "version" => 0.1,
      "options" => options,
      "numPlayers" => 1,
      "layout" => "standard",
      "firstPlayer" => "player1",
      "roundNumber" => 0,
      "phase" => "Beginning",
      "roundStep" => "0.0",
      "groupById" => Groups.new(),
      "stackById" => %{},
      "cardById"  => %{},
      "triggerMap" => %{},
      "playerData" => %{
        "player1" => PlayerData.new(),
        "player2" => PlayerData.new(),
        "player3" => PlayerData.new(),
        "player4" => PlayerData.new(),
      },
      "deltas" => [],
    }
    game
  end

  def add_delta(game, prev_game) do
    d = get_delta(prev_game, game)
    if d do
      put_in(game["deltas"], [d | game["deltas"]])
    else
      game
    end
  end

  def undo(game) do
    if Enum.count(game["deltas"]) do
      d = Enum.at(game["deltas"],0)
      #game = Map.delete(game, "deltas")
      game = apply_delta(game, d)
      Map.put(game, "deltas", List.delete_at(game["deltas"],0))
    else
      game
    end
  end

  def get_delta(game_old, game_new) do
    game_old = Map.delete(game_old, "deltas")
    game_new = Map.delete(game_new, "deltas")
    diff_map = MapDiff.diff(game_old, game_new)
    delta("game", diff_map)
  end

  def delta(key, diff_map) do
    case diff_map[:changed] do
      :equal ->
        nil
      :primitive_change ->
        diff_map[:removed]
      :map_change ->
        diff_value = diff_map[:value]
        Enum.reduce(diff_value, %{}, fn({k,v},acc) ->
          d2 = delta(k, v)
          if d2 do
            acc |> Map.put(k, d2)
          else
            acc
          end
        end)
        _ ->
          nil
    end
  end

  def apply_delta(map, delta) do
    Enum.reduce(delta, map, fn({k, v}, acc) ->
      if is_map(v) do
        put_in(acc[k], apply_delta(map[k], v))
      else
        put_in(acc[k], v)
      end
    end)
  end

  def apply_delta_list(game, delta_list) do
    Enum.reduce(delta_list, game, fn(delta, acc) ->
      apply_delta(acc, delta)
    end)
  end

end
