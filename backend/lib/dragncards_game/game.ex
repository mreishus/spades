defmodule DragnCardsGame.Game do
  @moduledoc """
  Represents a game of dragncards.
  In early stages of the app, it only represents a
  some toy game used to test everything around it.
  """
  alias DragnCardsGame.{Groups, Game, PlayerData}
  alias DragnCards.{Repo, Replay}

  @type t :: Map.t()

  @doc """
  load/1:  Create a game with specified options.
  """
  @spec load(Map.t()) :: Game.t()
  def load(%{} = options) do
    game = if options["replayId"] != "" do
      replay = Repo.get_by(Replay, uuid: options["replayId"])
      if replay.game_json do replay.game_json else Game.new() end
    else
      Game.new()
    end
    # Refresh id so that replay does not get overwritten
    put_in(game["id"], Ecto.UUID.generate)
  end

  @doc """
  new/1:  Create a game with specified options.
  """
  @spec new() :: Game.t()
  def new() do
    %{
      "id" => Ecto.UUID.generate,
      "version" => 0.1,
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

  def step(game, direction) do
    case direction do
      "undo" ->
        undo(game)
      "redo" ->
        redo(game)
      _ ->
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
        [":removed", diff_map[:value]]
      # TODO: Check that removal behaves properly
      :removed ->
        [diff_map[:value], ":removed"]
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

  def apply_delta(map, delta, direction) do
    Enum.reduce(delta, map, fn({k, v}, acc) ->
      if is_map(v) do
        put_in(acc[k], apply_delta(map[k], v, direction))
      else
        new_val = if direction == "undo" do
          Enum.at(v,0)
        else
          Enum.at(v,1)
        end
        if new_val == ":removed" do
          Map.delete(acc, k)
        else
          put_in(acc[k], new_val)
        end
      end
    end)
  end

  def apply_delta_list(game, delta_list, direction) do
    Enum.reduce(delta_list, game, fn(delta, acc) ->
      apply_delta(acc, delta, direction)
    end)
  end

  def apply_deltas_until_round_change(game, direction) do
    deltas = game["deltas"]
    round_init = game["roundNumber"]
    Enum.reduce_while(deltas, game, fn(delta, acc) ->
      replay_step = acc["replayStep"]
      # Check if we run into the beginning/end
      cond do
        direction == "undo" and replay_step == 0 ->
          {:halt, acc}
        direction == "redo" and replay_step == Enum.count(deltas) ->
          {:halt, acc}
      # Check if round has changed
        acc["roundNumber"] != round_init ->
          {:halt, acc}
      # Otherwise continue
        true ->
          {:cont, step(acc, direction)}
      end
    end)
  end

end
