import React from 'react';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import BookList from '../components/BookList';

const Home = () => {
  return (
    <div>
      <Navbar />
      <Banner />
      <div>
        <h1 style={{ textAlign: 'center',background:'bisque' }}>All the books</h1>
        <BookList booksPerPage={12} /> {/* 12 books per page, 3 books per row, 4 rows */}
      </div>
    </div>
  );
};

export default Home;
