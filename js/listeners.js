document.addEventListener('DOMContentLoaded', function(e) {
    Game.all();
})

document.addEventListener('click', function(e) {
    let target = e.target;
  
    if(target.matches(".selectGame")) {
      let game = Game.findById(target.dataset.gameId);
      game.show();
    } else if(target.matches(".deleteGame")) {
      if(confirm("Are you sure you want to delete this game?")) {
        let game = Game.findById(target.dataset.gameId);
        game.delete();
      }
    } else if(target.matches(".editGame")) {
      let game = Game.findById(target.dataset.gameId);
      Modal.populate({title: "Edit Game", content: game.edit()})
      Modal.toggle()
    } else if(target.matches(".deleteGame")) {
      if(confirm("Are you sure you want to delete this game?")) {
        let game = Game.findById(target.dataset.gameId);
        game.delete();
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
        .then(() => {
          target.reset();
          target.querySelector('input[name="name"]').blur();
        });
    } else if(target.matches('#newReviewForm')) {
      e.preventDefault();
      Review.create(target.serialize())
        .then(() => target.reset());
    } else if(target.matches('.editReviewForm')) {
      e.preventDefault();
      let review = review.findById(target.dataset.reviewId);
      review.update(target.serialize())
        //.then(() => Modal.toggle())
    }
  });