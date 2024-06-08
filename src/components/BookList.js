import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './BookList.css';

Modal.setAppElement('#root');

const BookList = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);
  const booksPerPage = 16; // 4 rows x 4 books per row

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await axios.get(`https://openlibrary.org/search.json?q=programming&limit=96`);
      setAllBooks(response.data.docs);
      setFilteredBooks(response.data.docs);
    };

    fetchBooks();
  }, []);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const query = event.target.search.value.toLowerCase();

    const filtered = allBooks.filter(book => 
      (book.title && book.title.toLowerCase().includes(query)) ||
      (book.author_name && book.author_name.join(', ').toLowerCase().includes(query))
    );
    setFilteredBooks(filtered);
    setCurrentPage(1); // Reset to the first page
  };

  const renderBooks = () => {
    const startIndex = (currentPage - 1) * booksPerPage;
    const selectedBooks = filteredBooks.slice(startIndex, startIndex + booksPerPage);

    return selectedBooks.map((book, index) => (
      <div key={index} className="book-tile" onClick={() => setSelectedBook(book)}>
        <img src={`http://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`} alt={`${book.title} cover`} />
        <h3>{book.title}</h3>
        <p>Author: {book.author_name ? book.author_name.join(', ') : 'Unknown Author'}</p>
      </div>
    ));
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  const renderBookDetails = () => {
    if (!selectedBook) return null;

    return (
      <Modal isOpen={!!selectedBook} onRequestClose={closeModal} className="book-modal" overlayClassName="book-overlay">
        <h2>{selectedBook.title}</h2>
        <p>Author: {selectedBook.author_name ? selectedBook.author_name.join(', ') : 'Unknown Author'}</p>
        <p>Introduction: {selectedBook.first_sentence ? selectedBook.first_sentence : 'No introduction available.'}</p>
        <button onClick={closeModal}>Back</button>
        <button onClick={() => window.open(`http://openlibrary.org${selectedBook.key}`, '_blank')}>Download</button>
      </Modal>
    );
  };

  return (
    <div className="book-list-container">
      <form onSubmit={handleSearch} className="search-form">
        <input type="text" name="search" placeholder="Search for books..." />
        <button type="submit">Search</button>
      </form>
      <div className="book-list">
        {renderBooks()}
      </div>
      <div className="pagination">
        <button onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>Previous</button>
        <button onClick={() => handlePageChange('next')} disabled={currentPage === totalPages}>Next</button>
      </div>
      {renderBookDetails()}
    </div>
  );
};

export default BookList;
