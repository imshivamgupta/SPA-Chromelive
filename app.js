document.addEventListener('DOMContentLoaded', function() {
    fetchData('fetch', 1, makeTableColumnFixed);
});
let json, currentPage;
let dataType = 'frequency_trend_data';

function tableFill(res, type) {
    let tableUI;
    switch (res.data_type) {
        case 'frequency_trend_data':
            console.log('Request for frequency_trend_data');
            tableUI = frequency_trend_data(res);
            break;
        case 'carriage_impact_data':
            console.log('Request for carriage_impact_data');
            tableUI = carriage_impact_data(res);
            break;
        case 'carriage_impact_graph':
            console.log('Request for carriage_impact_graph');
            tableUI = carriage_impact_graph(res);
            break;
        case 'weekly_carriage_data':
            console.log('Request for weekly_carriage_data');
            tableUI = weekly_carriage_data(res);
            break;
        case 'weekly_carriage_graph':
            console.log('Request for weekly_carriage_graph');
            tableUI = weekly_carriage_graph(res);
            break;
        case 'active_subs_data':
            console.log('Request for active_subs_graph');
            tableUI = active_subs_data(res);
            break;
        case 'total_subs_data':
            console.log('Request for total_subs_data');
            tableUI = total_subs_data(res);
            break;
        case 'total_subs_graph':
            console.log('Request for total_subs_graph');
            tableUI = total_subs_graph(res);
            break;
        default:
            break;
    }
    currentPage = parseInt(res.page);
    let remainingPage = res.remaining_pages;
    var totalPages = currentPage + remainingPage;
    let pagination;
    // console.log((++currentPage));

    if (currentPage === 1) {
        pagination = `
            <nav aria-label="Page navigation example">
                <ul class="pagination justify-content-end">
                    <li class="page-item disabled">
                    <a class="page-link" href="#" tabindex="-1">Previous</a>
                    </li>
                    <li class="page-item active"><a class="page-link" onclick="fetchData('${type}',${currentPage}, makeTableColumnFixed)">${currentPage}</a></li>
                    <li class="page-item ${((currentPage+1)<=totalPages) ? '' : 'hide'}"><a class="page-link" onclick="fetchData('${type}',${currentPage+1}, makeTableColumnFixed)">${currentPage+1}</a></li>
                    <li class="page-item ${((currentPage+2)<=totalPages) ? '' : 'hide'}"><a class="page-link" onclick="fetchData('${type}',${currentPage+2}, makeTableColumnFixed)">${currentPage+2}</a></li>
                    <li class="page-item ${((currentPage+1)<=totalPages) ? '' : 'disabled'}">
                    <a class="page-link" onclick="fetchData('${type}',${currentPage+1}, makeTableColumnFixed)">Next</a>
                    </li>
                </ul>
            </nav>`;
    } else if (currentPage > 1) {
        pagination = `
        <nav aria-label="Page navigation example">
            <ul class="pagination justify-content-end">
                <li class="page-item ${((currentPage-1)<=totalPages) ? '' : 'disabled'}">
                <a class="page-link" onclick="fetchData('${type}',${currentPage-1}, makeTableColumnFixed)" tabindex="-1">Previous</a>
                </li>
                <li class="page-item ${((currentPage-1)<=totalPages) ? '' : 'hide'}"><a class="page-link" onclick="fetchData('${type}',${currentPage-1}, makeTableColumnFixed)">${currentPage-1}</a></li>
                <li class="page-item active ${((currentPage)<=totalPages) ? '' : 'hide'}"><a class="page-link" onclick="fetchData('${type}',${currentPage}, makeTableColumnFixed)">${currentPage}</a></li>
                <li class="page-item ${((currentPage+1)<=totalPages) ? '' : 'hide'}"><a class="page-link" onclick="fetchData('${type}',${currentPage+1}, makeTableColumnFixed)">${currentPage+1}</a></li>
                <li class="page-item ${((currentPage+1)<=totalPages) ? '' : 'disabled'}">
                <a class="page-link" onclick="fetchData('${type}',${currentPage+1}, makeTableColumnFixed)">Next</a>
                </li>
            </ul>
        </nav>`;
    }
    document.querySelector('.container-fluid').innerHTML = tableUI + pagination;
}

function fetchData(type, page, callback) {
    const method = 'POST';
    const url = './server/main.php';
    const async = true;
    if (type === 'fetch') {
        var data = new FormData();
        data.append('req', type);
        data.append('page', page);
        data.append('data_type', dataType)
        console.log('fetch');
    } else if (type === 'filter') {
        var data = new FormData(document.getElementById('filter'));
        data.append('req', type);
        data.append('page', page);
        data.append('data_type', dataType);
    }
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, async);
    xhr.send(data);
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            json = JSON.parse(this.responseText);
            tableFill(json, type);
            callback();
        }
    }
}
// For making the few column fixed
function makeTableColumnFixed() {
    if (dataType == 'carriage_impact_graph' || dataType == 'weekly_carriage_graph' || dataType == 'total_subs_graph') {
        $('.table').clone(true).appendTo('#table-scroll').addClass('clone').css({ width: '100%' });
    } else {
        $('.table').clone(true).appendTo('#table-scroll').addClass('clone');
    }
}
// updating the row data
function updateData(el) {
    // console.log(json.data[0].ID);
    var arrFound = [];
    // var formInput = Array.prototype.slice.call(document.querySelectorAll('form#updateForm input'));
    const formRow = document.querySelector('form#updateForm .row');
    const search = json.data;
    search.forEach((data) => {
        if (el.id == data.ID) {
            arrFound.push(data);
        }
    });
    var formEl = '';
    var weekList = '';
    var formLimit = 0;
    switch (dataType) {
        case 'frequency_trend_data':
            formLimit = 7;
            break;
        case 'carriage_impact_data':
            formLimit = 8;
            break;
        case 'carriage_impact_graph':
            formLimit = 3;
            break;
        case 'weekly_carriage_data':
            formLimit = 8;
            break;
        case 'weekly_carriage_graph':
            formLimit = 4;
            break;
        case 'active_subs_data':
            formLimit = 8;
            break;
        case 'total_subs_data':
            formLimit = 8;
            break;
        case 'total_subs_graph':
            formLimit = 4;
            break;
        default:
            break;
    }
    if (arrFound.length == 1) {
        // ObjKey is the key of found object
        Object.keys(arrFound[0]).map((objKey, index) => {
            // formInput.map((inputElement) => {
            //     return (inputElement.name === objKey) ? (inputElement.value = arrFound[0][objKey]) : false;
            // });
            if (index < formLimit) {
                formEl += `
                <div class="col-6 ${(index == 0 ) ? 'hide' : ''}">
                    <div class="form-group">
                        <label for="${objKey}">${objKey}</label>
                        <input type="text" class="form-control" name="${objKey}" placeholder="Enter ${objKey}" value="${arrFound[0][objKey]}">
                    </div>
                </div>
                `;
            } else if (index == formLimit) {
                formEl += `
                <div class="col-${(formLimit%2 == 0 ) ? '6' : '12'}">
                    <div class="form-group">
                        <label for="${objKey}">${objKey}</label>
                        <input type="text" class="form-control" name="${objKey}" placeholder="Enter ${objKey}" value="${arrFound[0][objKey]}">
                    </div>
                </div>
                `;
            } else {
                weekList += `<option value="${arrFound[0][objKey]}">${objKey}</option>`;
            }
        });
    }
    var weekEl = `
    <div class="cloneRow d-flex">
        <div class="col-3">
            <div class="form-group">
                <label for="weeklist">Week</label>
                <select class="form-control" id="weeklist" onchange="fillValue(this)">
                <option disabled selected>Week</option>
                ${weekList}
                </select>
            </div>
        </div>
        <div class="col-6">
            <div class="form-group">
                <label for="">&nbsp;</label>
                <input type="number" class="form-control" data-id="${arrFound[0].ID}" name="week_value" placeholder="Enter Week Data" value="" form="weekData" id="weekValue" required">
            </div>
        </div>
        <div class="col-3">
            <div class="form-group">
                <label for="">&nbsp;</label>
                <input type="button" class="form-control btn btn-outline-info" value="Update" onclick="weekUpdate()">
            </div>
        </div>
    </div>
    `;
    if (dataType == 'carriage_impact_graph' || dataType == 'weekly_carriage_graph' || dataType == 'total_subs_graph') {
        formRow.innerHTML = formEl;
    } else {
        formRow.innerHTML = weekEl + formEl;
    }
}

function fillValue(week) {
    var input = document.getElementById('weekValue');
    input.value = week.value;
    var opt = week.options[week.selectedIndex];
    input.setAttribute('data-name', opt.text);
    // input.name = opt.text;
    // input.id = opt.text;
}

// updating only week
function weekUpdate() {
    const input = document.querySelector('#weekValue');
    if (!(document.getElementById('weeklist').value == 'Week')) {
        var form = document.getElementById('weekData');
        const weekName = input.getAttribute('data-name');
        const id = input.getAttribute('data-id');
        var formData = new FormData(form);
        formData.append('req', 'only_week');
        formData.append('type', dataType);
        formData.append('week_name', weekName);
        formData.append('id', id);
        var method = form.method,
            url = './server/main.php',
            async = true;
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            // console.log(this.responseText);
            var res = JSON.parse(this.responseText);
            if (res.status == '200') {
                fetchData('fetch', currentPage, makeTableColumnFixed);
                toast(res);
                $('.toast').toast('show');
            }
        }
        xhr.open(method, url, async);
        xhr.send(formData);
    } else {
        alert('Please, Select a Week from the List');
    }
}

// For cloning the week row
function cloneRow(e) {
    if (e.innerText != 'DEL') {
        var div = e.closest('.cloneRow'),
            cloneDiv = div.cloneNode(true);
        var form = document.querySelector('form#updateForm .row');
        form.appendChild(cloneDiv);
        e.innerText = 'DEL';
        e.className = 'btn btn-danger';
        var input = e.parentNode.parentNode.previousElementSibling.children[0].children[1];
    } else {
        e.closest('.cloneRow').remove();
    }
}

function saveChanges() {
    const form = document.getElementById('updateForm');
    const method = form.method;
    const url = './server/main.php';
    const async = true;
    const updateForm = new FormData(form);
    updateForm.append('req', 'update');
    updateForm.append('type', dataType);
    var sendTime = (new Date()).getTime();
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        // console.log(this.responseText);
        var res = JSON.parse(this.responseText);
        if (res.status == '200') {
            $('#editModal').modal('hide');
            fetchData('fetch', currentPage, makeTableColumnFixed);
            var returnTime = (new Date()).getTime();
            var responseTime = Math.ceil((returnTime - sendTime) / 1000) + ' sec';
            res.responseTime = responseTime;
            toast(res);
            $('.toast').toast('show');
        }
    }
    xhr.open(method, url, async);
    xhr.send(updateForm);
}

document.getElementById('applyFilter').addEventListener('click', function(e) {
    e.preventDefault();
    // const select = document.getElementById('data_type');
    // const option = select.options[select.selectedIndex].value;
    // const channel = document.getElementById('channel').value;
    // console.log(dataType + ' & ' + channel);
    const form = document.getElementById('filter');
    const method = form.method;
    const url = './server/main.php';
    const async = true;
    const filterForm = new FormData(form);
    filterForm.append('req', 'filter');
    filterForm.append('data_type', dataType);
    filterForm.append('page', 1);
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
        // console.log(this.responseText);
        json = JSON.parse(this.responseText);
        if (json.status == "200") {
            tableFill(json, 'filter');
            makeTableColumnFixed();
        } else {
            document.getElementById('table-scroll').innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Data Not Available</strong> Please, Try it Later.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>`;
        }
    }
    xhr.open(method, url, async);
    xhr.send(filterForm);
});

document.getElementById('data_type').addEventListener('change', (e) => {
    dataType = e.target.value;
    fetchData('fetch', 1, makeTableColumnFixed);
});

// Toast Notification
function toast(obj) {
    const msg = obj.message;
    const time = obj.responseTime;
    const template = `
    <div role="alert show" aria-live="assertive" aria-atomic="true" class="toast" data-delay="5000" style="position: fixed; top: 12vh; right: 1vw;">
        <div class="toast-header">
            <strong class="mr-2">Notification</strong>
            <small>${(time == undefined) ? 'few sec ago' : time} ago</small>
            <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="toast-body">
            <p class="text-success">${msg}</p>
        </div>
    </div>
    `;
    var el = document.createElement('div');
    el.innerHTML = template;
    document.body.appendChild(el);
}
// Frequency_trend_data
function frequency_trend_data(res) {
    const headerEl = ['ID', 'CRN NO', 'ACTION', 'TYPE', 'MARKET', 'CITY', 'HEADEND', 'MSO', 'CHANNEL'];
    let headerDom = '';
    headerEl.forEach((col, index) => {
        if (index == 0) {
            headerDom += `<th scope="col" class="hide">${col}</th>`;
        } else if (index == 1) {
            headerDom += `<th scope="col" class="fixed-side">${col}</th>`;
        } else if (index == 2) {
            headerDom += `<th scope="col" class="fixed-side">${col}</th>`;
        } else {
            headerDom += `<th scope="col">${col}</th>`;
        }
    });
    let totalWeek = '';
    for (let i = 1; i <= 40; i++) {
        totalWeek += `<th scope="col">Wk${("0"+i).slice(-2)}</th>`;
    }
    let innerData = '';
    res.data.forEach((row) => {
        innerData += `
        <tr>
            <td class="hide">${row.ID}</td>
            <td class="fixed-side">${row.CRN_NO}</td>
            <td class="fixed-side">
                <button class="btn btn-danger" data-toggle="modal" data-target="#editModal" id="${row.ID}" onclick="updateData(this)">Edit</button>
            </td>
            <td>${row.TYPE}</td>
            <td>${row.MARKET}</td>
            <td>${row.CITY}</td>
            <td>${row.HEADEND}</td>
            <td>${row.MSOs}</td>
            <td>${row.CHANNEL}</td>
            <td>${row.Wk01}</td>
            <td>${row.Wk02}</td>
            <td>${row.Wk03}</td>
            <td>${row.Wk04}</td>
            <td>${row.Wk05}</td>
            <td>${row.Wk06}</td>
            <td>${row.Wk07}</td>
            <td>${row.Wk08}</td>
            <td>${row.Wk09}</td>
            <td>${row.Wk10}</td>
            <td>${row.Wk11}</td>
            <td>${row.Wk12}</td>
            <td>${row.Wk13}</td>
            <td>${row.Wk14}</td>
            <td>${row.Wk15}</td>
            <td>${row.Wk16}</td>
            <td>${row.Wk17}</td>
            <td>${row.Wk18}</td>
            <td>${row.Wk19}</td>
            <td>${row.Wk20}</td>
            <td>${row.Wk21}</td>
            <td>${row.Wk22}</td>
            <td>${row.Wk23}</td>
            <td>${row.Wk24}</td>
            <td>${row.Wk25}</td>
            <td>${row.Wk26}</td>
            <td>${row.Wk27}</td>
            <td>${row.Wk28}</td>
            <td>${row.Wk29}</td>
            <td>${row.Wk30}</td>
            <td>${row.Wk31}</td>
            <td>${row.Wk32}</td>
            <td>${row.Wk33}</td>
            <td>${row.Wk34}</td>
            <td>${row.Wk35}</td>
            <td>${row.Wk36}</td>
            <td>${row.Wk37}</td>
            <td>${row.Wk38}</td>
            <td>${row.Wk39}</td>
            <td>${row.Wk40}</td>
        </tr>`;
    });

    const template = `
        <table class="table table-responsive">
            <thead class="thead-dark">
                <tr>
                ${headerDom}
                ${totalWeek}
                </tr>
            </thead>
            <tbody>
                ${innerData}
            </tbody>
        </table>
    `;
    return template;
}

// Carriage_impact_data
function carriage_impact_data(res) {
    const headerEl = ['ID', 'CRN NO', 'ACTION', 'TYPE', 'MARKET', 'CITY', 'HEADEND', 'MSO', 'CHANNEL', 'IMPACT'];
    let headerDom = '';
    headerEl.forEach((col, index) => {
        if (index == 0) {
            headerDom += `<th scope="col" class="hide">${col}</th>`;
        } else if (index == 1) {
            headerDom += `<th scope="col" class="fixed-side">${col}</th>`;
        } else if (index == 2) {
            headerDom += `<th scope="col" class="fixed-side">${col}</th>`;
        } else {
            headerDom += `<th scope="col">${col}</th>`;
        }
    });
    let totalWeek = '';
    for (let i = 1; i <= 52; i++) {
        totalWeek += `<th scope="col">Wk${("0"+i).slice(-2)}</th>`;
    }
    let innerData = '';
    res.data.forEach((row) => {
        innerData += `
        <tr>
            <td class="hide">${row.ID}</td>
            <td class="fixed-side">${row.CRN_NO}</td>
            <td class="fixed-side">
                <button class="btn btn-danger" data-toggle="modal" data-target="#editModal" id="${row.ID}" onclick="updateData(this)">Edit</button>
            </td>
            <td>${row.TYPE}</td>
            <td>${row.MARKET}</td>
            <td>${row.CITY}</td>
            <td>${row.HEADEND}</td>
            <td>${row.MSOs}</td>
            <td>${row.CHANNEL}</td>
            <td>${row.IMPACT}</td>
            <td>${row.Wk01}</td>
            <td>${row.Wk02}</td>
            <td>${row.Wk03}</td>
            <td>${row.Wk04}</td>
            <td>${row.Wk05}</td>
            <td>${row.Wk06}</td>
            <td>${row.Wk07}</td>
            <td>${row.Wk08}</td>
            <td>${row.Wk09}</td>
            <td>${row.Wk10}</td>
            <td>${row.Wk11}</td>
            <td>${row.Wk12}</td>
            <td>${row.Wk13}</td>
            <td>${row.Wk14}</td>
            <td>${row.Wk15}</td>
            <td>${row.Wk16}</td>
            <td>${row.Wk17}</td>
            <td>${row.Wk18}</td>
            <td>${row.Wk19}</td>
            <td>${row.Wk20}</td>
            <td>${row.Wk21}</td>
            <td>${row.Wk22}</td>
            <td>${row.Wk23}</td>
            <td>${row.Wk24}</td>
            <td>${row.Wk25}</td>
            <td>${row.Wk26}</td>
            <td>${row.Wk27}</td>
            <td>${row.Wk28}</td>
            <td>${row.Wk29}</td>
            <td>${row.Wk30}</td>
            <td>${row.Wk31}</td>
            <td>${row.Wk32}</td>
            <td>${row.Wk33}</td>
            <td>${row.Wk34}</td>
            <td>${row.Wk35}</td>
            <td>${row.Wk36}</td>
            <td>${row.Wk37}</td>
            <td>${row.Wk38}</td>
            <td>${row.Wk39}</td>
            <td>${row.Wk40}</td>
            <td>${row.Wk41}</td>
            <td>${row.Wk42}</td>
            <td>${row.Wk43}</td>
            <td>${row.Wk44}</td>
            <td>${row.Wk45}</td>
            <td>${row.Wk46}</td>
            <td>${row.Wk47}</td>
            <td>${row.Wk48}</td>
            <td>${row.Wk49}</td>
            <td>${row.Wk50}</td>
            <td>${row.Wk51}</td>
            <td>${row.Wk52}</td>
        </tr>`;
    });

    const template = `
        <table class="table table-responsive">
            <thead class="thead-dark">
                <tr>
                ${headerDom}
                ${totalWeek}
                </tr>
            </thead>
            <tbody>
                ${innerData}
            </tbody>
        </table>
    `;
    return template;
}

// Carriage_impact_graph
function carriage_impact_graph(res) {
    const headerEl = ['ID', 'ACTION', 'WEEK', 'ACTIONED', 'REPORTED'];
    let headerDom = '';
    headerEl.forEach((col, index) => {
        if (index == 0) {
            headerDom += `<th scope="col" class="hide">${col}</th>`;
        } else if (index == 1) {
            headerDom += `<th scope="col" class="fixed-side">${col}</th>`;
        } else if (index == 2) {
            headerDom += `<th scope="col">${col}</th>`;
        } else {
            headerDom += `<th scope="col">${col}</th>`;
        }
    });
    let innerData = '';
    res.data.forEach((row) => {
        innerData += `
        <tr>
            <td class="hide">${row.ID}</td>
            <td class="fixed-side">
                <button class="btn btn-danger" data-toggle="modal" data-target="#editModal" id="${row.ID}" onclick="updateData(this)">Edit</button>
            </td>
            <td>${row.Week}</td>
            <td>${row.Actioned}</td>
            <td>${row.Reported}</td>
        </tr>`;
    });

    const template = `
        <table class="table table-responsive">
            <thead class="thead-dark">
                <tr>
                ${headerDom}
                </tr>
            </thead>
            <tbody>
                ${innerData}
            </tbody>
        </table>
    `;
    return template;
}

// weekly_carriage_data
function weekly_carriage_data(res) {
    const headerEl = ['ID', 'CRN NO', 'ACTION', 'PARAMETER', 'TYPE', 'MARKET', 'CITY', 'HEADEND', 'MSO', 'CHANNEL'];
    let headerDom = '';
    headerEl.forEach((col, index) => {
        if (index == 0) {
            headerDom += `<th scope="col" class="hide">${col}</th>`;
        } else if (index == 1) {
            headerDom += `<th scope="col" class="fixed-side">${col}</th>`;
        } else if (index == 2) {
            headerDom += `<th scope="col" class="fixed-side">${col}</th>`;
        } else {
            headerDom += `<th scope="col">${col}</th>`;
        }
    });
    let totalWeek = '';
    for (let i = 1; i <= 52; i++) {
        totalWeek += `<th scope="col">Wk${("0"+i).slice(-2)}</th>`;
    }
    let innerData = '';
    res.data.forEach((row) => {
        innerData += `
        <tr>
            <td class="hide">${row.ID}</td>
            <td class="fixed-side">${row.CRN_NO}</td>
            <td class="fixed-side">
                <button class="btn btn-danger" data-toggle="modal" data-target="#editModal" id="${row.ID}" onclick="updateData(this)">Edit</button>
            </td>
            <td>${row.PARAMETER}</td>
            <td>${row.TYPE}</td>
            <td>${row.MARKET}</td>
            <td>${row.CITY}</td>
            <td>${row.HEADEND}</td>
            <td>${row.MSOs}</td>
            <td>${row.CHANNEL}</td>
            <td>${row.Wk01}</td>
            <td>${row.Wk02}</td>
            <td>${row.Wk03}</td>
            <td>${row.Wk04}</td>
            <td>${row.Wk05}</td>
            <td>${row.Wk06}</td>
            <td>${row.Wk07}</td>
            <td>${row.Wk08}</td>
            <td>${row.Wk09}</td>
            <td>${row.Wk10}</td>
            <td>${row.Wk11}</td>
            <td>${row.Wk12}</td>
            <td>${row.Wk13}</td>
            <td>${row.Wk14}</td>
            <td>${row.Wk15}</td>
            <td>${row.Wk16}</td>
            <td>${row.Wk17}</td>
            <td>${row.Wk18}</td>
            <td>${row.Wk19}</td>
            <td>${row.Wk20}</td>
            <td>${row.Wk21}</td>
            <td>${row.Wk22}</td>
            <td>${row.Wk23}</td>
            <td>${row.Wk24}</td>
            <td>${row.Wk25}</td>
            <td>${row.Wk26}</td>
            <td>${row.Wk27}</td>
            <td>${row.Wk28}</td>
            <td>${row.Wk29}</td>
            <td>${row.Wk30}</td>
            <td>${row.Wk31}</td>
            <td>${row.Wk32}</td>
            <td>${row.Wk33}</td>
            <td>${row.Wk34}</td>
            <td>${row.Wk35}</td>
            <td>${row.Wk36}</td>
            <td>${row.Wk37}</td>
            <td>${row.Wk38}</td>
            <td>${row.Wk39}</td>
            <td>${row.Wk40}</td>
            <td>${row.Wk41}</td>
            <td>${row.Wk42}</td>
            <td>${row.Wk43}</td>
            <td>${row.Wk44}</td>
            <td>${row.Wk45}</td>
            <td>${row.Wk46}</td>
            <td>${row.Wk47}</td>
            <td>${row.Wk48}</td>
            <td>${row.Wk49}</td>
            <td>${row.Wk50}</td>
            <td>${row.Wk51}</td>
            <td>${row.Wk52}</td>
        </tr>`;
    });

    const template = `
        <table class="table table-responsive">
            <thead class="thead-dark">
                <tr>
                ${headerDom}
                ${totalWeek}
                </tr>
            </thead>
            <tbody>
                ${innerData}
            </tbody>
        </table>
    `;
    return template;
}

// weekly_carriage_graph
function weekly_carriage_graph(res) {
    const headerEl = ['ID', 'ACTION', 'WEEK', 'CARRIAGE VALUE', 'CARRIAGE LOSS', 'SUBSCRIBERS LOSS'];
    let headerDom = '';
    headerEl.forEach((col, index) => {
        if (index == 0) {
            headerDom += `<th scope="col" class="hide">${col}</th>`;
        } else if (index == 1) {
            headerDom += `<th scope="col" class="fixed-side">${col}</th>`;
        } else if (index == 2) {
            headerDom += `<th scope="col">${col}</th>`;
        } else {
            headerDom += `<th scope="col">${col}</th>`;
        }
    });
    let innerData = '';
    res.data.forEach((row) => {
        innerData += `
        <tr>
            <td class="hide">${row.ID}</td>
            <td class="fixed-side">
                <button class="btn btn-danger" data-toggle="modal" data-target="#editModal" id="${row.ID}" onclick="updateData(this)">Edit</button>
            </td>
            <td>${row.Week}</td>
            <td>${row.Carriage_Value}</td>
            <td>${row.Carriage_Loss}</td>
            <td>${row.Subscribers_Loss}</td>
        </tr>`;
    });

    const template = `
        <table class="table table-responsive">
            <thead class="thead-dark">
                <tr>
                ${headerDom}
                </tr>
            </thead>
            <tbody>
                ${innerData}
            </tbody>
        </table>
    `;
    return template;
}

// active_subs_data
function active_subs_data(res) {
    const headerEl = ['ID', 'CRN NO', 'ACTION', 'SUBS', 'TYPE', 'MARKET', 'CITY', 'HEADEND', 'MSO', 'CHANNEL'];
    let headerDom = '';
    headerEl.forEach((col, index) => {
        if (index == 0) {
            headerDom += `<th scope="col" class="hide">${col}</th>`;
        } else if (index == 1) {
            headerDom += `<th scope="col" class="fixed-side">${col}</th>`;
        } else if (index == 2) {
            headerDom += `<th scope="col" class="fixed-side">${col}</th>`;
        } else {
            headerDom += `<th scope="col">${col}</th>`;
        }
    });
    let totalWeek = '';
    for (let i = 1; i <= 52; i++) {
        totalWeek += `<th scope="col">Wk${("0"+i).slice(-2)}</th>`;
    }
    let innerData = '';
    res.data.forEach((row) => {
        innerData += `
        <tr>
            <td class="hide">${row.ID}</td>
            <td class="fixed-side">${row.CRN_NO}</td>
            <td class="fixed-side">
                <button class="btn btn-danger" data-toggle="modal" data-target="#editModal" id="${row.ID}" onclick="updateData(this)">Edit</button>
            </td>
            <td>${row.SUBS}</td>
            <td>${row.TYPE}</td>
            <td>${row.MARKET}</td>
            <td>${row.CITY}</td>
            <td>${row.HEADEND}</td>
            <td>${row.MSOs}</td>
            <td>${row.CHANNEL}</td>
            <td>${row.Wk01}</td>
            <td>${row.Wk02}</td>
            <td>${row.Wk03}</td>
            <td>${row.Wk04}</td>
            <td>${row.Wk05}</td>
            <td>${row.Wk06}</td>
            <td>${row.Wk07}</td>
            <td>${row.Wk08}</td>
            <td>${row.Wk09}</td>
            <td>${row.Wk10}</td>
            <td>${row.Wk11}</td>
            <td>${row.Wk12}</td>
            <td>${row.Wk13}</td>
            <td>${row.Wk14}</td>
            <td>${row.Wk15}</td>
            <td>${row.Wk16}</td>
            <td>${row.Wk17}</td>
            <td>${row.Wk18}</td>
            <td>${row.Wk19}</td>
            <td>${row.Wk20}</td>
            <td>${row.Wk21}</td>
            <td>${row.Wk22}</td>
            <td>${row.Wk23}</td>
            <td>${row.Wk24}</td>
            <td>${row.Wk25}</td>
            <td>${row.Wk26}</td>
            <td>${row.Wk27}</td>
            <td>${row.Wk28}</td>
            <td>${row.Wk29}</td>
            <td>${row.Wk30}</td>
            <td>${row.Wk31}</td>
            <td>${row.Wk32}</td>
            <td>${row.Wk33}</td>
            <td>${row.Wk34}</td>
            <td>${row.Wk35}</td>
            <td>${row.Wk36}</td>
            <td>${row.Wk37}</td>
            <td>${row.Wk38}</td>
            <td>${row.Wk39}</td>
            <td>${row.Wk40}</td>
            <td>${row.Wk41}</td>
            <td>${row.Wk42}</td>
            <td>${row.Wk43}</td>
            <td>${row.Wk44}</td>
            <td>${row.Wk45}</td>
            <td>${row.Wk46}</td>
            <td>${row.Wk47}</td>
            <td>${row.Wk48}</td>
            <td>${row.Wk49}</td>
            <td>${row.Wk50}</td>
            <td>${row.Wk51}</td>
            <td>${row.Wk52}</td>
        </tr>`;
    });

    const template = `
        <table class="table table-responsive">
            <thead class="thead-dark">
                <tr>
                ${headerDom}
                ${totalWeek}
                </tr>
            </thead>
            <tbody>
                ${innerData}
            </tbody>
        </table>
    `;
    return template;
}

// total_subs_data
function total_subs_data(res) {
    const headerEl = ['ID', 'CRN NO', 'ACTION', 'IMPACT', 'TYPE', 'MARKET', 'CITY', 'HEADEND', 'MSO', 'CHANNEL'];
    let headerDom = '';
    headerEl.forEach((col, index) => {
        if (index == 0) {
            headerDom += `<th scope="col" class="hide">${col}</th>`;
        } else if (index == 1) {
            headerDom += `<th scope="col" class="fixed-side">${col}</th>`;
        } else if (index == 2) {
            headerDom += `<th scope="col" class="fixed-side">${col}</th>`;
        } else {
            headerDom += `<th scope="col">${col}</th>`;
        }
    });
    let totalWeek = '';
    for (let i = 1; i <= 52; i++) {
        totalWeek += `<th scope="col">Wk${("0"+i).slice(-2)}</th>`;
    }
    let innerData = '';
    res.data.forEach((row) => {
        innerData += `
        <tr>
            <td class="hide">${row.ID}</td>
            <td class="fixed-side">${row.CRN_NO}</td>
            <td class="fixed-side">
                <button class="btn btn-danger" data-toggle="modal" data-target="#editModal" id="${row.ID}" onclick="updateData(this)">Edit</button>
            </td>
            <td>${row.IMPACT}</td>
            <td>${row.TYPE}</td>
            <td>${row.MARKET}</td>
            <td>${row.CITY}</td>
            <td>${row.HEADEND}</td>
            <td>${row.MSOs}</td>
            <td>${row.CHANNEL}</td>
            <td>${row.Wk01}</td>
            <td>${row.Wk02}</td>
            <td>${row.Wk03}</td>
            <td>${row.Wk04}</td>
            <td>${row.Wk05}</td>
            <td>${row.Wk06}</td>
            <td>${row.Wk07}</td>
            <td>${row.Wk08}</td>
            <td>${row.Wk09}</td>
            <td>${row.Wk10}</td>
            <td>${row.Wk11}</td>
            <td>${row.Wk12}</td>
            <td>${row.Wk13}</td>
            <td>${row.Wk14}</td>
            <td>${row.Wk15}</td>
            <td>${row.Wk16}</td>
            <td>${row.Wk17}</td>
            <td>${row.Wk18}</td>
            <td>${row.Wk19}</td>
            <td>${row.Wk20}</td>
            <td>${row.Wk21}</td>
            <td>${row.Wk22}</td>
            <td>${row.Wk23}</td>
            <td>${row.Wk24}</td>
            <td>${row.Wk25}</td>
            <td>${row.Wk26}</td>
            <td>${row.Wk27}</td>
            <td>${row.Wk28}</td>
            <td>${row.Wk29}</td>
            <td>${row.Wk30}</td>
            <td>${row.Wk31}</td>
            <td>${row.Wk32}</td>
            <td>${row.Wk33}</td>
            <td>${row.Wk34}</td>
            <td>${row.Wk35}</td>
            <td>${row.Wk36}</td>
            <td>${row.Wk37}</td>
            <td>${row.Wk38}</td>
            <td>${row.Wk39}</td>
            <td>${row.Wk40}</td>
            <td>${row.Wk41}</td>
            <td>${row.Wk42}</td>
            <td>${row.Wk43}</td>
            <td>${row.Wk44}</td>
            <td>${row.Wk45}</td>
            <td>${row.Wk46}</td>
            <td>${row.Wk47}</td>
            <td>${row.Wk48}</td>
            <td>${row.Wk49}</td>
            <td>${row.Wk50}</td>
            <td>${row.Wk51}</td>
            <td>${row.Wk52}</td>
        </tr>`;
    });

    const template = `
        <table class="table table-responsive">
            <thead class="thead-dark">
                <tr>
                ${headerDom}
                ${totalWeek}
                </tr>
            </thead>
            <tbody>
                ${innerData}
            </tbody>
        </table>
    `;
    return template;
}

// total_subs_graph
function total_subs_graph(res) {
    const headerEl = ['ID', 'ACTION', 'WEEK', 'SWITCHED ON', 'SWITCHED OFF', 'CHANNEL REACH'];
    let headerDom = '';
    headerEl.forEach((col, index) => {
        if (index == 0) {
            headerDom += `<th scope="col" class="hide">${col}</th>`;
        } else if (index == 1) {
            headerDom += `<th scope="col" class="fixed-side">${col}</th>`;
        } else if (index == 2) {
            headerDom += `<th scope="col">${col}</th>`;
        } else {
            headerDom += `<th scope="col">${col}</th>`;
        }
    });
    let innerData = '';
    res.data.forEach((row) => {
        innerData += `
        <tr>
            <td class="hide">${row.ID}</td>
            <td class="fixed-side">
                <button class="btn btn-danger" data-toggle="modal" data-target="#editModal" id="${row.ID}" onclick="updateData(this)">Edit</button>
            </td>
            <td>${row.Week}</td>
            <td>${row.Switched_On}</td>
            <td>${row.Switched_Off}</td>
            <td>${row.Channel_Reach}</td>
        </tr>`;
    });

    const template = `
        <table class="table table-responsive">
            <thead class="thead-dark">
                <tr>
                ${headerDom}
                </tr>
            </thead>
            <tbody>
                ${innerData}
            </tbody>
        </table>
    `;
    return template;
}