const ProductCategory = require("../models/product-category.model");

module.exports.getSubCategory = async (parentId) => {
  const getCategory = async (parentId) => {
    // lấy ra những danh mục con
    const subs = await ProductCategory.find({
      parent_id: parentId,
      availabilityStatus: "In Stock",
      deleted: false,
    });

    let allSub = [...subs]; // tạo một bản sao mới chứa những phần tử cũ của subs

    //sử dụng dệ quy lặp qua từng phần tử của thằng subs 
    //để lấy ra những thằng con của danh mục trong subs
    for (const sub of subs) {
      const childs = await getCategory(sub.id);
      allSub = allSub.concat(childs); // dùng concat để ghép lại mảng
    }

    return allSub;
  } 

  const result = await getCategory(parentId)
  return result
}