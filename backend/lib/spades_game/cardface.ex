import Ecto

defmodule SpadesGame.CardFace do
  @moduledoc """
  Represents a playing card.
  """
  alias SpadesGame.{CardFace}

  @type t :: Map.t()

  @spec cardface_from_cardrowside(Map.t()) :: Map.t()
  def cardface_from_cardrowside(card_row_side) do
    type = card_row_side["type"]
    width = if(type=="Quest" || type=="Side Quest", do: 1.39, else: 1.0)
    height = if(type=="Quest" || type=="Side Quest", do: 1.0, else: 1.39)
    %{
      "width"=> width,
      "height"=> height,
      "attack" => card_row_side["attack"],
      "cost" => card_row_side["cost"],
      "defense" => card_row_side["defense"],
      "engagementcost" => card_row_side["engagementcost"],
      "hitpoints" => card_row_side["hitpoints"],
      "keywords" => card_row_side["keywords"],
      "name" => card_row_side["name"],
      "printname" => card_row_side["printname"],
      "questpoints" => card_row_side["questpoints"],
      "shadow" => card_row_side["shadow"],
      "sphere" => card_row_side["sphere"],
      "text" => card_row_side["text"],
      "threat" => card_row_side["threat"],
      "traits" => card_row_side["traits"],
      "type" => card_row_side["type"],
      "unique" => card_row_side["unique"],
      "victorypoints" => card_row_side["victorypoints"],
      "willpower" => card_row_side["willpower"],
    }
  end
end
