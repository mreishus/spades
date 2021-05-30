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
      "id" => Ecto.UUID.generate,
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
      "replayStep" => 0,
    }
    game
  end

  def add_delta(game, prev_game) do
    d = get_delta(prev_game, game)
    if d do
      ds = game["deltas"]
      ds = Enum.slice(ds, Enum.count(ds)-game["replayStep"]..-1)
      ds = [d | ds]
      game = put_in(game["deltas"], ds)
      put_in(game["replayStep"], game["replayStep"]+1)
    else
      game
    end
  end

  def undo(game) do
    replay_step = game["replayStep"]
    if replay_step > 0 do
      ds = game["deltas"]
      d = Enum.at(ds,Enum.count(ds)-replay_step)
      game = apply_delta(game, d, "undo")
      game = put_in(game["replayStep"], replay_step-1)
    else
      game
    end
  end

  def redo(game) do
    replay_step = game["replayStep"]
    ds = game["deltas"]
    if replay_step < Enum.count(ds) do
      d = Enum.at(ds,Enum.count(ds)-replay_step-1)
      game = apply_delta(game, d, "redo")
      game = put_in(game["replayStep"], replay_step+1)
    else
      game
    end
  end

  def get_delta(game_old, game_new) do
    game_old = Map.delete(game_old, "deltas")
    game_old = Map.delete(game_old, "replayStep")
    game_new = Map.delete(game_new, "deltas")
    game_new = Map.delete(game_new, "replayStep")
    diff_map = MapDiff.diff(game_old, game_new)
    delta("game", diff_map)
  end

  def delta(key, diff_map) do
    case diff_map[:changed] do
      :equal ->
        nil
      :added ->
        [:removed, diff_map[:value]]
      :primitive_change ->
        [diff_map[:removed],diff_map[:added]]
      :map_change ->
        diff_value = diff_map[:value]
        Enum.reduce(diff_value, %{}, fn({k,v},acc) ->
          d2 = delta(k, v)
          if v[:changed] != :equal do
            acc |> Map.put(k, d2)
          else
            acc
          end
        end)
        _ ->
          nil
    end
  end

  def apply_delta(map, delta, type) do
    Enum.reduce(delta, map, fn({k, v}, acc) ->
      if is_map(v) do
        put_in(acc[k], apply_delta(map[k], v, type))
      else
        new_val = if type == "undo" do
          Enum.at(v,0)
        else
          Enum.at(v,1)
        end
        if new_val == :removed do
          Map.delete(acc, k)
        else
          put_in(acc[k], new_val)
        end
      end
    end)
  end

  def apply_delta_list(game, delta_list, type) do
    Enum.reduce(delta_list, game, fn(delta, acc) ->
      apply_delta(acc, delta, type)
    end)
  end

end
