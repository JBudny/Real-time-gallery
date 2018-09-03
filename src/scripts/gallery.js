const socket = io();
let imageList = [];
let currentPage = 1;
let imagesPerPage = 0;
let nrOfPages = 0;
let nrOfImages = 0;

socket.on('init', function(data) {
  imageList = data;
  nrOfImages = imageList.length;
  nrOfPages = howMuchPages(imageList);
  showPaginationNavigation(imageList);
  if (nrOfPages > 0) {
    let visiblePages = generatePages(currentPage, imageList);
    showPaginationPages(visiblePages);
    paginationActivePageToggle(currentPage);
    showGalleryOfSelectedPage(currentPage, imageList);
    showNrOfPages(imageList);
  } else {
    $('.empty').show();
    $('.pagination').hide();
    currentPage = 1;
  }
});

$(document).ready(function() {
  $('.modal-background').hide();
  $('.modal-content').hide();
})

$(document).on('click', '.pageNr', function(e) {
  currentPage = e.currentTarget.attributes.id.textContent;
  refreshAll(currentPage, imageList);
});

$(document).on('click', '.pagination-previous', function(e) {
  currentPage = $('.pagination-active').attr('id');
  currentPage = paginationPrevious(currentPage);
  refreshAll(currentPage, imageList);
});

$(document).on('click', '.pagination-next', function() {
  currentPage = $('.pagination-active').attr('id');
  currentPage = paginationNext(currentPage);
  refreshAll(currentPage, imageList);
});

$(document).on('click', '.modal-close', function() {
  $('.modal-content').hide();
  $('.modal-background').hide();
})

$(document).on('click', '.modal-background', function() {
  $('.modal-content').hide();
  $('.modal-background').hide();
})

$(document).on('click', '.card', function() {
  $('.modal-background').css('display', 'flex');
  $('.modal-image>img').attr('src', 'gallery/' + this.id);
  $('.modal-image>figcaption>p').replaceWith('<p>' + this.id + '</p>');
  $('.modal-content').show();
})

socket.on('galleryUpdated', function(data) {
  nrOfPages = howMuchPages(data);
  currentPage = $('.pagination-active').attr('id');
  imageList = data;
  if (typeof currentPage == 'undefined') {
    currentPage = 1;
  }
  if (nrOfPages < currentPage) {
    currentPage = nrOfPages;
  }
  refreshAll(currentPage, imageList);
});

let howMuchPages = (imageList) => {
  if (window.matchMedia("only screen and (min-width: 1024px) and (max-width: 1366px) and (-webkit-min-device-pixel-ratio: 1.5)").matches) {
    imagesPerPage = 9;
    return Math.ceil(nrOfImages / 9);
  } else {
    imagesPerPage = 10;
    return Math.ceil(nrOfImages / 10);
  }
}

let generatePages = (currentPage, imageList) => {
  let i = 0;
  let firstPage = currentPage - 2;
  let visiblePages = [];
  if (currentPage < 4) {
    firstPage = 2;
    if (nrOfPages >= 5) {
      for (firstPage; firstPage <= 5; firstPage++) {
        visiblePages[i] = firstPage;
        i++
      }
    } else {
      for (firstPage; firstPage <= nrOfPages; firstPage++) {
        visiblePages[i] = firstPage;
        i++
      }
    }
    return visiblePages;
  } else if (currentPage > nrOfPages - 3) {
    if (nrOfPages > 5) {
      firstPage = nrOfPages - 4;
    } else {
      firstPage = 2;
    }
    for (firstPage; firstPage <= nrOfPages; firstPage++) {
      visiblePages[i] = firstPage;
      i++
    }
    return visiblePages;
  } else {
    let lastPage = Number(currentPage) + 2;
    for (firstPage; firstPage <= lastPage; firstPage++) {
      if (firstPage > 1 && firstPage <= nrOfPages) {
        visiblePages[i] = firstPage;
        i++;
      }
    }
    return visiblePages;
  }
}

let showPaginationNavigation = (imageList) => {
  $(".pagination").append('<a href="#" class="pagination-previous">&laquo; Previous</a>');
  $(".pagination").append('<a class="pageNr" aria-label="page ' + 1 + '" href="#" id="' + 1 + '">' + 1 + '</a>');
  $(".pagination").append('<div class="pagination-dots"</div>');
  $(".pagination").append('<div class="pagination-interactive"</div>');
  $(".pagination").append('<div class="nrOfPages"></div>');
  $(".pagination").append('<a href="#" class="pagination-next">Next &raquo;</a>');
}

let showPaginationPages = (visiblePages) => {
  $('.pagination-interactive').find('.interactiveElement').each(function() {
    $(this).remove();
  });
  for (let i = 0; i <= visiblePages.length - 1; i++) {
    $(".pagination-interactive").append('<a class="pageNr interactiveElement" aria-label="page ' + visiblePages[i] + '" href="#" id="' + visiblePages[i] + '">' + visiblePages[i] + '</a>');
  }
}

let paginationActivePageToggle = (currentPage) => {
  $('.pagination').find('a').each(function() {
    $(this).removeClass('pagination-active');
  })
  $('#' + currentPage).toggleClass('pagination-active');
}

let showGalleryOfSelectedPage = (currentPage, imageList) => {
  let imageIndex = (currentPage * imagesPerPage) - imagesPerPage;
  let counter = 0;
  while (counter < imagesPerPage) {
    if (imageIndex < nrOfImages) {
      $(".gallery").append('<figure class="card" id="' + imageList[imageIndex] + '"><img class="card-image" src="gallery/' + imageList[imageIndex] + '" alt="Image: ' + imageIndex + '"><figcaption class="card-caption" id="' + imageList[imageIndex] + '">' + imageList[imageIndex] + '</figcaption></figure>');
      imageIndex++;
      counter++;
    } else {
      counter = 10;
    }
  }
}

let showNrOfPages = (imageList) => {
  $('.nrOfPages').find('p').each(function() {
    $(this).remove();
  });
  $(".nrOfPages").append('<p>of ' + nrOfPages + '</p>');
}

let paginationPrevious = (currentPage) => {
  if (currentPage > 1) {
    currentPage = Number(currentPage) - 1;
    return currentPage;
  } else {
    if (currentPage <= 1) {
      currentPage = nrOfPages;
      return currentPage;
    }
  }
}

let paginationNext = (currentPage) => {
  if (currentPage < nrOfPages) {
    currentPage = Number(currentPage) + 1;
    return currentPage;
  } else {
    if (currentPage >= nrOfPages) {
      currentPage = 1;
      return currentPage;
    }
  }
}

let clearGallery = () => {
  $('.gallery').find('.card').each(function() {
    $(this).remove();
  });
}

let addDots = (visiblePages, imageList) => {
  $('.pagination-dots').find('.interactiveElement').each(function() {
    $(this).remove();
  });
  currentPage = $(".pagination-active").attr('id');
  if (currentPage - 1 > 3 && nrOfPages > 5) {
    $(".pagination-dots").append('<p class="interactiveElement">...</p>');
  }
}

let refreshAll = (currentPage, imageList) => {
  let visiblePages = generatePages(currentPage, imageList);
  clearGallery();
  if (nrOfPages > 0) {
    $('.empty').hide();
    $('.pagination').show();
    showPaginationPages(visiblePages);
    paginationActivePageToggle(currentPage);
    addDots(visiblePages, imageList);
    showGalleryOfSelectedPage(currentPage, imageList);
    showNrOfPages(imageList);
  } else {
    $('.empty').show();
    $('.pagination').hide();
  }
}
