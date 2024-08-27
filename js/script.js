var iso;
var category;
var isMenuItem = false;
var isPrevMenuItem = false;

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
        
        // Perform the load operation
        $("#main").load(link, function() {
            if (link == "projects.html") {

                iso = new Isotope( '.row', {
                    itemSelector: '.col',
                    layoutMode: 'fitRows',
                    fitRows: {
                        equalheight: true
                    }
                });

                imagesLoaded( document.querySelector('.row') ).on( 'progress', function() {
                    iso.layout();
                });

                // Extract the category from the clicked link
                category = $(event.currentTarget).attr("data-category");

                filterProject(category);
            }
        });
    });

    // Manage dropdown while sidebar is opened
    const dropdown = document.querySelectorAll(".icon-link-no-arrow");
    for (let i = 0; i < dropdown.length; i++) {
        dropdown[i].addEventListener("click", (e)=>{
            // Find the closest list item
            let arrowParent = e.target.closest("li");
            if (arrowParent) {
                // Rule 1: Open the menu if it is closed at first load
                if (!arrowParent.classList.contains("showMenu")) {
                    arrowParent.classList.add("showMenu");
                } else {
                    // Rule 2: Only toggle if not on a subcategory page
                    if (isPrevMenuItem) {
                        arrowParent.classList.toggle("showMenu");
                    }
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
    $('.nav-links .nav-link').on("click", function() {
        $('.nav-links .nav-link').removeClass('active');
        $(this).addClass('active');
    });
/*
    const myModalEl = document.getElementById('escargotModal')
    myModalEl.addEventListener('hidden.bs.modal', event => {
        console.log("hi");
        const iframe = document.getElementById('youtubeVideo');
        const src = iframe.src;
        iframe.src = ''; // Stop the video by removing the src
        iframe.src = src; // Restore the src to reload the video when needed
    })

    $('.modal').on('hide.bs.modal', function () {
        $('.modal iframe').attr('src', '');
    });*/
});

function searchProject() {
    const input = document.querySelector(".box").value.toUpperCase();

    // Apply the filter function to Isotope
    iso.arrange({ 
        filter: function( index, item ) {
            let title = item.querySelector(".card .card-body .card-title").innerText.toUpperCase();
            let isShown = item.classList.contains(category);
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

function filterProject(value) {
    iso.arrange({ filter: "." + value });

    if (value == "programming") {
        document.getElementsByClassName("title")[0].textContent="Programming Projects";
    } else if (value == "animation") {
        document.getElementsByClassName("title")[0].textContent="Animation Projects";
    } else {
        document.getElementsByClassName("title")[0].textContent="All Projects";
    }
}