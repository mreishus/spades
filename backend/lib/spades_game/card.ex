import Ecto

defmodule SpadesGame.Card do
  @moduledoc """
  Represents a playing card.
  """
  alias SpadesGame.{Card,CardFace,Tokens}

  @type t :: Map.t()

  @spec card_from_cardrow(Map.t(), String.t()) :: Map.t()
  def card_from_cardrow(card_row, controller) do
    IO.puts("creating card controlled by #{controller}")
    %{
      "id" => Ecto.UUID.generate,
      "rotation" => 0,
      "exhausted" => false,
      "committed" => false,
      "tokens" =>Tokens.new(),
      "current_side" => "A",
      "owner" => controller,
      "controller" => controller,
      "peeking" => %{
        "Player1" => false,
        "Player2" => false,
        "Player3" => false,
        "Player4" => false
      },

      "cardbackoverride" => card_row["cardbackoverride"],
      "cardencounterset" => card_row["cardencounterset"],
      "cardid" => card_row["cardid"],
      "cardnumber" => String.to_integer(card_row["cardnumber"]),
      "cardquantity" => String.to_integer(card_row["cardquantity"]),
      "cardsetid" => card_row["cardsetid"],
      "cardpackname" => card_row["cardpackname"],

      "discardgroupid" => card_row["discardgroupid"],

      "sides"=> %{
        "A"=>CardFace.cardface_from_cardrowside(card_row["sides"]["A"]),
        "B"=>CardFace.cardface_from_cardrowside(card_row["sides"]["B"]),
      }
    }
  end

end
