# Flickr Photo Search

This is an example of using the [Flickr API](https://www.flickr.com/services/api/) to search for public photos by tag. The search result is displayed in a grid of photo thumbnails which can be clicked to open a lightbox for closer look.

## Features

- Search for photos by tag
- Press enter key to submit the form
- Click thumbnail to open lightbox
- Navigate through slides of photos using left and right arrows
- Loop through slides of photos back to the beginning
- Press escape key to close lightbox
- Display simple error handling when form is submitted without tag
- Responsive design

## Compatibility

- Chrome (Version 51.0.2704.106)
- Safari (Version 9.1)
- Firefox (Version 47.0.1)
- IE

## Known issues

When a search is made on Firefox, the browser loads the alternative texts before the images are fully loaded. There were two options I considered to improve user experience: not using alternative text in whole or making the images's font color transparent to hide the alternative text. I've decided against both because alternative text should display in the case that image does not load. 