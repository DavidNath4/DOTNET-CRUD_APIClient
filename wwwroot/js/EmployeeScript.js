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

const setAddEmployeeModal = () => {
    $('#modalLabel').text("Add new employee")
    $('#addEmployee').addClass("d-block")
    $('#editEmployee').removeClass("d-block")
    return false;
}

const setEditEmployeeModal = (nik, firstName, lastName, phone, address, status) => {
    $('#modalLabel').text("Edit employee")
    $('#editEmployee').addClass("d-block")
    $('#addEmployee').removeClass("d-block")

    
    $('#editDepartmentNIK').val(nik)
    $('#editFirstName').val(firstName)
    $('#editLastName').val(lastName)
    $('#editPhone').val(phone)
    $('#editAddress').val(address)       

    return false;
}



$(document).ready(function () {
    var table = $("#tbEmployees").DataTable({
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "order": [],
        "ordering": true,
        "info": true,
        "autoWidth": false,
        "responsive": true,
        "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"],
        "ajax": {
            url: 'https://localhost:7021/api/Employee/GetEmployees',
            type: 'GET',
            "dataType": 'json',
            "dataSrc": 'data',
        },
        "columns": [
            // No urut
            {
                "data": null,
                "orderable": false,
                "searchable": false,

            },
            // NIK
            { "data": "nik" },
            // Name
            {
                "data": null,
                "render": function (data, type, row) {
                    return (data.firstName + " " + data.lastName);
                },
            },            
            // Email
            { "data": "email" },
            { "data": "phone" },
            { "data": "address" },
            {
                "data": "isActive",
                render: function (data, type, row, meta) {
                    return data == true ? '<span class="badge badge-success" >Active</span>' : '<span class="badge badge-danger" >Resign</span>';
                }
            },
            {
                "data": "departmentId",
                "render": function (data, type, row) {

                    if (data) {
                        var departmentName = fetchDepartmentName(data);
                        return departmentName;
                    } else {
                        return data;
                    }
                }
            },
            {
                "data": null,
                "render": function (data, type, row) {
                    return `<div> 
                    <button type="button" class="btn btn-outline-warning" data-toggle="modal" data-target="#employeeModal" data-tooltip="tooltip" data-placement="left" title="Edit" onclick="setEditEmployeeModal('${data.nik}','${data.firstName}','${data.lastName}','${data.phone}','${data.address}','${data.isActive}')">
                    <i class="fas fa-edit"></i>
                    </button>
                    &nbsp;
                    <button type="button" class="btn btn-outline-danger" data-tooltip="tooltip" data-placement="top" title="Remove" onclick="Remove('${data.nik}')">
                    <i class="fas fa-trash"></i>
                    </button>
                    &nbsp;
                    <button type="button" class="btn btn-outline-danger" data-tooltip="tooltip" data-placement="right" title="Remove Permanently" onclick="RemovePermanently('${data.nik}')">
                    <i class="fas fa-exclamation-triangle"></i>
                    </button>
                    </div>`
                }
                , "orderable": false
            }
        ]

    })

    table.on('draw.dt', function () {
        var PageInfo = $('#tbEmployees').DataTable().page.info();
        table.column(0, { page: 'current' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1 + PageInfo.start;
        });
    });

    var departmentSelect = document.getElementById('addDepartmentId');
    var departmentSelect2 = document.getElementById('editDepartmentId');

    function populateDepartmentSelect(selectElement) {
        $.ajax({
            type: 'GET',
            url: "https://localhost:7021/api/Department/GetDepartments",
            //url: "http://localhost:8082/api/Department/GetDepartments",
            dataType: 'json',
            dataSrc: 'data',
        }).then(function (result) {
            result.data.forEach(function (item) {
                var option = new Option(item.name, item.id, true, false);
                selectElement.add(option);
            });
        });
    }

    populateDepartmentSelect(departmentSelect);
    populateDepartmentSelect(departmentSelect2);


    table.buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');

})


function fetchDepartmentName(departmentId) {
    $.ajax({
        url: `https://localhost:7021/api/Department/GetDepartment/${departmentId}`,
        //url: `http://localhost:8082/api/Department/GetDepartment/${departmentId}`,
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function (data) {
            departmentName = `${data.data.name}`;
        },
        error: function () {
            departmentName = "Unknown";
        }
    });

    return departmentName;
}

function Save(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const firstName = form.get("addFirstName");
    const lastName = form.get("addLastName");
    const phone = form.get("addPhone");
    const address = form.get("addAddress");
    const departmentId = form.get("addDepartmentId");

    if (!firstName || !lastName || !phone || !address || !departmentId) {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Please fill in all required fields.',
        });
        return;
    }

    let data = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        address: address,
        departmentId: departmentId
    }


    $.ajax({
        url: 'https://localhost:7021/api/Employee/InsertEmployee',
        //url: 'http://localhost:8082/api/Employee/InsertEmployee',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data)
    }).then(result => {
        if (result.status_code === 200) {
            $("#tbEmployees").DataTable().ajax.reload();
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
    $("#employeeModal").modal("hide");

}

function Update(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const nik = form.get("editDepartmentNIK");
    const firstName = form.get("editFirstName");
    const lastName = form.get("editLastName");
    const phone = form.get("editPhone");
    const address = form.get("editAddress");
    const statusString = form.get("editStatus");
    const departmentId = form.get("editDepartmentId");

    const status = statusString === "1";

    if (!firstName || !lastName || !phone || !address || !departmentId) {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Please fill in all required fields.',
        });
        return;
    }

    // Data to be sent in the request body
    const data = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        address: address,
        isActive: status,
        departmentId: departmentId
    };

    Swal.fire({
        title: 'Confirm Update',
        text: 'Are you sure you want to update this employee?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Update',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `https://localhost:7021/api/Employee/UpdateEmployee/${nik}`,
                //url: `http://localhost:8082/api/Employee/UpdateEmployee/${nik}`,
                type: 'PUT',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(data)
            }).then(result => {
                if (result.status_code === 200) {
                    $("#tbEmployees").DataTable().ajax.reload();
                    Swal.fire('Success!', `${result.message}`, 'success');
                } else {
                    Swal.fire('Error!', `${result.message}`, 'error');
                }
            }).catch(error => {
                Swal.fire('Error!', `${error.responseJSON.message}`, 'error');
            }).always(() => {
                $("#employeeModal").modal("hide");
            });
        }
    });
}

function Remove(id) {
    Swal.fire({
        title: 'Confirm Delete',
        text: 'Are you sure you want to Delete Employee? (this employee will set to resign)',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
    })
        .then((result) => {
            if (result.isConfirmed) {

                $.ajax({
                    url: `https://localhost:7021/api/Employee/DeleteActiveEmployee/${id}`,
                    //url: `http://localhost:8082/api/Employee/DeleteActiveEmployee/${id}`,
                    type: 'DELETE',
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    async: false,
                }).then(response => {
                    if (response.status_code === 200) {
                        $("#tbEmployees").DataTable().ajax.reload();
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

function RemovePermanently(id) {
    Swal.fire({
        title: 'Confirm Delete',
        text: 'Are you sure you want to Delete Employee? (this employee data will delete PERMANENTLY)',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
    })
        .then((result) => {
            if (result.isConfirmed) {

                $.ajax({
                    url: `https://localhost:7021/api/Employee/DeleteEmployee/${id}`,
                    //url: `http://localhost:8082/api/Employee/DeleteEmployee/${id}`,
                    type: 'DELETE',
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    async: false,
                }).then(response => {
                    if (response.status_code === 200) {
                        $("#tbEmployees").DataTable().ajax.reload();
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

$('#addEmployee').submit(function (event) {
    event.preventDefault();

    $("#addFirstName").val("");
    $("#addLastName").val("");
    $("#addPhone").val("");
    $("#addAddress").val("");
})

$('#editEmployee').submit(function (event) {
    event.preventDefault();
    
    $("#editStatus").val("3");
    $("#editDepartmentId").val("3");
})
