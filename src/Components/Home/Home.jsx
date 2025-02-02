import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "./BookCard";
import "./Home.css";

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    author: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Retrieve logged-in user info from localStorage
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(storedUser);

    // Fetch books
    axios
      .get("http://localhost:8081/book/all")
      .then((response) => {
        console.log("Books from API:", response.data);
        setBooks(response.data);

        // Extract categories and authors from books
        const uniqueCategories = [];
        const uniqueAuthors = [];

        response.data.forEach((book) => {
          if (!uniqueCategories.some((cat) => cat.id === book.category.id)) {
            uniqueCategories.push(book.category);
          }

          if (!uniqueAuthors.some((auth) => auth.id === book.author.id)) {
            uniqueAuthors.push(book.author);
          }
        });

        setCategories(uniqueCategories);
        setAuthors(uniqueAuthors);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      });
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredBooks = books.filter((book) => {
    const matchesCategory = filters.category
      ? book.category.id === Number(filters.category)
      : true;
    const matchesAuthor = filters.author
      ? book.author.id === Number(filters.author)
      : true;
    const matchesSearch = book.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesAuthor && matchesSearch;
  });

  const handleBorrowBook = (book) => {
    if (!currentUser) {
      alert("You need to log in first!");
      return;
    }

    const borrowPayload = {
      user: { id: currentUser.id },
      book: { id: book.id },
      loanDate: new Date().toISOString().split("T")[0], // Today's date
      returnDate: new Date(new Date().setDate(new Date().getDate() + 14)) // Return date in 2 weeks
        .toISOString()
        .split("T")[0],
      status: "ACTIVE",
    };

    // Call backend to create a loan and update book state
    axios
      .post("http://localhost:8081/loan/add", borrowPayload)
      .then((response) => {
        alert(`You have successfully borrowed "${book.title}"!`);

        // Update the book state locally
        setBooks((prevBooks) =>
          prevBooks.map((b) =>
            b.id === book.id ? { ...b, state: "BORROWED" } : b
          )
        );
      })
      .catch((error) => {
        console.error("Error borrowing book:", error);
        alert("Failed to borrow the book. Please try again.");
      });
  };

  return (
    <div className="home-page">
      <nav className="home-navbar">
        <div className="logo">Library</div>
        <div className="home-nav-buttons">
          <button
            className="home-nav-button"
            onClick={() => (window.location.href = "/home")}
          >
            Home
          </button>
          {currentUser ? (
            <button
              className="home-nav-button user-email-button"
              onClick={() => (window.location.href = "/profile")}
            >
              {currentUser.email}
            </button>
          ) : (
            <button
              className="home-nav-button"
              onClick={() => (window.location.href = "/login")}
            >
              Login
            </button>
          )}
        </div>
      </nav>
      <div className="filters-section">
        <input
          type="text"
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        <div className="filters">
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            name="author"
            value={filters.author}
            onChange={handleFilterChange}
          >
            <option value="">All Authors</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.firstName} {author.lastName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="books-grid">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onBorrowClick={() => handleBorrowBook(book)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
