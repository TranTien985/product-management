module.exports = (objectPagination, query, countProducts) => {
  // 1h bài 21 
  // Nếu có keyword mà KHÔNG có page => reset về trang đầu
  if (query.keyword && !query.page) {
    objectPagination.currentPage = 1;
  } 
  // Còn nếu không tìm kiếm thì lấy trang từ query
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page);
  }

  objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

  const totalPages = Math.ceil(countProducts / objectPagination.limitItems) //Math.ceil dùng để làm tròn lên

  objectPagination.totalPages = totalPages;

  // Nếu page > totalPages => quay lại trang 1
  if (objectPagination.currentPage > totalPages) {
    objectPagination.currentPage = 1;
    objectPagination.skip = 0;
  }
  return objectPagination;
}