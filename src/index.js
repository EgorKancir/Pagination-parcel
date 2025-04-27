import axios from 'axios';
import * as basicLightbox from 'basiclightbox';

const imageList = document.getElementById("image-gallery");
const loadBtn = document.getElementById("load-more-btn");

const url = "https://pixabay.com/api/?key=38928903-dd3dafa1314b3ab642900bf79&q=porsche&image_type=photo&per_page=30";
let sitePage = 1;

async function fetchImage(page) {
    try {
        const { data } = await axios.get(`${url}&page=${page}`);
        console.log(data);
        makeHtml(data.hits);

    } catch (error) {}
}
function makeHtml(dataImage) {

    const markup = dataImage.map(image => {
        return `
            <div class="image-box">
                <img class="image-box__img" src="${image.largeImageURL}" data-large="${image.largeImageURL}" data-userLike="false" alt="JPG">
                <div class="image-box__img-info">
                    <div class="image-box__author-info">
                        <img class="image-box__author-avatar" src="https://cdn-icons-png.flaticon.com/512/1177/1177568.png" alt="user image" style="width: 40px; height: auto;">
                        <h3 class="image-box__author-name">${image.user}</h3>
                    </div>
                    <div class="image-box__likes" data-likes="${image.likes}">
                        <img class="image-box__likes-icon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Eo_circle_green_heart.svg/768px-Eo_circle_green_heart.svg.png" alt="Green likes" style="width: 20px; height: auto;">
                        ${image.likes}
                    </div>
                </div>
            </div>`;
    })
    .join('');

    imageList.insertAdjacentHTML('beforeend', markup);
}

imageList.addEventListener('click', (event) => {
    if (event.target.classList.contains("image-box__img")) {
        const instance = basicLightbox.create(`
            <div style="position: relative;">
                <button style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; font-size: 30px; cursor: pointer; color: white;" id="modal-close">&times;</button>
                <img src="${event.target.dataset.large}" alt="JPG" style="max-width: 100%; height: auto; display: block;"/>
            </div>
        `);
        instance.show();
        document.getElementById('modal-close').addEventListener('click', () => {
            instance.close();
        });

    } else if (event.target.closest(".image-box__likes")) {
        const likeBox = event.target.closest(".image-box__likes");
        let likes = Number(likeBox.dataset.likes); 
        const userLikes = likeBox.dataset.userLike === "true"; 
        let opacity = 1;

        if (userLikes) {
            likeBox.dataset.likes = likes - 1;
            likeBox.dataset.userLike = "false";
            opacity = 1; 
        } else {
            likeBox.dataset.likes = likes + 1;
            likeBox.dataset.userLike = "true";
            opacity = 0.6;
        }
        likeBox.innerHTML = `
            <img class="image-box__likes-icon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Eo_circle_green_heart.svg/768px-Eo_circle_green_heart.svg.png" alt="Green likes" style="width: 20px; height: auto; opacity: ${opacity};">
            ${likeBox.dataset.likes}
        `;
    }
})

document.addEventListener('DOMContentLoaded', async () => {
    fetchImage(sitePage)
});
loadBtn.addEventListener('click', async () => {
    sitePage++;
    console.log(sitePage);
    fetchImage(sitePage)
});

