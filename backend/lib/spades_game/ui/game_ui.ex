defmodule SpadesGame.GameUI do
  @moduledoc """
  One level on top of Game.
  """

  alias SpadesGame.{Game, GameOptions, GameUI, GameUISeat, Groups, Group, Stack, Card, User, Tokens}

  @type t :: Map.t()

  @spec new(String.t(), User.t(), GameOptions.t()) :: GameUI.t()
  def new(game_name, user, %GameOptions{} = options) do
    game = Game.new(options)
    IO.puts("game_ui new")
    #IO.inspect(game)

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

  def get_group_type(gameui,group_id) do
    group = gameui["game"]["groups"][group_id]
    if group do
      group["type"]
    else
      nil
    end
  end

  def get_stacks(gameui,group_id) do
    get_group(gameui,group_id)["stacks"]
  end

  def get_stack(gameui, group_id, stack_index) do
    stacks = get_stacks(gameui, group_id)
    if stacks do Enum.at(stacks, stack_index) else nil end
  end

  def get_cards(gameui, group_id, stack_index) do
    get_stack(gameui, group_id, stack_index)["cards"]
  end

  def get_card(gameui, group_id, stack_index, card_index) do
    cards = get_cards(gameui, group_id, stack_index)
    if cards do Enum.at(cards, card_index) else nil end
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
    new_value = if new_value < 0 && Enum.member?(["resource", "progress", "damage", "time"], token_type) do
      0
    else
      new_value
    end
    old_tokens = get_tokens(gameui, group_id, stack_index, card_index)
    new_tokens = put_in(old_tokens[token_type],new_value)
    update_tokens(gameui, group_id, stack_index, card_index, new_tokens)
  end

  # Modify the card based on where it's coming from and where it's going
  def card_group_change(gameui, card, orig_group_id, dest_group_id) do
    orig_group_type = get_group_type(gameui, orig_group_id)
    dest_group_type = get_group_type(gameui, dest_group_id)
    card = if dest_group_type != "play" do Map.put(card, "tokens", Tokens.new()) else card end
    card = if dest_group_type != "play" do Map.put(card, "exhausted", false) else card end
    card = if dest_group_type != "play" do Map.put(card, "rotation", 0) else card end
    card = if dest_group_type == "deck" do Map.put(card, "currentSide", "B") else card end
    card = if orig_group_type == "deck" and dest_group_type != "deck" do Map.put(card, "currentSide", "A") else card end
    card
  end


  def move_stack(gameui, orig_group_id, orig_stack_index, dest_group_id, dest_stack_index) do
    # Check if dest_stack_index is negative, indicating a move to the end of a group, and adjust index accordingly
    dest_stack_index = if dest_stack_index < 0 do Enum.count(GameUI.get_stacks(gameui, dest_group_id)) + 1 + dest_stack_index else dest_stack_index end
    old_orig_group = get_group(gameui, orig_group_id)
    old_orig_stacks = get_stacks(gameui, orig_group_id)
    old_stack = get_stack(gameui, orig_group_id, orig_stack_index)
    if old_stack do
        new_orig_stacks = List.delete_at(old_orig_stacks,orig_stack_index)
        new_orig_group = put_in(old_orig_group["stacks"],new_orig_stacks)
        old_dest_group =
          if orig_group_id == dest_group_id do
            new_orig_group
          else
            get_group(gameui,dest_group_id)
          end
        old_dest_stacks = old_dest_group["stacks"]
        old_cards = old_stack["cards"]
        new_cards = Enum.map(old_cards, fn card -> card_group_change(gameui, card, orig_group_id, dest_group_id) end)
        new_dest_stacks =
          # If stack leaving play, separate the stack
          if old_dest_group["type"] != "play" do
            stack_list_to_insert = Enum.map(new_cards, fn card -> Stack.stack_from_card(card) end)
            # Insert list of stacks into original destination stacks
            List.flatten(List.insert_at(old_dest_stacks,dest_stack_index,stack_list_to_insert))
          # Stack is either entering play or staying in play. Keep it in one piece
          else
            new_stack = put_in(old_stack["cards"],new_cards)
            List.insert_at(old_dest_stacks,dest_stack_index,new_stack)
          end
        new_dest_group = put_in(old_dest_group["stacks"], new_dest_stacks)
        gameui_orig_removed = update_group(gameui, orig_group_id, new_orig_group)
        update_group(gameui_orig_removed,dest_group_id,new_dest_group)
      else
        gameui
      end
  end

  def move_card(gameui, orig_group_id, orig_stack_index, orig_card_index, dest_group_id, dest_stack_index, dest_card_index, create_new_stack \\ true) do
    IO.puts("game_ui move_card")
    IO.inspect(create_new_stack)
    # Check if dest_stack_index is negative, indicating a move to the end of a group, and adjust index accordingly
    dest_stack_index = if dest_stack_index < 0 do Enum.count(GameUI.get_stacks(gameui, dest_group_id)) + 1 + dest_stack_index else dest_stack_index end
    if orig_group_id == dest_group_id and orig_stack_index == dest_stack_index and orig_card_index == dest_card_index do
      gameui
    else
      # Get old position info
      old_orig_stacks = get_stacks(gameui, orig_group_id)
      old_orig_stack = get_stack(gameui, orig_group_id, orig_stack_index)
      old_orig_cards = get_cards(gameui, orig_group_id, orig_stack_index)
      moving_card = get_card(gameui, orig_group_id, orig_stack_index, orig_card_index)
      moving_card = card_group_change(gameui, moving_card, orig_group_id, dest_group_id)
      #IO.inspect(moving_card)
      if !moving_card do
        gameui
      else
        # Delete card from old position
        new_orig_cards = List.delete_at(old_orig_cards, orig_card_index)
        new_orig_stack = put_in(old_orig_stack["cards"],new_orig_cards)
        new_orig_stacks = if Enum.count(new_orig_cards) == 0 do
          List.delete_at(old_orig_stacks, orig_stack_index)
        else
          List.replace_at(old_orig_stacks, orig_stack_index, new_orig_stack)
        end
        intermediate_gameui = update_stacks(gameui, orig_group_id, new_orig_stacks)

        # Add card to new position
        if create_new_stack do
          old_dest_stacks = get_stacks(intermediate_gameui, dest_group_id)
          IO.puts("inserting at")
          IO.inspect(dest_stack_index)
          new_dest_stacks = List.insert_at(old_dest_stacks, dest_stack_index, Stack.stack_from_card(moving_card))
          IO.inspect(dest_group_id)
          IO.inspect(new_dest_stacks)
          update_stacks(intermediate_gameui, dest_group_id, new_dest_stacks)
        else # Add to existing stack
          old_dest_cards = get_cards(intermediate_gameui, dest_group_id, dest_stack_index)
          new_dest_cards = List.insert_at(old_dest_cards, dest_card_index, moving_card)
          update_cards(intermediate_gameui, dest_group_id, dest_stack_index, new_dest_cards)
        end
      end
    end
  end

  def flip_card(gameui, group_id, stack_index, card_index) do
    old_card = get_card(gameui, group_id, stack_index, card_index)
    current_side = old_card["currentSide"]
    new_card = if current_side == "A" do
      put_in(old_card["currentSide"],"B")
    else
      put_in(old_card["currentSide"],"A")
    end
    update_card(gameui, group_id, stack_index, card_index, new_card)
  end

  def shuffle_group(gameui, group_id) do
    shuffled_stacks = get_stacks(gameui, group_id) |> Enum.shuffle
    update_stacks(gameui, group_id, shuffled_stacks)
  end

  def load_card(gameui, card_row, group_id, quantity) do
    #IO.puts("game_ui load_card a")
    #IO.inspect(card_row)

    stacks_to_add = for _ <- 1..quantity do
      card = Card.card_from_cardrow(card_row)
      card = card_group_change(gameui, card, group_id, group_id)
      Stack.stack_from_card(card)
    end
    old_stacks = get_stacks(gameui, group_id)
    new_stacks = old_stacks ++ stacks_to_add
    update_stacks(gameui, group_id, new_stacks)
  end

  def load_cards(gameui, load_list) do
    # IO.puts("before_load")
    # IO.inspect(gameui["game"]["groups"])
    gameui = Enum.reduce load_list, gameui, fn r, acc ->
      load_card(acc, r["cardRow"], r["groupID"], r["quantity"])
    end

    # Check if we should load the first quest card
    IO.puts("checking quest")
    IO.inspect(Enum.count(get_stacks(gameui,"gSharedQuestDeck")))
    IO.inspect(Enum.count(get_stacks(gameui,"gSharedMainQuest")))
    gameui = if Enum.count(get_stacks(gameui,"gSharedQuestDeck"))>0 && Enum.count(get_stacks(gameui,"gSharedMainQuest"))==0 do
      move_stack(gameui, "gSharedQuestDeck", 0, "gSharedMainQuest", 0)
    else
      gameui
    end

    # IO.puts("after_load")
    # IO.inspect(gameui["game"]["groups"])
    gameui
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
