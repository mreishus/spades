defmodule Spades.Rot13 do
  @moduledoc """
  `Rot13` performs a [Caesar cipher](https://en.wikipedia.org/wiki/Caesar_cipher), shifting 13 places up the English alphabet.
  """

  @doc """
  Returns an `:ok` tuple with an encoded string, ignoring numbers and punctuation.

  ## Examples

      iex> Rot13.encode("Execute Order 66!")
      {:ok, "Rkrphgr Beqre 66!"}

      iex> Rot13.encode(42)
      {:error, "Value cannot be encoded"}

  """
  def encode(text) when is_binary(text), do: {:ok, rotate(text)}
  def encode(_), do: {:error, "Value cannot be encoded"}

  @doc """
  Returns an encoded string, raising an `ArgumentError` if the value passed can't be encoded.

  ## Examples

      iex> Rot13.encode!("Execute Order 66!")
      "Rkrphgr Beqre 66!"

      iex> Rot13.encode!(42)
      ** (ArgumentError) Value cannot be encoded

  """
  def encode!(text) do
    case encode(text) do
      {:ok, encoded} ->
        encoded

      {:error, reason} ->
        raise ArgumentError, reason
    end
  end

  @doc """
  This is a (poor) attempt at humor.

  ## Examples

      iex> Rot13.decode("Execute Order 66!")
      {:ok, "Rkrphgr Beqre 66!"}

      iex> Rot13.encode(42)
      {:error, "Value cannot be encoded"}

  """
  defdelegate decode(text), to: __MODULE__, as: :encode

  defp rotate(<<char>> <> text) do
    <<rotate_char(char)>> <> rotate(text)
  end

  defp rotate(_), do: ""

  defp rotate_char(char) when char in ?a..?z do
    rem(char - ?a + 13, 26) + ?a
  end

  defp rotate_char(char) when char in ?A..?Z do
    rem(char - ?A + 13, 26) + ?A
  end

  defp rotate_char(char), do: char
end
