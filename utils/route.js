class Route {
    constructor (cityOrder) {
        this.cityOrder = cityOrder;
        this.fitness = 0;
    }

    mutate(mutationRate) {
      //console.log("mutated");
        if (mutationRate >= Math.random()) {
          let indexA = Math.floor(Math.random() * this.length);
          let indexB = Math.floor(Math.random() * this.length);
          this.flipSection(indexA, indexB);
        }
    }

    flipSection(indexA, indexB) {
        if (indexA > indexB) {
          this.flipSection(indexB, indexA);
        } else {
          for (let i = 0; i < (indexB - indexA) / 2; i++) {
            let temp             = this.cityOrder[indexA + i];
            this.cityOrder[indexA + i] = this.cityOrder[indexB - i];
            this.cityOrder[indexB - i] = temp;
          }
        }
      }
}