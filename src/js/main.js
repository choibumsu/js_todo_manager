import '../scss/main.scss';

const X_IMAGE = "/x.93083e62.svg";

window.onload = () => {
    const categoryAddBtn = document.querySelector(".category-add-btn");
    categoryAddBtn.addEventListener("click", addCategoryHandler);

    const modalCloseBtn = document.querySelector(".modal .cancel-btn");
    modalCloseBtn.addEventListener("click", closeModalHandler);

    const cardAddBtn = document.querySelector(".modal .save-btn");
    cardAddBtn.addEventListener("click", cardAddHandler);

    loadLocalStorage();

    const descriptions = document.querySelectorAll(".card .description");
    descriptions.forEach(description => {
        description.style.height = (description.scrollHeight) + "px";
    })
}

/* Delete Card */
const findTargetClass = (node, targetClass) => {
    while (node.classList.contains(targetClass) == false)
        node = node.parentNode;
    return node;
}

const deleteCardHandler = (event) => {
    var target = findTargetClass(event.target, "card");
    target.remove();
    setLocalStorage();
}
/* end: Delete Card */

/* Category Create */
const addCategoryHandler = () => {
    const categoryTitle = document.querySelector(".category-title");
    if (categoryTitle.value == "") {
        alert("카테고리 이름을 작성해주세요.");
        return;
    }

    const categories = document.querySelectorAll(".category");
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

const createColumn = (categoryTitle) => {
    const column = document.createElement("div");
    column.classList.add("column");

    const todoCategory = document.createElement("div");
    todoCategory.classList.add("todo-category");

    const categoryInput = document.createElement("input");
    categoryInput.classList.add("category");
    categoryInput.value = categoryTitle;
    categoryInput.addEventListener("change", changeCategoryHandler);

    const addBtn = document.createElement("img");
    addBtn.classList.add("add-btn");
    addBtn.src = X_IMAGE;
    addBtn.addEventListener("click", showModalHandler);

    todoCategory.appendChild(categoryInput);
    todoCategory.appendChild(addBtn);
    column.appendChild(todoCategory);

    return column;
}
/* end: Category Create */

/* Modal Show */
const showModalHandler = (event) => {
    const modalContainer = document.querySelector(".modal-container");
    const body = document.querySelector("body");

    modalContainer.style.top = `${window.scrollY}px`;
    modalContainer.classList.remove("dp-none");
    body.classList.add("stop-scroll");

    updateSelectBox(event);
}
/* end: Modal Show */

/* Modal Close */
const closeModalHandler = () => {
    const modalContainer = document.querySelector(".modal-container");
    const body = document.querySelector("body");

    modalContainer.classList.add("dp-none");
    body.classList.remove("stop-scroll");
}
/* end: Modal Close */

/* Options Create */
const updateSelectBox = event => {
    const selectBox = document.querySelector(".modal select");
    selectBox.innerText = "";

    const categoryInputs = document.querySelectorAll(".category");
    categoryInputs.forEach(categoryInput => {
        const categoryOption = document.createElement("option");
        categoryOption.innerText = categoryInput.value;
        selectBox.appendChild(categoryOption);
    })

    const currentCategory = findCategory(event);
    selectBox.value = currentCategory;
}

const findCategory = event => {
    const currentInput = event.target.parentNode.querySelector(".category");
    return currentInput.value;
}
/* end: Options Create */

/* Card Create */
const cardAddHandler = () => {
    const categorySelect = document.querySelector(".modal select");
    const cardTitleInput = document.querySelector(".modal input");
    const cardDescTextarea = document.querySelector(".modal textarea");

    const card = createCard(cardTitleInput.value, cardDescTextarea.value);

    addToCategory(categorySelect.value, card);
    closeModalHandler();

    categorySelect.value = "";
    cardTitleInput.value = "";
    cardDescTextarea.value = "";
    setLocalStorage();
}

const createCard = (titleValue, descriptionValue) => {
    const card = document.createElement("div");
    card.classList.add("card");

    var deleteBtn = document.createElement("img");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.src = X_IMAGE;
    deleteBtn.addEventListener("click", deleteCardHandler);

    const cardTitle = document.createElement("input");
    cardTitle.classList.add("title")
    cardTitle.value = titleValue;
    cardTitle.addEventListener("change", setLocalStorage);

    const divider = document.createElement("div");
    divider.classList.add("divider");

    const cardDescription = document.createElement("textarea");
    cardDescription.classList.add("description");
    cardDescription.value = descriptionValue;
    cardDescription.addEventListener("change", setLocalStorage);
    cardDescription.addEventListener("input", autoTextarea);

    card.appendChild(deleteBtn);
    card.appendChild(cardTitle);
    card.appendChild(divider);
    card.appendChild(cardDescription);

    return card;
}

const addToCategory = (targetCategory, card) => {
    const columns = document.querySelectorAll(".column");

    for (var i = 0; i < columns.length; i++) {
        const category = columns[i].querySelector(".category").value;
        if (targetCategory == category) {
            columns[i].appendChild(card);
            break;
        }
    }
}

const autoTextarea = (event) => {
    event.target.style.height = (event.target.scrollHeight) + "px";
}

/* end: Card Create */

/* Category Delete */
const changeCategoryHandler = event => {
    if (event.target.value == "") {
        const deleteConfirm = confirm("정말 카테고리를 삭제하시겠습니까?")
        if (deleteConfirm) {
            var column = findTargetClass(event.target, "column");
            column.remove();
        } else {
            event.target.focus();
        }
    }
    setLocalStorage();
}
/* end: Category Delete */

/* LocalStorage Load */
const loadLocalStorage = () => {
    var todoLists = localStorage.TODO_LISTS;
    if (todoLists) todoLists = JSON.parse(todoLists);

    for (var category in todoLists) {
        const todoList = todoLists[category];

        const column = createColumn(category);
        todoList.forEach(todo => {
            const card = createCard(todo['title'], todo['description']);
            column.appendChild(card);
        });

        const todoContainer = document.querySelector(".todo-container");
        todoContainer.appendChild(column);
    }
}
/* end: LocalStorage Load */

/* LocalStorage Update */
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
/* end: LocalStorage Update */