document.addEventListener('DOMContentLoaded', function() {
      const toggleBtns = document.querySelectorAll('.toggle-btn');
      
      toggleBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          const sidebar = this.closest('.category-sidebar');
          sidebar.classList.toggle('collapsed');
          
          if (sidebar.classList.contains('collapsed')) {
            this.textContent = '+';
          } else {
            this.textContent = '-';
          }
        });
      });

      document.querySelectorAll('.category-sidebar').forEach(sidebar => {
        sidebar.addEventListener('click', function(e) {
          if (this.classList.contains('collapsed') && 
              e.target.closest('.sidebar-header')) {
            this.classList.remove('collapsed');
            const toggleBtn = this.querySelector('.toggle-btn');
            toggleBtn.textContent = '-';
          }
        });
      });
    });