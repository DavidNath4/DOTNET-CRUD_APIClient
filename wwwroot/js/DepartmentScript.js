$(function () {
    $('[data-tooltip="tooltip"]').tooltip({
        trigger: 'hover'
    });
});

$('body').tooltip({
    selector: '[data-tooltip="tooltip"]',
    container: 'body',
    trigger: 'hover'
});

const setAddDepartmentModal = () => {
    $('#modalLabel').text("Add new department") // ganti modal title
    $('#addDepartment').addClass("d-block") // menampilkan form untuk menambahkan data
    $('#editDepartment').removeClass("d-block") // menyembunyikan form edit
    return false;
}

const setEditDepartmentModal = (id, name) => {
    $('#modalLabel').text("Edit department") // ganti modal title
    $('#editDepartment').addClass("d-block") // menampilkan form untuk mengedit data
    $('#addDepartment').removeClass("d-block") // menyembunyikan form tambah

    $('#editDepartmentId').val(id)
    $('#editDepartmentName').val(name) // menampilkan data sebelumnya
    return false;
}


$(document).ready(function () {
    var table = $("#tbDepartments").DataTable({
        "paging": true,
        "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "Show All"]],
        "lengthChange": true,
        "searching": true,
        "order": [],
        "ordering": true,
        "info": true,
        "autoWidth": false,
        "responsive": true,
        "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"],
        "processing": true,
        "serverSide": true,
        "ajax": {
            url: 'https://localhost:7021/api/Department/GetPaging',
            //url: 'https://localhost:7021/api/Department/GetDepartments',
            //url: 'http://localhost:8082/api/Department/GetDepartments',
            type: 'POST',
            "dataType": 'json',
            "dataSrc": 'data',
        },
        "columns": [
            {
                "data": null,
                "orderable": false,
                "searchable": false

            },
            { "data": "id", "name": "id" },
            { "data": "name", "name": "Name" },
            {
                "data": null,
                "render": function (data, type, row) {
                    return `<div> 
                    <button type="button" class="btn btn-outline-warning" data-toggle="modal" data-target="#departmentModal" data-tooltip="tooltip" data-placement="left" title="Edit department" onclick="setEditDepartmentModal('${data.id}', '${data.name}')">
                    <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger" data-tooltip="tooltip" data-placement="right" title="Remove department" onclick="Remove('${data.id}')">
                    <i class="fas fa-trash"></i>
                    </button>
                    </div>`
                }
                , "orderable": false
            }
        ]

    })
    console.log("test")
    table.on('draw.dt', function () {
        var PageInfo = $('#tbDepartments').DataTable().page.info();
        table.column(0, { page: 'current' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1 + PageInfo.start;
        });
    });

    table.buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');

})

function Save(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const departmentName = form.get("addDepartmentName");

    let data = {
        name: departmentName
    }


    $.ajax({
        url: 'https://localhost:7021/api/Department/InsertDepartment',
        //url: 'http://localhost:8082/api/Department/InsertDepartment',
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ name: departmentName })
    }).then(result => {
        if (result.status_code === 200) {
            $("#tbDepartments").DataTable().ajax.reload();
            Swal.fire(
                'Success!',
                `${result.message}`,
                'success'
            )
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: `${result.message}`
            })
        }
    }).catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: `${error.responseJSON.message}`
        });
    });
    $("#departmentModal").modal("hide");

}

function Update(event) {
    event.preventDefault();

    const form = new FormData(event.target);
    const departmentID = form.get("editDepartmentId");
    const departmentName = form.get("editDepartmentName");

    let data = {
        "newName": departmentName
    }

    $.ajax({
        url: `https://localhost:7021/api/Department/UpdateDepartment/${departmentID}`,
        //url: `http://localhost:8082/api/Department/UpdateDepartment/${departmentID}`,
        type: 'PUT',
        contentType: 'application/json',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ newName: departmentName })
    }).then(result => {
        if (result.status_code === 200) {
            $("#tbDepartments").DataTable().ajax.reload();
            Swal.fire(
                'Success!',
                `${result.message}`,
                'success'
            )

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: `${result.message}`
            })
        }
    }).catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: `${error.responseJSON.message}`
        });
    });
    $("#departmentModal").modal("hide");
}

function Remove(id) {
    Swal.fire({
        title: 'Confirm Delete',
        text: 'Are you sure you want to Delete this Department?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
    })
        .then((result) => {
            if (result.isConfirmed) {

                $.ajax({
                    url: `https://localhost:7021/api/Department/DeleteDepartment/${id}`,
                    //url: `http://localhost:8082/api/Department/DeleteDepartment/${id}`,
                    type: 'DELETE',
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    async: false,
                }).then(response => {
                    if (response.status_code === 200) {
                        Swal.fire(
                            'Success!',
                            `${response.message}`,
                            'success'
                        );
                        $("#tbDepartments").DataTable().ajax.reload();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: `${response.message}`
                        });
                    }
                }).catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: `${error.responseJSON.message}`
                    });
                });
            }
        });
}



$('#addDepartment').submit(function (event) {
    event.preventDefault();

    $("#addDepartmentName").val("");
})


