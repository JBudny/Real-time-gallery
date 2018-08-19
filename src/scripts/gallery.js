const socket = io();
let galleryData = {};
let currentPage = 1;

socket.on('init', function(data) {
  galleryData = data;
  showPaginationNavigation(galleryData);
  if (galleryData.nrOfPages > 0) {
    let visiblePages = generatePages(currentPage, galleryData);
    showPaginationPages(visiblePages);
    paginationActivePageToggle(currentPage);
    showGalleryOfSelectedPage(currentPage, galleryData);
    showNrOfPages(galleryData);
  } else {
    $('.empty').show();
    $('.pagination').hide();
    currentPage = 1;
  }
});

$(document).on('click', '.pageNr', function(e) {
  currentPage = e.currentTarget.attributes.id.textContent;
  refreshAll(currentPage, galleryData);
});

$(document).on('click', '.pagination-previous', function(e) {
  currentPage = $('.pagination-active').attr('id');
  currentPage = paginationPrevious(currentPage);
  refreshAll(currentPage, galleryData);
});

$(document).on('click', '.pagination-next', function() {
  currentPage = $('.pagination-active').attr('id');
  currentPage = paginationNext(currentPage);
  refreshAll(currentPage, galleryData);
});

socket.on('galleryUpdated', function(data) {
  currentPage = $('.pagination-active').attr('id');
  galleryData = data;
  if (typeof currentPage == 'undefined') {
    currentPage = 1;
  }
  if (galleryData.nrOfPages < currentPage) {
    currentPage = galleryData.nrOfPages;
  }
  refreshAll(currentPage, galleryData);
});

let generatePages = (currentPage, galleryData) => {
  let i = 0;
  let firstPage = currentPage - 2;
  let visiblePages = [];
  if (currentPage < 4) {
    firstPage = 2;
    if (galleryData.nrOfPages >= 5) {
      for (firstPage; firstPage <= 5; firstPage++) {
        visiblePages[i] = firstPage;
        i++
      }
    } else {
      for (firstPage; firstPage <= galleryData.nrOfPages; firstPage++) {
        visiblePages[i] = firstPage;
        i++
      }
    }
    return visiblePages;
  } else if (currentPage > galleryData.nrOfPages - 3) {
    if (galleryData.nrOfPages > 5) {
      firstPage = galleryData.nrOfPages - 4;
    } else {
      firstPage = 2;
    }
    for (firstPage; firstPage <= galleryData.nrOfPages; firstPage++) {
      visiblePages[i] = firstPage;
      i++
    }
    return visiblePages;
  } else {
    let lastPage = Number(currentPage) + 2;
    for (firstPage; firstPage <= lastPage; firstPage++) {
      if (firstPage > 1 && firstPage <= galleryData.nrOfPages) {
        visiblePages[i] = firstPage;
        i++;
      }
    }
    return visiblePages;
  }
}

let showPaginationNavigation = (galleryData) => {
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

let showGalleryOfSelectedPage = (currentPage, galleryData) => {
  let imageIndex = (currentPage * 10) - 10;
  let counter = 0;
  while (counter < 10) {
    if (imageIndex < galleryData.nrOfImages) {
      $(".gallery").append('<figure class="card"><img class="card-image" src="static/' + galleryData.imageList[imageIndex] + '" alt="Image: ' + imageIndex + '"><figcaption class="card-caption">' + galleryData.imageList[imageIndex] + '</figcaption></figure>');
      imageIndex++;
      counter++;
    } else {
      counter = 10;
    }
  }
}

let showNrOfPages = (galleryData) => {
  $('.nrOfPages').find('p').each(function() {
    $(this).remove();
  });
  $(".nrOfPages").append('<p>of ' + galleryData.nrOfPages + '</p>');
}

let paginationPrevious = (currentPage) => {
  if (currentPage > 1) {
    currentPage = Number(currentPage) - 1;
    return currentPage;
  } else {
    if (currentPage <= 1) {
      currentPage = galleryData.nrOfPages;
      return currentPage;
    }
  }
}

let paginationNext = (currentPage) => {
  if (currentPage < galleryData.nrOfPages) {
    currentPage = Number(currentPage) + 1;
    return currentPage;
  } else {
    if (currentPage >= galleryData.nrOfPages) {
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

let addDots = (visiblePages, galleryData) => {
  $('.pagination-dots').find('.interactiveElement').each(function() {
    $(this).remove();
  });
  currentPage = $(".pagination-active").attr('id');
  if (currentPage - 1 > 3 && galleryData.nrOfPages > 5) {
    $(".pagination-dots").append('<p class="interactiveElement">...</p>');
  }
}

let refreshAll = (currentPage, galleryData) => {
  let visiblePages = generatePages(currentPage, galleryData);
  clearGallery();
  if (galleryData.nrOfPages > 0) {
    $('.empty').hide();
    $('.pagination').show();
    showPaginationPages(visiblePages);
    paginationActivePageToggle(currentPage);
    addDots(visiblePages, galleryData);
    showGalleryOfSelectedPage(currentPage, galleryData);
    showNrOfPages(galleryData);
  } else {
    $('.empty').show();
    $('.pagination').hide();
  }
}
