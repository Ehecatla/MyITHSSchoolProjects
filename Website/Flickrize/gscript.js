let content = document.getElementById('content');
let gallery = document.getElementById('gallery');
let searchReq;
let requestedPhotos = [];
const SEARCH_ADDRESS = ' https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key';
const API_KEY = '...'; //removed key, requests wont work without it. create and use own key for testing

let searchWord = getRequestedName();
searchForPhotos(searchWord);

/**
 * Retreives searched by user word string from page adress.
 * @returns text searched by user
 */
function getRequestedName() {
    let searched = window.location.search;
    searched = searched.substr(searched.indexOf('=') + 1);
    return searched;
}


/**
 * When search form is submited this method runs search for photos on Flickr.
 * @param {string} word - is searched word that will be queried on Flickr
 */
function searchForPhotos(word) {
    if (!word) {
        gallery.innerHTML = 'Could not retreive any photos from Flickr.';
        return;
    } else {
        gallery.innerHTML = 'Loading...';
    }

    let request = `${SEARCH_ADDRESS}=${API_KEY}&text=${word}&format=json&nojsoncallback=1&extras=url_s`;
    searchReq = new XMLHttpRequest();
    searchReq.onreadystatechange = function () { onSearchDone(searchReq) };
    searchReq.open('GET', request, true);
    searchReq.send();

}


/**
 * When XMLHttpRequest for list of photos has been fullfilled this method checks 
 * the result. If result is OK then a gallery of found photos will be shown to user.
 * @param {XMLHttpRequest} xmlhttpr - is search request to be checked for status
 */
function onSearchDone(xmlhttpr) {
    if (xmlhttpr.readyState == XMLHttpRequest.DONE) {
        if (xmlhttpr.status == 200) {
            this.requestedPhotos = decodeJSONPhotos(xmlhttpr.responseText);
            displayPhotos(this.requestedPhotos);
        }
        else {
            alert('Error, could not retreive list of photos: status ' + xmlhttpr.status);
        }
    }
}


/**
 * Decodes jsonString result from Flickr gallery search request to array of Photo objects
 * which is then returned.
 * @param {string} jsonString - is string formatted photo gallery response from Flickr server
 * @returns an array of Photo objects to be shown to user in gallery
 */
function decodeJSONPhotos(jsonString) {
    let jsonObj = JSON.parse(jsonString);
    let photoArray = jsonObj.photos.photo;
    let photos = [];
    if (photoArray) {
        for (let i in photoArray) {
            let jsonPhoto = photoArray[i];
            let id = jsonPhoto.id;
            let urlS = jsonPhoto.url_s;
            if (id && urlS) {
                let photo = new Photo(id, urlS);
                photo.img = createImgElement('', '', photo.urlS, id);
                photos.push(photo);
            }

        }
    }
    return photos;
}

/**
 * Takes list of Photo objects and displays them to user by appending child
 * elements with photos. If list is empty user will be informed that there 
 * are no photos to show.
 * @param {array} photos - list of Photo objects to be shown
 */
function displayPhotos(photos) {
    gallery.innerHTML = '';
    if (photos.length < 1) {
        gallery.innerHTML = 'No photos were found for ' + searchWord;
        return;
    }
    for (let photo of photos) {
        gallery.appendChild(photo.img);
    }
 
}


/**
 * Class Photo is used as container of photo information to be
 * shown to user.
 * @constructor
 * @param {string} id is photos id on Flickr
 * @param {string} urlS is photos url on Flickr
 */
class Photo {
    constructor(id, urlS) {
        this.urlS = urlS;
        this.id = id;
        this.img = null;
        this.urlO = null;
    }

    toString() {
        return `id: ${this.id}, urlS: ${this.urlS}, urlO:${this.urlO}, a: ${this.img} `;
    }
}


/**
 * Creates img element contained in div and a elements which enable prettier
 * display of that element in DOM. 
 * @param {string} text - is thext to be added in node
 * @param {string} alt - is alternative text to picture
 * @param {string} refUrl - is url to photo to be used by img
 * @returns returns div element containing a element with img element in it
 */
function createImgElement(text, alt, refUrl, id) {

    let img = new Image();
    let linkText = document.createTextNode(text);
    img.appendChild(linkText);
    img.alt = alt;
    img.src = refUrl;

    let a = document.createElement('a');
    a.href = 'editor.html?search=' + id;
    a.appendChild(img);
    let div = document.createElement('div');
    div.className = 'photo';
    div.appendChild(a);
    return div;

}
