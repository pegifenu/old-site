var iso;
var category;
var isMenuItem = false;
var isPrevMenuItem = false;

var isProjectsMenu = false;
var isPrevProjectsMenu = false;

var isPortfolioMenu = false;

document.addEventListener("DOMContentLoaded", function() {
    // Your code here
    $("#main").load("about.html");
    $("a").on("click", function(event) {
        event.preventDefault();

        // Get the link from the clicked anchor tag
        let link = $(this).attr("href"); 
        
        if (isMenuItem) {
            isPrevMenuItem = true;
        } else {
            isPrevMenuItem = false;
        }
        isMenuItem = $(this).hasClass('icon-link-no-arrow');

        if (isProjectsMenu) {
            isPrevProjectsMenu = true;
        } else {
            isPrevProjectsMenu = false;
        }
        isProjectsMenu = (link == "projects.html");
        isPortfolioMenu = (link == "portfolio.html");

        // Extract the category from the clicked link
        category = $(event.currentTarget).attr("data-category");

        if (isPrevProjectsMenu && isProjectsMenu) {
            filterProject(category);

        } else {
            $("#main").load(link, function() {
                if (isProjectsMenu || isPortfolioMenu) {

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

    // Stop any YouTube videos playing in modal if modal is closed.
    let checkForModal = setInterval(function() {
        const myModal = document.getElementById('escargotModal');
        
        if (myModal) {
            clearInterval(checkForModal);
            // Listen for the modal hide event
            myModal.addEventListener('hidden.bs.modal', function (event) {
                // Find the iframe inside the modal
                const iframe = myModal.querySelector('iframe');
                if (iframe) {
                    // Store the current src of the iframe
                    const src = iframe.src;
                    // Clear the src to stop the video
                    iframe.src = '';
                    // Reset the src to restart the video if the modal is opened again
                    iframe.src = src;
                }
            });
        }
    });

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
    console.log(category);
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

}

function plusSlides(direction) {
    let portfolioFilteredItems = iso.getFilteredItemElements();

    let index = 0;
    let currModalInstance;
    for (let i = 0; i < portfolioFilteredItems.length; i++) {
        let currItem = portfolioFilteredItems[i].querySelector(".card");
        let currItemModal = document.querySelector(currItem.getAttribute('data-bs-target'));
        currModalInstance = bootstrap.Modal.getOrCreateInstance(currItemModal);
        if (currItemModal.classList.contains("show")) {
            index = i;
            break;
        }
    }

    if (direction == 1) {
        if (index < portfolioFilteredItems.length - 1) {
            currModalInstance.hide();

            let nextItem = portfolioFilteredItems[index + 1].querySelector(".card");
            let nextItemModal = document.querySelector(nextItem.getAttribute('data-bs-target'));
            let nextModalInstance = bootstrap.Modal.getOrCreateInstance(nextItemModal);
            nextModalInstance.show();

            index += 1;
        }
    } else if (direction == -1) {
        if (index > 0) {
            currModalInstance.hide();

            let prevItem = portfolioFilteredItems[index - 1].querySelector(".card");
            let prevItemModal = document.querySelector(prevItem.getAttribute('data-bs-target'));
            let prevModalInstance = bootstrap.Modal.getOrCreateInstance(prevItemModal);
            prevModalInstance.show();

            index -= 1;
        }
    }
}