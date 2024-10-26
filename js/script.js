let iso;
let category;
let isMenuItem = false;
let isPrevMenuItem = false;

let isProjectsMenu = false;
let isPrevProjectsMenu = false;

let isPortfolioMenu = false;

let currMenu = null;
let prevMenu = null;

document.addEventListener("DOMContentLoaded", function() {
    // Your code here
    $("#main").load("about.html");
    $(".sidebar ul a").on("click", function(event) {
        event.preventDefault();

        // Get the link from the clicked anchor tag
        let link = $(this).attr("href"); 
        
        if (isMenuItem) {
            isPrevMenuItem = true;
        } else {
            isPrevMenuItem = false;
        }
        isMenuItem = $(this).hasClass('icon-link-no-arrow');

        prevMenu = currMenu;
        currMenu = $(this).closest(".nav-link");

        if (isProjectsMenu) {
            isPrevProjectsMenu = true;
        } else {
            isPrevProjectsMenu = false;
        }
        isProjectsMenu = (link == "projects.html");
        isPortfolioMenu = (link == "portfolio.html");

        let isDropdownMenu = isProjectsMenu || isPortfolioMenu;

        // Extract the category from the clicked link
        category = $(event.currentTarget).attr("data-category");

        if (prevMenu && (prevMenu.is(currMenu)) && isDropdownMenu) {
            filterProject(category);
        } else {
            $("#main").load(link, function() {
                if (isDropdownMenu) {
                    iso = new Isotope( '.row', {
                        filter: '.' + category,
                        itemSelector: '.col',
                        masonry: {
                            horizontalOrder: true
                        }
                    });
    
                    imagesLoaded( document.querySelector('.row') ).on( 'progress', function() {
                        iso.layout();
                    });
    
                    filterProject(category);
                }
            });

        }

    });

    // Manage dropdown while sidebar is opened
    const dropdown = document.querySelectorAll(".icon-link-no-arrow");
    let activeDropdown = null;
    for (let i = 0; i < dropdown.length; i++) {
        dropdown[i].addEventListener("click", (e)=>{
            // Find the closest list item
            let arrowParent = e.target.closest("li");

            if (arrowParent) {
                // Toggle the submenu if the current category is selected
                if (activeDropdown && activeDropdown == arrowParent && isPrevMenuItem) {
                    activeDropdown.classList.toggle("showMenu");
                
                    if (!arrowParent.classList.contains("showMenu")) {
                        activeDropdown = null;
                    }
                } else {
                    arrowParent.classList.add("showMenu");
                    activeDropdown = arrowParent;
                }
            }
        });
    }

    const arrow = document.querySelectorAll(".arrow");
    for (let i = 0; i < arrow.length; i++) {
        arrow[i].addEventListener("click", (e)=>{
            console.log("hi");
            let arrowParent = e.target.closest("li");
            arrowParent.classList.toggle("showMenu");
        });
    }

    const sidebar = document.querySelector(".sidebar");
    const sidebarBtn = document.querySelector(".bx-menu");
    sidebarBtn.addEventListener("click", ()=>{
        sidebar.classList.toggle("close");
        setTimeout(() => {
            if (iso) {
                iso.layout();
            }
        }, 200); // Delay in milliseconds
    });

    $('.nav-link').filter(function() {
        return $(this).children().attr('href') == 'about.html';
    }).addClass('active');
    $('.nav-links a').on("click", function() {
        $('.sub-menu-item').removeClass('active');
        $('.nav-links .nav-link').removeClass('active');
        $(this).closest('.nav-link').addClass('active');
    });

    $('.sub-menu-item').on("click", function() {
        $('.sub-menu-item').removeClass('active');
        $(this).addClass('active');
    });

    stopModalVideo();
});

function searchProject() {
    const input = document.querySelector(".box").value.toUpperCase();
    console.log(category);
    // Apply the filter function to Isotope
    iso.arrange({ 
        filter: function( index, item ) {
            let title = item.querySelector(".card .card-body .card-title").innerText.toUpperCase();
            let isShown = item.classList.contains(category) || category == "col";
            return title.includes(input) && isShown; // Use includes to handle partial matches
        }
    });

    noResultsCheck();
}

function noResultsCheck() {
    const noResults = document.querySelector(".not-found");

    if (iso.getFilteredItemElements().length == 0) {
        noResults.classList.add("true");
    } else {
        noResults.classList.remove("true");
    }

}

function filterProject(category) {
    if (category != "col") {
        iso.arrange({ filter: "." + category });
    } else {
        iso.arrange({ filter: "*" });
    }

    if (isProjectsMenu) {
        if (category == "programming") {
            document.getElementsByClassName("title")[0].textContent="Programming Projects";
        } else if (category == "animation") {
            document.getElementsByClassName("title")[0].textContent="Animation Projects";
        } else {
            document.getElementsByClassName("title")[0].textContent="All Projects";
        }
    }

    if (isPortfolioMenu) {
        if (category == "test-category") {
            document.getElementsByClassName("title")[0].textContent="Category Portfolio";
        } else {
            document.getElementsByClassName("title")[0].textContent="Portfolio";
        }
    }
}

function playVideo() {
    // Check if the device supports hover
    //const isHoverDevice = window.matchMedia("(hover: hover)").matches;
    document.querySelectorAll('.portfolio-content .card').forEach(card => {
        const video = card.querySelector("video");
        if (video /*&& isHoverDevice*/) {
            card.addEventListener('mouseenter', () => {
                video.play();
            });
            
            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        }
    });
}

function stopModalVideo() {
    document.body.addEventListener('hidden.bs.modal', function (event) {
      if (event.target.classList.contains('modal')) {
        const modal = event.target;
        
        // Handle YouTube iframes
        const iframes = modal.querySelectorAll('iframe[src*="youtube.com"]');
        iframes.forEach(iframe => {
            const src = iframe.src;
            iframe.src = '';
            iframe.src = src;
        });
  
        // Handle HTML5 videos
        const videos = modal.querySelectorAll('video');
        videos.forEach(video => {
            video.currentTime = 0;
        });
      }
    }, true);
}

function plusSlides(direction) {

    let portfolioFilteredItems = iso.getFilteredItemElements();

    let index = 0;
    let currItemModal;
    let currModalInstance;
    
    for (let i = 0; i < portfolioFilteredItems.length; i++) {
        let currItem = portfolioFilteredItems[i].querySelector(".card");
        currItemModal = document.querySelector(currItem.getAttribute('data-bs-target'));
        currModalInstance = bootstrap.Modal.getOrCreateInstance(currItemModal);
        if (currItemModal.classList.contains("show")) {
            index = i;
            break;
        }
    }

    if (index == 0 && direction == -1) {
        direction = portfolioFilteredItems.length - 1;
    } else if (index == portfolioFilteredItems.length - 1 && direction == 1) {
        direction = -index;
    }

    let nextItem = portfolioFilteredItems[index + direction].querySelector(".card");
    let nextItemModal = document.querySelector(nextItem.getAttribute('data-bs-target'));
    let nextModalInstance = bootstrap.Modal.getOrCreateInstance(nextItemModal);
    
    currModalInstance.hide();
    nextModalInstance.show();

    index += direction;
}