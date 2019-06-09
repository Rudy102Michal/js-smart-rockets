
class Genome {
    
    constructor(genomeSize, chromGenerator, dna=null) {
        this.size = genomeSize;
        this.genFunc = chromGenerator;
        this.dna = (dna != null) ? dna : [];
    }

    generateRandomDNA() {
        for(let i of Array(this.size).keys()) {
            this.dna.push(this.genFunc());
        }
    }

    crossover(genome, ratio=0.5) {
        let newDnaA = [];
        let newDnaB = [];
        const pivot = int(this.size * ratio);
        newDnaA = newDnaA.concat(this.dna.slice(0, pivot));
        newDnaA = newDnaA.concat(genome.dna.slice(pivot));
        newDnaB = newDnaB.concat(genome.dna.slice(0, pivot));
        newDnaB = newDnaB.concat(this.dna.slice(pivot));
        return [new Genome(newDnaA.length, this.genFunc, newDnaA), new Genome(newDnaB.length, this.genFunc, newDnaB)];
    }

    mutate(index) {
        this.dna[index % this.dna.length] = this.genFunc();
    }

    clone() {
        return new Genome(this.dna.length, this.genFunc, this.dna.slice(0));
    }
}