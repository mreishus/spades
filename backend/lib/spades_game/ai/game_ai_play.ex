defmodule SpadesGame.GameAI.Play do
  @moduledoc """
  Functions for the AI figuring out what game to play.
  """
  alias SpadesGame.{Card, Deck, Game, TrickCard}
  # alias SpadesGame.{Card, Game}

  @spec play(Game.t()) :: Card.t()
  def play(%Game{turn: turn, trick: trick} = game) do
    {:ok, valid_cards} = Game.valid_cards(game, turn)

    info = %{
      hand: Game.hand(game, turn),
      valid_cards: valid_cards,
      trick: trick
    }

    # true -> raise "play: don't understand this trick"
    case length(trick) do
      0 -> play_pos1(info)
      1 -> play_pos2(info)
      2 -> play_pos3(info)
      3 -> play_pos4(info)
    end
  end

  @spec play_pos1(map) :: Card.t()
  def play_pos1(%{} = info) do
    # "playing pos1" |> IO.inspect()
    info.valid_cards |> Enum.random()
  end

  @spec play_pos2(map) :: Card.t()
  def play_pos2(%{} = info) do
    options = card_options(info.trick, info.valid_cards)
    # "playing pos2" |> IO.inspect()
    # [%SpadesGame.TrickCard{card: %SpadesGame.Card{rank: 14, suit: :d}, seat: :west}]
    # info.valid_cards |> Enum.random()
    [
      options.worst_winner,
      options.worst_loser,
      Enum.random(info.valid_cards)
    ]
    |> first_non_nil()
  end

  def first_non_nil(list) do
    list
    |> Enum.filter(fn x -> x != nil end)
    |> List.first()
  end

  @spec play_pos3(map) :: Card.t()
  def play_pos3(%{} = info) do
    options = card_options(info.trick, info.valid_cards)
    # "playing pos3" |> IO.inspect()
    # info |> IO.inspect()

    # Info Example
    # %{
    #   hand: [
    #     %SpadesGame.Card{rank: 12, suit: :s},
    #     %SpadesGame.Card{rank: 7, suit: :c},
    #     %SpadesGame.Card{rank: 2, suit: :s}
    #   ],
    #   trick: [
    #     %SpadesGame.TrickCard{
    #       card: %SpadesGame.Card{rank: 5, suit: :s},
    #       seat: :east
    #     },
    #     %SpadesGame.TrickCard{
    #       card: %SpadesGame.Card{rank: 3, suit: :s},
    #       seat: :north
    #     }
    #   ],
    #   valid_cards: [
    #     %SpadesGame.Card{rank: 12, suit: :s},
    #     %SpadesGame.Card{rank: 2, suit: :s}
    #   ]
    # }

    # Trick example 1
    # [
    #     %SpadesGame.TrickCard{card: %SpadesGame.Card{rank: 9, suit: :d}, seat: :north},
    #     %SpadesGame.TrickCard{card: %SpadesGame.Card{rank: 2, suit: :d}, seat: :west}
    # ]

    # Trick example 2
    # Ace was played first
    # [
    #     %SpadesGame.TrickCard{card: %SpadesGame.Card{rank: 2, suit: :c}, seat: :east},
    #     %SpadesGame.TrickCard{
    #           card: %SpadesGame.Card{rank: 14, suit: :c},
    #           seat: :north
    #         }
    # ]

    # info.trick |> IO.inspect()
    # info.valid_cards |> Enum.random()

    [
      options.worst_winner,
      options.worst_loser,
      Enum.random(info.valid_cards)
    ]
    |> first_non_nil()
  end

  @spec play_pos4(map) :: Card.t()
  def play_pos4(%{} = info) do
    # Pos 4: If my partner is winning, I don't have to win it unless they're going nil
    options = card_options(info.trick, info.valid_cards)
    # "playing pos4" |> IO.inspect()
    # info.valid_cards |> Enum.random()

    [
      options.worst_winner,
      options.worst_loser,
      Enum.random(info.valid_cards)
    ]
    |> first_non_nil()
  end

  @spec card_options(list(TrickCard.t()), Deck.t()) :: map
  def card_options([], _valid_cards) do
    %{
      worst_winner: nil,
      best_winner: nil,
      worst_loser: nil,
      best_loser: nil
    }
  end

  def card_options(trick, valid_cards) when length(trick) > 0 do
    priority_map = priority_map(trick)
    trick_max = trick_max(trick)
    #   valid_cards: [
    #     %SpadesGame.Card{rank: 12, suit: :s},
    #     %SpadesGame.Card{rank: 2, suit: :s}
    #   ]
    sort_cards =
      valid_cards
      |> Enum.map(fn %Card{rank: rank, suit: suit} = card ->
        val = rank + priority_map[suit]
        {card, val}
      end)
      |> Enum.sort_by(fn {_card, val} -> val end)

    winners =
      sort_cards
      |> Enum.filter(fn {_card, val} -> val >= trick_max end)
      |> Enum.map(fn {card, _val} -> card end)

    losers =
      sort_cards
      |> Enum.filter(fn {_card, val} -> val < trick_max end)
      |> Enum.map(fn {card, _val} -> card end)

    %{
      worst_winner: List.first(winners),
      best_winner: List.last(winners),
      worst_loser: List.first(losers),
      best_loser: List.last(losers)
    }
  end

  # trick_max/1
  # Given a trick with at least one card, what's the current value of the winner?
  # value = rank + suit priority
  @spec trick_max(list(TrickCard.t())) :: non_neg_integer
  def trick_max(trick) when length(trick) > 0 do
    priority_map = priority_map(trick)

    trick
    |> Enum.map(fn %TrickCard{card: %Card{rank: rank, suit: suit}} ->
      rank + priority_map[suit]
    end)
    |> Enum.max()
  end

  def trick_max([]), do: 0

  # priority_map/1
  # Given a trick, what is the priority of each suit?
  # This is the mechanism we use to track following suit, 
  # ruffing and trumping.  See game.ex.
  @spec priority_map(list(TrickCard.t())) :: map
  def priority_map(trick) when length(trick) > 0 do
    List.last(trick).card.suit
    |> Game.suit_priority()
  end

  def priority_map([]) do
    %{s: 100, h: 100, c: 100, d: 100}
  end

  # @spec play2(list(TrickCard.t()), Deck.t(), Deck.t()) :: Card.t()
  # def play2(_trick, valid_cards, _hand) do
  #   valid_cards |> Enum.random()
  # end

  # First card = last in list by convention
  # game.trick: list(TrickCard.t()),
  # @type t :: %TrickCard{card: Card.t(), seat: :north | :east | :west | :south}
end
