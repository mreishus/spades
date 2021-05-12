import Ecto

defmodule DragnCardsGame.CardFace do
  @moduledoc """
  Represents a playing card.
  """
  alias DragnCardsGame.{CardFace}

  @type t :: Map.t()

  @spec convert_to_integer(String.t()) :: number
  def convert_to_integer(my_string) do
    result = Integer.parse(my_string)
    case result do
      {number, _} -> number
      :error -> 0
    end
  end

  @spec trigger_steps_from_text(String.t(), String.t()) :: List.t()
  def trigger_steps_from_text(keywords, text) do
    steps = []
    steps = if String.match?(text, ~r/at the beginning of the round/i) do steps ++ ["0.0"] else steps end
    steps = if String.match?(text, ~r/at the beginning of the resource phase/i) do steps ++ ["1.1"] else steps end
    steps = if String.match?(text, ~r/at the beginning of the planning phase/i) do steps ++ ["2.1"] else steps end
    steps = if String.match?(text, ~r/at the beginning of the quest phase/i) do steps ++ ["3.1"] else steps end
    steps = if String.match?(text, ~r/at the beginning of the staging step/i) do steps ++ ["3.3"] else steps end
    steps = if String.match?(text, ~r/at the beginning of the travel phase/i) do steps ++ ["4.1"] else steps end
    steps = if String.match?(text, ~r/at the beginning of the encounter phase/i) do steps ++ ["5.1"] else steps end
    steps = if String.match?(text, ~r/at the beginning of the combat phase/i) do steps ++ ["6.1"] else steps end
    steps = if String.match?(text, ~r/at the beginning of the refresh phase/i) do steps ++ ["7.1"] else steps end

    steps = if String.match?(text, ~r/at the end of the round/i) do steps ++ ["0.1"] else steps end
    steps = if String.match?(text, ~r/at the end of the resource phase/i) do steps ++ ["1.4"] else steps end
    steps = if String.match?(text, ~r/at the end of the planning phase/i) do steps ++ ["2.4"] else steps end
    steps = if String.match?(text, ~r/at the end of the quest phase/i) do steps ++ ["3.1"] else steps end
    steps = if String.match?(text, ~r/at the end of the staging step/i) do steps ++ ["3.3"] else steps end
    steps = if String.match?(text, ~r/at the end of the travel phase/i) do steps ++ ["4.3"] else steps end
    steps = if String.match?(text, ~r/at the end of the encounter phase/i) do steps ++ ["5.4"] else steps end
    steps = if String.match?(text, ~r/at the end of the combat phase/i) do steps ++ ["6.11"] else steps end
    steps = if String.match?(text, ~r/at the end of the refresh phase/i) do steps ++ ["7.3"] else steps end
    IO.inspect(text)
    IO.puts("steps")
    IO.inspect(steps)
    steps
  end

  @spec cardface_from_cardrowside(Map.t()) :: Map.t()
  def cardface_from_cardrowside(card_row_side) do
    IO.puts("card_face")
    IO.inspect(card_row_side["name"])
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
      "triggers" => trigger_steps_from_text(card_row_side["keywords"], card_row_side["text"])
    }
  end
end
