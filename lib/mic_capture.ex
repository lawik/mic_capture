defmodule MicCapture do
  @moduledoc false

  use Kino.JS, assets_path: "lib/assets/mic_capture"
  use Kino.JS.Live

  def new(pid) do
    Kino.JS.Live.new(__MODULE__, pid)
  end

  @impl true
  def init(pid, ctx) do
    {:ok, assign(ctx, pid: pid)}
  end

  @impl true
  def handle_connect(ctx) do
    payload = %{}

    {:ok, payload, ctx}
  end


  @impl true
  def handle_event("microphone_input", {:binary, _info, buffer}, ctx) do
    send(ctx.assigns.pid, {:audio, buffer})
    {:noreply, ctx}
  end
end
