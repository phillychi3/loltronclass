// ==UserScript==
// @name         tronclass util
// @namespace    no
// @version      0.1
// @description  more useful tools for tronclass
// @author       lol
// @match        https://eclass.yuntech.edu.tw/course/*
// @icon         https://media.discordapp.net/attachments/922733774633050112/969011518861623376/256.png
// @grant        none
// @license MIT
// ==/UserScript==

// include /https?:\/\/eclass.yuntech.edu.tw\/course\/[0-9]{1,6}\/content#\//
// add a card under class="tcollapse ng-scope

(function () {
  "use strict";
  function circle_watch() {
    const video = document.querySelector("video");
    const max = video.duration;
    const maxrun = 60;
    let videodata = ""
    let lasttime = 0;
    const thisvideoid = document.URL.split("/").splice(-1).toString()
    fetch(`https://eclass.yuntech.edu.tw/api/activities/${thisvideoid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cookie: document.cookie,
    })
      .then((response) => response.json())
      .then((data) => {
        videodata = data
        console.log(data)
      }
    );
    console.log(videodata)

    for (let i = 0; i < max; i = i + maxrun) {
      setTimeout(function () {
        watchthevideo(i, i + maxrun, videodata);
      }, 2000);
      lasttime = i + maxrun;
    }
    //無法被整除的部分
    setTimeout(function () {
      watchthevideo(lasttime, max, videodata);
    }, 2000);
  }

  function watchthevideo(start, end, videodata) {
    // let start = 0;
    // let end = 120;
    let student = globalData.user;
    let course = globalData.course;
    let dep = globalData.dept;
    fetch(
      `https://eclass.yuntech.edu.tw/api/course/activities-read/${videodata.id}`,
      {
        method: "POST",
        headers: {
          Origin: "https://eclass.yuntech.edu.tw",
          Referer:
            `https://eclass.yuntech.edu.tw/course/${course.id}/learning-activity/full-screen`,
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          start: start,
          end: end,
        }),
        cookie: document.cookie,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
    fetch("https://eclass.yuntech.edu.tw/statistics/api/online-videos", {
      method: "POST",
      headers: {
        Connection: "keep-alive",
        Origin: "https://eclass.yuntech.edu.tw",
        Referer:
          `https://eclass.yuntech.edu.tw/course/${course.id}/learning-activity/full-screen`,
        "Content-Type": "Typetext/plain;charset=UTF-8",
      },
      cookie: document.cookie,

      body: JSON.stringify({
        user_id: student.id,
        org_id: 1,
        course_id: course.id,
        module_id: videodata.moduls_id,
        syllabus_id: videodata.syllabus_id,
        activity_id: videodata.id,
        upload_id: videodata.uploads[0].id,
        reply_id: null,
        comment_id: null,
        forum_type: "",
        action_type: "play",
        is_teacher: false,
        is_student: true,
        ts: Date.now(),
        user_agent:
          "Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0",
        meeting_type: "online_video",
        start_at: start,
        end_at: end,
        duration: end - start,
        master_course_id: 0,
        org_name: student.orgName,
        user_no: student.userNo,
        user_name: student.name,
        course_code: course.courseCode,
        course_name: course.name,
        dep_id: dep.id,
        dep_name: dep.name,
        dep_code: dep.code,
      }),
    }).then((response) => {
      if (response.ok) {
        console.log("success");
        console.log(response.status);
      } else {
        console.log(response);
      }
    });
  }

  function makepanel() {
    console.log("i am in");
    let panel = document.createElement("div");
    panel.innerHTML = `
    <div class="panel panel-default">
        <div class="panel-heading">
            <h4 class="panel-title">
                <a class="collapsed" data-toggle="collapse" data-parent="#accordion" aria-expanded="false">tronclass util</a>
            </h4>
        </div>
        <div class="buttons" id="buttons">
            <button class="btn btn-default" id="btn1">watch all video</button>
            <button class="btn btn-default" id="btn2">wait...</button>
        </div>
    </div>
    <style>
        .panel {
            margin-bottom: 23px;
        }
        .panel-heading {
            padding: 0px;
        }
        .panel-title {
            padding: 10px;
        }
    `;

    let target = document.querySelector(".collapse");
    target.parentNode.insertBefore(panel, target);

    let btn1 = document.getElementById("btn1");
    let btn2 = document.getElementById("btn2");
    btn1.addEventListener("click", function () {
      console.log("click1");
    });
    btn2.addEventListener("click", function () {
      console.log("click2");
    });
  }

  var observer = new MutationObserver(resetTimer);
  var timer = setTimeout(action, 1000, observer); // wait for the page to stay still for 3 seconds
  observer.observe(document, { childList: true, subtree: true });

  // reset timer every time something changes
  function resetTimer(changes, observer) {
    clearTimeout(timer);
    timer = setTimeout(action, 1000, observer);
  }

  function action(observer) {
    observer.disconnect();
    console.log("load done");
    makepanel();
  }
  console.log("tronclass util");
})();
