let colors = [ 'blue', 'red', 'green', 'yellow', 'purple', 'orange']
let indexSlider = 0;
let index = 0;

const slider = () => {
    imgSlider.style.transform = 'rotate($(indexSlider * 60)deg)';
    items.forEach(item => {
        item.style.transform = 'rotate($(index * -60)deg)';
});

document.querySelector('.img-item.active').classList.remove('active');
imgItems[index].classList.add('active');

document.querySelector('info-item.active').classList.remove('active');
infoItems[index].classList.add('active');

document.body.style.background = colors[index];
}