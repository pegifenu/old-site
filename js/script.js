$("#main").load("about.html");
$("a").on("click", function(event) {
    event.preventDefault();
    let link = $(this).attr("href");
    $("#main").load(link);

    if ($(this).parents().hasClass('sub-menu')) {
        let category = $(this).attr("data-category");
        filterProject(category)
    }
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
    //const cardContainer = document.querySelector(".card-list");
    const cards = document.getElementsByClassName("col");

    let isProjectFound = false;
    for (let i = 0; i < cards.length; i++) {
        let title = cards[i].querySelector(".card-body h5.card-title");
        console.log(title);
        if (title.innerText.toUpperCase().indexOf(input) > -1) {
            cards[i].style.display = "";
            isProjectFound = true;
            document.querySelector(".not-found").classList.remove("true");
        } else {
            cards[i].style.display = "none";
        }
    }
    if (!isProjectFound) {
        document.querySelector(".not-found").classList.add("true");
    }

}

function filterProject(value) {
    const cards = document.getElementsByClassName("col");
    for (let i = 0; i < cards.length; i++) {
        // Get the tags for this card
        const categories = cards[i].querySelector(".card").getAttribute("data-categories").split(' ');
        
        // Show or hide the card based on whether its tags include the selected tag
        if (categories.includes(value)) {         
            cards[i].style.display = "block"; // Show card
        } else {
            cards[i].style.display = "none"; // Hide card
        }
    }
}