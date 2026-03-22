import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Issuedbooks = () => {
    const [issuedBooks, setIssuedBooks] = useState([]);

    const fetchIssuedBooks = async () => {
        try {
            const response = await axios.get('http://localhost:7000/currentissued', {
                headers: {
                    Authorization: `Bearer ${Cookies.get('emtoken')}`
                },
                withCredentials: true,
            });
            setIssuedBooks(response.data.issuedBooks);
            console.log('Issued Books:', response.data.books);
        } catch (error) {
            console.error('Error fetching issued books:', error);
        }
    };

    useEffect(() => {
        fetchIssuedBooks();
    }, []);

  return (
    <div className="min-h-screen bg-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-purple-300 text-purple-900">
            <h1 className="text-2xl font-bold">Currently Issued Books</h1>
            <p className="text-purple-700 mt-1">View all books that are currently issued to students</p>
          </div>
          
          <div className="p-6">
            {issuedBooks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📖</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Issued Books</h3>
                <p className="text-gray-500">There are no books currently issued.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Book ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Book Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Issue Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {issuedBooks.map((book) => (
                      <tr key={book._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {book.bookId || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {book.bookName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {book.studentName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {book.date ? new Date(book.date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Issued
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Issuedbooks
