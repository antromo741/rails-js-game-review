document.addEventListener('DOMContentLoaded', function(e) {
    Game.all();
    Modal.init();
})

document.addEventListener('click', function(e) {
    let target = e.target;
  
    if (target.matches('.loginLink')) {
      e.preventDefault();
      Modal.populate({title: "", content: Auth.loginForm()})
      Modal.toggle();
    } else if (target.matches('.logoutLink')) {
      e.preventDefault();
      Auth.logout();
    } else if(target.matches(".selectGame")) {
      let game = Game.findById(target.dataset.gameId);
      game.show();
    } else if(target.matches(".deleteGameForm")) {
      if(confirm("Are you sure you want to delete this game?")) {
        let game = Game.findById(target.dataset.gameId);
        game.delete();
      }
    }  else if(target.matches(".editReviewForm")) {
        let review = Review.findById(target.dataset.reviewId);
        Modal.populate({title: "Edit Review", content: review.edit()})
        Modal.toggle()
      } else if(target.matches(".deleteReviewForm")) {
        if(confirm("Are you sure you want to delete this review?")) {
          let review = Review.findById(target.dataset.reviewId);
          review.delete();
        }
      } else if (target.matches('.multi-submit[type="submit"]')) {
        e.preventDefault();
          let form = target.closest('form');
          if(form.matches('.authForm')) {
            if(target.value === "Login") {
              Auth.login(form.serialize());
            } else if(target.value === "Signup") {
              Auth.signup(form.serialize());
            }
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
    } else if (target.matches('#newReviewForm')) {
      e.preventDefault();
      Review.create(target.serialize())
      .then(() => target.reset());
  } else if(target.matches('.editReviewForm')) {
    e.preventDefault();
    let review = Review.findById(target.dataset.reviewId);
    review.update(target.serialize())
      .then(() => Modal.toggle())
  }
});

document.addEventListener('keydown', function(evt) {
  evt = evt || window.event;
  let isEscape = false;
  if ("key" in evt) {
    isEscape = (evt.key === "Escape" || evt.key === "Esc");
  } else {
    isEscape = (evt.keyCode === 27);
  }
  if (isEscape && document.body.classList.contains('modal-active')) {
    Modal.toggle();
  }
});