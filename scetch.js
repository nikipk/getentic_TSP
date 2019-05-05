//Format variables to change
const canvasHeight   = 700;
const margin         = 20;
const textSize       = 20;
const textPadding    = 5;
const scndRouteRatio = 4;  

//Dependant format variables
const canvasWidth    = window.innerWidth - 370;
const infoWidth      = canvasWidth - canvasHeight;
const margin2        = margin * 2
const section1       = margin2 + 7 * (textSize + textPadding);
const section2       = margin2 + section1 + canvasHeight / scndRouteRatio;
const section3       = margin2 + section2 + textSize;

//Timer variables
const showGenEvery   = 1;
let lastLoop         = 0;
let thisLoop         = 0;

//Variables from html-elements
let pointPlacement   = document.getElementById("pointPlacement").value;
let numberCities     = document.getElementById("numberCities").value;
let populationSize   = document.getElementById("populationSize").value;
let mutationRate     = document.getElementById("mutationRate").value;
let graphSize        = document.getElementById("graphSize").value;
const btn            = document.getElementById("settings_btn");
const canvas         = document.getElementById("canvas");
canvas.width         = canvasWidth;
canvas.height        = canvasHeight;
const c              = canvas.getContext("2d");

//Algorithm variables
let cityColor;
let routeColor;
let cities           = [];
let averageGraph     = [];
let bestGraph        = [];
let worstGraph       = [];
let bestEverGraph    = [];

//First init
document.getElementById("content").setAttribute("style","height:"+canvasHeight+"px");
document.getElementById("settings_container").setAttribute("style","left: "+canvasWidth+"px; margin-left: "+margin+"px; margin-top: "+margin+"px");
generateCities();
let generationNumber = 0;
let ga = new GeneticAlgorithm(cities, populationSize, mutationRate);
ga.generateRandomPopulation();
startAlgorithm();

/**
 * temporary
 */
canvas.addEventListener("mousedown", event => {
  //console.log(event.clientY - 100);
  console.log("cities.push(new City(canvasHeight / "+Math.round((canvasHeight / event.clientX) * 1000 ) / 1000+", canvasHeight / "+Math.round((canvasHeight / (event.clientY - 110) * 1000 )) / 1000+"));");
})

/**
 * Listen for button press to restart the algorithm
 */
btn.addEventListener("click", () => {
  populationSize     = document.getElementById("populationSize").value;
  mutationRate       = document.getElementById("mutationRate").value;
  numberCities       = document.getElementById("numberCities").value;
  graphSize          = document.getElementById("graphSize").value;
  pointPlacement     = document.getElementById("pointPlacement").value;
  generateCities();
  averageGraph       = [];
  bestGraph          = [];
  worstGraph         = [];
  bestEverGraph      = [];
  generationNumber   = 0;
  ga                 = new GeneticAlgorithm(cities, populationSize, mutationRate);
  ga.generateRandomPopulation();
});

/**
 * Create cities according to pointPlacement mode
 */
function generateCities() {
  cities = [];
  if (pointPlacement == 0) {
    cityColor   = "#000000";
    routeColor  = "#FFFFFF";
    for (let i = 0; i < numberCities; i++) {
      let x = Math.random() * (canvasWidth - infoWidth - margin2) + margin;
      let y = Math.random() * (canvasHeight - margin2) + margin;
      cities.push(new City(x, y));
    }
  } else if (pointPlacement == 1) {
    cityColor   = "#000000";
    routeColor  = "#FFFFFF";
    let xSpan   = canvasWidth - infoWidth - margin2;
    let ySpan   = canvasHeight - margin2;
    let radius  = 0;
    if (xSpan < ySpan) {
      radius = xSpan / 2;
    } else {
      radius = ySpan / 2;
    }
    let angle = (2 * Math.PI) / numberCities;
    for (let i = 0; i < numberCities; i++) {
      let x = radius * Math.sin(angle * i) + xSpan / 2 + margin;
      let y = radius * Math.cos(angle * i) + ySpan / 2 + margin;
      cities.push(new City(x, y));
    }
  } else if (pointPlacement == 2) {
    cityColor   = "#000000";
    routeColor  = "#FFFFFF";
    let cube    = 1;
    let square  = cube * cube;
    while (square < numberCities) {
      cube++;
      square = cube * cube;
    }
    numberCities = square;
    document.getElementById("numberCities").value = numberCities;
    let xSpan = canvasWidth - infoWidth - margin2;
    let ySpan = canvasHeight - margin2;
    let step  = 0;
    if (xSpan < ySpan) {
      step = xSpan / (cube - 1);
    } else {
      step = ySpan / (cube - 1);
    }
    for (let i = 0; i < cube; i++) {
      for (let j = 0; j < cube; j++) {
        cities.push(new City(margin + step * i, margin + step * j));
      }
    }
  } else if (pointPlacement == 3) {
    cityColor   = "#FF0000";
    routeColor  = "#000000";

    //Zuerich
    cities.push(new City(canvasHeight / 1.750, canvasHeight / 3.200));
    //Winterthur
    cities.push(new City(canvasHeight / 1.670, canvasHeight / 3.600));
    //Basel
    cities.push(new City(canvasHeight / 2.800, canvasHeight / 3.850));
    //Genf
    cities.push(new City(canvasHeight / 35.00, canvasHeight / 1.430));
    //Bern
    cities.push(new City(canvasHeight / 3.100, canvasHeight / 2.200));
    //Lugano
    cities.push(new City(canvasHeight / 1.520, canvasHeight / 1.320));
    //Chur
    cities.push(new City(canvasHeight / 1.260, canvasHeight / 2.050));
    //Sion
    cities.push(new City(canvasHeight / 3.200, canvasHeight / 1.450));
    //St. Gallen
    cities.push(new City(canvasHeight / 1.320, canvasHeight / 3.380));
    //Luzern
    cities.push(new City(canvasHeight / 1.950, canvasHeight / 2.420));
    //Neuenburg
    cities.push(new City(canvasHeight / 4.500, canvasHeight / 2.350));
    //Schaffhausen
    cities.push(new City(canvasHeight / 1.700, canvasHeight / 4.800));
    //Fribourg
    cities.push(new City(canvasHeight / 3.750, canvasHeight / 1.980));
    //Lausanne
    cities.push(new City(canvasHeight / 6.700, canvasHeight / 1.700));
    //Interlaken
    cities.push(new City(canvasHeight / 2.400, canvasHeight / 1.850));
    //Altdorf
    cities.push(new City(canvasHeight / 1.690, canvasHeight / 2.100));
    //Davos
    cities.push(new City(canvasHeight / 1.175, canvasHeight / 1.980));
    //Stein am Rhein
    cities.push(new City(canvasHeight / 1.580, canvasHeight / 4.700));

    numberCities = cities.length;
    document.getElementById("numberCities").value = numberCities;
  }else if(pointPlacement == 4){
    cityColor   = "#0000FF";
    routeColor  = "#000000";

    cities.push(new City(canvasHeight / 12.069, canvasHeight / 2));
    cities.push(new City(canvasHeight / 5.469, canvasHeight / 3.415));
    cities.push(new City(canvasHeight / 2.823, canvasHeight / 7.865));
    cities.push(new City(canvasHeight / 2.917, canvasHeight / 3.955));
    cities.push(new City(canvasHeight / 1.570, canvasHeight / 6.481));
    cities.push(new City(canvasHeight / 1.222, canvasHeight / 6.796));
    cities.push(new City(canvasHeight / 1.079, canvasHeight / 2.834));
    cities.push(new City(canvasHeight / 1.509, canvasHeight / 3.256));
    cities.push(new City(canvasHeight / 1.989, canvasHeight / 3.804));
    cities.push(new City(canvasHeight / 2.303, canvasHeight / 2.713));
    cities.push(new City(canvasHeight / 3.271, canvasHeight / 2.397));
    cities.push(new City(canvasHeight / 4.605, canvasHeight / 1.136));
    cities.push(new City(canvasHeight / 3.804, canvasHeight / 1.724));
    cities.push(new City(canvasHeight / 2.154, canvasHeight / 1.804));
    cities.push(new City(canvasHeight / 1.928, canvasHeight / 1.417));
    cities.push(new City(canvasHeight / 1.934, canvasHeight / 1.068));
    cities.push(new City(canvasHeight / 1.493, canvasHeight / 1.679));
    cities.push(new City(canvasHeight / 1.344, canvasHeight / 2.273));
    cities.push(new City(canvasHeight / 1.420, canvasHeight / 1.250));
    cities.push(new City(canvasHeight / 1.182, canvasHeight / 1.587));
    cities.push(new City(canvasHeight / 1.138, canvasHeight / 1.085));

    numberCities = cities.length;
    document.getElementById("numberCities").value = numberCities;
  }
}

/**
 * Starts the loop that runs the algorithm 
 */
function startAlgorithm() {
  setInterval(() => {
    setTimeout(() => {
      ga.generateNextGeneration();
      generationNumber++;

      thisLoop = new Date();
      let msg = Math.round(thisLoop - lastLoop);
      lastLoop = thisLoop;

      if (generationNumber % showGenEvery === 0) {
        //Background + lines
        c.clearRect(0, 0, canvasWidth, canvasHeight);
        if (pointPlacement == 3) {
          let image = document.getElementById("ch");
          image.width = canvasHeight;
          image.height = canvasHeight;
          c.drawImage(image, 0, 0, canvasHeight, canvasHeight);
        }else if(pointPlacement == 4){
          let image = document.getElementById("board");
          image.width = canvasHeight;
          image.height = canvasHeight;
          c.drawImage(image, 0, 0, canvasHeight, canvasHeight);
        }else {
          c.fillStyle = "#393e46";
          c.fillRect(0, 0, canvasWidth, canvasHeight);
        }
        c.strokeStyle = "#FFFFFF";
        c.strokeRect(0, 0, canvasWidth, canvasHeight);
        c.beginPath();
        c.moveTo(canvasWidth - infoWidth, 0);
        c.lineTo(canvasWidth - infoWidth, canvasHeight);
        c.stroke();
        c.moveTo(canvasWidth - infoWidth, section1);
        c.lineTo(canvasWidth,  section1);
        c.stroke();
        c.moveTo(canvasWidth - infoWidth, section2);
        c.lineTo(canvasWidth,  section2);
        c.stroke();
        c.moveTo(canvasWidth - infoWidth, section3);
        c.lineTo(canvasWidth,  section3);
        c.stroke();
        c.closePath();

        //Stats
        const statsXStart   = canvasWidth - infoWidth + margin;
        const statsWidth    = infoWidth - margin2;
        let section0YOffset = margin + textSize;
        c.font              = textSize + "px Arial";
        c.fillStyle         = "#FFFFFF";
        c.textAlign         = "left";
        c.fillText("ms for each generation:  "        + msg,                                                                 statsXStart, section0YOffset, statsWidth);
        section0YOffset += (textSize + textPadding);
        c.fillText("Generation:                     " + generationNumber,                                                    statsXStart, section0YOffset, statsWidth);
        section0YOffset += (textSize + textPadding);
        c.fillText("Number of cities:             "   + numberCities,                                                        statsXStart, section0YOffset, statsWidth);
        section0YOffset += (textSize + textPadding);
        c.fillText("Population size:              "   + populationSize,                                                      statsXStart, section0YOffset, statsWidth);
        section0YOffset += (textSize + textPadding);
        c.fillText("Mutation rate:                  " + mutationRate,                                                        statsXStart, section0YOffset, statsWidth);
        section0YOffset += (textSize + textPadding);
        c.fillText("Best ever length:             "   + Math.round(Math.sqrt(ga.bestEverLength) * 100) / 100 +" pxls",       statsXStart, section0YOffset, statsWidth);
        section0YOffset += (textSize + textPadding);
        c.fillText("Best current length:         "    + Math.round(Math.sqrt(ga.generationBestLength) * 100) / 100 +" pxls", statsXStart, section0YOffset, statsWidth);

        //Best ever route
        c.strokeStyle = routeColor;
        c.moveTo(  cities[ga.bestEver[0]].x, cities[ga.bestEver[0]].y);
        for (let i = 1; i < ga.bestEver.length; i++) {
          c.lineTo(cities[ga.bestEver[i]].x, cities[ga.bestEver[i]].y);
        }
        c.lineTo(  cities[ga.bestEver[0]].x, cities[ga.bestEver[0]].y);
        c.stroke();
        c.fillStyle = cityColor;
        for (let i = 0; i < cities.length; i++) {
          c.beginPath();
          c.arc(cities[i].x, cities[i].y, 3, 0, Math.PI * 2);
          c.fill();
          c.closePath();
        }

        //Best route
        c.strokeStyle = routeColor;
        let generationBestYStart = section1 + margin;
        c.moveTo(  cities[ga.generationBest[0]].x / scndRouteRatio + statsXStart, cities[ga.generationBest[0]].y / scndRouteRatio + generationBestYStart);
        for (let i = 1; i < ga.generationBest.length; i++) {
          c.lineTo(cities[ga.generationBest[i]].x / scndRouteRatio + statsXStart, cities[ga.generationBest[i]].y / scndRouteRatio + generationBestYStart);
        }
        c.lineTo(  cities[ga.generationBest[0]].x / scndRouteRatio + statsXStart, cities[ga.generationBest[0]].y / scndRouteRatio + generationBestYStart);
        c.stroke();
        c.fillStyle = cityColor;
        for (let i = 0; i < cities.length; i++) {
          c.beginPath();
          c.arc(cities[i].x / scndRouteRatio + statsXStart, cities[i].y / scndRouteRatio + section1 + margin, 2, 0, Math.PI * 2);
          c.fill();
          c.closePath();
        }

        //Graph
        let sectionLength = infoWidth / 4;
        const section2TextY = margin + section2 + textSize;
        const textWidth = (infoWidth - 5 * margin) / 4;
        c.fillStyle = "#00FF00";
        c.fillText("best ever", statsXStart,                     section2TextY, textWidth);
        c.fillStyle = "#0000FF";
        c.fillText("best",      statsXStart + sectionLength,     section2TextY, textWidth);
        c.fillStyle = "#FF0000";
        c.fillText("average",   statsXStart + sectionLength * 2, section2TextY, textWidth);
        c.fillStyle = "#FFFFFF";
        c.fillText("worst",     statsXStart + sectionLength * 3, section2TextY, textWidth);
        if (averageGraph.length < graphSize) {
          averageGraph.push(ga.averageLength);
        } else {
          averageGraph.splice(0, 1);
          averageGraph.push(ga.averageLength);
        }
        if (bestGraph.length < graphSize) {
          bestGraph.push(ga.generationBestLength);
        } else {
          bestGraph.splice(0, 1);
          bestGraph.push(ga.generationBestLength);
        }
        if (worstGraph.length < graphSize) {
          worstGraph.push(ga.generationWorstLength);
        } else {
          worstGraph.splice(0, 1);
          worstGraph.push(ga.generationWorstLength);
        }
        if (bestEverGraph.length < graphSize) {
          bestEverGraph.push(ga.bestEverLength);
        } else {
          bestEverGraph.splice(0, 1);
          bestEverGraph.push(ga.bestEverLength);
        }
        if (averageGraph.length > 0) {
          let min = averageGraph[0];
          let max = averageGraph[0];
          for (let i = 0; i < averageGraph.length; i++) {
            if (averageGraph[i] > max) {
              max = averageGraph[i];
            }
            if (averageGraph[i] < min) {
              min = averageGraph[i];
            }
            if (bestGraph[i] > max) {
              max = bestGraph[i];
            }
            if (bestGraph[i] < min) {
              min = bestGraph[i];
            }
            if (worstGraph[i] > max) {
              max = worstGraph[i];
            }
            if (worstGraph[i] < min) {
              min = worstGraph[i];
            }
            if (bestEverGraph[i] > max) {
              max = bestEverGraph[i];
            }
            if (bestEverGraph[i] < min) {
              min = bestEverGraph[i];
            }
          }
          const dif            = max - min;
          const graphYSpan     = canvasHeight - section3 - margin2;
          const graphXSpan     = statsWidth;
          const XStep          = graphXSpan / (averageGraph.length - 1);
          let section3XOffset           = 0;
          const section3YStart = margin + section3;

          //best ever
          c.beginPath();
          c.strokeStyle = "#00FF00";
          c.moveTo(  statsXStart + section3XOffset, ((bestEverGraph[0] - min) / dif) * graphYSpan + section3YStart);
          for (let i = 1; i < bestEverGraph.length; i++) {
            section3XOffset += XStep;
            c.lineTo(statsXStart + section3XOffset, ((bestEverGraph[i] - min) / dif) * graphYSpan + section3YStart);
          }
          c.stroke();
          c.closePath();

          //best
          c.beginPath();
          c.strokeStyle = "#0000FF";
          section3XOffset        = 0;
          c.moveTo(  statsXStart + section3XOffset, ((bestGraph[0] - min) / dif) * graphYSpan + section3YStart);
          for (let i = 1; i < bestGraph.length; i++) {
            section3XOffset += XStep;
            c.lineTo(statsXStart + section3XOffset, ((bestGraph[i] - min) / dif) * graphYSpan + section3YStart);
          }
          c.stroke();
          c.closePath();

          //average
          c.beginPath();
          c.strokeStyle = "#FF0000";
          section3XOffset        = 0;
          c.moveTo(  statsXStart + section3XOffset, ((averageGraph[0] - min) / dif) * graphYSpan + section3YStart);
          for (let i = 1; i < averageGraph.length; i++) {
            section3XOffset += XStep;
            c.lineTo(statsXStart + section3XOffset, ((averageGraph[i] - min) / dif) * graphYSpan + section3YStart);
          }
          c.stroke();
          c.closePath();

          //worst
          c.beginPath();
          c.strokeStyle = "#FFFFFF";
          section3XOffset        = 0;
          c.moveTo(  statsXStart + section3XOffset, ((worstGraph[0] - min) / dif) * graphYSpan + section3YStart);
          for (let i = 1; i < worstGraph.length; i++) {
            section3XOffset += XStep;
            c.lineTo(statsXStart + section3XOffset, ((worstGraph[i] - min) / dif) * graphYSpan + section3YStart);
          }
          c.stroke();
          c.closePath();
        }
      }
    }, 0);
  }, 0);
}
