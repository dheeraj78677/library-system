import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { TailSpin } from 'react-loader-spinner'; // Import the spinner component
import './BookList.css';

Modal.setAppElement('#root');

const BookList = ({ userInfo }) => {
    console.log(userInfo);
  const [allBooks, setAllBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false); // Add a loading state
  const booksPerPage = 16; // 4 rows x 4 books per row

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true); // Set loading to true before starting the fetch
      try {
        const response = await axios.get('/api/books');
        console.log("hello");
        setAllBooks(response.data.docs);
        setFilteredBooks(response.data.docs);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching is done
      }
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
  
  const downloadSamplePDF = async () => {
    console.log('download clicked');
    try {
      const response = await axios.get('/api/download-sample', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sample.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading sample PDF:', error);
    }
  };

  const renderBooks = () => {
    const startIndex = (currentPage - 1) * booksPerPage;
    const selectedBooks = filteredBooks.slice(startIndex, startIndex + booksPerPage);

    return selectedBooks.map((book, index) => (
      <div key={index} className="book-tile" onClick={() => setSelectedBook(book)}>
        <img src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`} alt={`${book.title} cover`} />
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
        
        {userInfo ?(
            <>
        <button onClick={downloadSamplePDF}>
          Download
        </button>
        </>
      ):(
        <>
        <p>Please login/signUp to download the content!</p>
        </>
      )}
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
        {loading ? (
          <div className="spinner-container">
            <TailSpin color="#00BFFF" height={80} width={80} />
          </div>
        ) : (
          renderBooks()
        )}
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
