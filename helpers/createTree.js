let count = 0
// phải tạo ra một hàm riêng để chạy trước tại khi mình export
// đoạn code này sẽ được thực hiện bên file khác nên nó sẽ xảy ra lỗi ko tìm thấy hàm đệ quy
//  nên ta phải tạo 1 hàm chạy đệ quy riêng và 1 hàm export riêng
const createTree = (arr, parentId ="") => {
  const tree = [];
  arr.forEach((item) => {
    if((item.parent_id === parentId)) {
      count++
      const newItem = item 
      newItem.index = count
      const children = createTree(arr, item.id);        
      if(children.length > 0){
        newItem.children = children
      }
      tree.push(newItem);
    }
  });
  return tree  
}
// muốn xem dữ liệu thì phải mở ở mục console trên devtools của Nodejs

module.exports.tree = (arr, parentId = "") => {
  count = 0 // tại biến count là biến server nên khi mà load lại trang 
  // thì biến count vẫn giữ nguyên nên ta phải set nó về 0 trước khi sử dụng hàm đệ quy
  const tree = createTree(arr, parentId = "");
  return tree;  
}