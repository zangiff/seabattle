"use strict";

//==================Dark and Light mode switcher================================
window.addEventListener("DOMContentLoaded", () =>{
  let head = document.head,
      link = document.createElement("link");
  link.rel = "stylesheet";
  if(localStorage.getItem("themeStyle") === "dark") {
    link.href = "./css/dark.min.css";
  } else {
    localStorage.setItem("themeStyle", "light");
    link.href = "./css/light.min.css";
  }
  head.appendChild(link);
  document.addEventListener("click", evt => {
    if(evt.target.closest("div").id === "light-switch" && localStorage.getItem("themeStyle") === "dark") {
      localStorage.setItem("themeStyle", "light");
      link.href = "./css/light.min.css";
    } else if(evt.target.closest("div").id === "dark-switch" && localStorage.getItem("themeStyle") === "light") {
      localStorage.setItem("themeStyle", "dark");
      link.href = "./css/dark.min.css";
    } else {
      return;
    }
  });
});
