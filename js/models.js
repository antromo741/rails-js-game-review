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
    return this.c ||= document.querySelector('#games')
  }
  
  /*
  Game.all() will return a promise for all of the game objects that we get from fetching the game
  this collection will be stored locally in game.collection so we can refernce it after yhe 
  intial call to Game.all() which will occur at the DOMContentLoaded event
  */
  static all() {
    console.log(this);
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
      new FlashMessage({type: 'success', message: 'New game added succesfully'})
      return game;
    })
    .catch(error => {
      new FlashMessage({type: 'error', message: error});
    })
  }

  show() {
    return fetch(`http://localhost:3000/games/${this.id}`, {
      method: 'GET', 
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
      .then(({id, reviewsAttributes}) => {
        Review.loadFromList(id, reviewsAttributes)
        this.markActive()
      })
      .catch(error => {
        new FlashMessage({type: 'error', message: error});
      })
  }

  delete() {
    return fetch(`http://localhost:3000/games/${this.id}`,{
      method: "DELETE",
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
    .then(({id}) => {
      let index = Game.collection.findIndex(review => review.id == id)
      Game.collection.splice(index, 1);
      this.element.remove();
      if (id == Review.active_game_id) {
        Review.container().innerHTML = `<li class="my-2 p-4">Select a Game to see a Review</li>`
      }
      return this;

    })
    .catch(error => new FlashMessage({type: 'error', message: error}))
  }

  markActive() {
    if(Game.activeGame) {
      Game.activeGame.active = false;
      Game.activeGame.element.classList.replace('bg-red-500', 'bg-green-200');
      
    }
    Game.activeGame = this;
    this.active = true;
    this.element.classList.replace('bg-green-200', 'bg-red-500');
  }

  render() {
  this.element ||= document.createElement('li')

  this.element.classList.set(`my-2 px-4 bg-green-200 grid grid-cols-12 sm:grid-cols-6`);
 
  this.nameLink ||= document.createElement('a');
  this.nameLink.classList.set("selectGame py-4 col-span-10 sm:col-span-4");
  this.nameLink.textContent = this.name;
  this.nameLink.dataset.gameId = this.id;

  if(!this.editLink){
  this.editLink ||= document.createElement('a');
  this.editLink.classList.set("my-4 text-right");
  this.editLink.innerHTML = `<i class="editGameForm fa fa-pencil-alt  p-4 cursor-pointer" data-game-id="${this.id}"></i>`;
  
  this.deleteLink ||= document.createElement('a')
  this.deleteLink.classList.set("my-4 text-right");
  this.deleteLink.innerHTML = `<i class="deleteGameForm fa fa-trash-alt  p-4 cursor-pointer" data-game-id="${this.id}"></i>`;
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
  
  static collection() {
    return this.coll ||= {};
  }

  static container() {
    return this.c ||= document.querySelector("#reviews")
  }

  static findById(id) {
    return this.collection()[Review.active_game_id].find(review => review.id == id);
  }

  static loadFromList(id, reviewsAttributes) {
    Review.active_game_id = id;
    let reviews = reviewsAttributes.map(reviewAttributes => new Review(reviewAttributes));
    this.collection()[id] = reviews;
    let rendered = reviews.map(review => review.render())
    this.container().innerHTML = "";
    this.container().append(...rendered)
  }

  static create(formData) {
    if(!Review.active_game_id){
      return Promise.reject.catch(() => new FlashMessage({type: 'error', message: "Please select a game before adding a review"}));
    } else {
      formData.game_id = Review.active_game_id;
    }
    console.log(formData);
    return fetch(`http://localhost:3000/reviews`, {
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
        if (res.ok) {
          return res.json();
        } else {
          return res.text().then(error => Promise.reject(error));
        }
      })
      .then(reviewData => {
        let review = new Review(reviewData);
        this.collection()[Review.active_game_id].push(review);
        this.container().append(review.render());
        return review;
      })
      .catch(error => new FlashMessage({type: 'error', message: error}))
  }

  edit() {
      this.editForm ||= document.createElement("form")
      this.editForm.classList.set("editReviewForm mb-2");
      this.editForm.dataset.reviewId = this.id;
      this.editForm.innerHTML = `
      <fieldset class="my-2">
      <label for="name" class="block w-full uppercase">Name</label>
      <input  
        type="text" 
        name="name" 
        id="name"
        class="w-full border-2 rounded p-2 focus:outline-none focus:ring focus:border-blue-300" 
        />
      </fieldset>
      <fieldset class="my-2">
        <label for="review_post" class="block w-full uppercase">Review Post</label>
        <textarea
          id="review_post" 
          name="review_post" 
          class="w-full h-32 border-2 rounded p-2 focus:outline-none focus:ring focus:border-blue-300"
        ></textarea>
      </fieldset> 
      <input 
        type="submit" 
        class="w-full block py-3 bg-green-400 hover:bg-green-500 transition duration-200 uppercase font-semibold cursor-pointer" 
        value="Save Review" 
      />
     </form>
     `
      this.editForm.querySelector('#name').value = this.name;
      this.editForm.querySelector('#review_post').value = this.review_post || '';
      return this.editForm;
   }

   update(formData) {
    return fetch(`http://localhost:3000/reviews/${this.id}`, {
      method: "PUT",
      headers:{
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({review: formData})
    })
    .then(res => {
      if(res.ok) {
        return res.json()
      } else {
        return res.text().then(error => Promise.reject(error))
      }
    })
    .then((reviewAttributes) => {
      Object.keys(reviewAttributes).forEach(attr => this[attr] = reviewAttributes[attr])
      this.render();
      new FlashMessage({type: 'success', message: 'Review updated successfully'});
    })
    .catch(error => new FlashMessage({type: 'error', message: error})) 
   }

  delete() {
    return fetch(`http://localhost:3000/reviews/${this.id}`,{
      method: "DELETE",
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
    .then(({id}) => {
      let index = Review.collection()[Review.active_game_id].findIndex(review => review.id == id)
      Review.collection()[Review.active_game_id].splice(index, 1);
      this.element.remove();
      return this;

    })
    .catch(error => new FlashMessage({type: 'error', message: error}))
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
    this.editLink.innerHTML = `<i class="editReviewForm p-4 fa fa-pencil-alt" data-review-id="${this.id}"></i>`;

    this.deleteLink ||= document.createElement('a');
    this.deleteLink.classList.set("my-1 text-right");
    this.deleteLink.innerHTML = `<i class="deleteReviewForm p-4 fa fa-trash-alt" data-review-id="${this.id}"></i>`;

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