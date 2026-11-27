// phút 40 bài 21
module.exports = (query) => {
  // ta cần trả ra 2 kết quả là keyword nhập vào và regex 
  // thế nên cta cho vào 1 object để dễ quản lí
  let ObjectSearch ={
    keyword : "",
    regex : ""
  }
  if(query.keyword){
    ObjectSearch.keyword = query.keyword.trim();

    // Escape special regex characters to avoid Regex SyntaxError crashes
    const escapedKeyword = ObjectSearch.keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedKeyword, "i"); //tìm hiểu thêm regex js
    ObjectSearch.regex = regex; // nễu tồn tại regex thì sẽ cập nhật cho regex trong Object
  }

  return ObjectSearch
}