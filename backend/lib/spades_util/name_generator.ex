defmodule SpadesUtil.NameGenerator do
  @moduledoc """
  NameGenerator: Makes random room names.
  """

  @doc """
  generate/1: Takes no input.  Outputs a string of a random room name.
  """
  def generate do
    [
      Enum.random(adj()),
      Enum.random(noun()),
      :rand.uniform(9999)
    ]
    |> Enum.join("-")
  end

  defp adj do
    ~w[
becoming
bucolic
chatoyant
comely
demure
desultory
diaphanous
dulcet
effervescent
ephemeral
ethereal
evanescent
evocative
fetching
fugacious
furtive
gossamer
halcyon
incipient
ineffable
labyrinthine
lissome
lithe
mellifluous
murmurous
opulent
pyrrhic
quintessential
redolent
riparian
sempiternal
summery
sumptuous
surreptitious
susurrous
untoward
vestigial
woebegone
    ]
  end

  defp noun do
    ~w[
ailurophile
assemblage
brood
bungalow
cynosure
dalliance
demesne
denouement
desuetude
ebullience
elision
elixir
eloquence
epiphany
felicity
forbearance
glamour
harbinger
imbrication
imbroglio
ingénue
inglenook
insouciance
lagniappe
lagoon
languor
lassitude
leisure
love
moiety
mondegreen
nemesis
offing
onomatopoeia
palimpsest
panacea
panoply
pastiche
penumbra
petrichor
plethora
propinquity
ratatouille
ripple
scintilla
serendipity
susquehanna
talisman
tintinnabulation
umbrella
wafture
    ]
  end
end
