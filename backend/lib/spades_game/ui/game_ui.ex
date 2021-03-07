defmodule SpadesGame.GameUI do
  @moduledoc """
  One level on top of Game.
  """

  alias SpadesGame.{Game, GameOptions, GameUI, GameUISeat, Groups, Group, Stack, Card, User, Tokens, CardFace, Player}

  @type t :: Map.t()

  @spec new(String.t(), User.t(), GameOptions.t()) :: GameUI.t()
  def new(game_name, user, %GameOptions{} = options) do
    game = Game.new(options)
    IO.puts("game_ui new")
    #IO.inspect(game)

    gameui = %{
      "game"=> game,
      "game_name"=> game_name,
      "options"=> options,
      "created_at"=> DateTime.utc_now(),
      "created_by"=> user,
      "playerIds" => %{
        "player1" => user,
        "player2" => nil,
        "player3" => nil,
        "player4" => nil,
      }
    }
    #IO.inspect(gameui)
    gameui
  end

  def get_group(gameui, group_id) do
    gameui["game"]["groupById"][group_id]
  end

  def get_group_controller(gameui, group_id) do
    gameui["game"]["groupById"][group_id]["controller"]
  end

  def get_group_type(gameui, group_id) do
    group = get_group(gameui, group_id)
    if group do group["type"] else nil end
  end

  def get_stack_ids(gameui, group_id) do
    get_group(gameui,group_id)["stackIds"]
  end

  def get_stack(gameui, stack_id) do
    gameui["game"]["stackById"][stack_id]
  end

  def get_card_ids(gameui, stack_id) do
    get_stack(gameui, stack_id)["cardIds"]
  end

  def get_card(gameui, card_id) do
    gameui["game"]["cardById"][card_id]
  end

  def get_tokens(gameui, tokens_id) do
    gameui["game"]["tokensById"][tokens_id]
  end

  def get_token(gameui, card_id, token_type) do
    get_tokens(gameui, card_id)[token_type]
  end

  def update_group(gameui, new_group) do
    put_in(gameui["game"]["groupById"][new_group["id"]], new_group)
  end

  def update_stack_ids(gameui, group_id, new_stack_ids) do
    put_in(gameui["game"]["groupById"][group_id]["stackIds"], new_stack_ids)
  end

  def update_stack(gameui, new_stack) do
    put_in(gameui["game"]["stackById"][new_stack["id"]], new_stack)
  end

  def update_card_ids(gameui, stack_id, new_stack_ids) do
    put_in(gameui["game"]["stackById"][stack_id]["stackIds"], new_stack_ids)
  end

  def update_card(gameui, new_card) do
    put_in(gameui["game"]["cardById"][new_card["id"]], new_card)
  end

  def update_tokens(gameui, new_tokens) do
    put_in(gameui["game"]["tokensById"][new_tokens["id"]], new_tokens)
  end

  def update_token(gameui, tokens_id, token_type, new_value) do
    put_in(gameui["game"]["tokensById"][tokens_id][token_type], new_value)
  end

  def get_group_by_stack_id(gameui, stack_id) do
    Enum.reduce(gameui["game"]["groupById"], [], fn({group_id, group}, acc) ->
      acc = if stack_id in group["stackIds"] do group else acc end
    end)
  end

  def get_group_by_card_id(gameui, card_id) do
    stack = get_stack_by_card_id(gameui, card_id)
    get_group_by_stack_id(gameui, stack["id"])
  end

  def get_stack_index_by_stack_id(gameui, stack_id) do
    group_id = get_group_by_stack_id(gameui, stack_id)["id"]
    stack_ids = get_stack_ids(gameui, group_id)
    Enum.find_index(stack_ids, fn id -> id == stack_id end)
  end

  def get_stack_by_card_id(gameui, card_id) do
    Enum.reduce(gameui["game"]["stackById"], [], fn({stack_id, stack}, acc) ->
      acc = if card_id in stack["cardIds"] do stack_id else acc end
    end)
  end

  def get_stack_by_index(gameui, group_id, stack_index) do
    stack_ids = gameui["game"]["groupById"][group_id]["stack_ids"]
    gameui["game"]["stackById"][Enum.at(stack_ids, stack_index)]
  end

  def get_card_index_by_card_id(gameui, card_id) do
    stack_id = get_stack_by_card_id(gameui, card_id)["id"]
    card_ids = get_card_ids(gameui, stack_id)
    Enum.find_index(card_ids, fn id -> id == card_id end)
  end

  def gsc(gameui, card) do
    stack_id = get_stack_by_card_id(gameui, card["id"])["id"]
    card_index = get_card_index_by_card_id(gameui, card["id"])
    stack_index = get_stack_index_by_stack_id(gameui, stack_id)
    group_id = get_group_by_stack_id(gameui, stack_id)["id"]
    {group_id, stack_index, card_index}
  end

  def get_card_by_gsc(gameui, gsc) do
    group = get_group(gameui, Enum.at(gsc,1))
    stack_ids = group["stackIds"]
    stack = get_stack(gameui, Enum.at(stack_ids, Enum.at(gsc,1)))
    card_ids = stack["cardIds"]
    get_card(gameui, Enum.at(card_ids,Enum.at(gsc,2)))
  end

  # Card action: must be in the form fn(gameui, card, args)
  def card_action(gameui, action, card, options) do
    case action do
      "increment_token" ->
        increment_token(gameui, card, options)
      "toggle_exhaust" ->
        toggle_exhaust(gameui, card, options)
      "flip_card" ->
        deal_shadow(gameui, card, options)
      "deal_shadow" ->
        deal_shadow(gameui, card, options)
      "detach" ->
        detach(gameui, card, options)
      _ ->
        gameui
    end
  end

  def increment_token(gameui, card, options) do
    token_type = Enum.at(options, 0)
    increment = Enum.at(options, 1)
    tokens_id = card["tokensId"]
    old_tokens = get_tokens(gameui, tokens_id)
    old_value = old_tokens[token_type]
    new_value = if old_value + increment < 0 && Enum.member?(["resource", "progress", "damage", "time"], token_type) do
      0
    else
      old_value + increment
    end
    update_token(gameui, tokens_id, token_type, new_value)
  end

  def toggle_exhaust(gameui, card, options \\ nil) do
    new_card = if card["exhausted"] do
      card = put_in(card["exhausted"], false)
      put_in(card["rotation"], 0)
    else
      card = put_in(card["exhausted"], true)
      put_in(card["rotation"], 90)
    end
    update_card(gameui, new_card)
  end

  def flip_card(gameui, card, options \\ nil) do
    current_side = card["currentSide"]
    new_card = if current_side == "A" do
      put_in(card["currentSide"],"B")
    else
      put_in(card["currentSide"],"A")
    end
    update_card(gameui, new_card)
  end

  def deal_shadow(gameui, card, options \\ nil) do
    {group_id, stack_index, card_index} = gsc(gameui, card)
    gameui
    # shadow_card = get_card(gameui, ["sharedEncounterDeck", 0, 0])
    # IO.puts("shadow_card")
    # if shadow_card do
    #   cards_size = Enum.count(GameUI.get_card_ids(gameui, stack_id, stack_index))
    #   gameui = move_card(gameui, "sharedEncounterDeck", 0, 0, group_id, stack_index, cards_size, false, true)
    #   rotated_shadow_card = put_in(shadow_card["rotation"], -30)
    #   update_card(gameui, rotated_shadow_card)
    # else
    #   gameui
    # end
  end

  def insert_new_stack(gameui, group_id, stack_index, stack) do
    old_stack_ids = get_stack_ids(gameui, group_id)
    new_stack_ids = List.insert_at(old_stack_ids, stack_index, stack["id"])
    gameui
    |> update_stack(stack)
    |> update_stack_ids(group_id, new_stack_ids)
  end

  def remove_from_stack(gameui, stack, card) do
    old_card_ids = get_stack_ids(gameui, stack["id"])
    card_index = get_card_index_by_card_id(gameui, card["id"])
    new_card_ids = List.delete_at(old_card_ids, card_index)
    update_card_ids(gameui, stack["id"], new_card_ids)
  end

  def add_to_stack(gameui, stack, card, card_index) do
    old_card_ids = get_stack_ids(gameui, stack["id"])
    new_card_ids = List.insert_at(old_card_ids, card_index, card["id"])
    update_card_ids(gameui, stack["id"], new_card_ids)
  end

  def move_card(gameui, card, options) do
    dest_group_id    = Enum.at(options, 0)
    dest_stack_index = Enum.at(options, 1)
    dest_card_index  = Enum.at(options, 2)
    create_new_stack = Enum.at(options, 3)
    preserve_state   = Enum.at(options, 4)
    # Get position of card
    {orig_group_id, orig_stack_index, orig_card_index} = gsc(gameui, card)
    # Get origin stack
    orig_stack = get_stack_by_index(gameui, orig_group_id, orig_stack_index)
    # Update the card if necessary (might be changing groups and need to flip/rotate)
    gameui = if preserve_state do card else card_group_change(gameui, card) end
    # Perpare destination stack
    gameui = if create_new_stack do
      new_stack = Stack.empty_stack()
      insert_new_stack(gameui, dest_group_id, dest_stack_index, new_stack)
    else
      gameui
    end
    # Get destination stack
    dest_stack = get_stack_by_index(gameui, dest_group_id, dest_stack_index)
    # Update gameui
    gameui
    |> remove_from_stack(orig_stack, card)
    |> add_to_stack(dest_stack, card, dest_card_index)
    |> card_group_change(card, preserve_state)
  end

  def detach(gameui, card, options \\ nil) do
    {group_id, stack_index, card_index} = gsc(gameui, card)
    move_card(gameui, card, [group_id, stack_index + 1, 0, true, true])
  end


  # def detach(gameui, card, options \\ nil) do
  #   stack_id = get_stack_id_by_card_id(gameui, card["id"])
  #   card_index = get_card_index_by_card_id(gameui, stack_id, card["id"])
  #   stack_index = get_stack_index_by_stack_id(gameui, stack_id)
  #   group_id = get_group_id_by_stack_id(gameui, stack_id)

  #   new_stack = Stack.new()
  #   old_stacks = get_stack_ids(gameui, group_id)
  #   old_stack = get_stack(gameui, group_id, stack_index)
  #   old_cards = get_card_ids(gameui, stack_id)
  #   old_card = get_card(gameui, gsc)

  #   # Delete old card
  #   new_cards = List.delete_at(old_cards, card_index)
  #   new_stack = put_in(old_stack["cards"], new_cards)
  #   new_stacks = List.replace_at(old_stacks, stack_index, new_stack)

  #   # Insert new card
  #   new_stacks = List.insert_at(new_stacks, stack_index+1, Stack.stack_from_card(old_card))

  #   # Put stacks into gameui
  #   update_stacks(gameui, group_id, new_stacks)
  # end

  @spec sit(GameUI.t(), integer, String.t()) :: GameUI.t()
  def sit(gameui, user_id, player_n) do
    put_in(gameui["playerIds"][player_n], user_id)
  end

  def reset_peeking(card) do
    Map.put(card, "peeking", %{
      "player1" => false,
      "player2" => false,
      "player3" => false,
      "player4" => false
    })
  end

  # Modify the card based on where it's coming from and where it's going
  def card_group_change(gameui, card, options \\ nil) do
    preserve_state = Enum.at(options, 0)
    gameui
    # get_group
    # orig_group_type = get_group_type(gameui, orig_group_id)
    # dest_group_type = get_group_type(gameui, dest_group_id)
    # card = if dest_group_type != "play" do Map.put(card, "tokens", Tokens.new()) else card end
    # card = if dest_group_type != "play" do Map.put(card, "exhausted", false) else card end
    # card = if dest_group_type != "play" do Map.put(card, "rotation", 0) else card end
    # card = if dest_group_type == "deck" do Map.put(card, "currentSide", "B") else card end
    # card = if orig_group_type == "deck" and dest_group_type != "deck" do
    #    flipped_card = Map.put(card, "currentSide", "A")
    #    reset_peeking(flipped_card)
    # else
    #   card
    # end
    # card
  end

  def peek_card(card, player_n, tf) do
    if card["currentSide"] == "B" do
      put_in(card["peeking"][player_n],tf)
    else
      card
    end
  end

  def peek_stack(stack, player_n, tf) do
    old_cards = stack["cards"]
    new_cards = Enum.map(old_cards, fn card -> peek_card(card, player_n, tf) end)
    put_in(stack["cards"], new_cards)
  end

  def peek_group(gameui, group_id, player_n, tf) do
    gameui
    # old_stacks = get_stack_ids(gameui, group_id)
    # new_stacks = Enum.map(old_stacks, fn stack -> peek_stack(stack, player_n, tf) end)
    # update_stacks(gameui, group_id, new_stacks)
  end

  def peek_group_stack_card(gameui, gsc, player_n, tf) do
    gameui
    # old_card = get_card(gameui, gsc)
    # if old_card do
    #   new_card = peek_card(old_card, player_n, tf)
    #   update_card(gameui, gsc, new_card)
    # else
    #   gameui
    # end
  end

  def peek_at(gameui, group_id, stack_indices, card_indices, player_n, reset_peek) do
    gameui
    # gameui = if reset_peek do peek_group(gameui, group_id, player_n, false) else gameui end
    # if (Enum.count(stack_indices) != Enum.count(card_indices)) do
    #   gameui
    # else
    #   num_indices = Enum.count(stack_indices)
    #   range_indices = 0..num_indices |> Enum.reverse() |> tl() |> Enum.reverse() # Extra logic to drop last element so range does not inclue n
    #   Enum.reduce range_indices, gameui, fn i, acc ->
    #     stack_index = Enum.at(stack_indices, i)
    #     card_index = Enum.at(card_indices, i)
    #     peek_group_stack_card(acc, [group_id, stack_index, card_index], player_n, true)
    #   end
    # end
  end


  # def flatten_group(group) do
  #   Enum.reduce(Enum.with_index(group["stacks"]), [], fn({stack, index}, acc) ->
  #     cards = index_list_of_maps(stack["cards"],"card_index")
  #     cards = Enum.map(cards, fn(c) -> Map.merge(c, %{"stack_index" => index, "group_id" => group["id"]}) end)
  #     acc ++ cards
  #   end)
  # end

  def move_stack(gameui, stack_id, dest_group_id, dest_stack_index, combine \\ false, preserve_state \\ false) do
    orig_group_id = get_group_by_stack_id(gameui, stack_id)["id"]
    orig_stack_index = get_stack_index_by_stack_id(gameui, stack_id)
    # If destination is negative, count backward from the end
    dest_stack_index = if dest_stack_index < 0 do Enum.count(GameUI.get_stack_ids(gameui, dest_group_id)) + 1 + dest_stack_index else dest_stack_index end
    # Delete from old position
    old_orig_stack_ids = get_stack_ids(gameui, orig_group_id)
    stack_id = old_orig_stack_ids[orig_stack_index]
    new_orig_stack_ids = List.delete_at(old_orig_stack_ids, orig_stack_index)
    gameui = update_stack_ids(gameui, orig_group_id, new_orig_stack_ids)
    # Add to new position
    old_dest_stack_ids = get_stack_ids(gameui, dest_group_id)
    new_dest_stack_ids = List.insert_at(old_dest_stack_ids, dest_stack_index, stack_id)
    gameui = update_stack_ids(gameui, dest_group_id, new_dest_stack_ids)
    # Update gameui
    gameui
    |> update_stack_ids(orig_group_id, new_orig_stack_ids)
    |> update_stack_ids(dest_group_id, new_dest_stack_ids)
    #|> set_viewership(stack_id)
  end

  # def move_stack(gameui, orig_group_id, orig_stack_index, dest_group_id, dest_stack_index, preserve_state \\ false) do
  #   # Check if dest_stack_index is negative, indicating a move to the end of a group, and adjust index accordingly
  #   dest_stack_index = if dest_stack_index < 0 do Enum.count(GameUI.get_stack_ids(gameui, dest_group_id)) + 1 + dest_stack_index else dest_stack_index end
  #   old_orig_group = get_group(gameui, orig_group_id)
  #   old_orig_stacks = get_stack_ids(gameui, orig_group_id)
  #   old_stack = get_stack(gameui, orig_group_id, orig_stack_index)
  #   if old_stack do
  #     new_orig_stacks = List.delete_at(old_orig_stacks,orig_stack_index)
  #     new_orig_group = put_in(old_orig_group["stacks"],new_orig_stacks)
  #     old_dest_group =
  #       if orig_group_id == dest_group_id do
  #         new_orig_group
  #       else
  #         get_group(gameui,dest_group_id)
  #       end
  #     old_dest_stacks = old_dest_group["stacks"]
  #     old_cards = old_stack["cards"]

  #     new_dest_stacks =
  #       # If told to preserve the state of the stack, just move it over
  #       if preserve_state do
  #         List.insert_at(old_dest_stacks,dest_stack_index,old_stack)
  #       # Otherwise, process the movement of the stack to a different kind of group
  #       else
  #         new_cards = Enum.map(old_cards, fn card -> card_group_change(gameui, card, orig_group_id, dest_group_id) end)
  #         # If stack leaving play, separate the stack
  #         if old_dest_group["type"] != "play" do
  #           stack_list_to_insert = Enum.map(new_cards, fn card -> Stack.stack_from_card(card) end)
  #           # Insert list of stacks into original destination stacks
  #           List.flatten(List.insert_at(old_dest_stacks,dest_stack_index,stack_list_to_insert))
  #         # Stack is either entering play or staying in play. Keep it in one piece
  #         else
  #           new_stack = put_in(old_stack["cards"],new_cards)
  #           List.insert_at(old_dest_stacks,dest_stack_index,new_stack)
  #         end
  #       end
  #     new_dest_group = put_in(old_dest_group["stacks"], new_dest_stacks)
  #     gameui_orig_removed = update_group(gameui, orig_group_id, new_orig_group)
  #     update_group(gameui_orig_removed,dest_group_id,new_dest_group)
  #   else
  #     gameui
  #   end
  # end

  # def move_stacks(gameui, orig_group_id, dest_group_id, position) do
  #   orig_stacks = get_stack_ids(gameui, orig_group_id)
  #   # gameui = update_stacks(gameui, orig_group_id, [])
  #   # Moving stacks to the top or the bottom of the new group?
  #   dest_stack_index = if position == "b" do -1 else 0 end
  #   # Move stacks 1 at a time
  #   gameui = Enum.reduce orig_stacks, gameui, fn s, acc ->
  #     move_stack(acc, orig_group_id, 0, dest_group_id, dest_stack_index)
  #   end
  #   # Do we shuffle it in?
  #   if position == "s" do shuffle_group(gameui, dest_group_id) else gameui end
  # end

  # def move_card(gameui, orig_group_id, orig_stack_index, orig_card_index, dest_group_id, dest_stack_index, dest_card_index, create_new_stack \\ true, preserve_state \\ false) do
  #   IO.puts("game_ui move_card")
  #   IO.inspect(create_new_stack)
  #   # Check if dest_stack_index is negative, indicating a move to the end of a group, and adjust index accordingly
  #   dest_stack_index = if dest_stack_index < 0 do Enum.count(GameUI.get_stack_ids(gameui, dest_group_id)) + 1 + dest_stack_index else dest_stack_index end
  #   if orig_group_id == dest_group_id and orig_stack_index == dest_stack_index and orig_card_index == dest_card_index do
  #     gameui
  #   else
  #     # Get old position info
  #     old_orig_stacks = get_stack_ids(gameui, orig_group_id)
  #     old_orig_stack = get_stack(gameui, orig_group_id, orig_stack_index)
  #     old_orig_cards = get_card_ids(gameui, stackgroup_id, orig_stack_index)
  #     moving_card = get_card(gameui, [orig_group_id, orig_stack_index, orig_card_index])
  #     moving_card = if preserve_state do moving_card else card_group_change(gameui, moving_card, orig_group_id, dest_group_id) end
  #     #IO.inspect(moving_card)
  #     if !moving_card do
  #       gameui
  #     else
  #       # Delete card from old position
  #       new_orig_cards = List.delete_at(old_orig_cards, orig_card_index)
  #       new_orig_stack = put_in(old_orig_stack["cards"],new_orig_cards)
  #       new_orig_stacks = if Enum.count(new_orig_cards) == 0 do
  #         List.delete_at(old_orig_stacks, orig_stack_index)
  #       else
  #         List.replace_at(old_orig_stacks, orig_stack_index, new_orig_stack)
  #       end
  #       intermediate_gameui = update_stacks(gameui, orig_group_id, new_orig_stacks)

  #       # Add card to new position
  #       if create_new_stack do
  #         old_dest_stacks = get_stack_ids(intermediate_gameui, dest_group_id)
  #         IO.puts("inserting at")
  #         IO.inspect(dest_stack_index)
  #         new_dest_stacks = List.insert_at(old_dest_stacks, dest_stack_index, Stack.stack_from_card(moving_card))
  #         IO.inspect(dest_group_id)
  #         IO.inspect(new_dest_stacks)
  #         update_stacks(intermediate_gameui, dest_group_id, new_dest_stacks)
  #       else # Add to existing stack
  #         old_dest_cards = get_card_ids(intermedstackgameui, dest_group_id, dest_stack_index)
  #         new_dest_cards = List.insert_at(old_dest_cards, dest_card_index, moving_card)
  #         update_cards(intermediate_gameui, dest_group_id, dest_stack_index, new_dest_cards)
  #       end
  #     end
  #   end
  # end

  def shuffle_group(gameui, group_id) do
    shuffled_stacks = get_stack_ids(gameui, group_id) |> Enum.shuffle
    update_stack_ids(gameui, group_id, shuffled_stacks)
  end

  def get_player_n(gameui, user_id) do
    ids = gameui["playerIds"]
    cond do
      ids["player1"] == user_id -> "player1"
      ids["player2"] == user_id -> "player2"
      ids["player3"] == user_id -> "player3"
      ids["player4"] == user_id -> "player4"
      true -> nil
    end
  end

  def insert_stack_in_group(gameui, group_id, stack, index) do
    old_stack_ids = gameui["game"]["groupById"][group_id]["stackIds"]
    new_stack_ids = List.insert_at(old_stack_ids, index, stack["id"])
    new_group = put_in(gameui["game"]["groupById"][group_id]["stackIds"], new_stack_ids)
    update_group(gameui, new_group)
  end

  def insert_card_in_stack(gameui, stack_id, card, index) do
    old_card_ids = gameui["game"]["stackById"][stack_id]["cardIds"]
    new_card_ids = List.insert_at(old_card_ids, index, card["id"])
    update_card_ids(gameui, stack_id, new_card_ids)
  end

  def add_card_row_to_group(gameui, group_id, card_row) do
    controller = get_group_controller(gameui, group_id)
    group_size = Enum.count(get_stack_ids(gameui, group_id))
    # Can't insert a card directly into a group need to make a stack first
    new_tokens = Tokens.new()
    new_card = Card.card_from_cardrow(card_row, controller, new_tokens["id"])
    new_stack = Stack.new(new_card)
    gameui
    |> insert_stack_in_group(group_id, new_stack, group_size)
    |> update_stack(new_stack)
    |> update_card(new_card)
    |> update_tokens(new_tokens)
  end

  def load_card(gameui, card_row, group_id, quantity) do
    Enum.reduce(1..quantity, gameui, fn(index, acc) ->
      acc = add_card_row_to_group(gameui, group_id, card_row)
    end)
  end



  # def load_card(gameui, card_row, group_id, quantity) do
  #   #IO.puts("game_ui load_card a")
  #   #IO.inspect(card_row)
  #   controller = gameui["game"]["groupById"][group_id]["controller"]
  #   IO.puts("group controller")

  #   stacks_to_add = for _ <- 1..quantity do
  #     card = Card.card_from_cardrow(card_row, controller)
  #     card = card_group_change(gameui, card, group_id, group_id)
  #     Stack.stack_from_card(card)
  #   end
  #   old_stacks = get_stack_ids(gameui, group_id)
  #   new_stacks = old_stacks ++ stacks_to_add
  #   update_stacks(gameui, group_id, new_stacks)
  # end

  def load_cards(gameui, user_id, load_list) do
    # Get player doing the loading
    player_n = get_player_n(gameui, user_id)
    # Get deck sie before load
    deck_size_before = Enum.count(get_stack_ids(gameui,"g"<>player_n<>"Deck"))

    gameui = Enum.reduce(load_list, gameui, fn r, acc ->
      load_card(acc, r["cardRow"], r["groupID"], r["quantity"])
    end)

    # # Check if we should load the first quest card
    # IO.puts("checking quest")
    # IO.inspect(Enum.count(get_stack_ids(gameui,"sharedQuestDeck")))
    # IO.inspect(Enum.count(get_stack_ids(gameui,"sharedMainQuest")))
    # gameui = if Enum.count(get_stack_ids(gameui,"sharedQuestDeck"))>0 && Enum.count(get_stack_ids(gameui,"sharedMainQuest"))==0 do
    #   move_stack(gameui, "sharedQuestDeck", 0, "sharedMainQuest", 0)
    # else
    #   gameui
    # end

    # # Add to starting threat
    # threat = Enum.reduce load_list, 0, fn r, acc ->
    #   sideA = r["cardRow"]["sides"]["A"]
    #   if sideA["type"] == "Hero" do
    #     acc + CardFace.convert_to_integer(sideA["cost"])*r["quantity"]
    #   else
    #     acc
    #   end
    # end
    # gameui = if player_n do
    #   put_in(gameui["game"]["playerData"][player_n]["threat"], threat)
    # else
    #   gameui
    # end

    # # If deck size has increased from 0, assume it is at start of game and a mulligan is needed
    # round_number = gameui["game"]["round_number"]
    # round_step = gameui["game"]["round_step"]
    # deck_size_after = Enum.count(get_stack_ids(gameui,"g"<>player_n<>"Deck"))
    # gameui = if round_number == 0 && round_step == "0.0" && deck_size_before == 0 && deck_size_after > 6 do
    #   gameui = shuffle_group(gameui, "g"<>player_n<>"Deck")
    #   Enum.reduce 1..6, gameui, fn i, acc ->
    #     move_stack(acc, "g"<>player_n<>"Deck", 0, "g"<>player_n<>"Hand", -1, false)
    #   end
    # else
    #   gameui
    # end
  end

  # # Take a list of maps and add the index to each one with a key given by label
  # def index_list_of_maps(list, label) do
  #   Enum.map(Enum.with_index(list), fn({x,i}) -> Map.merge(x, %{label => i}) end)
  # end

  # # Flatten a group into a list of cards in that group, where each card has the additional keys group_id, stack_index, and card_index
  # def flatten_group(group) do
  #   Enum.reduce(Enum.with_index(group["stacks"]), [], fn({stack, index}, acc) ->
  #     cards = index_list_of_maps(stack["cards"],"card_index")
  #     cards = Enum.map(cards, fn(c) -> Map.merge(c, %{"stack_index" => index, "group_id" => group["id"]}) end)
  #     acc ++ cards
  #   end)
  # end

  # Obtain a flattened list of all cards in the game, where each card has the additional keys group_id, stack_index, and card_index
  def flat_list_of_cards(gameui) do
    card_by_id = gameui["game"]["cardById"]
    all_cards = Enum.reduce(card_by_id, [], fn({card_id, card}, acc) ->
      #IO.puts("flattening #{group_id}")
      {group_id, stack_index, card_index} = gsc(gameui, card)
      card = %{card | "group_id" => group_id, "stack_index" => stack_index, "card_index" => card_index}
      acc ++ [card]
    end)
    #IO.inspect(all_cards)
  end

  def passes_criteria(gameui, card, criteria) do
    Enum.reduce(criteria, true, fn(criterion, acc) ->
      object_to_check =
        case Enum.at(criterion,0) do
          "sideA" ->
            card["sides"]["A"]
          "sideB" ->
            card["sides"]["B"]
          "sideUp" ->
            card["sides"][card["currentSide"]]
          "sideDown" ->
            if card["currentSide"] == "A" do
              card["sides"]["B"]
            else
              card["sides"]["A"]
            end
          "tokens" ->
            get_tokens(gameui, card["tokensId"])
          "peeking" ->
            card["peeking"]
          _ ->
            card
        end
      property = Enum.at(criterion,1)
      value = Enum.at(criterion,2)
      passed_criterion = object_to_check[property] == value
      acc = acc && passed_criterion
    end)
  end

  def action_on_matching_cards(gameui, criteria, action, arguments \\ nil) do
    flat_list = flat_list_of_cards(gameui)
    #IO.inspect(gameui)
    Enum.reduce(flat_list, gameui, fn(card, acc) ->
      IO.puts("checking #{card["sides"]["A"]["name"]}")
      IO.inspect(card["controller"])
      acc = if passes_criteria(gameui, card, criteria) do
        #toggle_exhaust(acc, [card["group_id"], card["stack_index"], card["card_index"]])
        card_action(action, acc, [card["group_id"], card["stack_index"], card["card_index"]], arguments)
      else
        acc
      end
    end)
  end

  def next_player(gameui, player_n) do
    seated_player_ns = seated_non_eliminated(gameui)
    seated_player_ns2 = seated_player_ns ++ seated_player_ns
    IO.inspect(seated_player_ns2)
    next = Enum.reduce(Enum.with_index(seated_player_ns2), nil, fn({player_i, index}, acc) ->
      IO.puts("acc: #{acc}")
      IO.puts("player_i: #{player_i}")
      IO.puts("player_n: #{player_n}")
      if !acc && player_i == player_n do
        acc = Enum.at(seated_player_ns2, index+1)
      else
        acc
      end
    end)
    if next == player_n do
      nil
    else
      next
    end
  end

  def pass_first_player_token(gameui) do
    current_first_player = gameui["game"]["first_player"]
    IO.puts("current first player: #{current_first_player}")
    next_first_player = next_player(gameui, current_first_player)
    IO.puts("next first player: #{next_first_player}")
    if !next_first_player do
      gameui
    else
      put_in(gameui["game"]["first_player"], next_first_player)
    end
  end

  # List of PlayerN strings of players that are seated and not eliminated
  def seated_non_eliminated(gameui) do
    player_ids = gameui["playerIds"]
    player_data = gameui["game"]["playerData"]
    Enum.reduce(["player1","player2","player3","player4"], [], fn(player_n, acc) ->
      acc = if player_ids[player_n] && !player_data[player_n]["eliminated"] do
        acc ++ [player_n]
      else
        acc
      end
    end)
  end

  # Get leftmost player that is not elimiated. Useful for once per round actions like passing 1st player token so
  # that it doesn't get passed twice
  def leftmost_non_eliminated_player_n(gameui) do
    seated_player_ns = seated_non_eliminated(gameui)
    Enum.at(seated_player_ns,0) || "player1"
  end

  # Refresh cards controlled by player_n
  def refresh(gameui, player_n) do
    gameui = action_on_matching_cards(
      gameui,
      [["card", "exhausted", true], ["card", "controller", player_n]],
      "toggle_exhaust",
      []
    )
  end

  # Increment a player's threat
  def increment_threat(gameui, player_n, increment) do
    current_threat = gameui["game"]["playerData"][player_n]["threat"];
    put_in(gameui["game"]["playerData"][player_n]["threat"], current_threat + increment)
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
