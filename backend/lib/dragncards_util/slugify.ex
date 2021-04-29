defmodule DragnCardsUtil.Slugify do
  @moduledoc """
  Slugify:  Make a string suitable for a url by lowercasing it
  and changing non-word characters to spaces.
  """
  def slugify(str) do
    str
    |> String.downcase()
    |> String.replace(~r/[^\w-]+/u, "-")
  end
end
