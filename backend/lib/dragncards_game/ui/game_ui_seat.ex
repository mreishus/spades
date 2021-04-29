defmodule DragnCardsGame.GameUISeat do
  @moduledoc """
  Represents a seat at a table.
  The integers here are user ids.
  """

  alias DragnCardsGame.{GameUISeat}

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
  @spec leave(GameUISeat.t()) :: GameUISeat.t()
  def leave(%GameUISeat{} = seat) do
    %GameUISeat{
      seat
      | sitting: nil,
        recently_sitting: seat.sitting,
        when_left_seat: DateTime.utc_now()
    }
  end

  @spec bot_sit_if_empty(GameUISeat.t()) :: GameUISeat.t()
  def bot_sit_if_empty(%GameUISeat{} = seat) do
    if seat_empty?(seat) do
      %GameUISeat{seat | sitting: :bot}
    else
      seat
    end
  end

  @spec bot_leave_if_sitting(GameUISeat.t()) :: GameUISeat.t()
  def bot_leave_if_sitting(%GameUISeat{} = seat) do
    if is_bot?(seat), do: leave(seat), else: seat
  end

  @spec seat_empty?(GameUISeat.t()) :: boolean
  def seat_empty?(%GameUISeat{} = seat) do
    seat.sitting == nil
  end

  @spec is_bot?(GameUISeat.t()) :: boolean
  def is_bot?(%GameUISeat{} = seat) do
    seat.sitting == :bot
  end
end
