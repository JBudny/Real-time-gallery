const socket = io();
socket.on('init', function(data) {
  const galleryData = getData(data);
  let currentPage = 1;
  let visiblePages = generatePages(currentPage, galleryData);
  paginationInit(galleryData);
  showPages(visiblePages);
  activePageToggle(currentPage);
  showGalleryOfSelectedPage(currentPage, galleryData);
  switchPage(galleryData);
  nextPrevious(currentPage, galleryData);
});

let getData = (data) => {
  return dane = {
    imageList: data.imageList,
    nrOfPages: data.nrOfPages,
    nrOfImages: data.nrOfImages
  };
}

let paginationInit = (galleryData) => {
  $(".pagination").append('<a href="#" class="pagination-previous">&laquo; Previous</a>');
  $(".pagination").append('<a class="pageNr" aria-label="page ' + 1 + '" href="#" id="p' + 1 + '">' + 1 + '</a>');
  $(".pagination").append('<div class="pagination-dots"</div>');
  $(".pagination").append('<div class="pagination-interactive"</div>');
  $(".pagination").append('<p>of ' + galleryData.nrOfPages + '</p>');
  $(".pagination").append('<a href="#" class="pagination-next">Next &raquo;</a>');
}

let clearGallery = () => {
  $('.gallery').find('.card').each(function() {
    $(this).remove();
  });
}

let showGalleryOfSelectedPage = (currentPage, galleryData) => {
  let i = (currentPage * 10) - 10;
  let c = 0;
  while (c < 10) {
    if (i < galleryData.nrOfImages) {
      $(".gallery").append('<figure class="card"><img class="card-image" src="static/' + galleryData.imageList[i] + '" alt="Image: ' + i + '"><figcaption class="card-caption">' + galleryData.imageList[i] + '</figcaption></figure>');
      i++;
      c++;
    } else {
      c = 10;
    }
  }
}

let activePageToggle = (id) => {
  $('.pagination').find('a').each(function() {
    $(this).removeClass('pagination-active');
  })
  $('#p' + id).toggleClass('pagination-active');
}

let generatePages = (currentPage, galleryData) => {
  let i = 0;
  let j = currentPage - 2;
  let k = Number(currentPage) + 2;
  let visiblePages = [];
  if (currentPage < 4) {
    j = 2;
    if (galleryData.nrOfPages >= 5) {
      console.log("test1-1")
      for (j; j <= 5; j++) {
        visiblePages[i] = j;
        i++
      }
      console.log(visiblePages);
    } else {
      for (j; j <= galleryData.nrOfPages; j++) {
        visiblePages[i] = j;
        i++
      }
      console.log("test1-2")
    }
    return visiblePages;
  } else if (currentPage > galleryData.nrOfPages - 3) {
    console.log("test2");
    if (galleryData.nrOfPages>5){
      j = galleryData.nrOfPages - 4;
    } else {j=2;}
    for (j; j <= galleryData.nrOfPages; j++) {
      visiblePages[i] = j;
      i++
    }
    return visiblePages;
  } else {
    console.log("test3");
    for (j; j <= k; j++) {
      if (j > 1 && j <= galleryData.nrOfPages) {
        visiblePages[i] = j;
        i++;
      }
    }
    return visiblePages;
  }
}


let showPages = (visiblePages) => {
  $('.pagination-interactive').find('.interactiveElement').each(function() {
    $(this).remove();
  });
  for (let i = 0; i <= visiblePages.length - 1; i++) {
    $(".pagination-interactive").append('<a class="pageNr interactiveElement" aria-label="page ' + visiblePages[i] + '" href="#" id="p' + visiblePages[i] + '">' + visiblePages[i] + '</a>');
  }
}

let addDots = (visiblePages,galleryData) => {
  $('.pagination-dots').find('.interactiveElement').each(function() {
    $(this).remove();
  });
  let id = $(".pagination-active").attr('id').substring(1, 2);
  if (id - 1 > 3 && galleryData.nrOfPages>5) {
    $(".pagination-dots").append('<p class="interactiveElement">...</p>');
  }
}

let switchPage = (galleryData) => {
  $(document).on('click', '.pageNr', function(e) {
    let id = e.currentTarget.attributes.id.textContent;
    let currentPage = id.substring(1, 2);
    refreshAll(currentPage, galleryData);
    return false;
  });
}

let nextPrevious = (currentPage, galleryData) => {
  $(document).on('click', '.pagination-previous', function() {
    if (currentPage > 1) {
      currentPage = currentPage - 1;
      refreshAll(currentPage, galleryData);
      return false;
    } else {
      if (currentPage == 1) {
        currentPage = galleryData.nrOfPages
        refreshAll(currentPage, galleryData);
      }
    }
  });
  $(document).on('click', '.pagination-next', function() {
    if (currentPage < galleryData.nrOfPages) {
      currentPage = currentPage + 1;
      refreshAll(currentPage, galleryData);
      return false;
    } else {
      if (currentPage == galleryData.nrOfPages) {
        currentPage = 1
        refreshAll(currentPage, galleryData);
      }
    }
  });
}

let refreshAll = (currentPage, galleryData, ) => {
  let visiblePages = generatePages(currentPage, galleryData);
  clearGallery();
  showPages(visiblePages);
  activePageToggle(currentPage);
  addDots(visiblePages,galleryData);
  showGalleryOfSelectedPage(currentPage, galleryData);
}
