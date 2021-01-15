document.addEventListener('DOMContentLoaded', function(e) {
    Game.all();
})

document.addEventListener('click', function(e) {
    console.dir(e.target)
})


document.addEventListener('submit', function(e) {
    let target = e.target;
    if(target.matches('#newGame')) {
        e.preventDefault();
        let formData = {}
        target.querySelectorAll('input').forEach(function(input) {
            formData[input.name] = input.value;
        })
        Game.create(formData);
    }
})