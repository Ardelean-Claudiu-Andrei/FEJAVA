import React from "react";
import styles from "./BookCard.module.css";

const BookCard = ({ book, onBorrowClick }) => {
  return (
    <div className={styles.card}>
      <h3>{book.title}</h3>
      <p>
        Author: {book.author.firstName} {book.author.lastName}
      </p>
      <p>State: {book.state}</p>
      <button
        className={styles.button}
        onClick={onBorrowClick}
        disabled={book.state === "BORROWED"}
      >
        {book.state === "BORROWED" ? "Borrowed" : "Borrow"}
      </button>
    </div>
  );
};

export default BookCard;
