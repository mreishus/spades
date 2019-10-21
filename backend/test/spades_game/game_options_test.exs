defmodule GameOptionsTest do
  use ExUnit.Case, async: true

  doctest SpadesGame.GameOptions
  alias SpadesGame.{GameOptions}

  describe "basic" do
    test "i can make blank options" do
      assert {:ok, options} = GameOptions.validate(%{})
      assert %GameOptions{} = options
    end

    test "i can make basic options" do
      assert {:ok, options} = GameOptions.validate(%{"hardcoded_cards" => true})
      assert %GameOptions{} = options
      assert options.hardcoded_cards
    end
  end
end
