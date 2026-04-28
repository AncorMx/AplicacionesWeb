/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package com.mycompany.tasksapi.resources.controllers;

import com.google.gson.Gson;
import com.mycompany.tasksapi.resources.services.TaskService;
import com.mycompany.tasksapi.restapi.models.Task;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;

/**
 *
 * @author martinbl
 */
@WebServlet(name = "TaskController", urlPatterns = {"/api/task"})
public class TaskController extends HttpServlet {
private TaskService taskService;
    private Gson gson;
    
    @Override
    public void init() throws ServletException {
        // Se inicializan una sola vez cuando arranca el servidor
        this.taskService = new TaskService();
        this.gson = new Gson();
    }
    
    // CORS: Permitir que tu frontend (si está en otro puerto) se comunique con este backend
    private void setAccessControlHeaders(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "*"); // En producción, cambiar "*" por la URL de tu frontend
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setAccessControlHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }
    
    // ---------------------------------------------------------
    // GET: Obtener lista de tareas
    // ---------------------------------------------------------
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setAccessControlHeaders(resp);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        List<Task> tasks = taskService.getAllTasks();
        String jsonResponse = gson.toJson(tasks);
        
        resp.getWriter().write(jsonResponse);
    }

    // ---------------------------------------------------------
    // POST: Crear una nueva tarea
    // ---------------------------------------------------------
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setAccessControlHeaders(resp);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        try {
            Task incomingTask = gson.fromJson(req.getReader(), Task.class);
            
            Task createdTask = taskService.createTask(incomingTask);
            
            resp.setStatus(HttpServletResponse.SC_CREATED); 
            resp.getWriter().write(gson.toJson(createdTask));

        } catch (IllegalArgumentException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"error\": \"Ocurrió un error inesperado.\"}");
        }
    }

    // ---------------------------------------------------------
    // PUT: Actualizar una tarea (Editar texto o marcar completado)
    // ---------------------------------------------------------
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setAccessControlHeaders(resp);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        try {
            Task taskToUpdate = gson.fromJson(req.getReader(), Task.class);
            Task updatedTask = taskService.updateTask(taskToUpdate);
            
            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getWriter().write(gson.toJson(updatedTask));

        } catch (IllegalArgumentException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // ---------------------------------------------------------
    // DELETE: Eliminar una tarea por ID
    // ---------------------------------------------------------
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setAccessControlHeaders(resp);
        
        try {
            String idParam = req.getParameter("id");
            if (idParam == null) {
                throw new IllegalArgumentException("Falta el parámetro ID.");
            }
            
            Long id = Long.parseLong(idParam);
            taskService.deleteTask(id);
            
            resp.setStatus(HttpServletResponse.SC_NO_CONTENT); 
            
        } catch (IllegalArgumentException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\": \"ID inválido o no proporcionado.\"}");
        }
    }
}
