// const Pagination = ({ totalPages, currentPage }) => {
//     const handlePageChange = (newPage) => {
//       const query = new URLSearchParams({ page: newPage }).toString();
//       window.location.href = `/search?${query}`;
//     };
  
//     return (
//       <div className="flex justify-center mt-4">
//         {Array.from({ length: totalPages }, (_, i) => (
//           <button
//             key={i}
//             onClick={() => handlePageChange(i + 1)}
//             className={`p-2 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white'}`}
//           >
//             {i + 1}
//           </button>
//         ))}
//       </div>
//     );
//   };
  
//   export default Pagination;
  