// Get reference to elements
const title = document.querySelector("#title");
const author = document.querySelector("#author");
const id = document.querySelector("#id");
const addBtn = document.querySelector("#add-button");
const bookList = document.querySelector("#book-list");
const form = document.querySelector("#form");
const container = document.querySelector(".container");

// Listen to Add Button click event
addBtn.addEventListener("click", function (e) {
  e.preventDefault();

  //   validate the inputs
  if (title.value === "" || author.value === "" || id.value === "") {
    alert("Enter some input");
    return;
  }
  // create new book
  const book = new Book(title.value, author.value, id.value);
  //  Add book, Show alert and clear input
  ui.addBook(book);
  LS.storeBookToLS(book);
  ui.showAlert("Book Added", "green");
  ui.clearInput();
});

// Listen for removing books from bookList
bookList.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete")) {
    ui.removeBook(e.target);
    // pass the id of the book to remove from LS
    LS.removeBookFromLS(
      e.target.parentElement.previousElementSibling.textContent
    );
    ui.showAlert("Book removed", "red");
  }
});

// Book class
class Book {
  constructor(name, author, id) {
    this.name = name;
    this.author = author;
    this.id = id;
  }
}

// UI class
class UI {
  // Adds book to the list
  addBook(book) {
    // create li element and add book
    const tr = document.createElement("tr");
    tr.innerHTML = `
<td>${book.name}</td>
  <td>${book.author}</td>
  <td>${book.id}</td>
  <td><a href="#" class="delete">x</a></td>
  `;
    bookList.appendChild(tr);
  }
  // removes books from the list
  removeBook(ele) {
    ele.parentElement.parentElement.remove();
  }
  //   Show alert with message passed and color
  showAlert(msg, color) {
    // Check if alert is already there, if present remove it
    const alert = document.querySelector(".alert");
    if (alert) {
      //   If alert already there then remove
      alert.remove();
    }

    // create an alert and show before form
    const p = document.createElement("p");
    p.style.border = `1px solid ${color}`;
    p.style.color = color;
    p.classList.add("alert");
    p.textContent = msg;
    container.insertBefore(p, form);

    //   clear the alert after a second if it exists
    setTimeout(function () {
      const alert = document.querySelector(".alert");
      if (alert) {
        alert.remove();
      }
    }, 2000);
  }
  // To clear input fields
  clearInput() {
    title.value = "";
    author.value = "";
    id.value = "";
  }
}

const ui = new UI();

// Local Storage class
class LS {
  // get books from LS
  static getBooks() {
    let books;
    if (localStorage.getItem("books")) {
      // books present
      books = JSON.parse(localStorage.getItem("books"));
    } else {
      books = [];
    }
    return books;
  }
  //   Store book to LS
  static storeBookToLS(book) {
    // Get books from LS
    let books = LS.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  //   Remove book from LS
  static removeBookFromLS(id) {
    let books = LS.getBooks();
    let updatedBooks = books.filter((book) => book.id != id);
    localStorage.setItem("books", JSON.stringify(updatedBooks));
  }
}

// Get books from LS on DOMContentLoad
document.addEventListener("DOMContentLoaded", function () {
  let books = LS.getBooks();
  if (books) {
    books.forEach((book) => {
      ui.addBook(book);
    });
  }
});
