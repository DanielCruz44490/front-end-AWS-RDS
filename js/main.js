document.addEventListener('DOMContentLoaded', loadTableData);

    const apiUrl = 'https://66db3da9f47a05d55be77be9.mockapi.io/api/v1/estudiante/';


    async function loadTableData() {
      try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';

        data.forEach(estudiante => {
          const row = `
          <tr>
            <td>${estudiante.id}</td>
            <td>${estudiante.nombre}</td>
            <td>${estudiante.apellido}</td>
            <td>${estudiante.ciudad}</td>
            <td>${estudiante.calle}</td>
            <td>
              <button type="button" class="btn btn-info btn-sm" onclick="mostrarInfo(${estudiante.id})">
                <i class="fas fa-info-circle"></i> Info
              </button>
              <button type="button" class="btn btn-warning btn-sm" onclick="editarEstudiante(${estudiante.id})" data-bs-toggle="modal" data-bs-target="#editModal">
                <i class="fas fa-edit"></i> Editar
              </button>
              <button type="button" class="btn btn-danger btn-sm" onclick="confirmarEliminar(${estudiante.id})">
                <i class="fas fa-trash-alt"></i> Eliminar
              </button>
            </td>
          </tr>
        `;
          tableBody.insertAdjacentHTML('beforeend', row);
        });


        document.getElementById('no-records-message').style.display = data.length ? 'none' : 'block';
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    }


    async function mostrarInfo(id) {
      try {
        const response = await axios.get(`${apiUrl}${id}`);
        const estudiante = response.data;

        Swal.fire({
          title: `<strong>Información del Estudiante</strong>`,
          html: `
          <p><strong>ID:</strong> ${estudiante.id}</p>
          <p><strong>Nombre:</strong> ${estudiante.nombre}</p>
          <p><strong>Apellido:</strong> ${estudiante.apellido}</p>
          <p><strong>Ciudad:</strong> ${estudiante.ciudad}</p>
          <p><strong>Calle:</strong> ${estudiante.calle}</p>
        `,
          icon: 'info',
          confirmButtonText: 'Cerrar'
        });

      } catch (error) {
        console.error('Error al cargar la información del estudiante:', error);
        Swal.fire(
          'Error!',
          'Ocurrió un error al cargar la información del estudiante.',
          'error'
        );
      }
    }


    async function editarEstudiante(id) {
      try {
        const response = await axios.get(`${apiUrl}${id}`);
        const estudiante = response.data;


        document.getElementById('editId').value = estudiante.id;
        document.getElementById('editNombre').value = estudiante.nombre;
        document.getElementById('editApellido').value = estudiante.apellido;
        document.getElementById('editCiudad').value = estudiante.ciudad;
        document.getElementById('editCalle').value = estudiante.calle;
      } catch (error) {
        console.error('Error al cargar los datos del estudiante:', error);
      }
    }


    document.getElementById('editForm').addEventListener('submit', async function (event) {
      event.preventDefault();

      const id = document.getElementById('editId').value;
      const nombre = document.getElementById('editNombre').value;
      const apellido = document.getElementById('editApellido').value;
      const ciudad = document.getElementById('editCiudad').value;
      const calle = document.getElementById('editCalle').value;

      try {
        await axios.put(`${apiUrl}${id}`, {
          nombre,
          apellido,
          ciudad,
          calle
        });


        const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
        modal.hide();

        Swal.fire(
          'Actualizado!',
          'El estudiante ha sido actualizado correctamente.',
          'success'
        );

        loadTableData();
      } catch (error) {
        console.error('Error al actualizar el estudiante:', error);
        Swal.fire(
          'Error!',
          'Ocurrió un error al actualizar el estudiante.',
          'error'
        );
      }
    });


    function confirmarEliminar(id) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          eliminarEstudiante(id);
        }
      });
    }


    async function eliminarEstudiante(id) {
      try {
        await axios.delete(`${apiUrl}${id}`);
        Swal.fire(
          'Eliminado!',
          'El estudiante ha sido eliminado correctamente.',
          'success'
        );
        // Recargar la tabla
        loadTableData();
      } catch (error) {
        console.error('Error al eliminar el estudiante:', error);
        Swal.fire(
          'Error!',
          'Ocurrió un error al eliminar el estudiante.',
          'error'
        );
      }
    }


    async function agregarEstudiante() {
      const nombre = document.getElementById('addNombre').value;
      const apellido = document.getElementById('addApellido').value;
      const ciudad = document.getElementById('addCiudad').value;
      const calle = document.getElementById('addCalle').value;

      try {
        await axios.post(apiUrl, {
          nombre,
          apellido,
          ciudad,
          calle
        });


        const modal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
        modal.hide();

        Swal.fire(
          'Agregado!',
          'El estudiante ha sido agregado correctamente.',
          'success'
        );


        document.getElementById('addNombre').value = '';
        document.getElementById('addApellido').value = '';
        document.getElementById('addCiudad').value = '';
        document.getElementById('addCalle').value = '';


        loadTableData();
      } catch (error) {
        console.error('Error al agregar el estudiante:', error);
        Swal.fire(
          'Error!',
          'Ocurrió un error al agregar el estudiante.',
          'error'
        );
      }
    }


    function filterTable() {
      const searchInput = document.getElementById('searchInput').value.toLowerCase();
      const tableBody = document.getElementById('table-body');
      const rows = tableBody.getElementsByTagName('tr');

      let hasRecords = false;

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.getElementsByTagName('td');
        const nombre = cells[1].textContent.toLowerCase();
        const apellido = cells[2].textContent.toLowerCase();


        if (nombre.includes(searchInput) || apellido.includes(searchInput)) {
          row.style.display = '';
          hasRecords = true;
        } else {
          row.style.display = 'none';
        }
      }


      document.getElementById('no-records-message').style.display = hasRecords ? 'none' : 'block';
    }


    document.addEventListener('DOMContentLoaded', loadTableData);