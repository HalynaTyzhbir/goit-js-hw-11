import './sass/index.scss';
import Notiflix from 'notiflix';
import axios from "axios";

const refs = {
    form: document.querySelector('#search-form'),
    searchQuery: document.querySelector('.input-request'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
}
refs.loadMoreBtn.classList.add("hide");
let currentPage = 1;

const getPictures = async () => {
    try {
        const KEY = "34507667-10e09daff0142ff80b56bfc1b";
        const QUERY = refs.searchQuery.value.trim();
        
        const Response = await axios.get
            (`https://pixabay.com/api/?key=${KEY}&q=${QUERY}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`);
    
        if (Response.data.hits.length === 0 || QUERY === "") {
            Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');
        } else {
            insertContent(Response.data.hits);
            if (Response.data.hits.length === 40 && currentPage === 1) {
                refs.loadMoreBtn.classList.remove("hide");
            } else if (Response.data.hits.length < 40 && currentPage !== 1) {
                refs.loadMoreBtn.classList.add("hide");
                Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            };
            if (Response.data.hits.length !== 0 && currentPage === 1) {
                Notiflix.Notify.success(`Hooray! We found ${Response.data.totalHits} images.`);
            }; 
        }
    }
    catch (error) {
        console.log(error);
    }
}

const handleSubmit = (e) => {
    e.preventDefault();
    if (e.type === "submit") {
        refs.gallery.innerHTML = "";
        currentPage = 1;
        refs.loadMoreBtn.classList.add("hide");
    };
    if (e.type === "click") {
        currentPage += 1;
    }
    getPictures();
}

const createPictureCard = (card) => `<div class="photo-card">
<img src = "${card.webformatURL}" alt = "${card.tags}" loading="lazy">
<div class="info">
<p class="info-item">likes<b> ${card.likes}</b></p>
<p class="info-item">views<b> ${card.views}</b></p>
<p class="info-item">comments<b> ${card.comments}</b></p>
<p class="info-item">downloads<b> ${card.downloads}</b></p>
</div>
</div>`;

const generateContent = (array) => array.reduce((acc, card) => acc + createPictureCard(card), "");

const insertContent = (array) => {
    const result = generateContent(array);
    refs.gallery.insertAdjacentHTML("beforeend", result);
};

refs.form.addEventListener("submit", handleSubmit);
refs.loadMoreBtn.addEventListener("click", handleSubmit);
