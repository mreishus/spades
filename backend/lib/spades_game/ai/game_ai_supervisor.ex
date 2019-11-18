defmodule SpadesGame.GameAISupervisor do
  @moduledoc """
  A supervisor that starts `GameAIServer` processes dynamically.
  """

  use DynamicSupervisor

  alias SpadesGame.{GameAIServer}

  def start_link(_arg) do
    DynamicSupervisor.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def init(:ok) do
    DynamicSupervisor.init(strategy: :one_for_one)
  end

  @doc """
  Starts a `GameAIServer` process and supervises it.
  """
  def start_game(game_name) do
    child_spec = %{
      id: GameAIServer,
      start: {GameAIServer, :start_link, [game_name]},
      restart: :transient
    }

    DynamicSupervisor.start_child(__MODULE__, child_spec)
  end

  @doc """
  Terminates the `GameAIServer` process normally. It won't be restarted.
  """
  def stop_game(game_name) do
    child_pid = GameAIServer.gameai_pid(game_name)
    DynamicSupervisor.terminate_child(__MODULE__, child_pid)
  end
end
