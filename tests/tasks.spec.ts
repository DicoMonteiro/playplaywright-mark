import { test } from '@playwright/test'
import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, createNewTaskByHelper } from './support/helpers'
import { TasksPage } from './support/pages/tasks'
import dataTests from './fixtures/tasks.json'


let tasksPage: TasksPage

test.beforeEach(( {page} ) => {
    tasksPage = new TasksPage(page)
})

test.describe('cadastro', () => {

    test('deve poder cadastrar uma nova tarefa', async ( { request }) => {

        // Dado que eu tenho uma nova tarefa
        const task = dataTests.success as TaskModel
      
        await deleteTaskByHelper(request, task.name)
    
        // E que estou na página de cadastro
        await tasksPage.go()
        
        // Quando solicito cadastrar a nova tarefa
        await tasksPage.createTask(task)
    
        // Então vejo a tarefa na lista
        await tasksPage.validateTaskCreated(task)
    })
    
    test('não deve permitir tarefa duplicada', async ({ request }) => {
    
        // Dado que eu já tenho uma tarefa cadastrada
        const task = dataTests.duplicate as TaskModel
    
        await deleteTaskByHelper(request, task.name)
        await createNewTaskByHelper(request, task)
    
        // E que estou na página de cadastro
        await tasksPage.go()
        
        // Quando solicito cadastrar a mesma tarefa
        await tasksPage.createTask(task)
    
        // Então vejo uma mensagem de alerta sobre a tarefa já cadastrada
        await tasksPage.validateAlertMessage('Task already exists!')
    })
    
    test('campo obrigatório', async () => {
    
        const task = dataTests.required as TaskModel
    
        // Dado que eu estou na página de cadastro
        await tasksPage.go()
        
        // Quando solicito cadastrar sem informar a tarefa
        await tasksPage.createTask(task)
    
        // Então vejo uma mensagem de alerta de obrigatoriedade
        await tasksPage.validateRequiredField('This is a required field')
    })
})

test.describe('atualização', () => {

    test('deve concluir uma tarefa', async ( { request }) => {

        // Dado que eu tenho uma tarefa cadastrada
        const task = dataTests.update as TaskModel
      
        await deleteTaskByHelper(request, task.name)
        await createNewTaskByHelper(request, task)
    
        // E que estou na página de cadastro
        await tasksPage.go()
        
        // Quando solicito alterar a tarefa
        await tasksPage.updateOrDeleteTask(task, "Toggle")
    
        // Então vejo a tarefa concluida na lista
        await tasksPage.validateTaskDone(task)
    })
})

test.describe('exclusão', () => {
    test('deve excluir uma tarefa', async ( { request }) => {

        // Dado que eu tenho uma tarefa cadastrada
        const task = dataTests.delete as TaskModel
      
        await deleteTaskByHelper(request, task.name)
        await createNewTaskByHelper(request, task)
    
        // E que estou na página de cadastro
        await tasksPage.go()
        
        // Quando solicito excluir a tarefa
        await tasksPage.updateOrDeleteTask(task, "Delete")
    
        // Então vejo a tarefa concluida na lista
        await tasksPage.validateTaskDeleted(task)
    })
})