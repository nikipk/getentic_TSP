class Route {
    constructor (cityOrder) {
        this.cityOrder = cityOrder;
        this.fitness = 0;
    }

    mutate(mutationRate) {
        if (mutationRate >= Math.random()) {
          let indexA = Math.floor(Math.random() * newRoute.length);
          let indexB = Math.floor(Math.random() * newRoute.length);
          this.flipSection(indexA, indexB);
        }
    }

    flipSection(indexA, indexB) {
        if (indexA > indexB) {
          this.flipSection(newRoute, indexB, indexA);
        } else {
          for (let i = 0; i < (indexB - indexA) / 2; i++) {
            let temp             = newRoute[indexA + i];
            newRoute[indexA + i] = newRoute[indexB - i];
            newRoute[indexB - i] = temp;
          }
        }
      }
}