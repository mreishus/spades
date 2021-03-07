defmodule SpadesGame.Groups do
  @moduledoc """

  """
  alias SpadesGame.{Groups,Group}

  @type t :: Map.t()

  @doc """
  """
  @spec new() :: Map.t()
  def new() do
    %{
      "sharedQuestDeck"=>         Group.new("sharedQuestDeck","deck","Shared"),
      "sharedQuestDiscard"=>      Group.new("sharedQuestDiscard","discard","Shared"),
      "sharedEncounterDeck"=>     Group.new("sharedEncounterDeck","deck","Shared"),
      "sharedEncounterDiscard"=>  Group.new("sharedEncounterDiscard","discard","Shared"),
      "sharedQuestDeck2"=>        Group.new("sharedQuestDeck2","hand","Shared"),
      "sharedQuestDiscard2"=>     Group.new("sharedQuestDiscard2","discard","Shared"),
      "sharedEncounterDeck2"=>    Group.new("sharedEncounterDeck2","deck","Shared"),
      "sharedEncounterDiscard2"=> Group.new("sharedEncounterDiscard2","discard","Shared"),
      "sharedEncounterDeck3"=>    Group.new("sharedEncounterDeck3","deck","Shared"),
      "sharedEncounterDiscard3"=> Group.new("sharedEncounterDiscard3","discard","Shared"),
      "sharedOther"=>             Group.new("sharedOther","hand","Shared"),
      "sharedSetAside"=>          Group.new("sharedSetAside","hand","Shared"),
      "sharedVictory"=>           Group.new("sharedVictory","hand","Shared"),
      "sharedStaging"=>           Group.new("sharedStaging","play","Shared"),
      "sharedActive"=>            Group.new("sharedActive","play","Shared"),
      "sharedMainQuest"=>         Group.new("sharedMainQuest","play","Shared"),
      "sharedExtra1"=>            Group.new("sharedExtra1","play","Shared"),
      "sharedExtra2"=>            Group.new("sharedExtra2","play","Shared"),
      "sharedExtra3"=>            Group.new("sharedExtra3","play","Shared"),
      "player1Hand"=>             Group.new("player1Hand","hand","Player1"),
      "player1Deck"=>             Group.new("player1Deck","deck","Player1"),
      "player1Discard"=>          Group.new("player1Discard","discard","Player1"),
      "player1Sideboard"=>        Group.new("player1Sideboard","discard","Player1"),
      "player1Play1"=>            Group.new("player1Play1","play","Player1"),
      "player1Play2"=>            Group.new("player1Play2","play","Player1"),
      "player1Engaged"=>          Group.new("player1Engaged","play","Player1"),
      "player1Event"=>            Group.new("player1Event","discard","Player1"),
      "player2Hand"=>             Group.new("player2Hand","hand","Player2"),
      "player2Deck"=>             Group.new("player2Deck","deck","Player2"),
      "player2Discard"=>          Group.new("player2Discard","discard","Player2"),
      "player2Sideboard"=>        Group.new("player2Sideboard","discard","Player2"),
      "player2Play1"=>            Group.new("player2Play1","play","Player2"),
      "player2Play2"=>            Group.new("player2Play2","play","Player2"),
      "player2Engaged"=>          Group.new("player2Engaged","play","Player2"),
      "player2Event"=>            Group.new("player2Event","discard","Player2"),
      "player3Hand"=>             Group.new("player3Hand","hand","Player3"),
      "player3Deck"=>             Group.new("player3Deck","deck","Player3"),
      "player3Discard"=>          Group.new("player3Discard","discard","Player3"),
      "player3Sideboard"=>        Group.new("player3Sideboard","discard","Player3"),
      "player3Play1"=>            Group.new("player3Play1","play","Player3"),
      "player3Play2"=>            Group.new("player3Play2","play","Player3"),
      "player3Engaged"=>          Group.new("player3Engaged","play","Player3"),
      "player3Event"=>            Group.new("player3Event","discard","Player3"),
      "player4Hand"=>             Group.new("player4Hand","hand","Player4"),
      "player4Deck"=>             Group.new("player4Deck","deck","Player4"),
      "player4Discard"=>          Group.new("player4Discard","discard","Player4"),
      "player4Sideboard"=>        Group.new("player4Sideboard","discard","Player4"),
      "player4Play1"=>            Group.new("player4Play1","play","Player4"),
      "player4Play2"=>            Group.new("player4Play2","play","Player4"),
      "player4Engaged"=>          Group.new("player4Engaged","play","Player4"),
      "player4Event"=>            Group.new("player4Event","discard","Player4"),
    }
  end

end
