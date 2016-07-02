(function(document) {
	var lightbox = document.getElementById("lightbox");
	var backdrop = document.getElementById("lightbox-backdrop");	
	var thumbnailsContainer = document.getElementById("thumbnails");
	var featuredPhotoImg = document.getElementById("featured-photo-img");
	var featuredPhotoTitle = document.getElementById("featured-photo-title");
	var featuredPhoto = document.createElement("img");
	var photos = [];
	var photoIndex = 0;

	function toggle(el) {
		el.className = (el.className == "hide" ? "show" : "hide");
	}

	function toggleLightbox() {
		toggle(lightbox);
		toggle(backdrop);
	}

	function clearContent(el) {
	    while (el.firstChild) {
		   el.removeChild(el.firstChild);
		}
	}

	function ajaxRequest(tag) {
		var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=bc22da45cca487c9d2f5fe620687e996&per_page=100&format=json&nojsoncallback=1&tags=" + tag;
		var httpRequest = new XMLHttpRequest();

		httpRequest.onreadystatechange = function() {
		    if (httpRequest.readyState === XMLHttpRequest.DONE) {
		    	console.log("Ready!")
		    	if (httpRequest.status === 200) {
				    console.log("Success!");
				    photos = JSON.parse(httpRequest.responseText).photos.photo;
				    createThumbnails(photos);
				} else {
					console.log("Fail!");
				}
			} else {
				console.log("Not ready!!");
			};
		};

		httpRequest.open('GET', url);
		httpRequest.send(null);
	}

	function interpolateImageUrl(photo, size) {
		var url = "https://farm{farm}.staticflickr.com/{server}/{id}_{secret}_{size}.jpg";

		for (var key in photo) {
			url = url.replace("{" + key + "}", photo[key]);
		}

		url = url.replace("{size}", size);
		return url;
	}

	function getPhotoTitle(photo) {
		return photo.title == "" ? "(NO TITLE)" : photo.title;
	}

	function createThumbnails(photos) {
		for (var i = 0; i < photos.length; i++) {
			var photo = photos[i];
			var thumbnail = document.createElement("img");

			thumbnail.src = interpolateImageUrl(photo, "q");
			thumbnail.className = i;
			thumbnail.alt = getPhotoTitle(photo);

			// As each thumbnail image is being created, add event listener to display lightbox when thumbnail is clicked
			thumbnail.addEventListener("click", function(evt) {
				clearContent(featuredPhotoImg);

				photoIndex = parseInt(evt.target.className); // Index to keep track for navigating prev and next
				
				featuredPhotoTitle.innerText = evt.target.alt;
				featuredPhoto.src = evt.target.src.replace("_q.jpg", "_c.jpg"); // Constructing URL for larger image using thumbnail img src
				featuredPhotoImg.appendChild(featuredPhoto);
				toggleLightbox();
			});

			thumbnailsContainer.appendChild(thumbnail);
		}
	}

	function showPreviousPhoto() {
		// For infinite looping through list of returned photos
		if (photoIndex === 0) {
			photoIndex = photos.length - 1;
		} else {
			photoIndex--;
		}

		updateFeaturedPhoto();
	}

	function showNextPhoto() {
		// For infinite looping through list of returned photos
		if (photoIndex === photos.length - 1) {
			photoIndex = 0;
		} else {
			photoIndex++;
		}

		updateFeaturedPhoto();
	}

	function updateFeaturedPhoto() {
		var newPhoto = photos[photoIndex];
		var newSrc = interpolateImageUrl(newPhoto, "c");
		featuredPhotoTitle.innerText = getPhotoTitle(newPhoto);
		featuredPhoto.src = newSrc;
	}

	document.getElementById("search-form").addEventListener("submit", function(evt) {
		evt.preventDefault();

		var tag = evt.target.getElementsByTagName("input")[0].value;
		var warning = document.getElementsByTagName("p")[0];
		
		// Show warning if no tag is entered and hide once it is entered
		if (tag == "" && warning.className == "hide") {
			toggle(warning);
			return;
		} else if (tag != "" && warning.className == "show") {
			toggle(warning);
		}

	    clearContent(thumbnailsContainer);
	    ajaxRequest(tag); // Passing the value of text field for AJAX request
	});

	// When user clicks outside of the featured photo container, lightbox is toggled off
	document.getElementById("lightbox").addEventListener("click", function(evt) {
		if (evt.target.id === "lightbox") {
			toggleLightbox();
		}
	});

	document.onkeydown = function(evt) {
		if (lightbox.className == "show") {
		    if (evt.keyCode == 27) { // Escape key while lightbox is displayed, lightbox is toggled off
		        toggleLightbox();
		    } else if (evt.keyCode == 37) { // Left arrow to navigate to the previous photo
		        showPreviousPhoto();
		    } else if (evt.keyCode == 39) { // Right arrow to navigate to the next photo
		        showNextPhoto();
		    }
		}
	};

	document.getElementById("close-button").addEventListener("click", toggleLightbox);
	document.getElementById("prev").addEventListener("click", showPreviousPhoto);
	document.getElementById("next").addEventListener("click", showNextPhoto);

})(document);