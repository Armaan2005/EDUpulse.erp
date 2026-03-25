import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {
 FaBook,
 FaIdCard,
 FaUser,
 FaSortNumericUp,
 FaTag,
 FaFileImage,
 FaPlusCircle,
 FaRegFileAlt,
 FaSpinner,
} from "react-icons/fa";

const AddBook = () => {

 const [formData, setFormData] = useState({
  bookId: "",
  bookName: "",
  author: "",
  quantity: "",
  description: "",
  category: "",
  image: null,
 });

 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");

 const navigate = useNavigate();

 const handleChange = (e) => {
  if (e.target.name === "image") {
   setFormData({ ...formData, image: e.target.files[0] });
  } else {
   setFormData({ ...formData, [e.target.name]: e.target.value });
  }
 };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
   setLoading(true);

   const data = new FormData();
   for (const key in formData) {
    data.append(key, formData[key]);
   }

   const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/addbook`,
    data,
    { headers: { Authorization: `Bearer ${Cookies.get('emtoken')}`, "Content-Type": "multipart/form-data"}, withCredentials: true }
   );

   if (response.status === 201) {
    setFormData({
     bookId: "",
     bookName: "",
     author: "",
     quantity: "",
     description: "",
     category: "",
     image: null,
    });

    navigate("/Dashboard");
   }

  } catch (err) {
   console.error(err);
   setError("Error while adding the book!");
  } finally {
   setLoading(false);
  }
 };

 const imagePreviewUrl = formData.image
  ? URL.createObjectURL(formData.image)
  : null;

 return (

 <div className="min-h-screen flex items-center justify-center p-6 
 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">

  <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl 
  p-10 w-full max-w-4xl border border-white/40">

   <h1 className="text-3xl font-bold flex items-center gap-3 mb-8 text-gray-800">
    <FaBook className="text-indigo-600 text-2xl"/>
    Add New Book
   </h1>

   {error && (
    <p className="text-red-500 mb-4">{error}</p>
   )}

   <form onSubmit={handleSubmit}>

    <div className="grid md:grid-cols-2 gap-6">

     <div>
      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaIdCard className="text-indigo-500"/> Book ID
      </label>

      <input
       type="text"
       name="bookId"
       value={formData.bookId}
       onChange={handleChange}
       placeholder="Unique Book ID"
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3 shadow-sm
       focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      />
     </div>

     <div>
      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaBook className="text-indigo-500"/> Book Name
      </label>

      <input
       type="text"
       name="bookName"
       value={formData.bookName}
       onChange={handleChange}
       placeholder="Book Name"
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3 shadow-sm
       focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      />
     </div>
     <div>
      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaUser className="text-indigo-500"/> Author
      </label>

      <input
       type="text"
       name="author"
       value={formData.author}
       onChange={handleChange}
       placeholder="Author"
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3 shadow-sm
       focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      />
     </div>

     <div>
      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaTag className="text-indigo-500"/> Category
      </label>

      <input
       type="text"
       name="category"
       value={formData.category}
       onChange={handleChange}
       placeholder="Fiction / Science"
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3 shadow-sm
       focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      />
     </div>

     <div>
      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaSortNumericUp className="text-indigo-500"/> Quantity
      </label>

      <input
       type="number"
       name="quantity"
       value={formData.quantity}
       onChange={handleChange}
       placeholder="Available Quantity"
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3 shadow-sm
       focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      />
     </div>

     <div>
      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaFileImage className="text-indigo-500"/> Book Image
      </label>

      <input
       type="file"
       name="image"
       accept="image/*"
       onChange={handleChange}
      />

      <div className="mt-3 p-4 border-2 border-dashed border-indigo-200 
      rounded-xl text-center bg-white/60">

       {imagePreviewUrl ? (
        <img
         src={imagePreviewUrl}
         alt="preview"
         className="mx-auto w-32 rounded-lg shadow"
        />
       ) : (
        <p className="text-gray-400 text-sm">
         No Image Selected
        </p>
       )}

      </div>
     </div>

     <div className="md:col-span-2">
      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaRegFileAlt className="text-indigo-500"/> Description
      </label>

      <textarea
       name="description"
       value={formData.description}
       onChange={handleChange}
       rows="4"
       placeholder="Brief summary of the book..."
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3 shadow-sm
       focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      ></textarea>
     </div>

    </div>

    <button
     type="submit"
     disabled={loading}
     className="mt-8 bg-gradient-to-r from-indigo-500 to-blue-600
     hover:from-indigo-600 hover:to-blue-700
     text-white px-8 py-3 rounded-xl flex items-center gap-3
     shadow-lg hover:shadow-xl transition-all"
    >
     {loading ? (
      <>
       <FaSpinner className="animate-spin"/>
       Adding Book...
      </>
     ) : (
      <>
       <FaPlusCircle/>
       Add Book
      </>
     )}
    </button>

   </form>

  </div>

 </div>

 );
};

export default AddBook;