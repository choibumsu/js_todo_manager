import '../scss/main.scss';

/* */
const deleteBtns = document.querySelectorAll(".delete-btn");

deleteBtns.forEach(deleteBtn => {
    deleteBtn.addEventListener("click", event => {
        var target = event.target;
        while (target.classList.contains("card") == false)
            target = target.parentNode;
        target.remove();
    })
})


/* */
const addBtns = document.querySelectorAll(".add-btn");

addBtns.forEach(addBtn => {
    addBtn.addEventListener("click", event => {

        const modalContainer = document.querySelector(".modal-container");
        const body = document.querySelector("body");

        modalContainer.style.top = `${window.scrollY}px`;
        modalContainer.classList.remove("dp-none");
        body.classList.add("stop-scroll");

        const categories = document.querySelectorAll(".category");
        var selectBox = document.querySelector(".category-select");
        selectBox.innerText = "";
        categories.forEach(category => {
            var optionTag = document.createElement("option");
            optionTag.innerText = category.value;
            selectBox.appendChild(optionTag);
        })

        const optionValue = event.target.parentNode.querySelector(".category").value;
        selectBox.value = optionValue;
    })
})


/* */
const modalCancelBtn = document.querySelector(".cancel-btn");

modalCancelBtn.addEventListener("click", event => {
    const modalContainer = document.querySelector(".modal-container");
    const body = document.querySelector("body");

    modalContainer.classList.add("dp-none");
    body.classList.remove("stop-scroll");
});


/* */
const saveBtn = document.querySelector(".save-btn");

saveBtn.addEventListener("click", event => {
    var card = document.createElement("div");
    card.classList.add("card");

    var deleteBtn = document.createElement("img");
    deleteBtn.src = "x.93083e62.svg";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", event => {
        var target = event.target;
        while (target.classList.contains("card") == false)
            target = target.parentNode;
        target.remove();
    })

    var cardTitle = document.createElement("input");
    cardTitle.classList.add("title");
    cardTitle.type = "text";
    const titleInput = document.querySelector(".modal input");
    cardTitle.value = titleInput.value;
    titleInput.value = "";

    var divider = document.createElement("div");
    divider.classList.add("divider");

    var cardDescription = document.createElement("textarea");
    cardDescription.classList.add("description");
    const descTextarea = document.querySelector(".modal textarea");
    cardDescription.innerText = descTextarea.value;
    descTextarea.value = "";

    card.appendChild(deleteBtn);
    card.appendChild(cardTitle);
    card.appendChild(divider);
    card.appendChild(cardDescription);

    const categories = document.querySelectorAll(".category");
    const categorySelect = document.querySelector(".modal select");
    categories.forEach(category => {
        if (category.value == categorySelect.value) {
            var column = category;
            while (column.classList.contains("column") == false)
                column = column.parentNode;

            column.appendChild(card);
        }
    });

    const modalContainer = document.querySelector(".modal-container");
    const body = document.querySelector("body");

    modalContainer.classList.add("dp-none");
    body.classList.remove("stop-scroll");
});

/*  */
const updateCategoryHandler = event => {
    event.target.tag = "input";
}

const categoies = document.querySelectorAll(".category");
categoies.forEach(category => {
    category.addEventListener("click", updateCategoryHandler);
});