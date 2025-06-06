module.exports = (objectPagination, query, countProducts) => {
  // 1h bài 21 
    if(query.page){
      objectPagination.currentPage = parseInt(query.page); 
      //convert sang dạng number bằng parseInt
    }
  
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;
  
    const totalPages = Math.ceil(countProducts / objectPagination.limitItems) //Math.ceil dùng để làm tròn lên
  
    objectPagination.totalPages = totalPages;

    return objectPagination;
}