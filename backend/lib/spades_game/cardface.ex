import Ecto

defmodule SpadesGame.CardFace do
  @moduledoc """
  Represents a playing card.
  """
  alias SpadesGame.{CardFace}

  @type t :: Map.t()

  @spec convert_to_integer(String.t()) :: number
  def convert_to_integer(my_string) do
    result = Integer.parse(my_string)
    case result do
      {number, _} -> number
      :error -> nil
    end
  end

  @spec cardface_from_cardrowside(Map.t()) :: Map.t()
  def cardface_from_cardrowside(card_row_side) do
    IO.puts("cardface")
    IO.inspect(card_row_side)
    IO.inspect(convert_to_integer(card_row_side["cost"]))
    type = card_row_side["type"]
    width = if(type=="Quest" || type=="Side Quest", do: 1.39, else: 1.0)
    height = if(type=="Quest" || type=="Side Quest", do: 1.0, else: 1.39)
    %{
      "width"=> width,
      "height"=> height,
      "attack" => convert_to_integer(card_row_side["attack"]),
      "cost" => convert_to_integer(card_row_side["cost"]),
      "defense" => convert_to_integer(card_row_side["defense"]),
      "engagementCost" => convert_to_integer(card_row_side["engagementcost"]),
      "hitPoints" => convert_to_integer(card_row_side["hitpoints"]),
      "keywords" => card_row_side["keywords"],
      "name" => card_row_side["name"],
      "printName" => card_row_side["printname"],
      "questPoints" => convert_to_integer(card_row_side["questpoints"]),
      "shadow" => card_row_side["shadow"],
      "sphere" => card_row_side["sphere"],
      "text" => card_row_side["text"],
      "threat" => convert_to_integer(card_row_side["threat"]),
      "traits" => card_row_side["traits"],
      "type" => card_row_side["type"],
      "unique" => card_row_side["unique"],
      "victoryPoints" => convert_to_integer(card_row_side["victorypoints"]),
      "willpower" => convert_to_integer(card_row_side["willpower"]),
    }
  end
end
