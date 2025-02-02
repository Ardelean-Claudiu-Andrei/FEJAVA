import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

const MyProfile = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Retrieve the logged-in user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!storedUser) {
      setError("No user is logged in.");
      return;
    }

    setUserInfo(storedUser);

    // Fetch borrowed books for the logged-in user
    fetchBorrowedBooks(storedUser.id);
  }, []);

  const fetchBorrowedBooks = (userId) => {
    axios
      .get(`http://localhost:8081/loan/getByUser/${userId}`)
      .then((response) => {
        // Map loans to include the loanId with each book, and filter out returned loans
        const borrowedBooksWithLoans = response.data
          .filter((loan) => loan.status === "ACTIVE") // Only include active loans
          .map((loan) => ({
            ...loan.book,
            loanId: loan.id, // Attach the loanId to the book
          }));
        setBorrowedBooks(borrowedBooksWithLoans);
      })
      .catch((error) => {
        console.error("Error fetching borrowed books:", error);
        setError("Failed to load borrowed books.");
      });
  };

  const handleUnborrow = (book) => {
    if (!userInfo) {
      alert("No user is logged in.");
      return;
    }

    // Simulate the unborrow process for both book and loan
    const loanId = book.loanId; // Get the loanId associated with the book
    const unborrowPayload = {
      id: loanId,
      book: { id: book.id },
      user: { id: userInfo.id },
      status: "RETURNED",
    };

    // Send a simulated update for both the book and loan
    axios
      .post("http://localhost:8081/loan/update", unborrowPayload)
      .then(() => {
        alert(`You have successfully unborrowed "${book.title}"!`);

        // Update the borrowedBooks state to remove the unborrowed book
        setBorrowedBooks((prevBooks) =>
          prevBooks.filter((borrowedBook) => borrowedBook.id !== book.id)
        );

        // Optionally update the loan state locally
        const storedLoans = JSON.parse(localStorage.getItem("loans")) || [];
        const updatedLoans = storedLoans.filter((loan) => loan.id !== loanId);
        localStorage.setItem("loans", JSON.stringify(updatedLoans));
      })
      .catch((error) => {
        console.error("Error unborrowing the book:", error.response || error);
        alert("Failed to unborrow the book. Please try again.");
      });
  };

  return (
    <div className="profile-container">
      <nav className="home-navbar">
        <div className="logo">Library</div>
        <div className="home-nav-buttons">
          <button
            className="home-nav-button"
            onClick={() => (window.location.href = "/home")}
          >
            Home
          </button>
          {userInfo ? (
            <button
              className="home-nav-button user-email-button"
              onClick={() => (window.location.href = "/profile")}
            >
              {userInfo.email}
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
      <h1>My Profile</h1>
      {error && <p className="error-message">{error}</p>}
      {userInfo && (
        <div className="user-info">
          <ul>
            <li>
              <strong>Email:</strong> {userInfo.email}
            </li>
          </ul>
        </div>
      )}
      <div className="borrowed-books-section">
        <h2>Borrowed Books</h2>
        {borrowedBooks.length === 0 ? (
          <p>No borrowed books available.</p>
        ) : (
          <div className="books-grid">
            {borrowedBooks.map((book) => (
              <div className="book-card" key={book.id}>
                <h3>{book.title}</h3>
                <p>
                  Author: {book.author.firstName} {book.author.lastName}
                </p>
                <p>ISBN: {book.isbn}</p>
                <button
                  className="unborrow-button"
                  onClick={() => handleUnborrow(book)}
                >
                  Return Book
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
