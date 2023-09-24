document.addEventListener('DOMContentLoaded', function(){
    const allButtons = document.querySelectorAll('.searchBtn');
    const searchBar = document.querySelector('.searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchclose = document.getElementById('searchclose');


    for(var i = 0; i < allButtons.length; i++) {
        allButtons[i].addEventListener('click', function () {
            searchBar.style.visibility = 'visible';
            searchBar.classList.add('open');
            this.setAttribute('aria-expanded' , 'true');
            searchInput.focus();
        });
    }

    searchclose.addEventListener('click', function () {
        searchBar.style.visibility = 'hidden';
        searchBar.classList.remove('open');
        this.setAttribute('aria-expanded' , 'false');
    });

})