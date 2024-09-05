var iso;
var category;
var isMenuItem = false;
var isPrevMenuItem = false;

var isProjectsMenu = false;
var isPrevProjectsMenu = false;

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

        // Extract the category from the clicked link
        category = $(event.currentTarget).attr("data-category");

        if (isPrevProjectsMenu && isProjectsMenu) {
            filterProject(category);

        } else {
            $("#main").load(link, function() {
                if (isProjectsMenu) {
                    iso = new Isotope( '.row', {
                        filter: '.' + category,
                        itemSelector: '.col',
                        layoutMode: 'fitRows',
                        fitRows: {
                            equalheight: true
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
        $('.nav-links .nav-link').removeClass('active');
        $(this).closest('.nav-link').addClass('active');
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
    console.log(iso);

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

    if (category == "programming") {
        document.getElementsByClassName("title")[0].textContent="Programming Projects";
    } else if (category == "animation") {
        document.getElementsByClassName("title")[0].textContent="Animation Projects";
    } else {
        document.getElementsByClassName("title")[0].textContent="All Projects";
    }
}