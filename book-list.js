async function loadBooks() {
    let response = await fetch("http://localhost:3000/books");

    console.log(response.status); // 200
    console.log(response.statusText); // OK

    if (response.status === 200) {
        let data = await response.json();
        console.log(data);

        document.getElementById("books").innerHTML = '';

        for (let book of data) {
            const x = `
                <div class="col-4">
                    <div class="card" style="min-width:50px">
                        <div class="card-body">
                            <h5 class="card-title">${book.title}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${book.isbn}</h6>
                            <div>Author: ${book.author}</div>
                            <div>Publisher: ${book.publisher}</div>
                            <div>Number Of Pages: ${book.numOfPages}</div>
                            <hr>
                            <button type="button" class="btn btn-danger" onClick="setDeleteModal('${book.isbn}')">
                                Delete
                            </button>
                            <button type="button" class="btn btn-primary" data-toggle="modal" 
                                data-target="#editBookModal" onClick="setEditModal('${book.isbn}')">
                                Edit 
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById("books").innerHTML += x;
        }
    }
}

async function setEditModal(isbn) {
    let response = await fetch(`http://localhost:3000/book/${isbn}`, {
        method: 'GET'
    });

    console.log(response.status); // 200
    console.log(response.statusText); // OK

    if (response.status === 200) {
        let book = await response.json();
        console.log(book);

        document.getElementById('isbn').value = book.isbn;
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('publish_date').value = book.publish_date;
        document.getElementById('publisher').value = book.publisher;
        document.getElementById('numOfPages').value = book.numOfPages;

        document.getElementById('editForm').onsubmit = async function (event) {
            event.preventDefault();
            await submitEditForm(book.isbn);
        };
    }
}

async function setDeleteModal(isbn) {
    let response = await fetch(`http://localhost:3000/book/${isbn}`, {
        method: 'DELETE'
    });
    console.log(response.status); // 200
    console.log(response.statusText); // OK

    if (response.status === 200) {
        console.log("Book with ISBN: " + isbn + " has been deleted");
        await loadBooks();
    }
}

async function submitNewBookForm(event) {
    event.preventDefault();
    let form = event.target;
    let formData = new FormData(form);
    let data = Object.fromEntries(formData.entries());

    let response = await fetch("http://localhost:3000/book", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.status === 200) {
        form.reset();
        await loadBooks();
    }
}

async function submitEditForm(isbn) {
    let form = document.getElementById('editForm');
    let formData = new FormData(form);
    let data = Object.fromEntries(formData.entries());

    let response = await fetch(`http://localhost:3000/book/${isbn}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.status === 200) {
        $('#editBookModal').modal('hide');
        await loadBooks();
    }
}

document.getElementById('newBookForm').onsubmit = submitNewBookForm;

loadBooks();
