/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.tasksapi.resources.services;

import com.mycompany.tasksapi.restapi.daos.TaskDAO;
import com.mycompany.tasksapi.restapi.models.Task;
import java.util.List;

/**
 *
 * @author martinbl
 */
public class TaskService {
    private TaskDAO taskDAO;

    public TaskService() {
        this.taskDAO = new TaskDAO();
    }

    public List<Task> getAllTasks() {
        return taskDAO.findAll();
    }

    public Task createTask(Task task) {
        if (task.getText() == null || task.getText().trim().isEmpty()) {
            throw new IllegalArgumentException("El título de la tarea no puede estar vacío.");
        }
        
        if (task.getText().length() > 255) {
            throw new IllegalArgumentException("El título no puede exceder los 255 caracteres.");
        }

        task.setCompleted(false);

        return taskDAO.save(task);
    }

    public Task updateTask(Task task) {
        if (task.getId() == null) {
            throw new IllegalArgumentException("Se requiere el ID para actualizar una tarea.");
        }
        if (task.getText() == null || task.getText().trim().isEmpty()) {
            throw new IllegalArgumentException("El texto modificado no puede estar vacío.");
        }
        
        taskDAO.update(task);
        
        return task;
    }

    public void deleteTask(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID de tarea inválido.");
        }
        taskDAO.delete(id);
    }
}
