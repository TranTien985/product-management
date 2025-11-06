module.exports = (objectPagination, query, countProducts) => {
  // 1h bài 21 
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page);
  } else {
    objectPagination.currentPage = 1;
  }

  // Nếu có từ khóa tìm kiếm thì luôn quay về trang đầu tiên
  if (query.search) {
    objectPagination.currentPage = 1;
  }

  objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

  const totalPages = Math.ceil(countProducts / objectPagination.limitItems);
  objectPagination.totalPages = totalPages;

  // Nếu trang hiện tại lớn hơn tổng số trang, reset về trang 1
  if (objectPagination.currentPage > totalPages) {
    objectPagination.currentPage = 1;
    objectPagination.skip = 0;
  }

  return objectPagination;

}