defmodule Spades.Users.User do
  @moduledoc """
  Represents a user of the system.
  Managed by the "pow" library.
  """
  use Ecto.Schema
  use Pow.Ecto.Schema

  schema "users" do
    pow_user_fields()

    timestamps()
  end
end
