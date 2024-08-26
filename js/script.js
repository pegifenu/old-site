//import autoAnimate from 'https://cdn.jsdelivr.net/npm/@formkit/auto-animate'

$("#main").load("about.html");
$("a").on("click", function(event) {
    event.preventDefault();

    // Get the link from the clicked anchor tag
    let link = $(this).attr("href");
    
    // Check if the clicked anchor tag is a submenu item
    let isSubMenuItem = $(this).hasClass('sub-menu-item');
    
    // Perform the load operation
    $("#main").load(link, function() {
        if (isSubMenuItem) {
            // Extract the category from the clicked link
            let category = $(event.currentTarget).attr("data-category");
            filterProject(category);
        }
    });
});

let arrow = document.querySelectorAll(".icon-link");
for (var i = 0; i < arrow.length; i++) {
    arrow[i].addEventListener("click", (e)=>{
        let arrowParent = e.target.closest("li");
        arrowParent.classList.toggle("showMenu");
    });
}

let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".bx-menu");
sidebarBtn.addEventListener("click", ()=>{
    sidebar.classList.toggle("close");
});

function searchProject() {
    const input = document.querySelector(".box").value.toUpperCase();
    const cardContainer = document.querySelector(".card-list");
    const cards = document.getElementsByClassName("col")[0];

    let isProjectFound = false;

    var iso = new Isotope( '.row', {
        itemSelector: '.col',
        layoutMode: 'fitRows'
    });

    // Apply the filter function to Isotope
    iso.arrange({
        filter: function( index, item ) {
            var title = item.querySelector(".card .card-body .card-title").innerText.toUpperCase();
            console.log(title);
            //const title = titleElement.innerText.toUpperCase();
            console.log(title.match(input));
            return title.match(input); // Use includes to handle partial matches
        }
    });
    
    /*
    for (let i = 0; i < cards.length; i++) {
        let title = cards[i].querySelector(".card-body h5.card-title");
        console.log(title);
        if (title.innerText.toUpperCase().indexOf(input) > -1) {            
            cards[i].classList.remove("hidden");
            isProjectFound = true;
            document.querySelector(".not-found").classList.remove("true");
        } else {
            cards[i].classList.add("hidden"); 
            
        }
    }*/
   /*
    if (!isProjectFound) {
        document.querySelector(".not-found").classList.add("true");
    }*/
}

function filterProject(value) {

    var iso = new Isotope( '.row', {
        itemSelector: '.col',
        layoutMode: 'fitRows'
    });
  
    iso.arrange({ filter: "." + value });

    if (value == "programming") {
        document.getElementsByClassName("title")[0].textContent="Programming Projects";
    } else if (value == "animation") {
        document.getElementsByClassName("title")[0].textContent="Animation Projects";
    } else {
        document.getElementsByClassName("title")[0].textContent="All Projects";
    }
}