defmodule SpadesGame.GameScore do
  @moduledoc """
  Represents the score of a team.
  """
  #               You and Bill     Mike and Lisa
  # Combined Bid       6                 5
  # Tricks Won         7                 6
  # Bags               1                 1
  # Bags From Last     0                 0
  # Total Bags         1                 1
  ###########################################
  # Successful Bid     60               50
  # (ex: Failed Bid: -40)
  # (ex: Successful nil bid: 100)  Should this be 50 or 70?
  # (ex: Failed nil bid: -100)
  # Bag                 1                1
  # Points This Round  61               51
  # Prev                0                0 
  ###########################################
  # Total              61               51
end
