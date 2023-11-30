import React, { useState, useEffect } from "react";
import BoardView from "./BoardView";
import { app, database } from "../firebase";
import { get, ref, update, remove } from "firebase/database";
import "../styles/Content.css";

function Content() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo"
  });

  const fetchData = async () => {
    try {
      const snapshot = await get(ref(database, 'projects'));
      if (snapshot.exists()) {
        const projectsData = Object.values(snapshot.val());
        console.log('Projects loaded:', projectsData);
        setProjects(projectsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedProjectId]);

  const switchToTasksView = (projectId) => {
    console.log('Switching to tasks view for project ID:', projectId);
    setSelectedProjectId(projectId);
  };

  const handleEditProject = (projectId, newProjectName) => {
    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
        return {
          ...project,
          name: newProjectName
        };
      }
      return project;
    });
    updateFirebaseProjects(updatedProjects, projectId);
    setProjects(updatedProjects);
  };

  
  const handleAddProject = () => {
    if (!newProjectName) {
      console.error('El nombre del nuevo proyecto no puede estar vacío.');
      return;
    }

    const newProject = {
      id: Date.now(),
      name: newProjectName,
      tasks: []
    };

    const updatedProjects = [...projects, newProject];
    updateFirebaseProjects(updatedProjects, newProject.id);
    setProjects(updatedProjects);
    setNewProjectName('');
  };

  const handleEditTask = (editedTask) => {
    const updatedProjects = projects.map((project) => {
      if (project.id === selectedProjectId) {
        return {
          ...project,
          tasks: project.tasks.map((task) => (task.id === editedTask.id ? editedTask : task)),
        };
      }
      return project;
    });
    updateFirebaseProjects(updatedProjects, selectedProjectId);
    setProjects(updatedProjects);
  };

  const handleDeleteTask = (taskId) => {
    const updatedProjects = projects.map((project) => {
      if (project.id === selectedProjectId) {
        return {
          ...project,
          tasks: project.tasks.filter((task) => task.id !== taskId),
        };
      }
      return project;
    });
    updateFirebaseProjects(updatedProjects, selectedProjectId);
    setProjects(updatedProjects);
  };

  const handleDeleteAndFetch = async (projectId) => {
    await deleteFirebaseProject(projectId);
    fetchData();
  };

  const addTask = () => {
    if (selectedProjectId !== null) {
      const newTaskObject = {
        ...newTask,
        id: Date.now(),
        status: newTask.status,
      };

      const updatedProjects = projects.map((project) =>
        project.id === selectedProjectId
          ? {
              ...project,
              tasks: [...(project.tasks || []), newTaskObject],
            }
          : project
      );

      updateFirebaseProjects(updatedProjects, selectedProjectId);
      setProjects(updatedProjects);
      setNewTask({ title: "", description: "", status: "todo" });
    } else {
      console.error("No hay un proyecto seleccionado para agregar una tarea.");
    }
  };

  const updateFirebaseProjects = (updatedProjects, projectId) => {
    console.log("Updating project with ID:", projectId);

    try {
      const projectIndex = updatedProjects.findIndex(project => project.id === projectId);

      if (projectIndex !== -1) {
        const projectToUpdate = updatedProjects[projectIndex];
        update(ref(database, `projects/${projectId}`), projectToUpdate);
      } else {
        console.error("Project not found for update.");
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const deleteFirebaseProject = async (projectId) => {
    try {
      await remove(ref(database, `projects/${projectId}`));
      console.log(`Proyecto con ID ${projectId} eliminado de la base de datos.`);
    } catch (error) {
      console.error('Error deleting project from database:', error);
    }
  };

  const selectedProject = selectedProjectId ? projects.find((project) => project.id === selectedProjectId) : null;
  console.log('Projects:', projects);

  return (
    <div className="content">
      <div className="content-container">
        <h2>Proyectos</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.id} className="project-item">
              <input
                type="text"
                value={project.name}
                onChange={(e) => handleEditProject(project.id, e.target.value)}
              />
              <button onClick={() => handleDeleteAndFetch(project.id)}>Eliminar</button>
              <button onClick={() => switchToTasksView(project.id)}>Ver tareas</button>
            </li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Nuevo proyecto"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          className="new-project-input"
        />
        <button onClick={handleAddProject} className="add-project-button">
          Añadir Proyecto
        </button>
        <h2>Tareas</h2>
        {selectedProject && (
          <div>
            <div>
              <h3>Por hacer</h3>
              <BoardView
                tasks={(selectedProject && selectedProject.tasks) ? selectedProject.tasks : []}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Título de la tarea"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="task-title-input"
              />
              <textarea
                placeholder="Descripción de la tarea"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="task-description-textarea"
              />
              <select
                className="task-status-select"
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              >
                <option value="todo">Por hacer</option>
                <option value="in-progress">En proceso</option>
                <option value="done">Hecho</option>
              </select>
              <button onClick={addTask} className="add-task-button">
                Añadir Tarea
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Content;
