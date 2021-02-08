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
      "gSharedQuestDeck"=>         Group.new("gSharedQuestDeck","deck","Shared"),
      "gSharedQuestDiscard"=>      Group.new("gSharedQuestDiscard","discard","Shared"),
      "gSharedEncounterDeck"=>     Group.new("gSharedEncounterDeck","deck","Shared"),
      "gSharedEncounterDiscard"=>  Group.new("gSharedEncounterDiscard","discard","Shared"),
      "gSharedQuestDeck2"=>        Group.new("gSharedQuestDeck2","hand","Shared"),
      "gSharedQuestDiscard2"=>     Group.new("gSharedQuestDiscard2","discard","Shared"),
      "gSharedEncounterDeck2"=>    Group.new("gSharedEncounterDeck2","deck","Shared"),
      "gSharedEncounterDiscard2"=> Group.new("gSharedEncounterDiscard2","discard","Shared"),
      "gSharedEncounterDeck3"=>    Group.new("gSharedEncounterDeck3","deck","Shared"),
      "gSharedEncounterDiscard3"=> Group.new("gSharedEncounterDiscard3","discard","Shared"),
      "gSharedOther"=>             Group.new("gSharedOther","hand","Shared"),
      "gSharedSetAside"=>          Group.new("gSharedSetAside","hand","Shared"),
      "gSharedVictory"=>           Group.new("gSharedVictory","hand","Shared"),
      "gSharedStaging"=>           Group.new("gSharedStaging","play","Shared"),
      "gSharedActive"=>            Group.new("gSharedActive","play","Shared"),
      "gSharedMainQuest"=>         Group.new("gSharedMainQuest","play","Shared"),
      "gSharedExtra1"=>            Group.new("gSharedExtra1","play","Shared"),
      "gSharedExtra2"=>            Group.new("gSharedExtra2","play","Shared"),
      "gSharedExtra3"=>            Group.new("gSharedExtra3","play","Shared"),
      "gPlayer1Hand"=>             Group.new("gPlayer1Hand","hand","Player1"),
      "gPlayer1Deck"=>             Group.new("gPlayer1Deck","deck","Player1"),
      "gPlayer1Discard"=>          Group.new("gPlayer1Discard","discard","Player1"),
      "gPlayer1Sideboard"=>        Group.new("gPlayer1Sideboard","discard","Player1"),
      "gPlayer1Play1"=>            Group.new("gPlayer1Play1","play","Player1"),
      "gPlayer1Play2"=>            Group.new("gPlayer1Play2","play","Player1"),
      "gPlayer1Engaged"=>          Group.new("gPlayer1Engaged","play","Player1"),
      "gPlayer1Event"=>            Group.new("gPlayer1Event","discard","Player1"),
      "gPlayer2Hand"=>             Group.new("gPlayer2Hand","hand","Player2"),
      "gPlayer2Deck"=>             Group.new("gPlayer2Deck","deck","Player2"),
      "gPlayer2Discard"=>          Group.new("gPlayer2Discard","discard","Player2"),
      "gPlayer2Sideboard"=>        Group.new("gPlayer2Sideboard","discard","Player2"),
      "gPlayer2Play1"=>            Group.new("gPlayer2Play1","play","Player2"),
      "gPlayer2Play2"=>            Group.new("gPlayer2Play2","play","Player2"),
      "gPlayer2Engaged"=>          Group.new("gPlayer2Engaged","play","Player2"),
      "gPlayer2Event"=>            Group.new("gPlayer2Event","discard","Player2"),
      "gPlayer3Hand"=>             Group.new("gPlayer3Hand","hand","Player3"),
      "gPlayer3Deck"=>             Group.new("gPlayer3Deck","deck","Player3"),
      "gPlayer3Discard"=>          Group.new("gPlayer3Discard","discard","Player3"),
      "gPlayer3Sideboard"=>        Group.new("gPlayer3Sideboard","discard","Player3"),
      "gPlayer3Play1"=>            Group.new("gPlayer3Play1","play","Player3"),
      "gPlayer3Play2"=>            Group.new("gPlayer3Play2","play","Player3"),
      "gPlayer3Engaged"=>          Group.new("gPlayer3Engaged","play","Player3"),
      "gPlayer3Event"=>            Group.new("gPlayer3Event","discard","Player3"),
      "gPlayer4Hand"=>             Group.new("gPlayer4Hand","hand","Player4"),
      "gPlayer4Deck"=>             Group.new("gPlayer4Deck","deck","Player4"),
      "gPlayer4Discard"=>          Group.new("gPlayer4Discard","discard","Player4"),
      "gPlayer4Sideboard"=>        Group.new("gPlayer4Sideboard","discard","Player4"),
      "gPlayer4Play1"=>            Group.new("gPlayer4Play1","play","Player4"),
      "gPlayer4Play2"=>            Group.new("gPlayer4Play2","play","Player4"),
      "gPlayer4Engaged"=>          Group.new("gPlayer4Engaged","play","Player4"),
      "gPlayer4Event"=>            Group.new("gPlayer4Event","discard","Player4"),
    }
  end

end
