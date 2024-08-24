$("#main").load("about.html");
$("a").on("click", function(event) {
    event.preventDefault();
    let link = $(this).attr("href");
    $("#main").load(link);
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
    const cards = $("#card-list .col");  // Using jQuery selector
    
    let isProjectFound = false;

    cards.each(function() {
        
        const card = $(this);
        const title = card.find(".card-title").text().toUpperCase();
        
        if (title.indexOf(input) > -1) {
            $(".not-found").fadeOut(100);
            card.delay(100).fadeIn(100);    
            isProjectFound = true;
        } else {
            card.fadeOut(100);
        }
    });

    if (!isProjectFound) {
        $(".not-found").delay(100).fadeIn(100);
    }
}