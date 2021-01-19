document.addEventListener('DOMContentLoaded', function(e) {
    Game.all();
})

document.addEventListener('click', function(e) {
    let target = e.target;
  
    if(target.matches(".selectGame")) {
      let game = Game.findById(target.dataset.gameId);
      game.show();
    } else if(target.matches(".deleteGameForm")) {
      if(confirm("Are you sure you want to delete this game?")) {
        let game = Game.findById(target.dataset.gameId);
        game.delete();
      }
    }  else if(target.matches(".editReview")) {
        let review = Review.findById(target.dataset.reviewId);
        Modal.populate({title: "Edit Review", content: review.edit()})
        Modal.toggle()
      } else if(target.matches(".deleteReview")) {
        if(confirm("Are you sure you want to delete this review?")) {
          let review = Review.findById(target.dataset.reviewId);
          review.delete();
        }
      } else if(target.matches(".modal-close") || target.matches(".modal-overlay")) {
        e.preventDefault();
        Modal.toggle();
    } 
})

document.addEventListener('submit', function(e) {
    let target = e.target; 
    if(target.matches('#newGame')) {
      e.preventDefault();
      Game.create(target.serialize())
        .then(() => target.reset());
    } else if (target.matches('.editGameForm')) {
      e.preventDefault();
      let game = Game.findById(target.dataset.gameId);
      game.update(target.serialize());
    } else if (target.matches('#newReviewForm')) {
      e.preventDefault();
      if(!Review.active_game_id) {
        return new FlashMessage({type: 'error', message: 'Make sure to select a Game before creating a new Review'})
      }
      Review.create(target.serialize())
        .then(() => target.reset());
    } else if (target.matches('.editReviewForm')) {
      e.preventDefault();
      let review = Review.findById(target.dataset.reviewId);
      review.update(target.serialize());
    } 
  })