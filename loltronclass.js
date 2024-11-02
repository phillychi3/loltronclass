// ==UserScript==
// @name         lol tronclass
// @namespace    no
// @version      0.3
// @description  lol teacher
// @author       lol
// @match        https://eclass.yuntech.edu.tw/course/*
// @match        https://eclass.yuntech.edu.tw/exam/*
// @match        https://tronclass.com.tw/course/*
// @match        https://tronclass.com.tw/exam/*
// @match        https://elearning.yuntech.edu.tw/learn/exam/*
// @icon         https://media.discordapp.net/attachments/922733774633050112/969011518861623376/256.png
// @grant        none
// @license MIT
// ==/UserScript==

var css = document.createElement("style");
var head = document.head;
css.type = "text/css";

css.innerText = `* {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
}`;

[].forEach.call(
  [
    "visibilitychange",
    "webkitvisibilitychange",
    "blur",
    "mozvisibilitychange",
    "msvisibilitychange",
    "fullscreenElement",
    "fullscreenEnabled",
    "mozFullScreenEnabled",
    "webkitFullscreenEnabled",
    "msFullscreenEnabled",
    "webkitIsFullScreen",
  ],
  function (event_name) {
    window.addEventListener(
      event_name,
      function (event) {
        if (
          event.type.includes("visibility") ||
          event.type.includes("fullscreen") ||
          event.type === "blur"
        ) {
          event.stopImmediatePropagation();
        }
      },
      true
    );
  }
);

[].forEach.call(
  [
    "contextmenu",
    "copy",
    "cut",
    "paste",
    "mouseup",
    "mousedown",
    "keyup",
    "keydown",
    "drag",
    "dragstart",
    "select",
    "selectstart",
  ],
  function (event) {
    document.addEventListener(
      event,
      function (e) {
        e.stopPropagation();
      },
      true
    );
  }
);

[].forEach.call(["cut", "paste", "select", "selectstart"], function (event) {
  document.addEventListener(
    event,
    function (e) {
      e.stopPropagation();
    },
    true
  );
});

document.addEventListener(
  "copy",
  function (e) {
    e.preventDefault();
    e.stopPropagation();

    try {
      let copiedText = window.getSelection().toString();
      console.log("In text:", copiedText);

      let formattedText = copiedText
        .replace(/\(\d+\s*分\)/g, "")
        .replace(/[\t ]+/g, " ")
        .replace(/\n\s*\n/g, "\n")
        .replace(/([A-D])\s*\.\s*([^\n]*)/g, "$1.$2")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line)
        .join("\n")
        .trim();

      console.log("Out text:", formattedText);

      e.clipboardData.setData("text/plain", formattedText);
    } catch (error) {
      console.error("Copy formatting error:", error);
    }
  },
  {
    capture: true,
  }
);

document.oncopy = null;
document.onselectstart = null;
document.oncontextmenu = null;

window.addEventListener(
  "load",
  function () {
    document.getElementById("Symbol(water-mark)").style.background = "";
  },
  false
);

head.appendChild(css);
