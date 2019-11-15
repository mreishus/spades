defmodule SpadesGame.GameUISeat do
  @moduledoc """
  Represents a seat at a table.
  The integers here are user ids.
  """

  alias SpadesGame.{GameUISeat}

  @derive Jason.Encoder
  defstruct [:sitting, :recently_sitting, :when_left_seat]

  use Accessible

  @type t :: %GameUISeat{
          sitting: nil | integer,
          recently_sitting: nil | integer,
          when_left_seat: nil | DateTime.t()
        }

  @spec new_blank() :: GameUISeat.t()
  def new_blank() do
    %GameUISeat{
      sitting: nil,
      recently_sitting: nil,
      when_left_seat: nil
    }
  end

  def sit(%GameUISeat{} = seat, userid) do
    %GameUISeat{seat | sitting: userid}
  end
end
