defmodule SpadesGame.GameOptions do
  @moduledoc """
  Represents selected options while creating a game.
  """
  use Ecto.Schema
  import Ecto.Changeset
  alias SpadesGame.GameOptions

  @type t :: %__MODULE__{
          hardcoded_cards: boolean
        }

  @derive {Jason.Encoder, only: [:hardcoded_cards]}
  schema "gameuioptions" do
    field(:hardcoded_cards, :boolean)
  end

  def changeset(base, params \\ %{}) do
    base
    |> cast(params, [:hardcoded_cards])

    # |> validate_required([:vs])
    # |> validate_inclusion(:vs, ~w(human computer))
  end

  @doc """
  Use ecto w/o DB to validate incoming game options
  Input: %{"vs" => "computer", ... other options ... }
  OUTPUT: {:ok, %GameOptions{}}
  """
  def validate(params) do
    %GameOptions{}
    |> GameOptions.changeset(params)
    |> Ecto.Changeset.apply_action(:insert)
  end
end
