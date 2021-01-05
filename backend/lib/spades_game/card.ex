import Ecto

defmodule SpadesGame.Card do
  @moduledoc """
  Represents a playing card.
  """
  alias SpadesGame.{Card,Tokens}

  @type t :: Map.t()

  @spec new_test1() :: Map.t()
  def new_test1() do
    %{"id"=> Ecto.UUID.generate,
      "rotation"=> 0,
      "width"=> 1,
      "height"=> 1.39,
      "exhausted"=> false,
      "src"=> "https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Shadow-and-Flame/Elrond.jpg",
      "srcBack"=> "",
      "deckType"=> "Player",
      "tokens"=>Tokens.new(),
    }
  end
  @spec new_test2() :: Map.t()
  def new_test2() do
    %{"id"=> Ecto.UUID.generate,
      "rotation"=> 0,
      "width"=> 1,
      "height"=> 1.39,
      "exhausted"=> false,
      "src"=> "https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Shadow-and-Flame/Vilya.jpg",
      "srcBack"=> "",
      "deckType"=> "Player",
      "tokens"=>Tokens.new(),
    }
  end
  @spec new_test2() :: Map.t()
  def new_test3() do
    %{"id"=> Ecto.UUID.generate,
      "rotation"=> 90,
      "width"=> 1,
      "height"=> 1.39,
      "exhausted"=> false,
      "src"=> "https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Shadow-and-Flame/Miruvor.jpg",
      "srcBack"=> "",
      "deckType"=> "Player",
      "tokens"=>Tokens.new(),
    }
  end
  @spec new_testq() :: Map.t()
  def new_testq() do
    %{"id"=> Ecto.UUID.generate,
      "rotation"=> 0,
      "width"=> 1.39,
      "height"=> 1,
      "exhausted"=> false,
      "src"=> "https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Flies-and-Spiders-1A.jpg",
      "srcBack"=> "https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Flies-and-Spiders-1B.jpg",
      "deckType"=> "Quest",
      "tokens"=>Tokens.new(),
    }
  end

end
