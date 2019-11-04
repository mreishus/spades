defmodule SpadesGame.Game do
  @moduledoc """
  Represents a game of spades.
  In early stages of the app, it only represents a
  some toy game used to test everything around it.
  Right now, it's a simple draw pile and a discard pile.
  """
  alias SpadesGame.{Deck, Game, GamePlayer, GameOptions, Card}

  require Logger

  @derive Jason.Encoder
  defstruct [
    :game_name,
    :options,
    :dealer,
    :status,
    :turn,
    :draw,
    :discard,
    :west,
    :north,
    :east,
    :south,
    :trick,
    :spades_broken
  ]

  use Accessible

  @type t :: %Game{
          game_name: String.t(),
          options: GameOptions.t(),
          status: :bidding | :playing,
          dealer: :west | :north | :east | :south,
          turn: :west | :north | :east | :south,
          draw: Deck.t(),
          discard: Deck.t(),
          west: GamePlayer.t(),
          north: GamePlayer.t(),
          east: GamePlayer.t(),
          south: GamePlayer.t(),
          trick: list(),
          spades_broken: boolean
        }

  @doc """
  new/1:  Create a game with default options.
  """
  @spec new(String.t()) :: Game.t()
  def new(game_name) do
    {:ok, options} = GameOptions.validate(%{})
    new(game_name, options)
  end

  @doc """
  new/2:  Create a game with specified options.
  """
  @spec new(String.t(), GameOptions.t()) :: Game.t()
  def new(game_name, %GameOptions{} = options) do
    [w, n, e, s] =
      get_initial_hands(options)
      |> Enum.map(fn d -> GamePlayer.new(d) end)

    %Game{
      game_name: game_name,
      options: options,
      status: :bidding,
      dealer: :north,
      turn: :east,
      draw: Deck.new_shuffled(),
      discard: Deck.new_empty(),
      west: w,
      north: n,
      east: e,
      south: s,
      trick: [],
      spades_broken: false
    }
  end

  # get_initial_hands/1: (options)
  # return an array of 4 hands to use when constructing the game.
  # uses hardcoded cards if specified by options
  @spec get_initial_hands(GameOptions.t()) :: list(Deck.t())
  defp get_initial_hands(%GameOptions{} = options) do
    case options.hardcoded_cards do
      true ->
        Deck.hardcoded_cards()

      _ ->
        Deck.new_shuffled() |> Enum.chunk_every(13)
    end
  end

  @spec bid(Game.t(), :west | :north | :east | :south, integer) ::
          {:ok, Game.t()} | {:error, String.t()}
  def bid(game, seat, bid_num) do
    {:ok, game}
    |> ensure_bidding()
    |> ensure_active_player(seat)
    |> set_bid(seat, bid_num)
    |> bid_advance()
  end

  @spec ensure_bidding({:ok, Game.t()} | {:error, String.t()}) ::
          {:ok, Game.t()} | {:error, String.t()}
  def ensure_bidding({:error, message}), do: {:error, message}
  def ensure_bidding({:ok, %Game{status: :playing}}), do: {:error, "Can't bid while playing"}
  def ensure_bidding({:ok, game}), do: {:ok, game}

  @spec set_bid(
          {:ok, Game.t()} | {:error, String.t()},
          :west | :north | :east | :south,
          nil | integer
        ) ::
          {:ok, Game.t()} | {:error, String.t()}
  def set_bid({:error, message}, _seat, _bid), do: {:error, message}

  def set_bid({:ok, game}, seat, bid) when is_nil(bid) or (bid >= 0 and bid <= 13) do
    player =
      Map.get(game, seat)
      |> GamePlayer.set_bid(bid)

    {:ok, Map.put(game, seat, player)}
  end

  # bid_advance/1: Used as the last step in a bid.
  # Advance the game turn, then move the status to playing
  # if everyone has bid.
  def bid_advance({:error, message}), do: {:error, message}

  def bid_advance({:ok, game}) do
    bids =
      [:west, :north, :east, :south]
      |> Enum.map(fn seat -> Map.get(game, seat).bid end)

    game = %Game{game | turn: rotate(game.turn)}

    if Enum.any?(bids, fn b -> b == nil end) do
      {:ok, game}
    else
      game = %Game{game | status: :playing}
      {:ok, game}
    end
  end

  # play/3: A player puts a card on the table. (Moves from hand to trick.)
  @spec play(Game.t(), :west | :north | :east | :south, Card.t()) ::
          {:ok, Game.t()} | {:error, String.t()}

  # Should I add these for pipelining?
  # def play({:ok, game}, seat, card), do: play(game, seat, card)
  # def play({:error, _message}, _seat, _card), do: raise("Can't play on an error tuple")

  def play(%Game{} = game, seat, %Card{} = card) do
    {:ok, game}
    |> ensure_playing()
    |> ensure_active_player(seat)
    |> remove_card_from_hand(seat, card)
    |> add_card_to_trick(seat, card)
    |> check_for_trick_winner_and_advance_turn()
  end

  @spec ensure_playing({:ok, Game.t()} | {:error, String.t()}) ::
          {:ok, Game.t()} | {:error, String.t()}
  def ensure_playing({:error, message}), do: {:error, message}
  def ensure_playing({:ok, %Game{status: :bidding}}), do: {:error, "Can't play while bidding"}
  def ensure_playing({:ok, game}), do: {:ok, game}

  # Ensure_active_player/2: Only continue if the seat is the player
  # whose turn it is.
  @spec ensure_active_player(
          {:ok, Game.t()} | {:error, String.t()},
          :west | :north | :east | :south
        ) ::
          {:ok, Game.t()} | {:error, String.t()}
  def ensure_active_player({:error, message}, _seat), do: {:error, message}

  def ensure_active_player({:ok, game}, seat) do
    if game.turn == seat do
      {:ok, game}
    else
      {:error, "Inactive player attempted to play a card or bid"}
    end
  end

  # Remove_card_from_hand/3: Take the card and remove it from the player's
  # hand.  Checks to see if the player actually has the card.
  @spec remove_card_from_hand(
          {:ok, Game.t()} | {:error, String.t()},
          :west | :north | :east | :south,
          Card.t()
        ) ::
          {:ok, Game.t()} | {:error, String.t()}
  def remove_card_from_hand({:error, message}, _seat, _card), do: {:error, message}

  def remove_card_from_hand({:ok, game}, seat, card) do
    player_tuple =
      Map.get(game, seat)
      |> GamePlayer.play(card)

    case player_tuple do
      {:ok, player, _card} ->
        {:ok, Map.put(game, seat, player)}

      {:error, _player} ->
        {:error, "Unable to remove card. Does that player have that card?"}
    end
  end

  # add_card_to_trick/3: Add the card specified to the current trick.
  # Or start a new trick if no trick is in progress.
  # Checks to ensure it's a valid play.
  @spec add_card_to_trick(
          {:ok, Game.t()} | {:error, String.t()},
          :west | :north | :east | :south,
          Card.t()
        ) ::
          {:ok, Game.t()} | {:error, String.t()}
  def add_card_to_trick({:error, message}, _seat, _card), do: {:error, message}

  def add_card_to_trick({:ok, game}, seat, card) do
    cond do
      length(game.trick) >= 4 ->
        {:error, "Too many cards in trick to add another"}

      Enum.empty?(game.trick) && !valid_lead_card?(game, card) ->
        {:error, "Tried to play a spade before they were broken"}

      !Enum.empty?(game.trick) && !followed_suit?(game, seat, card) ->
        {:error, "Player could follow suit but didn't"}

      true ->
        new_trick = [{card, seat} | game.trick]
        {:ok, %Game{game | trick: new_trick}}
    end
  end

  # followed_suit?/3 If the player in seat seat played this card, would
  # they be following the rule of "You have to follow the trick's suit if
  # possible?"
  @spec followed_suit?(Game.t(), :north | :east | :west | :south, Card.t()) :: boolean
  def followed_suit?(game, seat, card) do
    {first_card, _first_player} = List.last(game.trick)
    this_player = Map.get(game, seat)

    cond do
      card.suit == first_card.suit -> true
      not GamePlayer.has_suit?(this_player, first_card.suit) -> true
      true -> false
    end
  end

  # valid_lead_card?/2 Is this card eligible to begin a trick?
  @spec valid_lead_card?(Game.t(), Card.t()) :: boolean
  def valid_lead_card?(game, card) do
    # Invalid card: !game.spades_broken && card.suit == :s
    # Use DeMorgan's Law to invert
    game.spades_broken || card.suit != :s
  end

  @spec check_for_trick_winner_and_advance_turn({:ok, Game.t()} | {:error, String.t()}) ::
          {:ok, Game.t()} | {:error, String.t()}
  def check_for_trick_winner_and_advance_turn({:error, message}), do: {:error, message}

  def check_for_trick_winner_and_advance_turn({:ok, game}) do
    cond do
      length(game.trick) > 4 ->
        {:error, "Trick too large"}

      length(game.trick) == 4 ->
        # Compute trick winner
        {_card, seat} = trick_winner(game.trick)
        # Give them +1 tricks, clear the current trick, set the turn
        new_player = Map.get(game, seat) |> GamePlayer.won_trick()

        game =
          game
          |> break_spades_if_needed()
          |> Map.put(seat, new_player)
          |> Map.put(:turn, seat)
          |> Map.put(:trick, [])

        {:ok, game}

      length(game.trick) < 4 ->
        game = %Game{game | turn: rotate(game.turn)}
        {:ok, game}
    end
  end

  @spec break_spades_if_needed(Game.t()) :: Game.t()
  defp break_spades_if_needed(game) do
    if !game.spades_broken && has_spade?(game.trick) do
      %Game{game | spades_broken: true}
    else
      game
    end
  end

  @spec has_spade?(list({Card.t(), :north | :east | :west | :south})) :: boolean
  defp has_spade?(trick) do
    trick
    |> Enum.any?(fn {card, _player} -> card.suit == :s end)
  end

  # Clockwise rotation
  defp rotate(:north), do: :east
  defp rotate(:east), do: :south
  defp rotate(:south), do: :west
  defp rotate(:west), do: :north

  @spec trick_winner(list({Card.t(), :north | :east | :west | :south})) ::
          {Card.t(), :north | :east | :west | :south}
  def trick_winner(trick) when is_list(trick) do
    # First card = last in list by convention
    {first_card, _first_player} = List.last(trick)
    this_priority = suit_priority(first_card.suit)

    Enum.max_by(
      trick,
      fn {card, _seat} ->
        this_priority[card.suit] + card.rank
      end
    )
  end

  # Define the priorities of a suit in a trick, based on the first card's suit
  defp suit_priority(:s), do: %{s: 200, h: 0, c: 0, d: 0}
  defp suit_priority(:h), do: %{s: 200, h: 100, c: 0, d: 0}
  defp suit_priority(:c), do: %{s: 200, h: 0, c: 100, d: 0}
  defp suit_priority(:d), do: %{s: 200, h: 0, c: 0, d: 100}

  @doc """
  discard/1:  Move one card from the draw pile to the discard pile.
  """
  @spec discard(Game.t()) :: Game.t()
  def discard(%Game{draw: []} = game), do: game

  def discard(%Game{draw: draw, discard: discard} = game) do
    [top_card | new_draw] = draw
    %Game{game | draw: new_draw, discard: [top_card | discard]}
  end
end
