document.addEventListener('DOMContentLoaded', function(e) {
    Game.all();
})

document.addEventListener('click', function(e) {
    console.dir(e.target)
    let target = e.target;
    if (target.matches(".selectGame")) {
        let list = Game.findById(target.dataset.gameId);
        list.show();
    } else if (target.matches(".deleteGame")) {
        let list = Game.findById(target.dataset.gameId);
        list.delete();
    } else if(taget.matches(".editGame")) {
        let list = Game.findById(target.dataset.gameId);
        list.edit()
    }
})

document.addEventListener('submit', function(e) {
    let target = e.target;
    if(target.matches('#newGame')) {
        e.preventDefault();
        let nameInput = target.querySelector('input[name="name"]');
        let formData = {
            name: nameInput.value
        };
        Game.create({game: formData})
        .then(() => nameInput.value = "");
    } else if (target.matches('editGameForm')) {
        e.preventDefault();
        let nameInput = target.querySelector('input[name="name"]');
        let formData = {
          name: nameInput.value
        };
        let list = Game.findById(target.dataset.gameId);
        list.update({game: formData});
    }
})