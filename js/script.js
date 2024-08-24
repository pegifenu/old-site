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

    cards.each(function() {
        const card = $(this);
        const title = card.find(".card-title").text().toUpperCase();

        if (title.indexOf(input) > -1) {
            // If card matches, show it (if hidden)
            //card.show(200);
            card.fadeIn(200);
        } else {
            // If card doesn't match, hide it with fadeOut
            //card.hide(200);
            card.fadeOut(200);
        }
    });
}