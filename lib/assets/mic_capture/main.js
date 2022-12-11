export function init(ctx, info) {
  ctx.importCSS("main.css");

  const bufferSize = 0; // auto
  let rawStream;
  let stream;
  let audioContext;
  let audioProcessor;
  let buffer = new Float32Array();
  let sum = 0;
  let avg = 0;
  let processing = false;

  let button = document.createElement("button");
  button.id = "rec-button";
  button.append("Capture microphone")
  button.addEventListener("click", open);

  let wrap = document.createElement("div");
  wrap.id = "wrapper";

  let indicator = document.createElement("div");
  indicator.id = "indicator";

  function process(event) {
    const buf = event.inputBuffer.getChannelData(0);

    let peak = Math.max.apply(null, buf); // -1.0 to +1.0, 0 is no sound
    peak += Math.max(0.0, peak); // 0.0 to +1.0, 0 is no sound
    peak = peak * 100; // percentage!

    if (!processing) {
      processing = true;
      requestAnimationFrame(function () {
        indicator.style.height = Math.round(peak) + "%";
        // Delay redraw
        //window.setTimeout(() => {
        processing = false;
        //}, 500);
      });
    }
    ctx.pushEvent("microphone_input", [{ info: "foo" }, buf.buffer]);
  }

  function open() {
    button.innerText = "Capturing...";
    button.disabled = true;


    audioContext = new AudioContext({ sampleRate: 16000 });
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    }).then((rawStream) => {
      rawStream = rawStream;
      stream = audioContext.createMediaStreamSource(rawStream);

      audioProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);
      audioProcessor.onaudioprocess = process;
      stream.connect(audioProcessor);
      audioProcessor.connect(audioContext.destination);
    });
  }

  ctx.root.append(button);
  wrap.append(indicator);
  ctx.root.append(wrap);
}