let waver;
let posy;

function setup() {
    createCanvas(windowWidth, windowHeight);
    waver = new waveMaker();
    posy = height * 0.25;
    makeBackground();
}

function draw() {
    posy += 0.75;
    if (posy > height * 1.2) {
        posy = height * 0.25;
        waver.flowers = random(1);
        makeBackground() // clear screen
    }
    translate(width / 2, posy);
    waver.update();
}

// generates gradient background
function makeBackground() {
    background('#ffffff')
    for(let y = 0; y < height; y++) {
        let newc = lerpColor(color("#71b4eb"), color("#042366"), y / height);
        stroke(newc);
        line(0, y, width, y);
    }
}

function waveMaker() {
    this.xoff = 0; // noise parameter
    this.yoff = 0; // noise parameter
    this.yend = 0; // last vertex
    this.ymod = -height / 4; // y position modifier
    this.density = width / 15; // step value for loops
    this.px = 0; // cluster unit position
    this.py = 0; // cluster unit position
    this.size = 0; // returns unit perspective size
    this.flowers = 1; // determines to call function

    this.update = function() {
        // first layer of waveform (left to right)
        push();
        beginShape();
        vertex(-width / 2, map(noise(0, this.yoff), 0, 1, -height * 0.25, height * 0.25));
        this.xoff = 0; // reset x-offset for 2D noise arguments
        this.density = map(posy, 0, height, 15, 25); // interpolate density of clusters to vertical canvas position to compliment perspective and height of terrain

        for (let x = -width / 2; x < width / 2; x += this.density) { // generate half of wave line by density ratio of segments, joints are nodes at which elements are output
            let xmod = map(noise(this.yoff, x), 0, 1, -this.density, this.density); // interpolate the x-position modifier by the perspective value as a measure of the density value
            let y = map(noise(this.xoff, this.yoff), 0, 1,  -height * 0.25, height * 0.25); // interpolate return of noise to produce vertical change in y-position of the wave's node, range (height) is a fraction of canvas height
            let sw = map(noise(this.xoff, this.yoff), 0 ,1 ,2, 12); // interpolate value to modify stroke thickness that is relative to the return on noise used to map the vertical position of node
            this.size = map(posy, 0, height, 2, 25); // scale element by the interpolation of the vertical canvas position to the element's relative size

            vertex(x + xmod, y);
            
            // attributes that apply to unencapsulated output
            stroke(0, 128, 0, 128);
            strokeWeight(this.size);

            // make a flower
            if (random() < this.flowers) {
                this.makeFlower(x + xmod, y);
            }

            let tree = random(this.size * 0.05, this.size * 0.5);
            // tree
            if (random() < 0.2) { // chance of green trees
                push();
                stroke(0, 50 + random(0, 100), 25);
                translate(x + xmod, y); // set encapsulated origin to base of tree shape
                triangle(0, random(-this.size * 0.5, 0) - tree, -tree, tree, tree, tree); // random proportion in perspective scale
                pop();
            }

            this.xoff += 0.05; // move next splice of wave noise returns
            this.yend = y; // set local variable y to global function variable to use in other methods

        }

        vertex(width / 2, this.yend); // assign node coordinate to shape table that outputs wave shape

        // second layer of waveform (return to start)
        for (let x = width / 2; x > -width / 2; x -= this.density) {
            let xmod = map(noise(this.yoff, x), 0, 1, -this.density, this.density);
            let y = map(noise(this.xoff, this.yoff), 0, 1,  -height * 0.25, height * 0.25);
            let sw = map(noise(this.xoff, this.yoff), 0, 1, 2, 12);
            this.size = map(posy, 0, height, 2, 25);
            stroke(0, 255 - random(128), 0);
            strokeWeight(this.size);

            vertex(x + xmod, y);

            // flowers
            if (random() < this.flowers) {
                this.makeFlower(x + xmod, y);
            }

            let tree = random(this.size * 0.1, this.size * 0.5);
            // grass cluster
            if (random() < 0.075) { /// chance of green grass
                push();
                stroke(0, random(175, 50), 25, 255);
                if (random() < 0.02) { /// chance of brown grass
                  stroke(125, 50, 10, 255);
                }
                translate(x + xmod,y);
                strokeWeight(1);
                for (let j = 0; j < 50; j++){
                  let grassx = random(-this.size, this.size);
                  rotate(random(-PI * 0.1, PI * 0.1));
                  line(grassx,-this.size * 0.1, grassx, random(this.size*0.1))
                }
                pop();
              }

            // advance to next layer of noise returns and set local y variable to the global function variable
            this.xoff += 0.05;
            this.yend = y;

            // put other stuff here?????

        }

        stroke(0, 64, 0);
        strokeWeight(2);

        // thicker terrain
        if (frameCount % 32 === 0) {
        strokeWeight(8);
        }
        
        let rock = random();
        if (rock > 0.95) {
            // makes a river!
            fill(0, 0, 255, rock * 128, 128);
        } else {
            // makes rock layer
            fill(255 - rock * 128, 200 - rock * 128, 75, rock * 128, 128);
        }
        vertex(-width / 2, this.yend);
        
        endShape(CLOSE);
        this.yoff += 0.01; // increment y parameter for 2D noise
        pop();
    }

    // generate cluster of flowers, pass into function the current node position
    this.makeFlower = function(tx, ty) {
        push();
        translate(tx, ty);
        for (let q = 0; q < 6; q++) { // density of cluster
            this.px = random(this.size * 0.5); // range
            rotate(random(TWO_PI)); // radial location
            strokeWeight(this.size * random(0.1, 0.5)); // changes size based on perspective
            this.py = random(-this.size * 0.25, this.size * 0.25);
            chance = random();

            if (chance < 0.15) {
                // sunflower
                stroke(255, 244, 25);
                for (let i = 0; i < 9; i++) {
                    rotate(radians(40));
                    ellipse(this.px, this.py, this.size * 0.000005, this.size * 0.00001);
                }
                stroke(0, 0, 0);
                ellipse(this.px, this.py, this.size * 0.000005, this.size * 0.000005);
            } else if (chance >= 0.15 && chance < 0.2) {
                // daisy
                stroke(250, 250, 250);
                for (let i = 0; i < 20; i++) {
                    rotate(radians(36));
                    ellipse(this.px, this.py, this.size * 0.000000005, this.size * 0.00000001);
                }
                stroke(236, 247, 25);
                ellipse(this.px, this.py, this.size * 0.000000005, this.size * 0.000000005);
            } else if (chance >= 0.2 && chance < 0.3) {
                // crape myrtle (thanks ben xox)
                stroke(173, 43, 126);
                ellipse(this.px, this.py, this.size * 0.5, this.size * 0.1);
            } else if (chance >= 0.3 && chance < 0.35) {
                // poppy
                stroke(232, 21, 21)
                for (let i = 0; i < 4; i++) {
                    rotate(radians(90));
                    ellipse(this.px, this.py, this.size * 0.000005, this.size * 0.00001);
                }
                stroke(0, 0, 0);
                ellipse(this.px, this.py, this.size * 0.000005, this.size * 0.000005);
            }

        }
        pop();
    }
}
