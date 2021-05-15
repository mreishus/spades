defmodule DragnCardsGame.GameUISupervisor do
  @moduledoc """
  A supervisor that starts `GameUIServer` processes dynamically.
  """

  use DynamicSupervisor

  alias DragnCardsGame.GameUIServer

  def start_link(_arg) do
    IO.puts("gameuisupervisor: start_link a")
    DynamicSupervisor.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def init(:ok) do
    DynamicSupervisor.init(strategy: :one_for_one)
  end

  @doc """
  Starts a `GameUIServer` process and supervises it.
  """
  def start_game(game_name, user, %{} = options) do
    IO.puts("gameuisup: start a")
    IO.inspect(user)
    child_spec = %{
      id: GameUIServer,
      start: {GameUIServer, :start_link, [game_name, user, options]},
      restart: :transient
    }
    IO.puts("gameuisup: start b")
    DynamicSupervisor.start_child(__MODULE__, child_spec)
  end

  @doc """
  Terminates the `GameUIServer` process normally. It won't be restarted.
  """
  def stop_game(game_name) do
    # :ets.delete(:games, game_name)

    child_pid = GameUIServer.gameui_pid(game_name)
    DynamicSupervisor.terminate_child(__MODULE__, child_pid)
  end
end
