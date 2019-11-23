defmodule SpadesGame.GameAI.PlayInfo do
  @moduledoc """
  Info structure used by GameAI.Play.
  Contains information the algo needs to 
  figure out which card to play.
  """
  alias SpadesGame.GameAI.PlayInfo
  alias SpadesGame.{Deck, TrickCard}

  @derive Jason.Encoder

  defstruct [
    :hand,
    :valid_cards,
    :trick,
    :me_nil,
    :partner_nil,
    :left_nil,
    :right_nil,
    :partner_winning
  ]

  use Accessible

  @type t :: %PlayInfo{
          hand: Deck.t(),
          valid_cards: Deck.t(),
          trick: list(TrickCard.t()),
          me_nil: boolean,
          partner_nil: boolean,
          left_nil: boolean,
          right_nil: boolean,
          partner_winning: boolean
        }
end
