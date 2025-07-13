//  Permission
const tablePermission = document.querySelector("[table-permission]")

if(tablePermission){
  const buttonSubmit = document.querySelector("[button-submit]")

  buttonSubmit.addEventListener("click", () => {
    let permission = [];

    const rows = tablePermission.querySelectorAll("[data-name]");

    rows.forEach(item => {
      const name = item.getAttribute("data-name")
      const inputs = item.querySelectorAll("input")
      
      if(name == "id"){
        inputs.forEach(input => {
          const id = input.value
          permission.push({
            id: id,
            permission: []
          });
        })
      }else{
        inputs.forEach((input, index) => {
          const check = input.checked;
          if(check){
            permission[index].permission.push(name);
          }
          // chọc vào mảng theo stt là index và push quyền theo các ô checkbox
        })
      }
      
    });
    console.log(permission);
    
    if(permission.length > 0){
      const formChangePermission = document.querySelector("#form-change-permission")
      const inputPermission = formChangePermission.querySelector("input[name='permission']")

      inputPermission.value = JSON.stringify(permission);
      
      formChangePermission.submit();
    }
  });
}

// End Permission

// Permission Data Default
const dataRecord = document.querySelector("[data-record]")

if(dataRecord){
  const records = JSON.parse(dataRecord.getAttribute("data-record"));

  const tablePermission = document.querySelector("[table-permission]");

  records.forEach((record, index) => {
    const permissions = record.permissions

    permissions.forEach(permission => {
      const row = tablePermission.querySelector(`[data-name="${permission}"]`);
      const input = row.querySelectorAll("input")[index];

      input.checked = true
    })
    
  })
}
// End Permission Data Default
