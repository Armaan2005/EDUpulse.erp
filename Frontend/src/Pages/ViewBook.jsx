import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  FaBookOpen,
  FaUser,
  FaTag,
  FaBookmark,
  FaSpinner,
  FaExclamationTriangle,
  FaSearch,
} from "react-icons/fa";

const ViewBooks = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [issueLoading, setIssueLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBooks = async () => {
    try {
      const token = Cookies.get("token");

      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/viewbook`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const data = res.data.book || [];

      const processed = data.map((b) => ({
        ...b,
        status: b.status ? b.status.toLowerCase() : "unknown",
      }));

      setBooks(processed);
      setFilteredBooks(processed);

      const unique = ["All", ...new Set(processed.map((b) => b.category))];
      setCategories(unique);

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch books");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    let result = books;

    if (activeCategory !== "All") {
      result = result.filter((b) => b.category === activeCategory);
    }

    if (search) {
      result = result.filter((b) =>
        b.bookName.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredBooks(result);
  }, [search, activeCategory, books]);

  const handleIssue = async (bookId) => {
    setIssueLoading(true);

    try {
      const token = Cookies.get("token");

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/issuebook`,
        { bookId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      alert(res.data.msg || "Book Issued");
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.msg || err.message);
    } finally {
      setIssueLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <FaSpinner className="animate-spin text-3xl mr-3 text-blue-600" />
        Loading Books...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <FaExclamationTriangle className="mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-200 py-12 px-6">

      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-blue-300 rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-indigo-400 rounded-full blur-[120px] opacity-40"></div>

      <div className="max-w-7xl mx-auto relative">

        <div className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-lg p-6 mb-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div className="flex items-center gap-3">
              <FaBookOpen className="text-blue-600 text-2xl" />
              <h1 className="text-2xl font-bold text-gray-800">
                Library Collection
              </h1>
            </div>

            <div className="flex items-center bg-white rounded-xl shadow px-4 py-2 w-full md:w-80">

              <FaSearch className="text-gray-400 mr-3" />

              <input
                type="text"
                placeholder="Search book name"
                className="focus:outline-none w-full text-gray-700"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

          </div>

          <div className="flex flex-wrap gap-3 mt-6">

            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition
                ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white shadow hover:bg-blue-50 text-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}

          </div>

        </div>


        {filteredBooks.length === 0 ? (
          <div className="text-center text-gray-500">
            No books found
          </div>
        ) : (

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

            {filteredBooks.map((book) => {
              const isAvailable = book.status === "available";

              return (
                <div
                  key={book._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 overflow-hidden"
                >

                  <div className="relative h-64">

                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}/images/${book.image}`}
                      alt={book.bookName}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />

                    <span
                      className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full text-white ${
                        isAvailable ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {book.status}
                    </span>

                  </div>

                  <div className="p-5">

                    <h3 className="font-semibold text-gray-800 mb-2">
                      {book.bookName}
                    </h3>

                    <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                      <FaUser className="text-gray-400" />
                      {book.author}
                    </p>

                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <FaTag className="text-gray-400" />
                      {book.category}
                    </p>

                    <button
                      onClick={() => handleIssue(book._id)}
                      disabled={!isAvailable || issueLoading}
                      className={`mt-4 w-full py-2 rounded-lg text-sm font-medium text-white transition
                      ${
                        !isAvailable
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >

                      {issueLoading ? (
                        <span className="flex justify-center items-center gap-2">
                          <FaSpinner className="animate-spin" />
                          Issuing...
                        </span>
                      ) : (
                        <span className="flex justify-center items-center gap-2">
                          <FaBookmark />
                          {isAvailable ? "Issue Book" : "Issued"}
                        </span>
                      )}

                    </button>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>

    </div>
  );
};

export default ViewBooks;