// phải tạo ra một hàm riêng để chạy trước tại khi mình export
// đoạn code này sẽ được thực hiện bên file khác nên nó sẽ xảy ra lỗi ko tìm thấy hàm đệ quy
//  nên ta phải tạo 1 hàm chạy đệ quy riêng và 1 hàm export riêng
const createTree = (arr, parentId ="") => {
  const tree = [];
  arr.forEach((item) => {
    if(item.parent_id === parentId){
      const newItem = item 
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
  const tree = createTree(arr, parentId = "");
  return tree;  
}