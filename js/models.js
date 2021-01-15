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
      return this.c ||= document.querySelector('#lists')
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
          this.collection = gameArray.map(attrs => new Game(attrs))
          let renderedLists = this.collection.map(game => game.render())
          this.container().append(...renderedLists);
            return this.collection
        })
    }
    /*
    <div
    */
    render() {
      this.element ||= document.createElement('li')
      this.element.classList.add(..."my-2 px-4 bg-red-500 grid grid-cols-12 sm:grid-cols-6".split(" "));
      
      this.nameLink ||= document.createElement('a');
      this.nameLink.classList.add(..."py-4 col-span-10 sm:col-span-4".split(" "));
      this.nameLink.textContent = this.name;
     
      this.editLink ||= document.createElement('a');
      this.editLink.classList.add(..."my-4 text-right".split(" "));
      this.editLink.innerHTML = `<i class="fa fa-pencil-alt"></i>`;
      
      this.deleteLink ||= document.createElement('a')
      this.deleteLink.classList.add(..."my-4 text-right".split(" "));
      this.deleteLink.innerHTML = `<i class="fa fa-trash-alt"></i>`;
      
    this.element.append(this.nameLink, this.editLink, this.deleteLink);
    
  return this.element

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