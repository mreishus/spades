import Ecto

defmodule SpadesGame.CardFace do
  @moduledoc """
  Represents a playing card.
  """
  alias SpadesGame.{CardFace}

  @type t :: Map.t()

  @spec player_back() :: Map.t()
  def player_back() do
    %{"name"=>"Player Card",
      "width"=> 1,
      "height"=> 1.39,
      "src"=> "https://raw.githubusercontent.com/seastan/Lord-of-the-Rings/master/o8g/cards/card.jpg",
    }
  end
  @spec encounter_back() :: Map.t()
  def encounter_back() do
    %{"name"=>"Encounter Card",
      "width"=> 1,
      "height"=> 1.39,
      "src"=> "https://raw.githubusercontent.com/seastan/Lord-of-the-Rings/master/o8g/cards/encounter.jpg",
    }
  end
  @spec test1() :: Map.t()
  def test1() do
    %{"name"=>"Elrond",
      "width"=> 1,
      "height"=> 1.39,
      "src"=> "https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Shadow-and-Flame/Elrond.jpg",
    }
  end
  @spec test2() :: Map.t()
  def test2() do
    %{"name"=>"Vilya",
      "width"=> 1,
      "height"=> 1.39,
      "src"=> "https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Shadow-and-Flame/Vilya.jpg",
    }
  end
  @spec test3() :: Map.t()
  def test3() do
    %{"name"=>"Miruvor",
      "width"=> 1,
      "height"=> 1.39,
      "src"=> "https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Shadow-and-Flame/Miruvor.jpg",
    }
  end
  @spec test_quest_A() :: Map.t()
  def test_quest_A() do
    %{"name"=>"Flies and Spiders",
      "width"=> 1.39,
      "height"=> 1,
      "src"=> "https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Flies-and-Spiders-1A.jpg",
    }
  end
  @spec test_quest_B() :: Map.t()
  def test_quest_B() do
    %{"name"=>"Flies and Spiders",
      "width"=> 1.39,
      "height"=> 1,
      "src"=> "https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Flies-and-Spiders-1B.jpg",
    }
  end

end
