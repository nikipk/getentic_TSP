class GeneticAlgorithm {
  constructor(cities, populationSize, mutationRate) {
    this.cities            = cities;
    this.populationSize    = populationSize;
    this.mutationRate      = mutationRate;
    this.currentPopulation = [];
    this.fitness           = [];
  }
  generateNextGeneration() {
    let nextGeneration = [];
    for (let i = 0; i < populationSize; i++) {
      let newRoute = [];
      let routeA   = this.getRoute();
      let routeB   = this.getRoute();
      let length   = Math.floor(Math.random() * this.cities.length);
      let index    = Math.floor(Math.random() * this.cities.length);
      for (let j = 0; j < length; j++) {
        index = j % (this.cities.length - 1);
        newRoute.push(routeA[index]);
      }
      for (let j = 0; j < this.cities.length; j++) {
        if (!newRoute.includes(routeB[j])) {
          newRoute.push(routeB[j]);
        }
      }
      newRoute = this.mutateRoute(newRoute);
      nextGeneration.push(newRoute);
    }
    this.currentPopulation = nextGeneration;
    this.getFitness();
  }
  mutateRoute(newRoute) {
    if (this.mutationRate >= Math.random()) {
      let indexA = Math.floor(Math.random() * newRoute.length);
      let indexB = Math.floor(Math.random() * newRoute.length);
      this.flipRoute(newRoute, indexA, indexB);
    }
    return newRoute;
  }
  flipRoute(newRoute, indexA, indexB) {
    if (indexA > indexB) {
      this.flipRoute(newRoute, indexB, indexA);
    } else {
      for (let i = 0; i < (indexB - indexA) / 2; i++) {
        let temp             = newRoute[indexA + i];
        newRoute[indexA + i] = newRoute[indexB - i];
        newRoute[indexB - i] = temp;
      }
    }
  }
  getRoute() {
    let index = 0;
    let r = Math.random(1);
    while (r > 0) {
      r -= this.fitness[index];
      index++;
    }
    index--;
    return this.currentPopulation[index];
  }
  generateRandomPopulation() {
    this.currentPopulation = [];
    for (let i = 0; i < this.populationSize; i++) {
      let route = [];
      for (let j = 0; j < this.cities.length; j++) {
        let found = false;
        while (!found) {
          let index = Math.floor(Math.random() * this.cities.length);
          if (!route.includes(index)) {
            route.push(index);
            found = true;
          }
        }
      }
      this.currentPopulation.push(route);
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
      let route = this.currentPopulation[i];
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
      this.fitness[i]  = 1 / (distances[i] + 1);
      totalFitness    += this.fitness[i];
    }
    for (let i = 0; i < this.fitness.length; i++) {
      this.fitness[i]  = this.fitness[i] / totalFitness;
    }
    this.averageLength = totalDist / this.populationSize;
  }
}