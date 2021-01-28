import Ecto

defmodule SpadesGame.Card do
  @moduledoc """
  Represents a playing card.
  """
  alias SpadesGame.{Card,CardFace,Tokens}

  @type t :: Map.t()

  @spec card_from_cardrow(Map.t()) :: Map.t()
  def card_from_cardrow(card_row) do
    %{"id"=> Ecto.UUID.generate,
      "rotation"=> 0,
      "exhausted"=> false,
      "tokens"=>Tokens.new(),
      "currentSide"=> "A",
      "owner"=> "Player1",
      "controller"=> "Player1",

      "cardbackoverride" => card_row["cardbackoverride"],
      "cardencounterset" => card_row["cardencounterset"],
      "cardid" => card_row["cardid"],
      "cardnumber" => card_row["cardnumber"],
      "cardquantity" => card_row["cardquantity"],
      "cardsetid" => card_row["cardsetid"],
      "discardgroupid" => card_row["discardgroupid"],

      "sides"=> %{
        "A"=>CardFace.cardface_from_cardrowside(card_row["sideA"]),
        "B"=>CardFace.cardface_from_cardrowside(card_row["sideB"]),
      }
    }
  end

end
