### Genetic algorithm test

This project emulates a small world with "Rabbit" creatures.
Each Rabbit has its own neural network brain, and can walk, eat grass and reproduce

#### Used tools and libraries
 - Node.js and npm
 - Typescript
 - Webpack
 - Three.js library
 - mocha, chai
 

#### Console commands
- ```npm install``` - to install necessary dependencies.

- ```make``` - to build project with webpack and start watching for source code changes.

- ```make clean``` to delete dst folder.

#### Start
  open dst/index.html

  use WASD and right mouse to move camera

  spawn creatures by pressing buttons

  Grass is being added automatically all time.

#### Built demo
  is here: https://tionl.github.io/genetic-demo/dst/

### WebAssembly version
  demo is here: https://tionl.github.io/genetic-demo/dst-wasm/

  I used c++ and emscripten to make a WebAssembly version. Although I thought, that it should be much faster than JavaScript, really it is just a little bit faster in my Opera browser on Ubuntu.
