
let photoId = '';
let content = document.getElementById('content');
let edited = document.getElementById('edited');
let tools = document.getElementById('tools');
var canvas = document.getElementById('cedit');
let happyBtn = document.getElementById('happybtn');
let angryBtn = document.getElementById('angrybtn');
let drawBtn = document.getElementById('drawbtn');
let editablePhoto = null;
let biggest = null;
const API_KEY = '...'; //removed key, requests wont work without it. create and use own key for testing
const STATIC_ADDRESS = ' https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=';
var isDrawing = false;
 
init();

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
 * Initializes editor page by checking for photo id, displaying feedback
 * to user and starting search on Flickr for best size version of that
 * photo.
 */
function init() {
    happyBtn.disabled = true;
    angryBtn.disabled = true;
    drawBtn.disabled = true;
    this.photoId = getRequestedName();
    if (!this.photoId) {
        edited.innerHTML = 'Could not retreive photo information.';
        return;
    }
    edited.innerHTML = 'Loading...';
    getBiggestPhoto(this.photoId);
}




/**
 * Downloads json formatted available photo sizes for photo with given id
 * from Flickr.
 *  
 */
function getBiggestPhoto(id) {
    let urlRequest = STATIC_ADDRESS + API_KEY + '&photo_id=' + id + '&format=json&nojsoncallback=1';
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () { onVersionsDownloaded(request) };
    request.open('GET', urlRequest, true);
    request.send();
}

/**
 * When download of photo sizes from Flickr is finished this method checks if
 * download succeded and enables photo editing for user or displays feedback
 * if error occured.
 */
function onVersionsDownloaded(req) {
    if (req.readyState == XMLHttpRequest.DONE) {
        if (req.status == 200) {

            let sizes = getAllSizes(req.responseText);
            if (!sizes) {
                edited.innerHTML = 'Could not retreive photo information.';
                return;
            }
            this.editablePhoto = new EditablePhoto(this.photoId, sizes);
            enablePhotoEditing();
        }
        else {
            edited.innerHTML = ('Error, could not retreive list of photos: status ' + req.status);
        }
    }
}


/**
 * Decodes json string photo size data from Flickr.
 * @returns array of Size objects with sizes available for photo
 */
function getAllSizes(jsonStringSizes) {

    let jsonObj = JSON.parse(jsonStringSizes);
    let sizeArray = jsonObj.sizes.size;
    let sizes = [];
    for (let i in sizeArray) {
        let source = sizeArray[i].source;
        let sizeLabel = sizeArray[i].label;
        let width = sizeArray[i].width;
        let height = sizeArray[i].height;
        if (source && sizeLabel && width && height) {
            let size = new Size(sizeLabel, source, width, height);
            sizes.push(size);
        }
    }
    return sizes;
}


/**
 * Method loads biggest available photo for EditablePhoto object which
 * was chosen by user, it even enables tools for photo editing.
 */
function enablePhotoEditing() {
    this.biggest = this.editablePhoto.getBiggestSize();
    let img = createImgElement(this.biggest.source, this.editablePhoto.id);
    canvas.width = this.biggest.width;
    canvas.height = this.biggest.height;
    let cont = canvas.getContext('2d');
    img.onload = function () {
        cont.drawImage(img, 0, 0);
        happyBtn.disabled = false;
        angryBtn.disabled = false;
        //drawBtn.disabled=false;

    };
    this.edited.innerHTML = '';
    enableButtons();

}
 
/**
 * Enables tools buttons.
 */
function enableButtons() {
    document.getElementById('happybtn').addEventListener('click', function () { addHappyFilter(); });
    document.getElementById('angrybtn').onclick = function () { addAngryFilter() };
    document.getElementById('drawbtn').onclick = function () { };
}

/**
 * Adds a yellow-white gradient on top of displayed photo in canvas to imitate sunny day.
 */
function addHappyFilter() {
    let cont = this.canvas.getContext("2d");
    let grd = cont.createLinearGradient(0, 170, 0, 0);

    grd.addColorStop(0, "rgba(255, 255, 255, 0.5)");
    grd.addColorStop(1, "rgba(239, 246, 166, 0.8)");
    cont.fillStyle = grd;
    cont.fillRect(0, 0, canvas.width, canvas.height);
}
 
/**
 * Adds black-red gradient on top of displayed photo to picturize angry feelings.
 */
function addAngryFilter() {
    let cont = this.canvas.getContext("2d");
    let grd = cont.createLinearGradient(0, 170, 0, 0);

    grd.addColorStop(0, "rgba(106, 31, 35, 0.5)");
    grd.addColorStop(1, "rgba(0,0,0, 0.8)");
    cont.fillStyle = grd;
    cont.fillRect(0, 0, canvas.width, canvas.height);
}


/**
 * Size class contains specfic size of photo.
 */
class Size {
    constructor(label, source, width, height) {
        this.label = label;
        this.source = source;
        this.width = width;
        this.height = height;
    }

    area() {
        return this.width * this.height;
    }

    toString() {
        return `label: ${this.label}, width: ${this.width}, height: ${this.height}, source: ${this.source}`;
    }

}

/**
 * EditablePhoto is representation of edit enabled photo with its different sizes.
 */
class EditablePhoto {
    constructor(id, sizes) {
        this.id = id;
        this.sizes = sizes;
    }

    getBiggestSize() {
        let biggest = null;
        for (let size of this.sizes) {
            if (!biggest) {
                biggest = size;
                continue;
            }
            if (biggest.area() < size.area()) {
                biggest = size;
            }
        }
        return biggest;
    }
}


/**
 * Creates img element and returns it.
 * @param url - url adress to photo
 * @param id - id of photo resource from Flickr
 */
function createImgElement(url, id) {

    let img = new Image();
    let linkText = document.createTextNode('');
    img.appendChild(linkText);
    img.alt = id;
    img.src = url;
    return img;

}


