/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/BufferingDetector.ts":
/*!**********************************!*\
  !*** ./src/BufferingDetector.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BufferingDetector": () => (/* binding */ BufferingDetector)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants.ts");

class BufferingDetector {
    constructor(video, bufferingBeginCallback, bufferingEndCallback) {
        this.video = video;
        this.bufferingBeginCallback = bufferingBeginCallback;
        this.bufferingEndCallback = bufferingEndCallback;
        this.buffering = false;
        ["canplay", "error", "play", "playing", "seeking"].forEach(event => this.video.addEventListener(event, () => this.restartDetecting()));
        ["loadstart", "pause"].forEach(event => this.video.addEventListener(event, () => this.stopDetecting()));
    }
    get currentTime() {
        return Math.floor(this.video.currentTime * 1000);
    }
    detectBuffering() {
        if (this.video.ended || this.video.paused || !this.currentTime /* begin of the video */) {
            return;
        }
        this.buffering = this.currentTime === this.previousTime;
        if (this.buffering) {
            this.handleBuffering();
        }
        else {
            this.startDetecting();
        }
    }
    handleBuffering() {
        clearTimeout(this.timeout);
        this.bufferingBeginCallback();
        this.bufferingBegin = Date.now();
    }
    restartDetecting() {
        this.stopDetecting();
        this.startDetecting();
    }
    startDetecting() {
        this.previousTime = this.currentTime;
        this.timeout = setTimeout(() => this.detectBuffering(), _constants__WEBPACK_IMPORTED_MODULE_0__.checkBufferingInterval);
    }
    stopDetecting() {
        clearTimeout(this.timeout);
        if (this.buffering) {
            this.bufferingEndCallback(Date.now() - this.bufferingBegin);
        }
        this.buffering = false;
    }
}


/***/ }),

/***/ "./src/StateLogger.ts":
/*!****************************!*\
  !*** ./src/StateLogger.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StateLogger": () => (/* binding */ StateLogger)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants.ts");
/* harmony import */ var _BufferingDetector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BufferingDetector */ "./src/BufferingDetector.ts");


class StateLogger {
    constructor(video) {
        console.log("IDLE" /* State.IDLE */);
        new _BufferingDetector__WEBPACK_IMPORTED_MODULE_1__.BufferingDetector(video, this.bufferingBeginCallback, this.bufferingEndCallback);
        Object.keys(_constants__WEBPACK_IMPORTED_MODULE_0__.statesMap).forEach((event) => {
            video.addEventListener(event, () => console.log(_constants__WEBPACK_IMPORTED_MODULE_0__.statesMap[event]));
        });
    }
    bufferingBeginCallback() {
        console.log(`${"BUFFERING" /* State.BUFFERING */} started`);
    }
    bufferingEndCallback(duration) {
        console.log(`${"BUFFERING" /* State.BUFFERING */} ended, duration ${duration}ms`);
    }
}


/***/ }),

/***/ "./src/VideoPlayer.ts":
/*!****************************!*\
  !*** ./src/VideoPlayer.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VideoPlayer": () => (/* binding */ VideoPlayer)
/* harmony export */ });
/* harmony import */ var _StateLogger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StateLogger */ "./src/StateLogger.ts");

class VideoPlayer {
    constructor(video) {
        this.video = video;
        this.destroy = () => { };
        this.handlersMap = {
            ["m3u8" /* VideoType.M3U8 */]: this.useHlsPlayer,
            ["mp4" /* VideoType.MP4 */]: this.useNativePlayer,
            ["mpd" /* VideoType.MPD */]: this.useDashPlayer,
        };
        new _StateLogger__WEBPACK_IMPORTED_MODULE_0__.StateLogger(video);
    }
    load(source) {
        var _a;
        this.destroy();
        const extension = source.split(".").pop();
        this.handlersMap[extension].call(this, source);
        (_a = this.video.play()) === null || _a === void 0 ? void 0 : _a.catch(() => { });
    }
    useDashPlayer(source) {
        const dash = dashjs.MediaPlayer().create();
        dash.initialize(this.video, source, true);
        this.destroy = () => dash.destroy();
    }
    useHlsPlayer(source) {
        if (!Hls.isSupported()) {
            return;
        }
        const hls = new Hls();
        hls.loadSource(source);
        hls.attachMedia(this.video);
        this.destroy = () => hls.destroy();
    }
    useNativePlayer(source) {
        this.video.insertAdjacentHTML("beforeend", `<source src="${source}" type="video/mp4" codecs="avc1.4d002a">`);
        this.destroy = () => (this.video.innerHTML = "");
    }
}


/***/ }),

/***/ "./src/constants.ts":
/*!**************************!*\
  !*** ./src/constants.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "checkBufferingInterval": () => (/* binding */ checkBufferingInterval),
/* harmony export */   "statesMap": () => (/* binding */ statesMap)
/* harmony export */ });
const statesMap = {
    ended: "ENDED" /* State.ENDED */,
    loadeddata: "READY" /* State.READY */,
    loadstart: "LOADING" /* State.LOADING */,
    pause: "PAUSE" /* State.PAUSE */,
    playing: "PLAYING" /* State.PLAYING */,
    seeking: "SEEKING" /* State.SEEKING */,
    //waiting: State.BUFFERING,
};
const checkBufferingInterval = 100; // ms


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _VideoPlayer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VideoPlayer */ "./src/VideoPlayer.ts");

const video = document.querySelector("video");
const player = new _VideoPlayer__WEBPACK_IMPORTED_MODULE_0__.VideoPlayer(video);
const selector = document.querySelector("select");
selector.addEventListener("change", () => player.load(selector.options[selector.selectedIndex].value));
selector.disabled = false;

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUN4QixLQUFLLDJCQUFhO0lBQ2xCLE9BQU8sK0JBQWU7SUFDdEIsT0FBTywrQkFBZTtJQUN0QiwyQkFBMkI7Q0FDOUIsQ0FBQztBQVFLLE1BQU0sc0JBQXNCLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSzs7Ozs7OztVQzNCaEQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ040QztBQUU1QyxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzlDLE1BQU0sTUFBTSxHQUFHLElBQUkscURBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUV0QyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2xELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3ZHLFFBQVEsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdmlkZW9wbGF5ZXItdGVzdC8uL3NyYy9CdWZmZXJpbmdEZXRlY3Rvci50cyIsIndlYnBhY2s6Ly92aWRlb3BsYXllci10ZXN0Ly4vc3JjL1N0YXRlTG9nZ2VyLnRzIiwid2VicGFjazovL3ZpZGVvcGxheWVyLXRlc3QvLi9zcmMvVmlkZW9QbGF5ZXIudHMiLCJ3ZWJwYWNrOi8vdmlkZW9wbGF5ZXItdGVzdC8uL3NyYy9jb25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vdmlkZW9wbGF5ZXItdGVzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly92aWRlb3BsYXllci10ZXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly92aWRlb3BsYXllci10ZXN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdmlkZW9wbGF5ZXItdGVzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3ZpZGVvcGxheWVyLXRlc3QvLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2hlY2tCdWZmZXJpbmdJbnRlcnZhbCB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuXG5leHBvcnQgY2xhc3MgQnVmZmVyaW5nRGV0ZWN0b3Ige1xuICAgIHByaXZhdGUgYnVmZmVyaW5nOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBidWZmZXJpbmdCZWdpbjogbnVtYmVyO1xuICAgIHByaXZhdGUgcHJldmlvdXNUaW1lOiBudW1iZXI7XG4gICAgcHJpdmF0ZSB0aW1lb3V0OiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PjtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHZpZGVvOiBIVE1MVmlkZW9FbGVtZW50LFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGJ1ZmZlcmluZ0JlZ2luQ2FsbGJhY2s6ICgpID0+IHZvaWQsXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgYnVmZmVyaW5nRW5kQ2FsbGJhY2s6IChkdXJhdGlvbjogbnVtYmVyKSA9PiB2b2lkXG4gICAgKSB7XG4gICAgICAgIFtcImNhbnBsYXlcIiwgXCJlcnJvclwiLCBcInBsYXlcIiwgXCJwbGF5aW5nXCIsIFwic2Vla2luZ1wiXS5mb3JFYWNoKGV2ZW50ID0+XG4gICAgICAgICAgICB0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsICgpID0+IHRoaXMucmVzdGFydERldGVjdGluZygpKVxuICAgICAgICApO1xuICAgICAgICBbXCJsb2Fkc3RhcnRcIiwgXCJwYXVzZVwiXS5mb3JFYWNoKGV2ZW50ID0+IHRoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgKCkgPT4gdGhpcy5zdG9wRGV0ZWN0aW5nKCkpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldCBjdXJyZW50VGltZSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcih0aGlzLnZpZGVvLmN1cnJlbnRUaW1lICogMTAwMCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZXRlY3RCdWZmZXJpbmcoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnZpZGVvLmVuZGVkIHx8IHRoaXMudmlkZW8ucGF1c2VkIHx8ICF0aGlzLmN1cnJlbnRUaW1lIC8qIGJlZ2luIG9mIHRoZSB2aWRlbyAqLykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYnVmZmVyaW5nID0gdGhpcy5jdXJyZW50VGltZSA9PT0gdGhpcy5wcmV2aW91c1RpbWU7XG4gICAgICAgIGlmICh0aGlzLmJ1ZmZlcmluZykge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVCdWZmZXJpbmcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnREZXRlY3RpbmcoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlQnVmZmVyaW5nKCk6IHZvaWQge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICAgICAgdGhpcy5idWZmZXJpbmdCZWdpbkNhbGxiYWNrKCk7XG4gICAgICAgIHRoaXMuYnVmZmVyaW5nQmVnaW4gPSBEYXRlLm5vdygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVzdGFydERldGVjdGluZygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdG9wRGV0ZWN0aW5nKCk7XG4gICAgICAgIHRoaXMuc3RhcnREZXRlY3RpbmcoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXJ0RGV0ZWN0aW5nKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnByZXZpb3VzVGltZSA9IHRoaXMuY3VycmVudFRpbWU7XG4gICAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5kZXRlY3RCdWZmZXJpbmcoKSwgY2hlY2tCdWZmZXJpbmdJbnRlcnZhbCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdG9wRGV0ZWN0aW5nKCk6IHZvaWQge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICAgICAgaWYgKHRoaXMuYnVmZmVyaW5nKSB7XG4gICAgICAgICAgICB0aGlzLmJ1ZmZlcmluZ0VuZENhbGxiYWNrKERhdGUubm93KCkgLSB0aGlzLmJ1ZmZlcmluZ0JlZ2luKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJ1ZmZlcmluZyA9IGZhbHNlO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFN0YXRlLCBzdGF0ZXNNYXAgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IEJ1ZmZlcmluZ0RldGVjdG9yIH0gZnJvbSBcIi4vQnVmZmVyaW5nRGV0ZWN0b3JcIjtcblxuZXhwb3J0IGNsYXNzIFN0YXRlTG9nZ2VyIHtcbiAgICBjb25zdHJ1Y3Rvcih2aWRlbzogSFRNTFZpZGVvRWxlbWVudCkge1xuICAgICAgICBjb25zb2xlLmxvZyhTdGF0ZS5JRExFKTtcbiAgICAgICAgbmV3IEJ1ZmZlcmluZ0RldGVjdG9yKHZpZGVvLCB0aGlzLmJ1ZmZlcmluZ0JlZ2luQ2FsbGJhY2ssIHRoaXMuYnVmZmVyaW5nRW5kQ2FsbGJhY2spO1xuICAgICAgICBPYmplY3Qua2V5cyhzdGF0ZXNNYXApLmZvckVhY2goKGV2ZW50OiBrZXlvZiBHbG9iYWxFdmVudEhhbmRsZXJzRXZlbnRNYXApID0+IHtcbiAgICAgICAgICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsICgpID0+IGNvbnNvbGUubG9nKHN0YXRlc01hcFtldmVudF0pKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBidWZmZXJpbmdCZWdpbkNhbGxiYWNrKCk6IHZvaWQge1xuICAgICAgICBjb25zb2xlLmxvZyhgJHtTdGF0ZS5CVUZGRVJJTkd9IHN0YXJ0ZWRgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGJ1ZmZlcmluZ0VuZENhbGxiYWNrKGR1cmF0aW9uOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgY29uc29sZS5sb2coYCR7U3RhdGUuQlVGRkVSSU5HfSBlbmRlZCwgZHVyYXRpb24gJHtkdXJhdGlvbn1tc2ApO1xuICAgIH1cbn1cbiIsImltcG9ydCBIbHNKcyBmcm9tIFwiaGxzLmpzXCI7XG5pbXBvcnQgRGFzaEpzIGZyb20gXCJkYXNoanNcIjtcbmltcG9ydCB7IFZpZGVvVHlwZSB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgU3RhdGVMb2dnZXIgfSBmcm9tIFwiLi9TdGF0ZUxvZ2dlclwiO1xuXG5kZWNsYXJlIGNvbnN0IEhsczogdHlwZW9mIEhsc0pzO1xuZGVjbGFyZSBjb25zdCBkYXNoanM6IHR5cGVvZiBEYXNoSnM7XG5cbmV4cG9ydCBjbGFzcyBWaWRlb1BsYXllciB7XG4gICAgcHJpdmF0ZSBkZXN0cm95OiAoKSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IGhhbmRsZXJzTWFwOiBSZWNvcmQ8VmlkZW9UeXBlLCAoc291cmNlOiBzdHJpbmcpID0+IHZvaWQ+ID0ge1xuICAgICAgICBbVmlkZW9UeXBlLk0zVThdOiB0aGlzLnVzZUhsc1BsYXllcixcbiAgICAgICAgW1ZpZGVvVHlwZS5NUDRdOiB0aGlzLnVzZU5hdGl2ZVBsYXllcixcbiAgICAgICAgW1ZpZGVvVHlwZS5NUERdOiB0aGlzLnVzZURhc2hQbGF5ZXIsXG4gICAgfTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgdmlkZW86IEhUTUxWaWRlb0VsZW1lbnQpIHtcbiAgICAgICAgbmV3IFN0YXRlTG9nZ2VyKHZpZGVvKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbG9hZChzb3VyY2U6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgY29uc3QgZXh0ZW5zaW9uID0gc291cmNlLnNwbGl0KFwiLlwiKS5wb3AoKSBhcyBWaWRlb1R5cGU7XG4gICAgICAgIHRoaXMuaGFuZGxlcnNNYXBbZXh0ZW5zaW9uXS5jYWxsKHRoaXMsIHNvdXJjZSk7XG4gICAgICAgIHRoaXMudmlkZW8ucGxheSgpPy5jYXRjaCgoKSA9PiB7fSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1c2VEYXNoUGxheWVyKHNvdXJjZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRhc2ggPSBkYXNoanMuTWVkaWFQbGF5ZXIoKS5jcmVhdGUoKTtcbiAgICAgICAgZGFzaC5pbml0aWFsaXplKHRoaXMudmlkZW8sIHNvdXJjZSwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuZGVzdHJveSA9ICgpID0+IGRhc2guZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXNlSGxzUGxheWVyKHNvdXJjZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmICghSGxzLmlzU3VwcG9ydGVkKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBobHMgPSBuZXcgSGxzKCk7XG4gICAgICAgIGhscy5sb2FkU291cmNlKHNvdXJjZSk7XG4gICAgICAgIGhscy5hdHRhY2hNZWRpYSh0aGlzLnZpZGVvKTtcbiAgICAgICAgdGhpcy5kZXN0cm95ID0gKCkgPT4gaGxzLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVzZU5hdGl2ZVBsYXllcihzb3VyY2U6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLnZpZGVvLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWVuZFwiLCBgPHNvdXJjZSBzcmM9XCIke3NvdXJjZX1cIiB0eXBlPVwidmlkZW8vbXA0XCIgY29kZWNzPVwiYXZjMS40ZDAwMmFcIj5gKTtcbiAgICAgICAgdGhpcy5kZXN0cm95ID0gKCkgPT4gKHRoaXMudmlkZW8uaW5uZXJIVE1MID0gXCJcIik7XG4gICAgfVxufVxuIiwiZXhwb3J0IGNvbnN0IGVudW0gU3RhdGUge1xuICAgIEJVRkZFUklORyA9IFwiQlVGRkVSSU5HXCIsXG4gICAgRU5ERUQgPSBcIkVOREVEXCIsXG4gICAgSURMRSA9IFwiSURMRVwiLFxuICAgIExPQURJTkcgPSBcIkxPQURJTkdcIixcbiAgICBQQVVTRSA9IFwiUEFVU0VcIixcbiAgICBQTEFZSU5HID0gXCJQTEFZSU5HXCIsXG4gICAgUkVBRFkgPSBcIlJFQURZXCIsXG4gICAgU0VFS0lORyA9IFwiU0VFS0lOR1wiLFxufVxuXG5leHBvcnQgY29uc3Qgc3RhdGVzTWFwOiBQYXJ0aWFsPFJlY29yZDxrZXlvZiBHbG9iYWxFdmVudEhhbmRsZXJzRXZlbnRNYXAsIFN0YXRlPj4gPSB7XG4gICAgZW5kZWQ6IFN0YXRlLkVOREVELFxuICAgIGxvYWRlZGRhdGE6IFN0YXRlLlJFQURZLFxuICAgIGxvYWRzdGFydDogU3RhdGUuTE9BRElORyxcbiAgICBwYXVzZTogU3RhdGUuUEFVU0UsXG4gICAgcGxheWluZzogU3RhdGUuUExBWUlORyxcbiAgICBzZWVraW5nOiBTdGF0ZS5TRUVLSU5HLFxuICAgIC8vd2FpdGluZzogU3RhdGUuQlVGRkVSSU5HLFxufTtcblxuZXhwb3J0IGNvbnN0IGVudW0gVmlkZW9UeXBlIHtcbiAgICBNM1U4ID0gXCJtM3U4XCIsXG4gICAgTVA0ID0gXCJtcDRcIixcbiAgICBNUEQgPSBcIm1wZFwiLFxufVxuXG5leHBvcnQgY29uc3QgY2hlY2tCdWZmZXJpbmdJbnRlcnZhbCA9IDEwMDsgLy8gbXNcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgVmlkZW9QbGF5ZXIgfSBmcm9tIFwiLi9WaWRlb1BsYXllclwiO1xuXG5jb25zdCB2aWRlbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ2aWRlb1wiKTtcbmNvbnN0IHBsYXllciA9IG5ldyBWaWRlb1BsYXllcih2aWRlbyk7XG5cbmNvbnN0IHNlbGVjdG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInNlbGVjdFwiKTtcbnNlbGVjdG9yLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4gcGxheWVyLmxvYWQoc2VsZWN0b3Iub3B0aW9uc1tzZWxlY3Rvci5zZWxlY3RlZEluZGV4XS52YWx1ZSkpO1xuc2VsZWN0b3IuZGlzYWJsZWQgPSBmYWxzZTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==