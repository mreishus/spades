defmodule SpadesGame.Game do
  @moduledoc """
  Represents a game of spades.
  In early stages of the app, it only represents a
  some toy game used to test everything around it.
  """
  alias SpadesGame.{Groups, Game, GameOptions, PlayerData}

  @type t :: Map.t()

  @doc """
  new/1:  Create a game with default options.
  """
  @spec new() :: Game.t()
  def new() do
    {:ok, options} = GameOptions.validate(%{})
    new(options)
  end

  # @doc """
  # new/1:  Create a game with specified options.
  # """
  # @spec new(GameOptions.t()) :: Game.t()
  # def new(%GameOptions{} = options) do
  #   %{
  #     "options" => options,
  #     "firstPlayer" => "player1",
  #     "roundNumber" => 0,
  #     "phase" => "Beginning",
  #     "roundStep" => "0.0",

  #     "groupById" => Groups.new(),
  #     "stackById" => %{},
  #     "cardById"  => %{},
  #     "playerData" => %{
  #       "player1" => PlayerData.new(),
  #       "player2" => PlayerData.new(),
  #       "player3" => PlayerData.new(),
  #       "player4" => PlayerData.new(),
  #     }
  #   }
  # end


  @doc """
  new/1:  Create a game with specified options.
  """
  @spec new(GameOptions.t()) :: Game.t()
  def new(%GameOptions{} = options) do

  %{
    "cardById" => %{
      "0d27b29a-a784-411b-95d4-005ca85710eb" => %{
        "cardBackOverride" => nil,
        "cardDbId" => "a3f93416-08e8-4d0c-b983-58ae2505e75c",
        "cardEncounterSet" => "",
        "cardNumber" => 117,
        "cardPackName" => "The Dungeons of Cirith Gurat",
        "cardQuantity" => 3,
        "cardSetId" => "ade2ad98-3d29-4324-ada3-793a91fa1fee",
        "committed" => false,
        "controller" => "player1",
        "currentSide" => "A",
        "discardGroupId" => "player1Discard",
        "exhausted" => false,
        "id" => "0d27b29a-a784-411b-95d4-005ca85710eb",
        "owner" => "player1",
        "peeking" => %{
          "player1" => false,
          "player2" => false,
          "player3" => false,
          "player4" => false
        },
        "rotation" => 0,
        "sides" => %{
          "A" => %{
            "attack" => nil,
            "cost" => 0,
            "defense" => nil,
            "engagementCost" => nil,
            "height" => 1.39,
            "hitPoints" => nil,
            "keywords" => "",
            "name" => "Legacy Blade",
            "printName" => "Legacy Blade",
            "questPoints" => nil,
            "shadow" => "",
            "sphere" => "Lore",
            "text" => "Attach to a hero. Restricted. Attached hero gets +1 [attack] for each side quest in the victory display. (Limit +3 [attack].)",
            "threat" => nil,
            "traits" => "Item. Weapon.",
            "type" => "Attachment",
            "unique" => "",
            "victoryPoints" => nil,
            "width" => 1.0,
            "willpower" => nil
          },
          "B" => %{
            "attack" => nil,
            "cost" => nil,
            "defense" => nil,
            "engagementCost" => nil,
            "height" => 1.39,
            "hitPoints" => nil,
            "keywords" => "",
            "name" => "player",
            "printName" => "player",
            "questPoints" => nil,
            "shadow" => "",
            "sphere" => "",
            "text" => "",
            "threat" => nil,
            "traits" => "",
            "type" => "",
            "unique" => "",
            "victoryPoints" => nil,
            "width" => 1.0,
            "willpower" => nil
          }
        },
        "tokens" => %{
          "attack" => 0,
          "damage" => 0,
          "defense" => 0,
          "hitPoints" => 0,
          "progress" => 0,
          "resource" => 0,
          "threat" => 0,
          "time" => 0,
          "willpower" => 0
        }
      },
      "222b336e-31d3-4970-9aba-dbd042fe5861" => %{
        "cardBackOverride" => nil,
        "cardDbId" => "6dc19efc-af54-4eff-b9ee-ee45e9fd4072",
        "cardEncounterSet" => "",
        "cardNumber" => 2,
        "cardPackName" => "The Flame of the West",
        "cardQuantity" => 1,
        "cardSetId" => "8c7fc7eb-abb2-4cea-b6f7-bd782231888d",
        "committed" => false,
        "controller" => "player1",
        "currentSide" => "A",
        "discardGroupId" => "player1Discard",
        "exhausted" => false,
        "id" => "222b336e-31d3-4970-9aba-dbd042fe5861",
        "owner" => "player1",
        "peeking" => %{
          "player1" => false,
          "player2" => false,
          "player3" => false,
          "player4" => false
        },
        "rotation" => 0,
        "sides" => %{
          "A" => %{
            "attack" => 1,
            "cost" => 9,
            "defense" => 1,
            "engagementCost" => nil,
            "height" => 1.39,
            "hitPoints" => 3,
            "keywords" => "",
            "name" => "Eowyn",
            "printName" => "Éowyn",
            "questPoints" => nil,
            "shadow" => "",
            "sphere" => "Tactics",
            "text" => "Setup: Reduce your threat by 3. Action: Raise your threat by 3 to ready Eowyn. She gets +9 [attack] until the end of the phase. (Limit once per game for the group.) ",
            "threat" => nil,
            "traits" => "Rohan. Noble. ",
            "type" => "Hero",
            "unique" => "1",
            "victoryPoints" => nil,
            "width" => 1.0,
            "willpower" => 4
          },
          "B" => %{
            "attack" => nil,
            "cost" => nil,
            "defense" => nil,
            "engagementCost" => nil,
            "height" => 1.39,
            "hitPoints" => nil,
            "keywords" => "",
            "name" => "player",
            "printName" => "player",
            "questPoints" => nil,
            "shadow" => "",
            "sphere" => "",
            "text" => "",
            "threat" => nil,
            "traits" => "",
            "type" => "",
            "unique" => "",
            "victoryPoints" => nil,
            "width" => 1.0,
            "willpower" => nil
          }
        },
        "tokens" => %{
          "attack" => 0,
          "damage" => 0,
          "defense" => 0,
          "hitPoints" => 0,
          "progress" => 0,
          "resource" => 0,
          "threat" => 0,
          "time" => 0,
          "willpower" => 0
        }
      },
      "2d1abc22-6957-44d9-a15a-be2ac00eb1eb" => %{
        "cardBackOverride" => nil,
        "cardDbId" => "c9cdf75b-7535-4d17-804f-0f22569812c7",
        "cardEncounterSet" => "",
        "cardNumber" => 124,
        "cardPackName" => "The Battle of Carn Dum",
        "cardQuantity" => 3,
        "cardSetId" => "c8f7efb1-537c-436e-9264-a2f3f8df9082",
        "committed" => false,
        "controller" => "player1",
        "currentSide" => "A",
        "discardGroupId" => "player1Discard",
        "exhausted" => false,
        "id" => "2d1abc22-6957-44d9-a15a-be2ac00eb1eb",
        "owner" => "player1",
        "peeking" => %{
          "player1" => false,
          "player2" => false,
          "player3" => false,
          "player4" => false
        },
        "rotation" => 0,
        "sides" => %{
          "A" => %{
            "attack" => nil,
            "cost" => 3,
            "defense" => nil,
            "engagementCost" => nil,
            "height" => 1.39,
            "hitPoints" => nil,
            "keywords" => "Attach to a player's threat dial. Limit 1 per player.",
            "name" => "Favor of the Valar",
            "printName" => "Favor of the Valar",
            "questPoints" => nil,
            "shadow" => "",
            "sphere" => "Neutral",
            "text" => "Forced: When you would be eliminated by reaching your threat elimination level, instead discard Favor of the Valar and reduce your threat to 5 lower than your threat elimination level. You are not eliminated.",
            "threat" => nil,
            "traits" => "Condition.",
            "type" => "Attachment",
            "unique" => "",
            "victoryPoints" => nil,
            "width" => 1.0,
            "willpower" => nil
          },
          "B" => %{
            "attack" => nil,
            "cost" => nil,
            "defense" => nil,
            "engagementCost" => nil,
            "height" => 1.39,
            "hitPoints" => nil,
            "keywords" => "",
            "name" => "player",
            "printName" => "player",
            "questPoints" => nil,
            "shadow" => "",
            "sphere" => "",
            "text" => "",
            "threat" => nil,
            "traits" => "",
            "type" => "",
            "unique" => "",
            "victoryPoints" => nil,
            "width" => 1.0,
            "willpower" => nil
          }
        },
        "tokens" => %{
          "attack" => 0,
          "damage" => 0,
          "defense" => 0,
          "hitPoints" => 0,
          "progress" => 0,
          "resource" => 0,
          "threat" => 0,
          "time" => 0,
          "willpower" => 0
        }
      },
      "394137c9-816a-4392-90b1-dc14f5e177b3" => %{
        "cardBackOverride" => nil,
        "cardDbId" => "789fbae0-a33e-4ea0-a34f-adfe3b62dba7",
        "cardEncounterSet" => "",
        "cardNumber" => 91,
        "cardPackName" => "The Drowned Ruins",
        "cardQuantity" => 3,
        "cardSetId" => "d2f8fe46-8e53-4138-906d-189f08da6903",
        "committed" => false,
        "controller" => "player1",
        "currentSide" => "A",
        "discardGroupId" => "player1Discard",
        "exhausted" => false,
        "id" => "394137c9-816a-4392-90b1-dc14f5e177b3",
        "owner" => "player1",
        "peeking" => %{
          "player1" => false,
          "player2" => false,
          "player3" => false,
          "player4" => false
        },
        "rotation" => 0,
        "sides" => %{
          "A" => %{
            "attack" => nil,
            "cost" => 1,
            "defense" => nil,
            "engagementCost" => nil,
            "height" => 1.39,
            "hitPoints" => nil,
            "keywords" => "Attach to a hero.",
            "name" => "Strider",
            "printName" => "Strider",
            "questPoints" => nil,
            "shadow" => "",
            "sphere" => "Neutral",
            "text" => "While you control 2 or fewer heroes, attached hero does not exhaust to commit to the quest.\n\nWhile you control 5 or fewer characters, attached hero gets +2 [willpower].",
            "threat" => nil,
            "traits" => "Title.",
            "type" => "Attachment",
            "unique" => "1",
            "victoryPoints" => nil,
            "width" => 1.0,
            "willpower" => nil
          },
          "B" => %{
            "attack" => nil,
            "cost" => nil,
            "defense" => nil,
            "engagementCost" => nil,
            "height" => 1.39,
            "hitPoints" => nil,
            "keywords" => "",
            "name" => "player",
            "printName" => "player",
            "questPoints" => nil,
            "shadow" => "",
            "sphere" => "",
            "text" => "",
            "threat" => nil,
            "traits" => "",
            "type" => "",
            "unique" => "",
            "victoryPoints" => nil,
            "width" => 1.0,
            "willpower" => nil
          }
        },
        "tokens" => %{
          "attack" => 0,
          "damage" => 0,
          "defense" => 0,
          "hitPoints" => 0,
          "progress" => 0,
          "resource" => 0,
          "threat" => 0,
          "time" => 0,
          "willpower" => 0
        }
      },
      "5488a77e-ec82-4b34-a67b-8985731f7b7d" => %{
        "cardBackOverride" => nil,
        "cardDbId" => "a3f93416-08e8-4d0c-b983-58ae2505e75c",
        "cardEncounterSet" => "",
        "cardNumber" => 117,
        "cardPackName" => "The Dungeons of Cirith Gurat",
        "cardQuantity" => 3,
        "cardSetId" => "ade2ad98-3d29-4324-ada3-793a91fa1fee",
        "committed" => false,
        "controller" => "player1",
        "currentSide" => "A",
        "discardGroupId" => "player1Discard",
        "exhausted" => false,
        "id" => "5488a77e-ec82-4b34-a67b-8985731f7b7d",
        "owner" => "player1",
        "peeking" => %{
          "player1" => false,
          "player2" => false,
          "player3" => false,
          "player4" => false
        },
        "rotation" => 0,
        "sides" => %{
          "A" => %{
            "attack" => nil,
            "cost" => 0,
            "defense" => nil,
            "engagementCost" => nil,
            "height" => 1.39,
            "hitPoints" => nil,
            "keywords" => "",
            "name" => "Legacy Blade",
            "printName" => "Legacy Blade",
            "questPoints" => nil,
            "shadow" => "",
            "sphere" => "Lore",
            "text" => "Attach to a hero. Restricted. Attached hero gets +1 [attack] for each side quest in the victory display. (Limit +3 [attack].)",
            "threat" => nil,
            "traits" => "Item. Weapon.",
            "type" => "Attachment",
            "unique" => "",
            "victoryPoints" => nil,
            "width" => 1.0,
            "willpower" => nil
          },
          "B" => %{
            "attack" => nil,
            "cost" => nil,
            "defense" => nil,
            "engagementCost" => nil,
            "height" => 1.39,
            "hitPoints" => nil,
            "keywords" => "",
            "name" => "player",
            "printName" => "player",
            "questPoints" => nil,
            "shadow" => "",
            "sphere" => "",
            "text" => "",
            "threat" => nil,
            "traits" => "",
            "type" => "",
            "unique" => "",
            "victoryPoints" => nil,
            "width" => 1.0,
            "willpower" => nil
          }
        },
        "tokens" => %{
          "attack" => 0,
          "damage" => 0,
          "defense" => 0,
          "hitPoints" => 0,
          "progress" => 0,
          "resource" => 0,
          "threat" => 0,
          "time" => 0,
          "willpower" => 0
        }
      },
      "5e1e27c7-a171-4d14-8b4d-c9d617c89f11" => %{
        "cardBackOverride" => nil,
        "cardDbId" => "789fbae0-a33e-4ea0-a34f-adfe3b62dba7",
        "cardEncounterSet" => "",
        "cardNumber" => 91,
        "cardPackName" => "The Drowned Ruins",
        "cardQuantity" => 3,
        "cardSetId" => "d2f8fe46-8e53-4138-906d-189f08da6903",
        "committed" => false,
        "controller" => "player1",
        "currentSide" => "A",
        "discardGroupId" => "player1Discard",
        "exhausted" => false,
        "id" => "5e1e27c7-a171-4d14-8b4d-c9d617c89f11",
        "owner" => "player1",
        "peeking" => %{
          "player1" => false,
          "player2" => false,
          "player3" => false,
          "player4" => false
        },
        "rotation" => 0,
        "sides" => %{
          "A" => %{
            "attack" => nil,
            "cost" => 1,
            "defense" => nil,
            "engagementCost" => nil,
            "height" => 1.39,
            "hitPoints" => nil,
            "keywords" => "Attach to a hero.",
            "name" => "Strider",
            "printName" => "Strider",
            "questPoints" => nil,
            "shadow" => "",
            "sphere" => "Neutral",
            "text" => "While you control 2 or fewer heroes, attached hero does not exhaust to commit to the quest.\n\nWhile you control 5 or fewer characters, attached hero gets +2 [willpower].",
            "threat" => nil,
            "traits" => "Title.",
            "type" => "Attachment",
            "unique" => "1",
            "victoryPoints" => nil,
            "width" => 1.0,
            "willpower" => nil
          },
          "B" => %{
            "attack" => nil,
            "cost" => nil,
            "defense" => nil,
            "engagementCost" => nil,
            "height" => 1.39,
            "hitPoints" => nil,
            "keywords" => "",
            "name" => "player",
            "printName" => "player",
            "questPoints" => nil,
            "shadow" => "",
            "sphere" => "",
            "text" => "",
            "threat" => nil,
            "traits" => "",
            "type" => "",
            "unique" => "",
            "victoryPoints" => nil,
            "width" => 1.0,
            "willpower" => nil
          }
        },
        "tokens" => %{
          "attack" => 0,
          "damage" => 0,
          "defense" => 0,
          "hitPoints" => 0,
          "progress" => 0,
          "resource" => 0,
          "threat" => 0,
          "time" => 0,
          "willpower" => 0
        }
      },
      "8d8554fd-c5fb-4d5a-baac-f8bebbb2a573" => %{
        "cardBackOverride" => nil,
        "cardDbId" => "789fbae0-a33e-4ea0-a34f-adfe3b62dba7",
        "cardEncounterSet" => "",
        "cardNumber" => 91,
        "cardPackName" => "The Drowned Ruins",
        "cardQuantity" => 3,
        "cardSetId" => "d2f8fe46-8e53-4138-906d-189f08da6903",
        "committed" => false,
        "controller" => "player1",
        "currentSide" => "A",
        "discardGroupId" => "player1Discard",
        "exhausted" => false,
        "id" => "8d8554fd-c5fb-4d5a-baac-f8bebbb2a573",
        "owner" => "player1",
        "peeking" => %{
          "player1" => false,
          "player2" => false,
          "player3" => false,
          "player4" => false
        },
        "rotation" => 0,
        "sides" => %{
          "A" => %{
            "attack" => nil,
            "cost" => 1,
            "defense" => nil,
            "engagementCost" => nil,
            "height" => 1.39,
            "hitPoints" => nil,
            "keywords" => "Attach to a hero.",
            "name" => "Strider",
            "printName" => "Strider",
            "questPoints" => nil,
            "shadow" => "",
            "sphere" => "Neutral",
            "text" => "While you control 2 or fewer heroes, attached hero does not exhaust to commit to the quest.\n\nWhile you control 5 or fewer characters, attached hero gets +2 [willpower].",
            "threat" => nil,
            "traits" => "Title.",
            "type" => "Attachment",
            "unique" => "1",
            "victoryPoints" => nil,
            "width" => 1.0,
            "willpower" => nil
          },
          "B" => %{
            "attack" => nil,
            "cost" => nil,
            "defense" => nil,
            "engagementCost" => nil,
            "height" => 1.39,
            "hitPoints" => nil,
            "keywords" => "",
            "name" => "player",
            "printName" => "player",
            "questPoints" => nil,
            "shadow" => "",
            "sphere" => "",
            "text" => "",
            "threat" => nil,
            "traits" => "",
            "type" => "",
            "unique" => "",
            "victoryPoints" => nil,
            "width" => 1.0,
            "willpower" => nil
          }
        },
        "tokens" => %{
          "attack" => 0,
          "damage" => 0,
          "defense" => 0,
          "hitPoints" => 0,
          "progress" => 0,
          "resource" => 0,
          "threat" => 0,
          "time" => 0,
          "willpower" => 0
        }
      },
      "a63cefd7-5ed2-4919-a0e3-59caf6c69ef3" => %{
        "cardBackOverride" => nil,
        "cardDbId" => "2f9c24db-2ee4-4368-99fa-db49a0add8f5",
        "cardEncounterSet" => "",
        "cardNumber" => 34,
        "cardPackName" => "The Thing in the Depths",
        "cardQuantity" => 3,
        "cardSetId" => "603551b9-cccd-4b8b-b258-83718010cca7",
        "committed" => false,
        "controller" => "player1",
        "currentSide" => "A",
        "discardGroupId" => "player1Discard",
        "exhausted" => false,
        "id" => "a63cefd7-5ed2-4919-a0e3-59caf6c69ef3",
        "owner" => "player1",
        "peeking" => %{
          "player1" => false,
          "player2" => false,
          "player3" => false,
          "player4" => false
        },
        "rotation" => 0,
        "sides" => %{
          "A" => %{
            "attack" => 0,
            "cost" => 2,
            "defense" => 0,
            "engagementCost" => nil,
            "height" => 1.39,
            "hitPoints" => 0,
            "keywords" => "Attach to a Warrior character. Raiment of War counts as 2 Restricted attachments.",
            "name" => "Raiment of War",
            "printName" => "Raiment of War",
            "questPoints" => nil,
            "shadow" => "",
            "sphere" => "Tactics",
            "text" => "Attached character gets +1 [attack], +1 [defense], and +2 hit points.",
            "threat" => nil,
            "traits" => "Item. Armor. Weapon.",
            "type" => "Attachment",
            "unique" => "",
            "victoryPoints" => nil,
            "width" => 1.0,
            "willpower" => 0
          },
          "B" => %{
            "attack" => nil,
            "cost" => nil,
            "defense" => nil,
            "engagementCost" => nil,
            "height" => 1.39,
            "hitPoints" => nil,
            "keywords" => "",
            "name" => "player",
            "printName" => "player",
            "questPoints" => nil,
            "shadow" => "",
            "sphere" => "",
            "text" => "",
            "threat" => nil,
            "traits" => "",
            "type" => "",
            "unique" => "",
            "victoryPoints" => nil,
            "width" => 1.0,
            "willpower" => nil
          }
        },
        "tokens" => %{
          "attack" => 0,
          "damage" => 0,
          "defense" => 0,
          "hitPoints" => 0,
          "progress" => 0,
          "resource" => 0,
          "threat" => 0,
          "time" => 0,
          "willpower" => 0
        }
      },
      "b197dee4-2c0c-4d8d-b361-0371084a49e9" => %{
        "cardBackOverride" => nil,
        "cardDbId" => "4a0d8846-9a30-455e-9bf7-a2f5c77b787b",
        "cardEncounterSet" => "",
        "cardNumber" => 49,
        "cardPackName" => "The City of Ulfast",
        "cardQuantity" => 1,
        "cardSetId" => "bbcb1c60-f3bd-45c3-91a0-efbeb64f7e19",
        "committed" => false,
        "controller" => "player1",
        "currentSide" => "A",
        "discardGroupId" => "player1Discard",
        "exhausted" => false,
        "id" => "b197dee4-2c0c-4d8d-b361-0371084a49e9",
        "owner" => "player1",
        "peeking" => %{
          "player1" => false,
          "player2" => false,
          "player3" => false,
          "player4" => false
        },
        "rotation" => 0,
        "sides" => %{
          "A" => %{
            "attack" => nil,
            "cost" => nil,
            "defense" => nil,
            "engagementCost" => nil,
            "height" => 1.39,
            "hitPoints" => nil,
            "keywords" => "",
            "name" => "Forth, The Three Hunters!",
            "printName" => "Forth, The Three Hunters!",
            "questPoints" => nil,
            "shadow" => "",
            "sphere" => "",
            "text" => "Your deck cannot include ally cards. Each of your heroes can have 1 additional restricted attachment. Reduce the cost of the first restricted attachment you play on each of your heroes each round by 1. Refresh Action: If each of your heroes has at least 2 restricted attachments, flip this card over.",
            "threat" => nil,
            "traits" => "",
            "type" => "Contract",
            "unique" => "",
            "victoryPoints" => nil,
            "width" => 1.0,
            "willpower" => nil
          },
          "B" => %{
            "attack" => nil,
            "cost" => nil,
            "defense" => nil,
            "engagementCost" => nil,
            "height" => 1.39,
            "hitPoints" => nil,
            "keywords" => "",
            "name" => "Forth, The Three Hunters!",
            "printName" => "Forth, The Three Hunters!",
            "questPoints" => nil,
            "shadow" => "",
            "sphere" => "",
            "text" => "Each of your heroes can have 1 additional restricted attachment and gets +1 [willpower] for each restricted attachment on it. Action: Exhaust this card to heal 1 damage from each of your heroes.",
            "threat" => nil,
            "traits" => "",
            "type" => "Contract",
            "unique" => "",
            "victoryPoints" => nil,
            "width" => 1.0,
            "willpower" => nil
          }
        },
        "tokens" => %{
          "attack" => 0,
          "damage" => 0,
          "defense" => 0,
          "hitPoints" => 0,
          "progress" => 0,
          "resource" => 0,
          "threat" => 0,
          "time" => 0,
          "willpower" => 0
        }
      },
      "c286195e-cc13-42f1-a7d1-e29d1f0981db" => %{
        "cardBackOverride" => nil,
        "cardDbId" => "c9cdf75b-7535-4d17-804f-0f22569812c7",
        "cardEncounterSet" => "",
        "cardNumber" => 124,
        "cardPackName" => "The Battle of Carn Dum",
        "cardQuantity" => 3,
        "cardSetId" => "c8f7efb1-537c-436e-9264-a2f3f8df9082",
        "committed" => false,
        "controller" => "player1",
        "currentSide" => "B",
        "discardGroupId" => "player1Discard",
        "exhausted" => false,
        "id" => "c286195e-cc13-42f1-a7d1-e29d1f0981db",
        "owner" => "player1",
        "peeking" => %{
          "player1" => false,
          "player2" => false,
          "player3" => false,
          "player4" => false
        },
        "rotation" => 0,
        "sides" => %{
          "A" => %{
            "attack" => nil,
            "cost" => 3,
            "defense" => nil,
            "engagementCost" => nil,
            "height" => 1.39,
            "hitPoints" => nil,
            "keywords" => "Attach to a player's threat dial. Limit 1 per player.",
            "name" => "Favor of the Valar",
            "printName" => "Favor of the Valar",
            "questPoints" => nil,
            "shadow" => "",
            "sphere" => "Neutral",
            "text" => "Forced: When you would be eliminated by reaching your threat elimination level, instead discard Favor of the Valar and reduce your threat to 5 lower than your threat elimination level. You are not eliminated.",
            "threat" => nil,
            "traits" => "Condition.",
            "type" => "Attachment",
            "unique" => "",
            "victoryPoints" => nil,
            "width" => 1.0,
            "willpower" => nil
          },
          "B" => %{
            "attack" => nil,
            "cost" => nil,
            "defense" => nil,
            "engagementCost" => nil,
            "height" => 1.39,
            "hitPoints" => nil,
            "keywords" => "",
            "name" => "player",
            "printName" => "player",
            "questPoints" => nil,
            "shadow" => "",
            "sphere" => "",
            "text" => "",
            "threat" => nil,
            "traits" => "",
            "type" => "",
            "unique" => "",
            "victoryPoints" => nil,
            "width" => 1.0,
            "willpower" => nil
          }
        },
        "tokens" => %{
          "attack" => 0,
          "damage" => 0,
          "defense" => 0,
          "hitPoints" => 0,
          "progress" => 0,
          "resource" => 0,
          "threat" => 0,
          "time" => 0,
          "willpower" => 0
        }
      },
      "e1a61cfb-071d-4f40-9bd9-31e9550dd9d1" => %{
        "cardBackOverride" => nil,
        "cardDbId" => "f8a3acfb-3b0d-414b-b5d0-2612d33c193d",
        "cardEncounterSet" => "",
        "cardNumber" => 9,
        "cardPackName" => "The Wastes of Eriador",
        "cardQuantity" => 3,
        "cardSetId" => "b651805f-c7d1-4a19-af65-b368d446e5d5",
        "committed" => false,
        "controller" => "player1",
        "currentSide" => "B",
        "discardGroupId" => "player1Discard",
        "exhausted" => false,
        "id" => "e1a61cfb-071d-4f40-9bd9-31e9550dd9d1",
        "owner" => "player1",
        "peeking" => %{
          "player1" => false,
          "player2" => false,
          "player3" => false,
          "player4" => false
        },
        "rotation" => 0,
        "sides" => %{
          "A" => %{
            "attack" => nil,
            "cost" => 0,
            "defense" => nil,
            "engagementCost" => nil,
            "height" => 1.0,
            "hitPoints" => nil,
            "keywords" => "Limit 1 per deck.",
            "name" => "Scout Ahead",
            "printName" => "Scout Ahead",
            "questPoints" => 4,
            "shadow" => "",
            "sphere" => "Lore",
            "text" => "Response: When this stage is defeated, the first player searches the top X cards of the encounter deck for 1 non-objective card worth no victory points and adds it to the victory display. Put the remaining cards back in any order. X is the number of players in the game plus 4.",
            "threat" => nil,
            "traits" => "",
            "type" => "Side Quest",
            "unique" => "",
            "victoryPoints" => 1,
            "width" => 1.39,
            "willpower" => nil
          },
          "B" => %{
            "attack" => nil,
            "cost" => nil,
            "defense" => nil,
            "engagementCost" => nil,
            "height" => 1.39,
            "hitPoints" => nil,
            "keywords" => "",
            "name" => "player",
            "printName" => "player",
            "questPoints" => nil,
            "shadow" => "",
            "sphere" => "",
            "text" => "",
            "threat" => nil,
            "traits" => "",
            "type" => "",
            "unique" => "",
            "victoryPoints" => nil,
            "width" => 1.0,
            "willpower" => nil
          }
        },
        "tokens" => %{
          "attack" => 0,
          "damage" => 0,
          "defense" => 0,
          "hitPoints" => 0,
          "progress" => 0,
          "resource" => 0,
          "threat" => 0,
          "time" => 0,
          "willpower" => 0
        }
      },
      "e5209581-ef58-4225-b6ab-476b69b9b8ea" => %{
        "cardBackOverride" => nil,
        "cardDbId" => "c9cdf75b-7535-4d17-804f-0f22569812c7",
        "cardEncounterSet" => "",
        "cardNumber" => 124,
        "cardPackName" => "The Battle of Carn Dum",
        "cardQuantity" => 3,
        "cardSetId" => "c8f7efb1-537c-436e-9264-a2f3f8df9082",
        "committed" => false,
        "controller" => "player1",
        "currentSide" => "B",
        "discardGroupId" => "player1Discard",
        "exhausted" => false,
        "id" => "e5209581-ef58-4225-b6ab-476b69b9b8ea",
        "owner" => "player1",
        "peeking" => %{
          "player1" => false,
          "player2" => false,
          "player3" => false,
          "player4" => false
        },
        "rotation" => 0,
        "sides" => %{
          "A" => %{
            "attack" => nil,
            "cost" => 3,
            "defense" => nil,
            "engagementCost" => nil,
            "height" => 1.39,
            "hitPoints" => nil,
            "keywords" => "Attach to a player's threat dial. Limit 1 per player.",
            "name" => "Favor of the Valar",
            "printName" => "Favor of the Valar",
            "questPoints" => nil,
            "shadow" => "",
            "sphere" => "Neutral",
            "text" => "Forced: When you would be eliminated by reaching your threat elimination level, instead discard Favor of the Valar and reduce your threat to 5 lower than your threat elimination level. You are not eliminated.",
            "threat" => nil,
            "traits" => "Condition.",
            "type" => "Attachment",
            "unique" => "",
            "victoryPoints" => nil,
            "width" => 1.0,
            "willpower" => nil
          },
          "B" => %{
            "attack" => nil,
            "cost" => nil,
            "defense" => nil,
            "engagementCost" => nil,
            "height" => 1.39,
            "hitPoints" => nil,
            "keywords" => "",
            "name" => "player",
            "printName" => "player",
            "questPoints" => nil,
            "shadow" => "",
            "sphere" => "",
            "text" => "",
            "threat" => nil,
            "traits" => "",
            "type" => "",
            "unique" => "",
            "victoryPoints" => nil,
            "width" => 1.0,
            "willpower" => nil
          }
        },
        "tokens" => %{
          "attack" => 0,
          "damage" => 0,
          "defense" => 0,
          "hitPoints" => 0,
          "progress" => 0,
          "resource" => 0,
          "threat" => 0,
          "time" => 0,
          "willpower" => 0
        }
      },
      "fdbee10f-3d26-4081-a80f-1e6467cc9eef" => %{
        "cardBackOverride" => nil,
        "cardDbId" => "a3f93416-08e8-4d0c-b983-58ae2505e75c",
        "cardEncounterSet" => "",
        "cardNumber" => 117,
        "cardPackName" => "The Dungeons of Cirith Gurat",
        "cardQuantity" => 3,
        "cardSetId" => "ade2ad98-3d29-4324-ada3-793a91fa1fee",
        "committed" => false,
        "controller" => "player1",
        "currentSide" => "B",
        "discardGroupId" => "player1Discard",
        "exhausted" => false,
        "id" => "fdbee10f-3d26-4081-a80f-1e6467cc9eef",
        "owner" => "player1",
        "peeking" => %{
          "player1" => false,
          "player2" => false,
          "player3" => false,
          "player4" => false
        },
        "rotation" => 0,
        "sides" => %{
          "A" => %{
            "attack" => nil,
            "cost" => 0,
            "defense" => nil,
            "engagementCost" => nil,
            "height" => 1.39,
            "hitPoints" => nil,
            "keywords" => "",
            "name" => "Legacy Blade",
            "printName" => "Legacy Blade",
            "questPoints" => nil,
            "shadow" => "",
            "sphere" => "Lore",
            "text" => "Attach to a hero. Restricted. Attached hero gets +1 [attack] for each side quest in the victory display. (Limit +3 [attack].)",
            "threat" => nil,
            "traits" => "Item. Weapon.",
            "type" => "Attachment",
            "unique" => "",
            "victoryPoints" => nil,
            "width" => 1.0,
            "willpower" => nil
          },
          "B" => %{
            "attack" => nil,
            "cost" => nil,
            "defense" => nil,
            "engagementCost" => nil,
            "height" => 1.39,
            "hitPoints" => nil,
            "keywords" => "",
            "name" => "player",
            "printName" => "player",
            "questPoints" => nil,
            "shadow" => "",
            "sphere" => "",
            "text" => "",
            "threat" => nil,
            "traits" => "",
            "type" => "",
            "unique" => "",
            "victoryPoints" => nil,
            "width" => 1.0,
            "willpower" => nil
          }
        },
        "tokens" => %{
          "attack" => 0,
          "damage" => 0,
          "defense" => 0,
          "hitPoints" => 0,
          "progress" => 0,
          "resource" => 0,
          "threat" => 0,
          "time" => 0,
          "willpower" => 0
        }
      }
    },
    "firstPlayer" => "player1",
    "groupById" => %{
      "sharedMainQuest" => %{
        "controller" => "shared",
        "id" => "sharedMainQuest",
        "stackIds" => [],
        "type" => "play"
      },
      "sharedExtra2" => %{
        "controller" => "shared",
        "id" => "sharedExtra2",
        "stackIds" => [],
        "type" => "play"
      },
      "player4Play2" => %{
        "controller" => "player4",
        "id" => "player4Play2",
        "stackIds" => [],
        "type" => "play"
      },
      "sharedQuestDiscard2" => %{
        "controller" => "shared",
        "id" => "sharedQuestDiscard2",
        "stackIds" => [],
        "type" => "discard"
      },
      "player2Play1" => %{
        "controller" => "player2",
        "id" => "player2Play1",
        "stackIds" => [],
        "type" => "play"
      },
      "player2Deck" => %{
        "controller" => "player2",
        "id" => "player2Deck",
        "stackIds" => [],
        "type" => "deck"
      },
      "sharedQuestDeck2" => %{
        "controller" => "shared",
        "id" => "sharedQuestDeck2",
        "stackIds" => [],
        "type" => "hand"
      },
      "player3Sideboard" => %{
        "controller" => "player3",
        "id" => "player3Sideboard",
        "stackIds" => [],
        "type" => "discard"
      },
      "player1Discard" => %{
        "controller" => "player1",
        "id" => "player1Discard",
        "stackIds" => [],
        "type" => "discard"
      },
      "player4Event" => %{
        "controller" => "player4",
        "id" => "player4Event",
        "stackIds" => [],
        "type" => "discard"
      },
      "player4Discard" => %{
        "controller" => "player4",
        "id" => "player4Discard",
        "stackIds" => [],
        "type" => "discard"
      },
      "sharedActive" => %{
        "controller" => "shared",
        "id" => "sharedActive",
        "stackIds" => [],
        "type" => "play"
      },
      "player1Play1" => %{
        "controller" => "player1",
        "id" => "player1Play1",
        "stackIds" => ["15b4febf-b850-428b-953c-bc1fe54d3058",
         "39484ccc-e578-43fd-9590-7bf9f6c0e800"],
        "type" => "play"
      },
      "player3Play2" => %{
        "controller" => "player3",
        "id" => "player3Play2",
        "stackIds" => [],
        "type" => "play"
      },
      "player3Event" => %{
        "controller" => "player3",
        "id" => "player3Event",
        "stackIds" => [],
        "type" => "discard"
      },
      "sharedQuestDeck" => %{
        "controller" => "shared",
        "id" => "sharedQuestDeck",
        "stackIds" => [],
        "type" => "deck"
      },
      "player2Engaged" => %{
        "controller" => "player2",
        "id" => "player2Engaged",
        "stackIds" => [],
        "type" => "play"
      },
      "sharedQuestDiscard" => %{
        "controller" => "shared",
        "id" => "sharedQuestDiscard",
        "stackIds" => [],
        "type" => "discard"
      },
      "sharedEncounterDiscard2" => %{
        "controller" => "shared",
        "id" => "sharedEncounterDiscard2",
        "stackIds" => [],
        "type" => "discard"
      },
      "player2Event" => %{
        "controller" => "player2",
        "id" => "player2Event",
        "stackIds" => [],
        "type" => "discard"
      },
      "sharedEncounterDeck2" => %{
        "controller" => "shared",
        "id" => "sharedEncounterDeck2",
        "stackIds" => [],
        "type" => "deck"
      },
      "sharedEncounterDiscard3" => %{
        "controller" => "shared",
        "id" => "sharedEncounterDiscard3",
        "stackIds" => [],
        "type" => "discard"
      },
      "player3Hand" => %{
        "controller" => "player3",
        "id" => "player3Hand",
        "stackIds" => [],
        "type" => "hand"
      },
      "sharedSetAside" => %{
        "controller" => "shared",
        "id" => "sharedSetAside",
        "stackIds" => [],
        "type" => "hand"
      },
      "player2Discard" => %{
        "controller" => "player2",
        "id" => "player2Discard",
        "stackIds" => [],
        "type" => "discard"
      },
      "player4Play1" => %{
        "controller" => "player4",
        "id" => "player4Play1",
        "stackIds" => [],
        "type" => "play"
      },
      "player4Engaged" => %{
        "controller" => "player4",
        "id" => "player4Engaged",
        "stackIds" => [],
        "type" => "play"
      },
      "player2Hand" => %{
        "controller" => "player2",
        "id" => "player2Hand",
        "stackIds" => [],
        "type" => "hand"
      },
      "player1Hand" => %{
        "controller" => "player1",
        "id" => "player1Hand",
        "stackIds" => ["0a0c0c35-9384-45a9-bbc9-988ab340b1a5",
         "669ad0e4-463a-4678-90aa-e605d1bb0464",
         "d6f33783-9e67-466d-8744-87daa48112cd",
         "dfcc87f8-a434-4a55-a33c-d783df955cce",
         "ac760306-5ce0-4b53-ad48-5fe9f2e598af",
         "6506a5f1-6866-424b-b02f-630fbf00bdcf"],
        "type" => "hand"
      },
      "sharedEncounterDiscard" => %{
        "controller" => "shared",
        "id" => "sharedEncounterDiscard",
        "stackIds" => [],
        "type" => "discard"
      },
      "sharedOther" => %{
        "controller" => "shared",
        "id" => "sharedOther",
        "stackIds" => [],
        "type" => "hand"
      },
      "sharedExtra1" => %{
        "controller" => "shared",
        "id" => "sharedExtra1",
        "stackIds" => [],
        "type" => "play"
      },
      "player4Deck" => %{
        "controller" => "player4",
        "id" => "player4Deck",
        "stackIds" => [],
        "type" => "deck"
      },
      "player1Event" => %{
        "controller" => "player1",
        "id" => "player1Event",
        "stackIds" => [],
        "type" => "discard"
      },
      "player3Engaged" => %{
        "controller" => "player3",
        "id" => "player3Engaged",
        "stackIds" => [],
        "type" => "play"
      },
      "sharedEncounterDeck" => %{
        "controller" => "shared",
        "id" => "sharedEncounterDeck",
        "stackIds" => [],
        "type" => "deck"
      },
      "player3Deck" => %{
        "controller" => "player3",
        "id" => "player3Deck",
        "stackIds" => [],
        "type" => "deck"
      },
      "player4Sideboard" => %{
        "controller" => "player4",
        "id" => "player4Sideboard",
        "stackIds" => [],
        "type" => "discard"
      },
      "player3Discard" => %{
        "controller" => "player3",
        "id" => "player3Discard",
        "stackIds" => [],
        "type" => "discard"
      },
      "sharedStaging" => %{
        "controller" => "shared",
        "id" => "sharedStaging",
        "stackIds" => [],
        "type" => "play"
      },
      "sharedVictory" => %{
        "controller" => "shared",
        "id" => "sharedVictory",
        "stackIds" => [],
        "type" => "hand"
      },
      "player1Deck" => %{
        "controller" => "player1",
        "id" => "player1Deck",
        "stackIds" => ["7ed70c1d-9d75-4df1-bfa3-c7126ed5261c",
         "97f642d8-3973-4523-a9f1-b41714dff3e9",
         "77c2dd8d-2e3c-4357-b0d6-ac56d87c6354",
         "a6de7289-db79-44c7-96a6-e4dab42c9fc2"],
        "type" => "deck"
      },
      "player1Engaged" => %{
        "controller" => "player1",
        "id" => "player1Engaged",
        "stackIds" => [],
        "type" => "play"
      },
      "player3Play1" => %{
        "controller" => "player3",
        "id" => "player3Play1",
        "stackIds" => [],
        "type" => "play"
      },
      "player2Play2" => %{
        "controller" => "player2",
        "id" => "player2Play2",
        "stackIds" => [],
        "type" => "play"
      },
      "player4Hand" => %{
        "controller" => "player4",
        "id" => "player4Hand",
        "stackIds" => [],
        "type" => "hand"
      },
      "sharedExtra3" => %{
        "controller" => "shared",
        "id" => "sharedExtra3",
        "stackIds" => [],
        "type" => "play"
      },
      "player1Sideboard" => %{
        "controller" => "player1",
        "id" => "player1Sideboard",
        "stackIds" => ["2a8b7bc5-1b67-40f7-8edb-b870ced7d965"],
        "type" => "discard"
      },
      "player1Play2" => %{
        "controller" => "player1",
        "id" => "player1Play2",
        "stackIds" => [],
        "type" => "play"
      },
      "sharedEncounterDeck3" => %{
        "controller" => "shared",
        "id" => "sharedEncounterDeck3",
        "stackIds" => [],
        "type" => "deck"
      },
      "player2Sideboard" => %{
        "controller" => "player2",
        "id" => "player2Sideboard",
        "stackIds" => [],
        "type" => "discard"
      }
    },
    "options" => %SpadesGame.GameOptions{
      __meta__: '#Ecto.Schema.Metadata<:built, "gameuioptions">',
      hardcoded_cards: nil,
      id: nil
    },
    "phase" => "Beginning",
    "playerData" => %{
      "player1" => %{
        "cards_drawn_during_resource" => 1,
        "eliminated" => false,
        "threat" => 9,
        "willpower" => 0
      },
      "player2" => %{
        "cards_drawn_during_resource" => 1,
        "eliminated" => false,
        "threat" => 0,
        "willpower" => 0
      },
      "player3" => %{
        "cards_drawn_during_resource" => 1,
        "eliminated" => false,
        "threat" => 0,
        "willpower" => 0
      },
      "player4" => %{
        "cards_drawn_during_resource" => 1,
        "eliminated" => false,
        "threat" => 0,
        "willpower" => 0
      }
    },
    "roundNumber" => 0,
    "roundStep" => "0.0",
    "stackById" => %{
      "0a0c0c35-9384-45a9-bbc9-988ab340b1a5" => %{
        "cardIds" => ["8d8554fd-c5fb-4d5a-baac-f8bebbb2a573"],
        "id" => "0a0c0c35-9384-45a9-bbc9-988ab340b1a5"
      },
      "15b4febf-b850-428b-953c-bc1fe54d3058" => %{
        "cardIds" => ["b197dee4-2c0c-4d8d-b361-0371084a49e9"],
        "id" => "15b4febf-b850-428b-953c-bc1fe54d3058"
      },
      "2a8b7bc5-1b67-40f7-8edb-b870ced7d965" => %{
        "cardIds" => ["a63cefd7-5ed2-4919-a0e3-59caf6c69ef3"],
        "id" => "2a8b7bc5-1b67-40f7-8edb-b870ced7d965"
      },
      "39484ccc-e578-43fd-9590-7bf9f6c0e800" => %{
        "cardIds" => ["222b336e-31d3-4970-9aba-dbd042fe5861"],
        "id" => "39484ccc-e578-43fd-9590-7bf9f6c0e800"
      },
      "6506a5f1-6866-424b-b02f-630fbf00bdcf" => %{
        "cardIds" => ["394137c9-816a-4392-90b1-dc14f5e177b3"],
        "id" => "6506a5f1-6866-424b-b02f-630fbf00bdcf"
      },
      "669ad0e4-463a-4678-90aa-e605d1bb0464" => %{
        "cardIds" => ["5e1e27c7-a171-4d14-8b4d-c9d617c89f11"],
        "id" => "669ad0e4-463a-4678-90aa-e605d1bb0464"
      },
      "77c2dd8d-2e3c-4357-b0d6-ac56d87c6354" => %{
        "cardIds" => ["e1a61cfb-071d-4f40-9bd9-31e9550dd9d1"],
        "id" => "77c2dd8d-2e3c-4357-b0d6-ac56d87c6354"
      },
      "7ed70c1d-9d75-4df1-bfa3-c7126ed5261c" => %{
        "cardIds" => ["fdbee10f-3d26-4081-a80f-1e6467cc9eef"],
        "id" => "7ed70c1d-9d75-4df1-bfa3-c7126ed5261c"
      },
      "97f642d8-3973-4523-a9f1-b41714dff3e9" => %{
        "cardIds" => ["e5209581-ef58-4225-b6ab-476b69b9b8ea"],
        "id" => "97f642d8-3973-4523-a9f1-b41714dff3e9"
      },
      "a6de7289-db79-44c7-96a6-e4dab42c9fc2" => %{
        "cardIds" => ["c286195e-cc13-42f1-a7d1-e29d1f0981db"],
        "id" => "a6de7289-db79-44c7-96a6-e4dab42c9fc2"
      },
      "ac760306-5ce0-4b53-ad48-5fe9f2e598af" => %{
        "cardIds" => ["2d1abc22-6957-44d9-a15a-be2ac00eb1eb"],
        "id" => "ac760306-5ce0-4b53-ad48-5fe9f2e598af"
      },
      "d6f33783-9e67-466d-8744-87daa48112cd" => %{
        "cardIds" => ["0d27b29a-a784-411b-95d4-005ca85710eb"],
        "id" => "d6f33783-9e67-466d-8744-87daa48112cd"
      },
      "dfcc87f8-a434-4a55-a33c-d783df955cce" => %{
        "cardIds" => ["5488a77e-ec82-4b34-a67b-8985731f7b7d"],
        "id" => "dfcc87f8-a434-4a55-a33c-d783df955cce"
      }
    }
  }
end





end
