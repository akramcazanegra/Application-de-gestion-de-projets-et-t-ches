import React, { useState, useEffect } from 'react';
import { projectService } from './services/projectService';
import taskService from './services/taskService';
import { quoteService } from './services/quoteService';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quote, setQuote] = useState({ text: 'Loading motivation...', author: '' });
  const [taskFormData, setTaskFormData] = useState({ title: '', description: '', priority: 'MEDIUM', status: 'TODO', deadline: '' });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  useEffect(() => {
    loadProjects();
    fetchDailyQuote();
  }, []);

  const fetchDailyQuote = async () => {
    const data = await quoteService.getRandomQuote();
    setQuote(data);
  };

  const loadProjects = async () => {
    const res = await projectService.getProjects();
    setProjects(res.data);
  };

  const handleViewTasks = async (project) => {
    const res = await taskService.getTasksByProject(project.id);
    setTasks(res.data);
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const resetTaskForm = () => {
    setTaskFormData({ title: '', description: '', priority: 'MEDIUM', status: 'TODO', deadline: '' });
    setEditingTaskId(null);
  };

  const handleCreateOrUpdateTask = async (e) => {
    e.preventDefault();
    if (editingTaskId) {
      await taskService.updateTask(editingTaskId, { ...taskFormData, project: selectedProject.id });
    } else {
      await taskService.createTask({ ...taskFormData, project: selectedProject.id });
    }
    resetTaskForm();
    handleViewTasks(selectedProject);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Delete this task?")) {
      await taskService.deleteTask(taskId);
      handleViewTasks(selectedProject);
    }
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setTaskFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      deadline: task.deadline ? task.deadline.split('T')[0] : ''
    });
  };

  const getPriorityStyle = (p) => ({
    padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold',
    backgroundColor: p === 'HIGH' ? 'rgba(239, 68, 68, 0.1)' : p === 'MEDIUM' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
    color: p === 'HIGH' ? '#f87171' : p === 'MEDIUM' ? '#fbbf24' : '#34d399',
    border: `1px solid ${p === 'HIGH' ? '#ef4444' : p === 'MEDIUM' ? '#f59e0b' : '#10b981'}`
  });

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Karizma Manager 🚀</h1>
        <p style={styles.subtitle}>Your Digital Project Workspace</p>
        <div style={styles.quoteBox}>
           <p style={styles.quoteText}>"{quote.text}"</p>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px'}}>
              <span style={styles.quoteAuthor}>— {quote.author}</span>
              <button onClick={fetchDailyQuote} style={styles.refreshBtn}>🔄 Refresh Energy</button>
           </div>
        </div>
      </header>

      <div style={styles.mainContent}>
        <aside style={styles.sidebar}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>{editingId ? "✨ Edit Project" : "➕ New Project"}</h3>
            <form onSubmit={async (e) => {
                e.preventDefault();
                if (editingId) await projectService.updateProject(editingId, formData);
                else await projectService.createProject(formData);
                setFormData({ name: '', description: '' });
                setEditingId(null);
                loadProjects();
              }}>
              <input type="text" placeholder="Project Name" style={styles.input} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              <textarea placeholder="Description..." style={{ ...styles.input, marginTop: '15px', minHeight: '100px' }} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
              <button type="submit" style={styles.submitBtn}>{editingId ? "Update" : "Launch"}</button>
            </form>
          </div>
        </aside>

        <section style={styles.content}>
          <div style={styles.grid}>
            {projects.map((project) => (
              <div key={project.id} style={styles.projectCard}>
                <div style={styles.projectHeader}>
                   <h4 style={styles.projectName}>{project.name}</h4>
                   <div style={styles.ownerFullBadge}>👤 {project.user || 'User'}</div>
                </div>
                <p style={styles.projectDesc}>{project.description}</p>
                <div style={styles.buttonGroup}>
                  <button onClick={() => { setEditingId(project.id); setFormData({ name: project.name, description: project.description }); }} style={styles.editBtn}>Edit</button>
                  <button onClick={async () => { if (window.confirm("Delete?")) { await projectService.deleteProject(project.id); loadProjects(); } }} style={styles.deleteBtn}>Delete</button>
                </div>
                <button onClick={() => handleViewTasks(project)} style={styles.tasksBtn}>Manage Tasks 📋</button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{color: '#fff'}}>Project: <span style={{color: '#6366f1'}}>{selectedProject?.name}</span></h3>
              <button onClick={() => { setIsModalOpen(false); resetTaskForm(); }} style={styles.closeBtn}>&times;</button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <select style={styles.input} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
              <select style={styles.input} value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                <option value="">All Priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div style={styles.tasksList}>
              {tasks
                .filter((task) => (filterStatus ? task.status === filterStatus : true) && (filterPriority ? task.priority === filterPriority : true))
                .map((task) => (
                  <div key={task.id} style={styles.taskItem}>
                    <div style={{flex: 1}}>
                      <strong style={{color: '#fff'}}>{task.title}</strong>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0' }}>{task.description}</p>
                      <div style={{fontSize: '11px', color: '#6366f1'}}>
                         <span>📅 Due: {task.deadline || "No date"}</span>
                         <span style={{marginLeft: '10px', color: '#10b981'}}>● {task.status}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={getPriorityStyle(task.priority)}>{task.priority}</span>
                      <button onClick={() => handleEditTask(task)} style={styles.iconBtn}>✏️</button>
                      <button onClick={() => handleDeleteTask(task.id)} style={styles.iconBtn}>❌</button>
                    </div>
                  </div>
                ))}
            </div>

            <div style={styles.addTaskSection}>
              <h4 style={{color: '#fff', marginBottom: '20px'}}>{editingTaskId ? "Edit Task" : "Add New Task"}</h4>
              <form onSubmit={handleCreateOrUpdateTask} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                  type="text" 
                  placeholder="Task Title" 
                  style={styles.modalInput} 
                  value={taskFormData.title} 
                  onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })} 
                  required 
                />
                <textarea 
                  placeholder="Task Description" 
                  style={{ ...styles.modalInput, minHeight: '80px' }} 
                  value={taskFormData.description} 
                  onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })} 
                  required 
                />
                
                <div style={styles.formField}>
                  <label style={styles.label}>📅 Deadline</label>
                  <input type="date" style={styles.modalInput} value={taskFormData.deadline} onChange={(e) => setTaskFormData({ ...taskFormData, deadline: e.target.value })} />
                </div>

                <div style={styles.formField}>
                  <label style={styles.label}>⚡ Priority</label>
                  <select style={styles.modalInput} value={taskFormData.priority} onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div style={styles.formField}>
                  <label style={styles.label}>🔄 Status</label>
                  <select style={styles.modalInput} value={taskFormData.status} onChange={(e) => setTaskFormData({ ...taskFormData, status: e.target.value })}>
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>

                <button type="submit" style={styles.addTaskBtn}>{editingTaskId ? "Save Changes" : "Confirm Task"}</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#0f172a', minHeight: '100vh', padding: '40px', paddingTop: '100px', fontFamily: "'Inter', sans-serif", color: '#fff' },
  header: { textAlign: 'center', marginBottom: '40px' },
  title: { fontSize: '2.8rem', fontWeight: '800', marginBottom: '8px', background: 'linear-gradient(to right, #6366f1, #ffffff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { color: '#94a3b8', fontSize: '1.1rem', letterSpacing: '1px' },
  quoteBox: { background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', padding: '20px 30px', borderRadius: '20px', maxWidth: '800px', margin: '30px auto 0 auto', border: '1px solid rgba(255, 255, 255, 0.08)' },
  quoteText: { fontStyle: 'italic', color: '#e2e8f0', fontSize: '1.1rem', margin: 0 },
  quoteAuthor: { color: '#6366f1', fontSize: '0.9rem', fontWeight: '700' },
  refreshBtn: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '12px' },
  mainContent: { display: 'flex', gap: '30px', maxWidth: '1400px', margin: '0 auto' },
  sidebar: { flex: '0 0 350px' },
  content: { flex: '1' },
  card: { background: 'rgba(255, 255, 255, 0.03)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.08)', position: 'sticky', top: '110px' },
  cardTitle: { color: '#fff', marginBottom: '20px', fontSize: '1.4rem' },
  input: { width: '100%', padding: '10px 14px', borderRadius: '12px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', color: '#fff', fontSize: '14px', boxSizing: 'border-box' },
  
  // Hadu homa l-styles l-jded bach t-gadd l-UI
  modalInput: { 
    width: '100%', 
    padding: '12px 15px', 
    borderRadius: '12px', 
    backgroundColor: 'rgba(15, 23, 42, 0.8)', 
    border: '1px solid #334155', 
    color: '#fff', 
    fontSize: '14px',
    boxSizing: 'border-box' // Hadu darouri bach may-khrjch 3la l-jnab
  },
  formField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%'
  },
  label: { fontSize: '12px', color: '#94a3b8', fontWeight: '600', marginLeft: '4px' },
  
  submitBtn: { width: '100%', marginTop: '20px', padding: '14px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' },
  projectCard: { background: 'rgba(255, 255, 255, 0.03)', padding: '25px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.08)' },
  projectHeader: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' },
  projectName: { fontSize: '1.4rem', fontWeight: '700', margin: 0, color: '#fff' },
  ownerFullBadge: { fontSize: '12px', color: '#6366f1', background: 'rgba(99, 102, 241, 0.1)', padding: '4px 10px', borderRadius: '6px', alignSelf: 'flex-start', border: '1px solid rgba(99, 102, 241, 0.2)' },
  projectDesc: { color: '#94a3b8', fontSize: '0.95rem', minHeight: '50px', lineHeight: '1.5' },
  buttonGroup: { display: 'flex', gap: '10px', marginTop: '20px' },
  editBtn: { flex: 1, padding: '10px', background: 'rgba(99, 102, 241, 0.1)', color: '#a5b4fc', border: 'none', borderRadius: '10px' },
  deleteBtn: { flex: 1, padding: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: 'none', borderRadius: '10px' },
  tasksBtn: { width: '100%', marginTop: '15px', padding: '14px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
  modalContent: { background: '#1e293b', padding: '30px', borderRadius: '30px', width: '600px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  closeBtn: { fontSize: '32px', border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' },
  tasksList: { marginBottom: '20px' },
  taskItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', marginBottom: '10px', border: '1px solid rgba(255,255,255,0.05)' },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' },
  addTaskSection: { marginTop: '30px', padding: '25px', background: 'rgba(0,0,0,0.2)', borderRadius: '20px' },
  addTaskBtn: { width: '100%', marginTop: '10px', padding: '14px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }
};

export default Dashboard;