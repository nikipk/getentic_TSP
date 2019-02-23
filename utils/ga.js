class GeneticAlgorithm {
  constructor(cities, populationSize, mutationRate) {
    this.cities            = cities;
    this.populationSize    = populationSize;
    this.mutationRate      = mutationRate;
    this.currentPopulation = [];
  }
  generateNextGeneration() {
    let nextGeneration = [];
    this.currentPopulation = this.quickSort(this.currentPopulation);
    for (let i = 0; i < populationSize; i++) {
      if (Math.random() * populationSize > i){
        let newRoute = [];
        let routeA   = (Math.random() > mutationRate) ? this.getRoute() : this.randomRoute();
        let routeB   = (Math.random() > mutationRate) ? this.getRoute() : this.randomRoute();
        let length   = Math.floor(Math.random() * this.cities.length);
        let index    = Math.floor(Math.random() * this.cities.length);
        for (let j = 0; j < length; j++) {
          index = j % (this.cities.length - 1);
          newRoute.push(routeA.cityOrder[index]);
        }
        for (let j = 0; j < this.cities.length; j++) {
          if (!newRoute.includes(routeB.cityOrder[j])) {
            newRoute.push(routeB.cityOrder[j]);
          }
        }
        let cityOrder = new Route(newRoute);
        if (Math.random() > mutationRate) {
          cityOrder.mutate();
        }
        nextGeneration.push(cityOrder);
      } else {
        nextGeneration.push(this.currentPopulation[i]);
      }
    }
    this.currentPopulation = nextGeneration;
    this.getFitness();
  }
  quickSort(inputArr) {
    if (inputArr.length <= 1) { 
      return inputArr;
    } else {

      let left = [];
      let right = [];
      let outputArr = [];
      let pivot = inputArr.pop(); //https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/pop
      let length = inputArr.length;
  
      for (let i = 0; i < length; i++) {
        if (inputArr[i].fitness <= pivot.fitness) {
          left.push(inputArr[i]);
        } else {
          right.push(inputArr[i]);
        }
      }
  
      return outputArr.concat(this.quickSort(left), pivot, this.quickSort(right));
    }
  }
  randomRoute() {
    let cityOrder = [];
    for (let j = 0; j < this.cities.length; j++) {
      let found = false;
      while (!found) {
        let index = Math.floor(Math.random() * this.cities.length);
        if (!cityOrder.includes(index)) {
          cityOrder.push(index);
          found = true;
        }
      }
    }
    return new Route(cityOrder);
  }
  getRoute() {
    let index = 0;
    let r = Math.random(1);
    while (r > 0) {
      r -= this.currentPopulation[index].fitness;
      index++;
    }
    index--;
    return this.currentPopulation[index];
  }
  generateRandomPopulation() {
    this.currentPopulation = [];
    for (let i = 0; i < this.populationSize; i++) {
      this.currentPopulation.push(this.randomRoute());
    }
    this.getFitness();
  }
  getFitness() {
    let distances              = [];
    let totalDist              = 0;
    let totalFitness           = 0;
    this.generationBestLength  = null;
    this.generationWorstLength = null;
    for (let i = 0; i < this.currentPopulation.length; i++) {
      let r = this.currentPopulation[i];
      let route = r.cityOrder;
      let dist = 0;
      let dx = 0;
      let dy = 0;
      for (let j = 0; j < route.length - 1; j++) {
        dx = this.cities[route[j]].x - this.cities[route[j + 1]].x;
        dy = this.cities[route[j]].y - this.cities[route[j + 1]].y;
        dist += dx * dx + dy * dy;
      }
      dx = this.cities[route.length - 1].x - this.cities[0].x;
      dy = this.cities[route.length - 1].y - this.cities[0].y;
      dist  += dx * dx + dy * dy;
      if (!this.generationBestLength) {
        this.generationBestLength  = dist;
        this.generationBest        = route;
      } else if (dist < this.generationBestLength) {
        this.generationBestLength  = dist;
        this.generationBest        = route;
      }
      if (!this.generationWorstLength) {
        this.generationWorstLength = dist;
        this.generationWorst       = route;
      } else if (dist > this.generationWorstLength) {
        this.generationWorstLength = dist;
        this.generationWorst       = route;
      }
      if (!this.bestEverLength) {
        this.bestEverLength        = dist;
        this.bestEver              = route;
      } else if (dist <= this.bestEverLength) {
        this.bestEverLength        = dist;
        this.bestEver              = route;
      }
      distances[i]     = dist;
      totalDist       += dist;
      r.fitness        = 1 / (distances[i] + 1);
      totalFitness    += r.fitness;
    }
    for (let i = 0; i < this.populationSize; i++) {
      this.currentPopulation[i].fitness  = this.currentPopulation[i].fitness / totalFitness;
    }
    this.averageLength = totalDist / this.populationSize;
  }
}