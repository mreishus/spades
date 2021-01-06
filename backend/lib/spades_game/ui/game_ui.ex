defmodule SpadesGame.GameUI do
  @moduledoc """
  One level on top of Game.
  """

  alias SpadesGame.{Game, GameOptions, GameUI, GameUISeat, Groups, Group, Stack, Card, User}

  @type t :: Map.t()

  @spec new(String.t(), User.t(), GameOptions.t()) :: GameUI.t()
  def new(game_name, user, %GameOptions{} = options) do
    game = Game.new(options)
    IO.puts("gameui new")
    IO.inspect(game)

    %{
      "game"=> game,
      "game_name"=> game_name,
      "options"=> options,
      "created_at"=> DateTime.utc_now(),
      "created_by"=> user,
      "seats"=> %{
        "player1"=> GameUISeat.new_blank(),
        "player2"=> GameUISeat.new_blank(),
        "player3"=> GameUISeat.new_blank(),
        "player4"=> GameUISeat.new_blank()
      },
      "player1"=> nil,
      "player2"=> nil,
      "player3"=> nil,
      "player4"=> nil,
    }
  end

  def get_group(gameui,group_id) do
    gameui["game"]["groups"][group_id]
  end

  def get_stacks(gameui,group_id) do
    get_group(gameui,group_id)["stacks"]
  end

  def get_stack(gameui, group_id, stack_index) do
    stacks = get_stacks(gameui, group_id)
    Enum.at(stacks, stack_index)
  end

  def get_cards(gameui, group_id, stack_index) do
    get_stack(gameui, group_id, stack_index)["cards"]
  end

  def get_card(gameui, group_id, stack_index, card_index) do
    cards = get_cards(gameui, group_id, stack_index)
    Enum.at(cards, card_index)
  end

  def get_tokens(gameui, group_id, stack_index, card_index) do
    get_card(gameui, group_id, stack_index, card_index)["tokens"]
  end

  def get_token(gameui, group_id, stack_index, card_index, token_type) do
    get_tokens(gameui, group_id, stack_index, card_index)[token_type]
  end

  def update_group(gameui, group_id, new_group) do
    put_in(gameui["game"]["groups"][group_id], new_group)
  end

  def update_stacks(gameui, group_id, new_stacks) do
    old_group = get_group(gameui,group_id)
    new_group = put_in(old_group["stacks"], new_stacks)
    update_group(gameui, group_id, new_group)
  end

  def update_stack(gameui, group_id, stack_index, new_stack) do
    old_stacks = get_stacks(gameui, group_id)
    new_stacks = List.replace_at(old_stacks, stack_index, new_stack)
    update_stacks(gameui, group_id, new_stacks)
  end

  def update_cards(gameui, group_id, stack_index, new_cards) do
    old_stack = get_stack(gameui, group_id, stack_index)
    new_stack = put_in(old_stack["cards"], new_cards)
    update_stack(gameui, group_id, stack_index, new_stack)
  end

  def update_card(gameui, group_id, stack_index, card_index, new_card) do
    old_cards = get_cards(gameui, group_id, stack_index)
    new_cards = List.replace_at(old_cards,card_index,new_card)
    update_cards(gameui, group_id, stack_index, new_cards)
  end

  def update_tokens(gameui, group_id, stack_index, card_index, new_tokens) do
    old_card = get_card(gameui, group_id, stack_index, card_index)
    new_card = put_in(old_card["tokens"],new_tokens)
    update_card(gameui, group_id, stack_index, card_index, new_card)
  end

  def update_token(gameui, group_id, stack_index, card_index, token_type, new_value) do
    old_tokens = get_tokens(gameui, group_id, stack_index, card_index)
    new_tokens = put_in(old_tokens[token_type],new_value)
    update_tokens(gameui, group_id, stack_index, card_index, new_tokens)
  end


  # # @doc """
  # # censor_hands/1: Return a version of GameUI with all hands hidden.
  # # """
  # # @spec censor_hands(GameUI.t()) :: GameUI.t()
  # # def censor_hands(gameui) do
  # #   gameui
  # #   |> put_in([:game, :player1, :hand], [])
  # #   |> put_in([:game, :player2, :hand], [])
  # #   |> put_in([:game, :player3, :hand], [])
  # #   |> put_in([:game, :player4, :hand], [])
  # # end


  # # @doc """
  # # user_id_to_seat/2: Which seat is this user sitting in?
  # # If :bot, check if the active turn seat belongs to a bot, return that seat if so.
  # # """
  # # @spec user_id_to_seat(GameUI.t(), number | :bot) :: nil | :west | :east | :north | :south
  # # def user_id_to_seat(%GameUI{game: %Game{turn: turn}} = game_ui, :bot) do
  # #   if bot_turn?(game_ui), do: turn, else: nil
  # # end

  # def user_id_to_seat(game_ui, user_id) do
  #   game_ui.seats
  #   |> Map.new(fn {k, %GameUISeat{} = v} -> {v.sitting, k} end)
  #   |> Map.delete(nil)
  #   |> Map.get(user_id)
  # end

  # @doc """
  # sit/3: User is attempting to sit in a seat.
  # Let them do it if vno one is in the seat, and they are not
  # in any other seats.  Otherwise return the game unchanged.
  # --> sit(gameui, userid, which_seat)
  # """
  # @spec sit(GameUI.t(), integer, String.t()) :: GameUI.t()
  # def sit(gameui, userid, "player1"), do: do_sit(gameui, userid, :player1)
  # def sit(gameui, userid, "player2"), do: do_sit(gameui, userid, :player2)
  # def sit(gameui, userid, "player3"), do: do_sit(gameui, userid, :player3)
  # def sit(gameui, userid, "player4"), do: do_sit(gameui, userid, :player4)
  # def sit(gameui, _userid, _), do: gameui

  # @spec do_sit(GameUI.t(), integer, :player1 | :player2 | :player3 | :player4) :: GameUI.t()
  # defp do_sit(gameui, userid, which) do
  #   if sit_allowed?(gameui, userid, which) do
  #     seat = gameui.seats[which] |> GameUISeat.sit(userid)
  #     seats = gameui.seats |> Map.put(which, seat)

  #     %GameUI{gameui | seats: seats}
  #   else
  #     gameui
  #   end
  # end

  # # Is this user allowed to sit in this seat?
  # @spec sit_allowed?(GameUI.t(), integer, :player1 | :player2 | :player3 | :player4) :: boolean
  # defp sit_allowed?(gameui, userid, which) do
  #   !already_sitting?(gameui, userid) && seat_empty?(gameui, which)
  # end

  # # Is this user sitting in a seat?
  # @spec seat_empty?(GameUI.t(), integer) :: boolean
  # defp already_sitting?(gameui, userid) do
  #   gameui.seats
  #   |> Map.values()
  #   |> Enum.map(fn %GameUISeat{} = seat -> seat.sitting end)
  #   |> Enum.member?(userid)
  # end

  # # Is this seat empty?
  # @spec seat_empty?(GameUI.t(), :player1 | :player2 | :player3 | :player4) :: boolean
  # defp seat_empty?(gameui, which), do: gameui.seats[which].sitting == nil

  @doc """
  leave/2: Userid just left the table.  For now, we do nothing.
  """
  @spec leave(GameUI.t(), integer) :: GameUI.t()
  def leave(gameui, userid) do
    gameui
  end

  # @doc """
  # check_full_seats/1
  # When the last person sits down and all of the seats are full, put a timestamp
  # on ".when_seats_full".
  # If there is a timestamp set, and someone just stood up, clear the timestamp.
  # """
  # @spec check_full_seats(GameUI.t()) :: GameUI.t()
  # def check_full_seats(%GameUI{} = gameui) do
  #   cond do
  #     everyone_sitting?(gameui) and gameui.when_seats_full == nil ->
  #       %{gameui | when_seats_full: DateTime.utc_now()}

  #     not everyone_sitting?(gameui) and gameui.when_seats_full != nil ->
  #       %{gameui | when_seats_full: nil}

  #     true ->
  #       gameui
  #   end
  # end

  # @doc """
  # check_game/1:
  # Run the series of checks on the Game object.
  # Similar to GameUI's checks(), but running on the embedded
  # game_ui.game object/level instead.
  # """
  # @spec check_game(GameUI.t()) :: GameUI.t()
  # def check_game(%GameUI{} = game_ui) do
  #   {:ok, game} = Game.checks(game_ui.game)
  #   %GameUI{game_ui | game: game}
  # end

  # @doc """
  # everyone_sitting?/1:
  # Does each seat have a person sitting in it?
  # """
  # @spec everyone_sitting?(GameUI.t()) :: boolean
  # def everyone_sitting?(gameui) do
  #   [:player1, :player2, :player3, :player4]
  #   |> Enum.reduce(true, fn seat, acc ->
  #     acc and gameui.seats[seat].sitting != nil
  #   end)
  # end

  # @doc """
  # trick_full?/1:
  # Does the game's current trick have one card for each player?
  # """
  # @spec trick_full?(GameUI.t()) :: boolean
  # def trick_full?(game_ui) do
  #   Game.trick_full?(game_ui.game)
  # end

  # @spec rewind_trickfull_devtest(GameUI.t()) :: GameUI.t()
  # def rewind_trickfull_devtest(game_ui) do
  #   %GameUI{game_ui | game: Game.rewind_trickfull_devtest(game_ui.game)}
  # end

  # @doc """
  # invite_bots/1: Invite bots to sit on the remaining seats.
  # """
  # @spec invite_bots(GameUI.t()) :: GameUI.t()
  # def invite_bots(game_ui) do
  #   game_ui
  #   |> map_seats(fn seat ->
  #     GameUISeat.bot_sit_if_empty(seat)
  #   end)
  # end

  # @doc """
  # bots_leave/1: Bots have left the table (server terminated).
  # """
  # @spec bots_leave(GameUI.t()) :: GameUI.t()
  # def bots_leave(game_ui) do
  #   game_ui
  #   |> map_seats(fn seat ->
  #     GameUISeat.bot_leave_if_sitting(seat)
  #   end)
  # end

  # @doc """
  # map_seats/2: Apply a 1 arity function to all seats
  # should probably only be used internally
  # """
  # @spec map_seats(GameUI.t(), (GameUISeat.t() -> GameUISeat.t())) :: GameUI.t()
  # def map_seats(game_ui, f) do
  #   seats =
  #     game_ui.seats
  #     |> Enum.map(fn {where, seat} -> {where, f.(seat)} end)
  #     |> Enum.into(%{})

  #   %GameUI{game_ui | seats: seats}
  # end

  # @doc """
  # bot_turn?/1 : Is it currently a bot's turn?
  # """
  # # @spec bot_turn?(GameUI.t()) :: boolean
  # # def bot_turn?(%GameUI{game: %Game{winner: winner}}) when winner != nil, do: false
  # # def bot_turn?(%GameUI{game: %Game{turn: nil}}), do: false

  # # def bot_turn?(%GameUI{game: %Game{turn: turn}, seats: seats}) do
  # #   seats
  # #   |> Map.get(turn)
  # #   |> GameUISeat.is_bot?()
  # # end
end
