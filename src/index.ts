import { VideoPlayer } from "./VideoPlayer";

const video = document.querySelector("video");
const player = new VideoPlayer(video);

const selector = document.querySelector("select");
selector.addEventListener("change", () => player.load(selector.options[selector.selectedIndex].value));
selector.disabled = false;
