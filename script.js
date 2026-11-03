
const myLibrary = [];

// Book constructor

function Book(title, author, pages, read) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

// Prototype function to toggle read status

Book.prototype.toggleRead = function () {
    this.read = !this.read;
};

// Add a new book to the library

function addBookToLibrary(title, author, pages, read) {
    const newBook = new Book(title, author, pages, read);

    myLibrary.push(newBook);

    displayBooks();
}

// Display all books

function displayBooks() {

    const bookContainer = document.getElementById("book-container");

    bookContainer.innerHTML = "";

    if (myLibrary.length === 0) {
        bookContainer.innerHTML = `
            <div class="empty-message">
                <h3>Your library is empty 📖</h3>
                <p>Click "Add New Book" to start your collection.</p>
            </div>
        `;
    }

    myLibrary.forEach((book) => {

        const bookCard = document.createElement("div");

        bookCard.classList.add("book-card");

        // Associate card with book ID

        bookCard.dataset.id = book.id;

        bookCard.innerHTML = `
            <div class="book-icon">📖</div>

            <h3>${escapeHTML(book.title)}</h3>

            <p class="book-author">
                By ${escapeHTML(book.author)}
            </p>

            <p class="book-pages">
                ${book.pages} pages
            </p>

            <span class="book-status ${book.read ? "read-status" : "unread-status"}">
                ${book.read ? "Read ✓" : "Not Read Yet"}
            </span>

            <div class="book-actions">

                <button class="toggle-btn">
                    ${book.read ? "Mark Unread" : "Mark Read"}
                </button>

                <button class="remove-btn">
                    Remove
                </button>

            </div>
        `;

        bookContainer.appendChild(bookCard);
    });

    updateStatistics();
}

// Escape user input before inserting it into HTML

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

// Update statistics

function updateStatistics() {

    const totalBooks = myLibrary.length;

    const readBooks = myLibrary.filter(book => book.read).length;

    const unreadBooks = totalBooks - readBooks;

    document.getElementById("total-books").textContent = totalBooks;

    document.getElementById("read-books").textContent = readBooks;

    document.getElementById("unread-books").textContent = unreadBooks;
}

// Dialog elements

const dialog = document.getElementById("book-dialog");

const newBookBtn = document.getElementById("new-book-btn");

const closeDialogBtn = document.getElementById("close-dialog");

const bookForm = document.getElementById("book-form");

// Open form

newBookBtn.addEventListener("click", () => {
    dialog.showModal();
});

// Close form

closeDialogBtn.addEventListener("click", () => {
    dialog.close();
});

// Add book when form is submitted

bookForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const title = document.getElementById("title").value.trim();

    const author = document.getElementById("author").value.trim();

    const pages = Number(document.getElementById("pages").value);

    const read = document.getElementById("read").checked;

    if (!title || !author || !Number.isInteger(pages) || pages < 1) {
        return;
    }

    addBookToLibrary(title, author, pages, read);

    bookForm.reset();

    dialog.close();
});

// Remove and toggle buttons

document.getElementById("book-container").addEventListener("click", (event) => {

    const bookCard = event.target.closest(".book-card");

    if (!bookCard) return;

    const bookId = bookCard.dataset.id;

    const book = myLibrary.find(book => book.id === bookId);

    if (!book) return;

    // Remove book

    if (event.target.classList.contains("remove-btn")) {

        const bookIndex = myLibrary.findIndex(book => book.id === bookId);

        myLibrary.splice(bookIndex, 1);

        displayBooks();
    }

    // Toggle read status

    if (event.target.classList.contains("toggle-btn")) {

        book.toggleRead();

        displayBooks();
    }
});

// Add some example books

addBookToLibrary("Atomic Habits", "James Clear", 320, true);

addBookToLibrary("The Psychology of Money", "Morgan Housel", 256, false);

addBookToLibrary("Ikigai", "Hector Garcia", 208, true);
