const inquirer = require("inquirer");
const dbApi = require("./dbApi.js")

module.exports.add = function (data) {
    dbApi.get().then((response) => {
        let temp = data.map((v) => {
            return {'taskName': v, 'isDone': false}
        })
        let result = response.concat(temp)
        dbApi.write(JSON.stringify(result)).catch(err => console.log(err));
    }).catch((err) => {
        console.log('here');
        console.log(err);
        dbApi.write('[]').catch((err) => {
            console.log(err);
        })
    })
}
module.exports.clear = function () {
    dbApi.write('[]').catch((err) => {
        console.log(err);
    })
}

function showList(data) {
    return inquirer
        .prompt([
            {
                type: 'list',
                message: '你要操作哪一项?',
                name: 'uuu',
                choices: [
                    {'name': "添加任务", 'value': '-2'},
                    ...data.map((v, k) => {
                        let taskName = v.isDone ? `√ ${v.taskName}` : `_ ${v.taskName}`
                        return {'name': taskName, 'value': k}
                    }), {'name': "退出", 'value': '-1'}
                ]
            }
        ])
}

function askChangeName(name) {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'changeTaskName',
            message: `新的任务名字(\x1b[31m${name}\x1b[0m):`,
        }
    ])
}

function askNameAdd() {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'addTaskName',
            message: "新的任务名字:"
        }
    ])
}

function showListAction(temp, id) {
    let action = {'更改任务名称': '2', '已完成': '1', '未完成': '0', '删除此任务': '3', '退出': '-1', '添加任务': '-2'}
    inquirer
        .prompt([
            {
                type: 'list',
                message: temp[id['uuu']].taskName,
                name: 'actionName',
                choices: Object.keys(action)
            }
        ]).then(async ({actionName}) => {
        if (action[actionName] === '2') {
            let Name = await askChangeName(temp[id['uuu']].taskName)
            temp[id['uuu']].taskName = Name['changeTaskName']
        } else if (action[actionName] === '1') {
            temp[id['uuu']].isDone = true
        } else if (action[actionName] === '0') {
            temp[id['uuu']].isDone = false
        } else if (action[actionName] === '3') {
            temp.splice(id['uuu'], 1)
        }
        void await dbApi.write(JSON.stringify(temp))
    })
}

module.exports.showAll = async function () {
    let temp = await dbApi.get().catch(async () => {
        await dbApi.write('[]')
    })
    if (!temp) {
        temp = await dbApi.get()
    }
    let id = await showList(temp);
    if (id['uuu'] === '-2') {
        let {addTaskName} = await askNameAdd()
        this.add([addTaskName])
        return
    }else if (id['uuu'] === '-1'){
        return
    }
    showListAction(temp, id)
}