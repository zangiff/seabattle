"use strict";

//====================Main constantes and Variables=============================
const
      //===============Constantes for Shooting process=================
      battleField           = document.querySelector(".board__field__body"),
      boardCoordsInput      = document.querySelector("#board-coords"),
      fireButton            = document.querySelector("#fire-button"),
      shootingForm          = document.querySelector("#board-shot"),

      //============Constantes from LEFT Aside=========================
      totalScore            = document.querySelector(".board__info-left__score-sum"),
      // shipsSunkName         = document.querySelector(".board__info-left__sunk-item-name"),
      shipsSunkQuantity     = document.querySelector(".board__info-left__sunk-item-quantity"),
      // shipsSunkTotal        = document.querySelector(".board__info-left__sunk-total-quantity"),
      // shipsDamagedName      = document.querySelector(".board__info-left__damaged-item-name"),
      shipsDamagedQuantity  = document.querySelector(".board__info-left__damaged-item-quantity"),

      //================Constantes from RIGHT Aside====================
      totalMoves            = document.querySelector(".board__info-right__moves-sum"),
      // shipsLeftName         = document.querySelector(".board__info-right__left-item-name"),
      shipsLeftQuantity     = document.querySelector(".board__info-right__left-item-quantity"),

      //==========Constantes for HEADER HANDLE Buttons=================
      headerButtonShow      = document.querySelector("#header-button-show"),
      headerButtonAsk       = document.querySelector("#header-button-ask"),
      headerButtonRestart   = document.querySelector("#header-button-restart");

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

//=======================Game Event Listeners===================================
battleField.addEventListener("click", battleFieldHandler);
// shootingForm.addEventListener("submit", shootingFormHandler);
fireButton.addEventListener("click", fireButtonHandler);
boardCoordsInput.addEventListener("keydown", boardCoordsInputHandler);

function battleFieldHandler(evt) {
  if(evt.target.closest("TD").classList.contains("board__field__body__cell")) {
    controller.fireHandler(+evt.target.closest("TD").id);
  }
}

// function shootingFormHandler() {
//   evt.preventDefault();
//     return false;
// }

function boardCoordsInputHandler(evt) {
  if(evt.keyCode === 13 && evt.target.checkValidity()) {
    controller.fireHandler(controller.parseCoords(boardCoordsInput.value));
  } else {
    view.displayMessage("Enter the correct data first");
  }
}

function fireButtonHandler(evt) {
  evt.preventDefault();
  if(boardCoordsInput.checkValidity()) {
    controller.fireHandler(controller.parseCoords(boardCoordsInput.value));
  } else {
    view.displayMessage("Enter the correct coordinates");
  }
}

//===================Handle Button Event Listeners==============================
headerButtonRestart.addEventListener("click", headerButtonRestartHandler);
headerButtonShow.addEventListener("click", headerButtonShowHandler);
headerButtonAsk.addEventListener("click", headerButtonAskHandler);

function headerButtonRestartHandler() {
  view.displayMessage("Loading new game...");
  setTimeout(() => {
    location.reload();
  }, 1000);
}

function headerButtonShowHandler() {
  let point = 0;
  model.locationsAll.forEach(item => {
    item.forEach(coordinate => {
      point = document.getElementById(coordinate);
      if(!point.classList.contains("red") && !point.classList.contains("black")) {
        point.classList.add("blue");
      }
    });
  });
  view.displayMessage("All the ships are shown...");
  view.removeProcessListeners();
}

function headerButtonAskHandler() {
  let hint = 0;
  model.locationsAll.some(item => {
    hint = document.getElementById(item[item.length - Math.ceil(item.length / 2)]);
    if(!hint.classList.contains("red") && !hint.classList.contains("black")) {
      hint.classList.add("orange");
      setTimeout(() => {
        hint.classList.remove("orange");
      }, 2000);
      view.displayMessage("Getting a hint...");
      setTimeout(() => {
        view.displayMessage("Now make your shot!");
      }, 2000);
      return true;
    }
  });
}

//====================VIEW AREA=================================================
const view = {
  displayMessage(msg) {
    let messageArea = document.getElementById("messageArea");
    messageArea.textContent = msg;
  },

  displayShot(location) {
    let cell = document.getElementById(location);
    cell.classList.add("green");
    this.displayMessage("Your miss...");
  },

  displayHit(location) {
    let target = document.getElementById(location);
    target.classList.remove("green");
    target.classList.add("red");
    this.displayMessage("Your luck!")
  },

  displaySunk(ship) {
    ship.locationPoints.forEach(item => {
      let sunk = document.getElementById(item);
      sunk.classList.remove("red");
      sunk.classList.add("black");
    });
    ship.whiteSpace.forEach(item => {
      let padding = document.getElementById(item);
      if(!padding.classList.contains("green")) {
        padding.classList.add("yellow");
      }
    })
    this.displayMessage("Enemy ship was sunk!!!");
  },

  //================Process Listeners Remover==================
  removeProcessListeners() {
    battleField.removeEventListener("click", battleFieldHandler);
    // shootingForm.removeEventListener("submit", shootingFormHandler);
    fireButton.removeEventListener("click", fireButtonHandler);
    boardCoordsInput.removeEventListener("keydown", boardCoordsInputHandler);
    headerButtonAsk.removeEventListener("click", headerButtonAskHandler);
  }
}

//======================MODEL AREA==============================================
const model = {
  boardSize: 20,
  totalShips: 16,
  totalTaken: [],
  locationsAll: [],
  ship: {},

  //=================Main ships Object================================
  ships: {
    battleship: {
      locationPoints: ["0", "0", "0", "0"],
      hits: 0,
      shipLength: 4,
      whiteSpace: []
    },
    criuserA: {
      locationPoints: ["0", "0", "0"],
      hits: 0,
      shipLength: 3,
      whiteSpace: []
    },
    cruiserB: {
      locationPoints: ["0", "0", "0"],
      hits: 0,
      shipLength: 3,
      whiteSpace: []
    },
    cruiserC: {
      locationPoints: ["0", "0", "0"],
      hits: 0,
      shipLength: 3,
      whiteSpace: []
    },
    destroyerA: {
      locationPoints: ["0", "0"],
      hits: 0,
      shipLength: 2,
      whiteSpace: []
    },
    destroyerB: {
      locationPoints: ["0", "0"],
      hits: 0,
      shipLength: 2,
      whiteSpace: []
    },
    destroyerC: {
      locationPoints: ["0", "0"],
      hits: 0,
      shipLength: 2,
      whiteSpace: []
    },
    destroyerD: {
      locationPoints: ["0", "0"],
      hits: 0,
      shipLength: 2,
      whiteSpace: []
    },
    destroyerE: {
      locationPoints: ["0", "0"],
      hits: 0,
      shipLength: 2,
      whiteSpace: []
    },
    submarineA: {
      locationPoints: ["0"],
      hits: 0,
      shipLength: 1,
      whiteSpace: []
    },
    submarineB: {
      locationPoints: ["0"],
      hits: 0,
      shipLength: 1,
      whiteSpace: []
    },
    submarineC: {
      locationPoints: ["0"],
      hits: 0,
      shipLength: 1,
      whiteSpace: []
    },
    submarineD: {
      locationPoints: ["0"],
      hits: 0,
      shipLength: 1,
      whiteSpace: []
    },
    submarineE: {
      locationPoints: ["0"],
      hits: 0,
      shipLength: 1,
      whiteSpace: []
    },
    submarineF: {
      locationPoints: ["0"],
      hits: 0,
      shipLength: 1,
      whiteSpace: []
    },
    submarineG: {
      locationPoints: ["0"],
      hits: 0,
      shipLength: 1,
      whiteSpace: []
    }
  },

//==============Generation of Ships================================
  generateShips() {
    for(let key in this.ships) {
      let
          //===Vertical or Horizontal Ship Position================
          direction   = Math.floor(Math.random() * 2),
          //===Entry Point Position================================
          entryPoint  = 0,
          //======Columns and Rows=================================
          cols        = Math.ceil(Math.random() * this.boardSize),
          rows        = Math.floor(Math.random() * (this.boardSize));
          //==============Current Ship=============================
          this.ship   = this.ships[key];
          //=============Generation New Ship=======================
      do {
        if(direction === 0) {
          rows = Math.floor(Math.random() * (this.boardSize - this.ship.shipLength));
          entryPoint = rows * this.boardSize + cols;
          for(let i = 0; i < this.ship.shipLength; i++) {
            this.ship.locationPoints[i] = entryPoint;
            entryPoint += 20;
          }
        } else {
          cols = Math.ceil(Math.random() * (this.boardSize - this.ship.shipLength));
          entryPoint = rows * this.boardSize + cols;
          for(let i = 0; i < this.ship.shipLength; i++) {
            this.ship.locationPoints[i] = entryPoint;
            entryPoint++;
          }
        }
      } while(this.isCollision(this.ship.locationPoints));
      console.log(this.ship.locationPoints); //===================Single visible  to console.log==============
      this.locationsAll.push(this.ship.locationPoints);
      // console.log(this.locationsAll);
      //==========Adding the ship and it's whitespace to database====
      this.ship.locationPoints.forEach(item => {
        this.totalTaken.push(item);
      });
      this.setWhiteSpace(this.ship.locationPoints);
    }
  },

  //==============White Space and Taken Cells Settings=======
    setWhiteSpace(locationPoints) {
      //=======LET variables declaration=====================
      let container       = new Set(),
          negativeValue   = 0,
          positiveValue   = 0;
      //==========Adding all possible boundaries=============
      // console.log(locationPoints);
      locationPoints.forEach(item => {
        if(+item < Math.pow(this.boardSize, 2) && +item % this.boardSize !== 0) {
          container.add(+item + 1);
        }
        if(+item > 1 && +item % this.boardSize !== 1) {
          container.add(+item - 1);
        }
        for(let i = this.boardSize + 1; i >= this.boardSize - 1; i--) {
          negativeValue = +item - i,
          positiveValue = +item + i;
          if(+item % this.boardSize === 1 && i === this.boardSize + 1) {
            negativeValue++;
          } else if (+item % this.boardSize === 1 && i === this.boardSize - 1) {
            positiveValue++;
          } else if(+item % this.boardSize === 0 && i === this.boardSize + 1) {
            positiveValue--;
          } else if(+item % this.boardSize === 0 && i === this.boardSize - 1) {
            negativeValue--;
          }
          if(negativeValue > 0) {
            container.add(negativeValue);
          }
          if(positiveValue <= Math.pow(this.boardSize, 2)) {
            container.add(positiveValue);
          }
        }
      });
      //============Removing the position of the ship in final set===========
      locationPoints.forEach(item => {
        if(container.has(item)) {
          container.delete(item);
        }
      });
      //===========Writing results to whiteSpace and TotalTaken properties===
      container.forEach(item => {
        this.ship.whiteSpace.push(item);
        this.totalTaken.push(item);
      });
      // console.log(this.ship.whiteSpace);
      // console.log(this.totalTaken);
    },

  //============Checking the collisions after ship generation================
    isCollision(locationPoints) {
      for(var i = 0; i < locationPoints.length; i++) {
        if(this.totalTaken.indexOf(locationPoints[i]) != -1) {
          return true;
        }
      }
      return false;
    },

  //===========Checking ships is sunk or not=================================
    isSunk(ship) {
      if(ship.hits === ship.shipLength) {
        return true;
      }
      return false;
    }
}

//============================CONTROLLER AREA===================================
const controller = {
  shipsSunk: 0,
  totalScore: 0,
  totalScoreBasis: 100,
  totalScoreIndex: 1,
  shipsDamaged: 0,
  totalMoves: 0,
  shipsLeft: 16,
  coordsMakeShots: [],
  ship: {},

  //==================Coords parser from Input values==================
  parseCoords(coords) {
    let alphabet  = [
                      "a", "b", "c", "d", "e",
                      "f", "g", "h", "i", "j",
                      "k", "l", "m", "n", "o",
                      "p", "q", "r", "s", "t",
                    ],
        firstChar = coords.charAt(0).toLowerCase(),
        row       = alphabet.indexOf(firstChar),
        column    = parseInt(coords.slice(1)),
        sum       = 0;
    if(coords === null || coords.length < 2 || coords.length > 3) {
      view.displayMessage("You have entered wrong coords");
    } else if(isNaN(column) || isNaN(row)) {
      view.displayMessage("Your coordinates are incorrect");
    } else if(!isNaN(firstChar)) {
      view.displayMessage("Your coords are wrong");
    } else if(column < 1 || column > model.boardSize || row < 0 || row > model.boardSize) {
      view.displayMessage("Your number is away from range");
    } else {
        sum = row * model.boardSize + column;
        return sum;
    }
    return null;
  },

  //========================Updating aside stats function===================
  updateStatistics() {
    totalScore.textContent = this.totalScore;
    shipsSunkQuantity.textContent = this.shipsSunk;
    shipsDamagedQuantity.textContent = this.shipsDamaged;
    totalMoves.textContent = this.totalMoves;
    shipsLeftQuantity.textContent = this.shipsLeft;
  },

  //================Events happening every shot=============================
  fireHandler(coords) {
    if(this.coordsMakeShots.indexOf(coords) !== -1) return;
    for(let key in model.ships) {
      this.ship = model.ships[key];
      let hit = this.ship.locationPoints.indexOf(coords);
      // console.log(hit);
      if(hit !== -1) {
        this.totalScore += this.totalScoreBasis * this.totalScoreIndex;
        this.totalScoreIndex++;
        this.ship.hits++;
        this.totalMoves++;
        this.shipsDamaged++;
        this.coordsMakeShots.push(coords);
        view.displayHit(coords);
        // console.log(model.isSunk(this.ship));
        // console.log(this.ship.hits);
        if(model.isSunk(this.ship)) {
          this.totalScore += this.totalScoreBasis * 4;
          this.shipsDamaged -= this.ship.locationPoints.length;
          this.shipsSunk++;
          this.shipsLeft--;
          this.ship.whiteSpace.forEach(item => {
            this.coordsMakeShots.push(item);
          });
          view.displaySunk(this.ship);
        }
        if(this.shipsLeft === 0) {
          view.displayMessage(`You have sunk ${model.totalShips} ships by ${this.totalMoves} shots`);
          view.removeProcessListeners();
        }
        this.updateStatistics();
        return;
      } else {
        this.totalScoreIndex === 1;
        view.displayShot(coords);
      }
    }
    this.coordsMakeShots.push(coords);
    this.totalMoves++;
    // console.log(this.coordsMakeShots);
    this.updateStatistics();
    // console.log(this.totalMoves);
  }
}

//==============================END & Game Initialization=======================
model.generateShips();
