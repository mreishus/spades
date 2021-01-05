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
      "sides"=> %{
        "A"=>CardFace.test_quest_A(),
        "B"=>CardFace.test_quest_B(),
      }
    }
  end

end
