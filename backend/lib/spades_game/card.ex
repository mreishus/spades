defmodule SpadesGame.Card do
  @moduledoc """
  Represents a playing card.
  """
  alias SpadesGame.{CardFace,Tokens}

  @type t :: Map.t()

  @spec card_from_cardrow(Map.t(), String.t()) :: Map.t()
  def card_from_cardrow(card_row, controller) do
    IO.puts("creating card controlled by #{controller}")
    %{
      "id" => Ecto.UUID.generate,
      "rotation" => 0,
      "exhausted" => false,
      "committed" => false,
      "currentSide" => "A",
      "owner" => controller,
      "controller" => controller,
      "peeking" => %{
        "player1" => false,
        "player2" => false,
        "player3" => false,
        "player4" => false,
      },
      "targeting" => %{
        "player1" => false,
        "player2" => false,
        "player3" => false,
        "player4" => false,
      },
      "tokens" => Tokens.new(),

      "cardBackOverride" => card_row["cardbackoverride"],
      "cardEncounterSet" => card_row["cardencounterset"],
      "cardDbId" => card_row["cardid"],
      "cardNumber" => String.to_integer(card_row["cardnumber"]),
      "cardQuantity" => String.to_integer(card_row["cardquantity"]),
      "cardSetId" => card_row["cardsetid"],
      "cardPackName" => card_row["cardpackname"],

      "loadGroupId" => card_row["loadgroupid"],
      "discardGroupId" => card_row["discardgroupid"],

      "sides"=> %{
        "A"=>CardFace.cardface_from_cardrowside(card_row["sides"]["A"]),
        "B"=>CardFace.cardface_from_cardrowside(card_row["sides"]["B"]),
      }
    }
  end

end
