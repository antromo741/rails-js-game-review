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
        let formData = {}
         target.querySelectorAll('input').forEach(function(input) {
            formData[input.name] = input.value;
        })
      Game.create(formData)
        .then(() => {
          target.querySelectorAll('input').forEach(function(input) {
            input.value = "";
          })
        });
    } else if(target.matches('#newReviewForm')) {
      e.preventDefault();
      let formData = {};
        target.querySelectorAll('input').forEach(function(input) {
        formData[input.name] = input.value;
     });
    Review.create(formData)
    .then(() => {
        target.querySelectorAll('input').forEach(function(input) {
           input.value = "";
        })
        });
    }
})