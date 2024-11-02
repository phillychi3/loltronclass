// ==UserScript==
// @name         lol tronclass
// @namespace    no
// @version      0.2
// @description  lol teacher
// @author       lol
// @match        https://eclass.yuntech.edu.tw/course/*
// @match        https://eclass.yuntech.edu.tw/exam/*
// @match        https://elearning.yuntech.edu.tw/learn/exam/*
// @icon         https://media.discordapp.net/attachments/922733774633050112/969011518861623376/256.png
// @grant        none
// @license MIT
// ==/UserScript==

for (let event_name of ["visibilitychange", "webkitvisibilitychange", "blur"]) {
  window.addEventListener(
    event_name,
    function (event) {
      event.stopImmediatePropagation();
    },
    true
  );
}

for (let full_event_name of [
  "fullscreenElement",
  "fullscreenEnabled",
  "mozFullScreenEnabled",
  "webkitFullscreenEnabled",
  "msFullscreenEnabled",
  "webkitIsFullScreen",
]) {
  window.addEventListener(
    full_event_name,
    function (event) {
      event.stopImmediatePropagation();
    },
    true
  );
}

window.addEventListener(
  "load",
  function () {
    document.getElementById("Symbol(water-mark)").style.background = "";
  },
  false
);
