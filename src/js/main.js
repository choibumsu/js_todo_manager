import '../scss/main.scss';

const X_IMAGE = "x.93083e62.svg";

const setLocalStorage = () => {
    var todoLists = {};
    const columns = document.querySelectorAll(".column");

    columns.forEach(column => {
        const cateogoryTitle = column.querySelector(".category").value;
        const cards = column.querySelectorAll(".card");

        var todoList = [];
        cards.forEach(card => {
            const title = card.querySelector(".title").value;
            const description = card.querySelector(".description").value;

            todoList.push({ title, description });
        })
        todoLists[cateogoryTitle] = todoList;
    });
    localStorage.TODO_LISTS = JSON.stringify(todoLists);
}

const addCategoryHandler = () => {
    const categoryTitle = document.querySelector(".category-title");
    const categories = document.querySelectorAll(".category");

    if (categoryTitle.value == "") {
        alert("카테고리 이름을 작성해주세요.");
        return;
    }

    for (var i = 0; i < categories.length; i++) {
        if (categories[i].value == categoryTitle.value) {
            alert("이미 존재하는 카테고리입니다.");
            return;
        }
    }

    const column = createColumn(categoryTitle.value);
    const todoContainer = document.querySelector(".todo-container");
    todoContainer.appendChild(column);

    categoryTitle.value = "";

    setLocalStorage();
}

const closeModal = () => {
    const modalContainer = document.querySelector(".modal-container");
    const body = document.querySelector("body");

    modalContainer.classList.add("dp-none");
    body.classList.remove("stop-scroll");
}

const saveCardHandler = () => {
    const titleInput = document.querySelector(".modal input");
    const descTextarea = document.querySelector(".modal textarea");

    const card = createCard(titleInput.value, descTextarea.value);
    titleInput.value = "";
    descTextarea.value = "";

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

    setLocalStorage();
    closeModal();
}

const customCreateElem = (tagName, className = "", value = "", innerText = "", event = "", eventHandler = "") => {
    var element = document.createElement(tagName);
    if (className) element.classList.add(className);
    if (value) element.value = value;
    if (innerText) element.innerText = innerText;
    if (event && eventHandler) element.addEventListener(event, eventHandler);

    return element;
}

const deleteCardHandler = (event) => {
    var target = event.target;
    while (target.classList.contains("card") == false)
        target = target.parentNode;
    target.remove();

    setLocalStorage();
}

const autoTextarea = (event) => {
    setLocalStorage();
    event.target.style.height = (event.target.scrollHeight) + "px";
}

const createCard = (titleValue, descriptionValue) => {
    const card = customCreateElem("div", "card");
    var deleteBtn = customCreateElem("img", "delete-btn", "", "", "click", deleteCardHandler);
    deleteBtn.src = X_IMAGE;

    const cardTitle = customCreateElem("input", "title", titleValue, "", "change", setLocalStorage);
    const divider = customCreateElem("div", "divider");
    const cardDescription = customCreateElem("textarea", "description", "", descriptionValue, "change", autoTextarea);

    card.appendChild(deleteBtn);
    card.appendChild(cardTitle);
    card.appendChild(divider);
    card.appendChild(cardDescription);

    return card;
}

const setCategoryTitle = (event) => {
    if (event.target.value == "") {
        var column = event.target;
        while (column.classList.contains("column") == false)
            column = column.parentNode;
        column.remove();
    }
    setLocalStorage();
}

const addClickHandler = event => {
    const modalContainer = document.querySelector(".modal-container");
    const body = document.querySelector("body");

    modalContainer.style.top = `${window.scrollY}px`;
    modalContainer.classList.remove("dp-none");
    body.classList.add("stop-scroll");

    var selectBox = document.querySelector(".category-select");
    selectBox.innerText = "";

    const categories = document.querySelectorAll(".category");
    categories.forEach(category => {
        var optionTag = customCreateElem("option", "", "", category.value);
        selectBox.appendChild(optionTag);
    })

    const optionValue = event.target.parentNode.querySelector(".category").value;
    selectBox.value = optionValue;
};

const createColumn = (categoryTitle) => {
    const column = customCreateElem("div", "column");
    const todoCategory = customCreateElem("div", "todo-category");
    const categoryInput = customCreateElem("input", "category", categoryTitle, "", "change", setCategoryTitle);
    const addBtn = customCreateElem("img", "add-btn", categoryTitle, "", "click", addClickHandler);
    addBtn.src = X_IMAGE;

    todoCategory.appendChild(categoryInput);
    todoCategory.appendChild(addBtn);
    column.appendChild(todoCategory);

    return column;
}

window.addEventListener('DOMContentLoaded', () => {
    var todoLists = localStorage.TODO_LISTS;
    todoLists = JSON.parse(todoLists);

    for (var category in todoLists) {
        const todoList = todoLists[category];
        console.log(category);

        const column = createColumn(category);
        todoList.forEach(todo => {
            const card = createCard(todo['title'], todo['description']);
            column.appendChild(card);
        });

        const todoContainer = document.querySelector(".todo-container");
        todoContainer.appendChild(column);

        const saveBtn = document.querySelector(".save-btn");
        saveBtn.addEventListener("click", saveCardHandler);

        const modalCancelBtn = document.querySelector(".cancel-btn");
        modalCancelBtn.addEventListener("click", closeModal);

        const categoryAddBtn = document.querySelector(".category-add-btn");
        categoryAddBtn.addEventListener("click", addCategoryHandler);
    }
})

window.onload = () => {
    const descriptions = document.querySelectorAll(".description");
    descriptions.forEach(description => {
        description.style.height = (description.scrollHeight) + "px";
    })
}