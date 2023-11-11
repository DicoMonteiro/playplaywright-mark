import { expect, Locator, Page } from '@playwright/test'
import { TaskModel } from '../../../fixtures/task.model'

export class TasksPage {
    readonly page: Page
    readonly inputTaskName: Locator

    constructor(page: Page) {
        this.page = page
        this.inputTaskName = page.locator('input[class*="InputNewTask"]')
    }

    async go() {
        await this.page.goto('/')
    }

    async createTask(task: TaskModel) {
        await this.inputTaskName.fill(task.name)
        await this.page.click('css=button >> text=Create')
    }

    async updateOrDeleteTask(task: TaskModel, text: string) {
        const target = this.page.locator(`//p[text()="${task.name}"]/../button[contains(@class, "${text}")]`)
        await target.click()
    }

    async validateTaskCreated(task: TaskModel) {
        const target = this.page.getByTestId('task-list').getByTestId('task-item').getByText(task.name)
        await expect(target).toBeVisible();
    }
    
    async validateAlertMessage(msg: string) {
        const target = this.page.locator('.swal2-html-container')
        await expect(target).toHaveText(msg)
    }

    async validateRequiredField(msg: string){
        const validationMessage = await this.inputTaskName.evaluate(e => (e as HTMLInputElement).validationMessage)
        await expect(validationMessage).toEqual(msg)
    }

    async validateTaskDone(task: TaskModel) {
        const target = this.page.getByText(task.name)
        await expect(target).toHaveCSS('text-decoration-line', 'line-through')
    }

    async validateTaskDeleted(task: TaskModel) {
        const target = this.page.getByTestId('task-list').getByTestId('task-item').getByText(task.name)
        await expect(target).not.toBeVisible()
    } 
}