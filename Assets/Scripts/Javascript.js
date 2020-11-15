
// // выбрал такую организацию данных, но в дальнейшем понял что не лучший вариант. Для связи данных из массива и строк в таблице,
//  осуществил привязку через назначение индекса каждому обьекту в массиве, взависимости от вкладки. Переназначение индекса происходит каждый раз перед отрисовкой.


let taskMass = [];
let doneMass = [];
let removedMass = [];

if (localStorage.getItem('TaskMass')) {
    taskMass = JSON.parse(localStorage.getItem('TaskMass'));
}

if (localStorage.getItem('doneMass')) {
    doneMass = JSON.parse(localStorage.getItem('doneMass'));
}

if (localStorage.getItem('removedMass')) {
    removedMass = JSON.parse(localStorage.getItem('removedMass'));
}

function validate() {
    let $inputs = document.querySelectorAll('.input');

    function clearForm() {
        let $inputs = document.querySelectorAll('.input');

        $inputs.forEach($input => {
            $input.classList.remove('error_red');
            if ($input.type != "radio") $input.value = "";
        });
    }

    function checkForm() {
        let error = false;
        $inputs.forEach($input => {
            $input.classList.remove('error_red');
            if (!$input.value) {
                error = true;
                $input.classList.add('error_red');
            }
        })
        if (!error) {
            getOk()
        }
    }

    function getOk() {
        $('#exampleModal').modal('hide');
        let user = {};
        $inputs.forEach($input => {
            if ($input.checked || $input.classList.contains('text')) {
                user[$input.dataset.type] = $input.value;
            }
        });
        user.type = "act";
        taskMass.push(user);
        taskMass = sortTable.creatIndex(taskMass);
        localStorage.setItem('TaskMass', JSON.stringify(taskMass));
        table.drowTask(taskMass);
        clearForm();
    }
    return {
        clearForm,
        checkForm
    }
}

const modul = validate();

const sortTableData = () => {

    // создание нумерации в обьектах согласно строчной нумерации, возвращает новый массив
    const creatIndex = (mass) => mass.map((item, index) => ({ ...item, index: index + 1 }));

    // поиск обьекта в массиве, возвращает обьект
    const findIndex = (mass, targetIndex) => mass[parseInt(targetIndex()) - 1];

    // добавляет элемент в выбранный массив
    const addElemInMass = (mass, elem) => mass.push(elem);

    // удаление обьекта из массива по индексу, возвращает новый массив
    const removeIndex = (mass, ind) => mass.reduce((acc, item, index) => item.index === parseInt(ind()) ? acc : [...acc, item], []);

    return {
        creatIndex,
        findIndex,
        addElemInMass,
        removeIndex
    }
}
const sortTable = sortTableData();


// отрисовка таблицы
function drowTable() {

    const drowTask = (mass) => {
        let $table = document.querySelector(".act");
        $table.innerHTML = "";
        if (mass.length) {
            mass.forEach((item, index) => {
                $table.innerHTML += `<tr>
        <th scope="row">${index + 1}</th>
        <td class=${item.priority === "Not Urgent" ? "edit_notUrgent__yellow" : item.priority === "Urgent" ? "edit_urgent__red" : ""}>${item.name}</td>
        <td class=${item.priority === "Not Urgent" ? "edit_notUrgent__yellow" : item.priority === "Urgent" ? "edit_urgent__red" : ""}>${item.description}</td>
        <td class='icon_table'>
            <div class="block_icon">
                <div><i data-action="done" class="fas fa-check-circle"></i></div>
                <div><i data-action="editeTask" class="fas fa-edit"></i></div>
                <div><i data-action="priority" class="fas fa-star"></i></div>
                <div><i data-action="removeTask" class="fas fa-trash-alt"></i></div>
            </div>
        </td>
    </tr > `;
            })
        }
        localStorage.setItem("TaskMass", JSON.stringify(taskMass))
    }

    const drowDone = (mass) => {
        let $table = document.querySelector(".done");
        $table.innerHTML = "";

        mass.forEach((item, index) => {
            $table.innerHTML += `<tr>
        <th scope="row">${index + 1}</th>
        <td>${item.name}</td>
        <td>${item.description}</td>
        <td class='icon_table'>
            <div class="block_icon">
                <div><i data-action="editeDone" class="fas fa-edit"></i></div>
                <div><i data-action="removeDone" class="fas fa-trash-alt"></i></div>
            </div>
        </td>
    </tr > `;
        })
        localStorage.setItem('doneMass', JSON.stringify(doneMass));
    }

    const drowRemove = (mass) => {
        let $table = document.querySelector(".remove");
        $table.innerHTML = "";

        mass.forEach((item, index) => {
            $table.innerHTML += `<tr>
        <th scope="row">${index + 1}</th>
        <td>${item.name}</td>
        <td>${item.description}</td>
        <td class='icon_table'>
            <div class="block_icon">
                <div><i data-action="renew"class="fas fa-arrow-left"></i></div>
                <div><i data-action="del" class="fas fa-trash-alt"></i></div>
            </div>
        </td>
    </tr > `;
        })
        localStorage.setItem('removedMass', JSON.stringify(removedMass));
    }

    return {
        drowTask,
        drowDone,
        drowRemove,
    }
}

const table = drowTable();
table.drowTask(taskMass);
table.drowDone(doneMass);
table.drowRemove(removedMass);

document.addEventListener('click', function (e) {
    // данные в виде функций из DOM, для поиска и связи DOM элементов с масссивами данных. Почему функции? Хотел вначале попробовать сделать чистыми функциями, все декларативно.
    const indexTrTable = () => e.target.closest('tr').cells[0].innerHTML;
    const trNameValue = () => e.target.closest('tr').cells[1].innerHTML;
    const trDescriptionValue = () => e.target.closest('tr').cells[2].innerHTML;
    const tdNameDes = () => {
        const [, tdName, tdDescription] = [...e.target.closest('tr').children].slice(0, 3);
        return [tdName, tdDescription]
    };
    // функция для изменения приоритета. Изменяется цвет приоритета строки
    const changePriority = () => {
        taskMass = taskMass.map((item, index) => {
            if (item.index === +indexTrTable()) {
                switch (item.priority) {
                    case "Urgent":
                        return ({ ...item, priority: "Not Urgent" });
                        break;
                    case "Not Urgent":
                        return ({ ...item, priority: "Not Important" });
                        break;
                    case "Not Important":
                        return ({ ...item, priority: "Urgent" });
                        break;
                }
            } else return item;
        })
    }
    // для редактирования добавляю атрибут contentEditable В DOM элемент ячейки
    const editTdTable = mass => {
        e.target.classList.toggle('color_icon');
        tdNameDes().forEach(item => {
            item.setAttribute('contentEditable', true);
            item.classList.toggle('edit');
            tdNameDes()[0].focus();
        });
    }
    // функция для сохранения изменений в ячейке. Удаляем атрибут contentEditable в DOM элементах, сохраняем изменения значений в массиве данных, и 
    // сохраняем в локально. Switch использовал для привязки массива соответсвующей вкладк

    const saveEditTable = mass => {
        if (!tdNameDes()[0].classList.contains('edit')) {
            tdNameDes().forEach(item => item.removeAttribute('contentEditable'));
            const replaceValue = mass => mass.reduce((acc, item) => (item.index === +indexTrTable()) ? [...acc, ({ ...item, name: trNameValue(), description: trDescriptionValue() })] : [...acc, item], [])

            switch (mass) {
                case taskMass:
                    taskMass = replaceValue(mass);
                    localStorage.setItem("TaskMass", JSON.stringify(taskMass));
                    break;

                case doneMass:
                    doneMass = replaceValue(mass);
                    localStorage.setItem('doneMass', JSON.stringify(doneMass));
                    break;
            }
        }
    }

    if (e.target.dataset.close) {
        modul.clearForm()
    }

    if (e.target.classList.contains('btn_addClose')) {
        modul.checkForm();
    }

    const { action } = e.target.dataset;

    if (action === "done") {
        let objDone = sortTable.findIndex(taskMass, indexTrTable);
        sortTable.addElemInMass(doneMass, objDone);
        taskMass = sortTable.removeIndex(taskMass, indexTrTable);
        taskMass = sortTable.creatIndex(taskMass);
        table.drowTask(taskMass);
        doneMass = sortTable.creatIndex(doneMass);
        table.drowDone(doneMass);
    }

    if (action === "removeTask") {
        let objTaskRemove = sortTable.findIndex(taskMass, indexTrTable);
        sortTable.addElemInMass(removedMass, objTaskRemove);
        taskMass = sortTable.removeIndex(taskMass, indexTrTable);
        taskMass = sortTable.creatIndex(taskMass);
        table.drowTask(taskMass);
        removedMass = sortTable.creatIndex(removedMass);
        table.drowRemove(removedMass);
    }

    if (action === "removeDone") {
        let objDoneRemove = sortTable.findIndex(doneMass, indexTrTable);
        sortTable.addElemInMass(removedMass, objDoneRemove);
        doneMass = sortTable.removeIndex(doneMass, indexTrTable);
        doneMass = sortTable.creatIndex(doneMass);
        table.drowDone(doneMass);
        removedMass = sortTable.creatIndex(removedMass);
        table.drowRemove(removedMass);
    }

    if (action === "del") {
        removedMass = sortTable.removeIndex(removedMass, indexTrTable);
        removedMass = sortTable.creatIndex(removedMass);
        table.drowRemove(removedMass);
    }

    if (action === "renew") {
        let objDel = sortTable.findIndex(removedMass, indexTrTable);
        sortTable.addElemInMass(doneMass, objDel);
        removedMass = sortTable.removeIndex(removedMass, indexTrTable);
        removedMass = sortTable.creatIndex(removedMass);
        table.drowRemove(removedMass);
        doneMass = sortTable.creatIndex(doneMass);
        table.drowDone(doneMass);
    }

    if (action === "editeTask") {
        editTdTable(taskMass);
        saveEditTable(taskMass)
    }

    if (action === "editeDone") {
        editTdTable(doneMass);
        saveEditTable(doneMass)
    }

    if (action === "priority") {
        changePriority();
        table.drowTask(taskMass);
    }
}
);
