class Game {
    /*
    new Game({id: 1, name: "Super Mario"})
    */
    constructor(attributes) {
      let whitelist = ["id", "name"]
      whitelist.forEach(attr => this[attr] = attributes[attr])
    }
    /*
    Game.container() returns a reference to this DOM node:
    <section id="gamesContainer" class="px-4 bg-teal-100 min-h-screen rounded-md shadow">
      <h1 class="text-2xl semibold border-b-4 border-teal">Game</h1>
      <ul id="lists" class="list-none">
      </ul>
    </section>
    */
    static container() {
      return this.c ||= document.querySelector("#gamesContainer")
    }
    /*
    Game.list() returns a reference to this DOM node:
    <ul id="lists" class="list-none">
    </ul>
    */
    static list() {
      return this.l ||= document.querySelector('#lists')
    }
  /*
  Game.all() will return a promise for all of the game objects that we get from fetching the game
  this collection will be stored locally in game.collection so we can refernce it after yhe 
  intial call to Game.all() which will occur at the DOMContentLoaded event
  */
    static all() {
        return fetch("http://localhost:3000/games", {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            if(res.ok) {
                return res.json() //returns a promise for body content that gets parsed s json
            } else {
                return res.text().then(error => Promise.reject(error)) // return a reject promise 
            }
        })
        .then(gameArray => {
            debugger
        })
    }
    /*
    <div
    */
    render() {
  
    }
  }
  
  class Review {
    constructor(attributes) {
      let whitelist = ["id", "name", "game_id", "review_post"]
      whitelist.forEach(attr => this[attr] = attributes[attr])
    }
  
    static container() {
      return this.c ||= document.querySelector("#reviews")
    }
  }