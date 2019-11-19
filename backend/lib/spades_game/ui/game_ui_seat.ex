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
          sitting: nil | integer | :bot,
          recently_sitting: nil | integer | :bot,
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

  # XXX TODO Not used everywhere, should be.
  def leave(%GameUISeat{} = seat) do
    %GameUISeat{
      seat
      | sitting: nil,
        recently_sitting: seat.sitting,
        when_left_seat: DateTime.utc_now()
    }
  end

  def bot_sit_if_empty(%GameUISeat{} = seat) do
    if seat_empty?(seat) do
      %GameUISeat{seat | sitting: :bot}
    else
      seat
    end
  end

  def bot_leave_if_sitting(%GameUISeat{} = seat) do
    if is_bot?(seat), do: leave(seat), else: seat
  end

  def seat_empty?(%GameUISeat{} = seat) do
    seat.sitting == nil
  end

  def is_bot?(%GameUISeat{} = seat) do
    seat.sitting == :bot
  end
end
