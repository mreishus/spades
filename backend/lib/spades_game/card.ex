import Ecto

defmodule SpadesGame.Card do
  @moduledoc """
  Represents a playing card.
  """
  alias SpadesGame.{Card,CardFace,Tokens}

  @type t :: Map.t()

  @spec new_test1() :: Map.t()
  def new_test1() do
    %{"id"=> Ecto.UUID.generate,
      "rotation"=> 0,
      "exhausted"=> false,
      "deckType"=> "Player",
      "tokens"=> Tokens.test(),
      "currentSide"=> "A",
      "owner"=> 1,
      "controller"=> 1,
      "sides"=> %{
        "A"=>CardFace.test1(),
        "B"=>CardFace.player_back(),
      }
    }
  end
  @spec new_test2() :: Map.t()
  def new_test2() do
    %{"id"=> Ecto.UUID.generate,
      "rotation"=> 0,
      "exhausted"=> false,
      "deckType"=> "Player",
      "tokens"=>Tokens.test(),
      "currentSide"=> "A",
      "owner"=> 1,
      "controller"=> 1,
      "sides"=> %{
        "A"=>CardFace.test2(),
        "B"=>CardFace.player_back(),
      }
    }
  end
  @spec new_test3() :: Map.t()
  def new_test3() do
    %{"id"=> Ecto.UUID.generate,
      "rotation"=> 90,
      "exhausted"=> false,
      "deckType"=> "Player",
      "tokens"=>Tokens.test(),
      "currentSide"=> "A",
      "owner"=> 1,
      "controller"=> 1,
      "sides"=> %{
        "A"=>CardFace.test3(),
        "B"=>CardFace.player_back(),
      }
    }
  end
  @spec new_testq() :: Map.t()
  def new_testq() do
    %{"id"=> Ecto.UUID.generate,
      "rotation"=> 0,
      "exhausted"=> false,
      "deckType"=> "Quest",
      "tokens"=>Tokens.test(),
      "currentSide"=> "A",
      "owner"=> 0,
      "controller"=> 0,
      "sides"=> %{
        "A"=>CardFace.test_quest_A(),
        "B"=>CardFace.test_quest_B(),
      }
    }
  end

  @spec card_from_cardrow(Map.t()) :: Map.t()
  def card_from_cardrow(card_row) do
    %{"id"=> Ecto.UUID.generate,
      "rotation"=> 0,
      "exhausted"=> false,
      "tokens"=>Tokens.test(),
      "currentSide"=> "A",
      "owner"=> "Player1",
      "controller"=> "Player1",

      "cardbackoverride" => card_row["cardbackoverride"],
      "cardencounterset" => card_row["cardencounterset"],
      "cardid" => card_row["cardid"],
      "cardnumber" => card_row["cardnumber"],
      "cardquantity" => card_row["cardquantity"],
      "cardsetid" => card_row["cardsetid"],

      "sides"=> %{
        "A"=>CardFace.cardface_from_cardrowside(card_row["sideA"]),
        "B"=>CardFace.cardface_from_cardrowside(card_row["sideB"]),
      }
    }
  end

end
