

class GenAlgorithm {

    constructor(fitnessFunc, crossoverProbability=0.9, crossoverRatio=0.5, mutationChance=0.02) {
        this.population = null;
        this.ratio = crossoverRatio;
        this.mutationChance = mutationChance;
        this.generation = 0;
        this.fitnessFunc = fitnessFunc;
        this.crossoverChance = crossoverProbability;
    }

    runGeneration() {
        
        //let newGeneration = this.selectionRating();
        let newGeneration = this.selectionRoulette();

        for(let subject of newGeneration)
        {
            if(random(0.0, 1.0) < this.mutationChance)
            {
                let index = random(Array.from(Array(subject.genome.dna.length).keys()));
                subject.genome.mutate(index);
            }
        }

        this.generation += 1;
        this.population = newGeneration;
    }

    selectionRating() {
        let rating = this.population.sort((a, b) => this.fitnessFunc(a) < this.fitnessFunc(b)).slice(0, this.population.length / 2);
        let newGeneration = [];
        while(rating.length > 0)
        {
            let parentA = rating.pop();
            let parentB = rating.pop();

            if(!parentB)            // Uneven number of rockets
            {
                newGeneration.push(parentA, parentA.clone());
            }
            else
            {
                newGeneration.push(parentA, parentB);
                if(random(0.0, 1.0) < this.crossoverChance)
                {
                    let newGenomes = parentA.genome.crossover(parentB.genome, this.ratio);
                    let childA = new Rocket(parentA.startingPos, parentA.width, parentA.ratio, parentA.drawFunction, newGenomes[0]);
                    let childB = new Rocket(parentB.startingPos, parentB.width, parentB.ratio, parentB.drawFunction, newGenomes[1]);
                    newGeneration.push(childA, childB);
                }
                else
                {
                    newGeneration.push(parentA.clone(), parentB.clone());
                }
            }

        }

        return newGeneration;
    }

    selectionRoulette() {
        let pool = [];
        let maxFitScore = 0.0;
        for(let subject of this.population)
        {
            let fitScore = this.fitnessFunc(subject);
            pool.push({fitness: fitScore, s: subject});

            if(fitScore > maxFitScore)
                maxFitScore = fitScore;
        }

        // Normalize fitness values and prepare mating pool
        let matingPool = [];
        for(let subject of pool) 
        {
            subject.fitness /= maxFitScore;
            let n = subject.fitness * 100;
            for(let i = 0; i < n; i++)
            {
                matingPool.push(subject);
            }
        }

        let newGeneration = [];

        while(newGeneration.length < pool.length)
        {
            let parentA = random(matingPool).s;
            let parentB = random(matingPool).s;

            if(random() < this.crossoverChance)
            {
                let newGenomes = parentA.genome.crossover(parentB.genome, this.ratio);

                let childA = new Rocket(parentA.startingPos, parentA.width, parentA.ratio, parentA.drawFunction, newGenomes[0]);
                let childB = new Rocket(parentB.startingPos, parentB.width, parentB.ratio, parentB.drawFunction, newGenomes[1]);

                newGeneration.push(childA, childB);
            }
            else 
            {
                newGeneration.push(parentA, parentB);
            }
        }

        return newGeneration;
    }

    loadInitialPopulation(firstGeneration) {
        this.population = firstGeneration.slice();
        this.generation = 0;
    }
}