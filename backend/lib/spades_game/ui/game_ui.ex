defmodule SpadesGame.GameUI do
  @moduledoc """
  One level on top of Game.
  """

  alias SpadesGame.{Game, GameUI, GameOptions, GameServer, GameSupervisor}

  @derive Jason.Encoder
  defstruct [:game, :game_name, :options, :created_at]

  @type t :: %GameUI{
          # "game" is Duplicated, since GameServer holds the state too
          game: Game.t(),
          game_name: String.t(),
          options: GameOptions.t(),
          created_at: DateTime.t()
        }

  @spec new(String.t(), GameOptions.t()) :: GameUI.t()
  def new(game_name, %GameOptions{} = options) do
    game =
      case GameServer.state(game_name) do
        nil ->
          {:ok, _pid} = GameSupervisor.start_game(game_name, options)
          GameServer.state(game_name)

        game ->
          game
      end

    %GameUI{
      game: game,
      game_name: game_name,
      options: options,
      created_at: DateTime.utc_now()
    }
  end
end
