class Game {
  /*
  new Game({id: 1, name: "Super Mario"})
  */
  constructor(attributes) {
      let whitelist = ["id", "name", "active"]
      whitelist.forEach(attr => this[attr] = attributes[attr])
      if(this.active) {Game.active = this;}
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

  static collection() {
    return this.coll ||= {};
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

  static findById(id) {
    return this.collection.find(game => game.id == id);
  }

  static create(formData) {
    return fetch("http://localhost:3000/games", {
      method: 'POST', 
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({game: formData})
    })
    .then(res => {
      if(res.ok) {
        return res.json() //returns a promise for body content that gets parsed s json
      } else {
        return res.text().then(error => Promise.reject(error)) // return a reject promise 
      }
    })
    .then(gameAttributes => {
      let game = new Game(gameAttributes);
      this.collection.push(game);
      this.container().appendChild(game.render());
      new FlashMessage({type: 'success', message: 'New list added succesfully'})
      return game;
    })
    .catch(error => {
      new FlashMessage({type: 'error', message: error});
    })
  }

  show() {
    return fetch(`http://localhost:3000/games/${this.id}`, {
      //method: 'GET', 
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if(res.ok) {
          return res.json()
        } else {
          return res.text().then(error => Promise.reject(error))
        }
      })
      .then(({game, reviews}) => {
        Review.loadFromList(reviews, game.id)
        this.markActive()
      })
      .catch(error => {
        new FlashMessage({type: 'error', message: error});
      })
  }

  markActive() {
    if(Game.active) {
      Game.active.element.classList.replace('bg-red-500', 'bg-green-200');
      Game.active.active = false;
    }
    
    this.element.classList.replace('bg-green-200', 'bg-red-500');
    this.active = true;
  }

  render() {
  this.element ||= document.createElement('li')

  this.element.classList.add(...`my-2 px-4 bg-green-200 grid grid-cols-12 sm:grid-cols-6`.split(" "));
 
  this.nameLink ||= document.createElement('a');
  this.nameLink.classList.add(..."py-4 col-span-10 sm:col-span-4 selectGame".split(" "));
  this.nameLink.textContent = this.name;
  this.nameLink.dataset.gameId = this.id;

  if(!this.editLink){
  this.editLink ||= document.createElement('a');
  this.editLink.classList.add(..."my-4 text-right".split(" "));
  this.editLink.innerHTML = `<i class="fa fa-pencil-alt editGame p-4 cursor-pointer" data-game-id="${this.id}"></i>`;
  
  this.deleteLink ||= document.createElement('a')
  this.deleteLink.classList.add(..."my-4 text-right".split(" "));
  this.deleteLink.innerHTML = `<i class="fa fa-trash-alt deleteGame p-4 cursor-pointer" data-game-id="${this.id}"></i>`;
  } 
  this.element.append(this.nameLink, this.editLink, this.deleteLink);

  return this.element;
  }


}
class Review {
  constructor(attributes) {
    let whitelist = ["id", "name", "game_id", "review_post"]
      whitelist.forEach(attr => this[attr] = attributes[attr])
  }
  
  static all() {
    return this.collection ||= {};
  }

  static container() {
    return this.c ||= document.querySelector("#reviews")
  }

  static findById(id) {
    let result = this.all()[Review.active_game_id].find(review => review.id == id);
    return result ? result : new FlashMessage({type: "error", message: "Review not found."})
  }

  static loadFromList(reviews, game_id) {
    let reviewObjects = reviews.map(attrs => new Review(attrs));
    this.all()[game_id] = reviewObjects;
    this.active_game_id = game_id;
    let reviewElements = reviewObjects.map(review => review.render());
    this.container().innerHTML = "";
    this.container().append(...reviewElements);
  }

  static create(formData) {
    if(!Review.active_game_id){
      return Promise.reject().catch(() => new FlashMessage({type: 'error', message: "Please select a game to review"}));
    } else {
      formData.game_id = Review.active_game_id;
    }
    return fetch('http://localhost:3000/reviews',{
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        review: formData
      })
    })
      .then(res => {
        if(res.ok) {
          return res.json()
      } else {
        return res.text().then(error => Promise.reject(error))
      }
    })
    .then(reviewData => {
      let review = new Review(reviewData);
      this.collection()[Review.active_game_id].push(review);
      this.container().append(review.render())
      return review;
    })
    .catch(error => {
      return new FlashMessage({type: 'error', message: error})
    })
  }

  render() {
    this.element ||= document.createElement('li');
    this.element.classList.set("my-2 px-4 bg-green-200 grid grid-cols-12");

    this.gamePadLink ||= document.createElement('a');
    this.gamePadLink.classList.set("my-1 text-right");
    this.gamePadLink.innerHTML = `<i class="fas fa-gamepad"></i>`;

    this.nameSpan ||= document.createElement('span');
    this.nameSpan.classList.set("py-4 col-span-9");
    this.nameSpan.textContent = this.name; 

    this.editLink ||= document.createElement('a');
    this.editLink.classList.set("my-1 text-right");
    this.editLink.innerHTML = `<i class="editReview p-4 fa fa-pencil-alt" data-review-id="${this.id}"></i>`;

    this.deleteLink ||= document.createElement('a');
    this.deleteLink.classList.set("my-1 text-right");
    this.deleteLink.innerHTML = `<i class="deleteReview p-4 fa fa-trash-alt" data-review-id="${this.id}"></i>`;

    this.element.append(this.gamePadLink, this.nameSpan, this.editLink, this.deleteLink);

    return this.element;
  }
}


class FlashMessage {
  constructor({type, message}) {
    this.message = message;
    this.color = type == "error" ? 'bg-red-200' : 'bg-blue-100';
    this.render();
  }

  static container() {
    return this.c ||= document.querySelector('#flash')
  }

  render() {
    this.toggleMessage();
    window.setTimeout(() => this.toggleMessage(), 5000);
  }

  toggleMessage() {
    
    FlashMessage.container().textContent = this.message;
    FlashMessage.container().classList.toggle(this.color);
    FlashMessage.container().classList.toggle('opacity-0'); 
  }
}