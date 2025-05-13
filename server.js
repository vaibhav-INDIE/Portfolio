const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine upload directory based on route
    const uploadDir = req.path.includes('projects') 
      ? 'public/uploads/projects' 
      : 'public/uploads/updates';
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// File paths
const updatesFilePath = path.join(__dirname, 'data', 'updates.json');
const projectsFilePath = path.join(__dirname, 'data', 'projects.json');

// Helper function to ensure directories exist
async function ensureDirectories() {
  const dirs = [
    path.join(__dirname, 'data'),
    path.join(__dirname, 'public/uploads/projects'),
    path.join(__dirname, 'public/uploads/updates')
  ];
  
  for (const dir of dirs) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }
}

// Helper function to ensure file exists with default structure
async function ensureFile(filePath) {
  try {
    await fs.access(filePath);
  } catch {
    const defaultData = filePath.includes('updates.json') 
      ? { updates: [] } 
      : { projects: [] };
    await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2));
  }
}

// Helper function to read JSON file
async function readJsonFile(filePath) {
  try {
    await ensureDirectories();
    await ensureFile(filePath);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return filePath.includes('updates.json') 
      ? { updates: [] } 
      : { projects: [] };
  }
}

// Helper function to write JSON file
async function writeJsonFile(filePath, data) {
  try {
    await ensureDirectories();
    const validData = filePath.includes('updates.json')
      ? { updates: Array.isArray(data.updates) ? data.updates : [] }
      : { projects: Array.isArray(data.projects) ? data.projects : [] };
    await fs.writeFile(filePath, JSON.stringify(validData, null, 2));
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    throw error;
  }
}

// Helper function to delete file if exists
async function deleteFileIfExists(filePath) {
  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
  } catch {
    // File doesn't exist, ignore
  }
}

// Updates API Routes

// Upload image for update
app.post('/api/updates/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ 
    imageUrl: `/uploads/updates/${req.file.filename}` 
  });
});

// Get all updates
app.get('/api/updates', async (req, res) => {
  try {
    const data = await readJsonFile(updatesFilePath);
    res.json(data.updates || []);
  } catch (error) {
    console.error('Error reading updates:', error);
    res.status(500).json({ error: 'Failed to read updates' });
  }
});

// Get single update
app.get('/api/updates/:id', async (req, res) => {
  try {
    const data = await readJsonFile(updatesFilePath);
    const update = data.updates.find(u => u.id === req.params.id);
    
    if (!update) {
      return res.status(404).json({ error: 'Update not found' });
    }
    
    res.json(update);
  } catch (error) {
    console.error('Error reading update:', error);
    res.status(500).json({ error: 'Failed to read update' });
  }
});

// Create new update
app.post('/api/updates', async (req, res) => {
  try {
    const data = await readJsonFile(updatesFilePath);
    
    const newUpdate = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    if (!Array.isArray(data.updates)) {
      data.updates = [];
    }
    
    data.updates.push(newUpdate);
    await writeJsonFile(updatesFilePath, data);
    
    res.status(201).json(newUpdate);
  } catch (error) {
    console.error('Error creating update:', error);
    res.status(500).json({ error: 'Failed to create update' });
  }
});

// Update existing update
app.put('/api/updates/:id', async (req, res) => {
  try {
    const data = await readJsonFile(updatesFilePath);
    
    if (!Array.isArray(data.updates)) {
      data.updates = [];
    }
    
    const index = data.updates.findIndex(u => u.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Update not found' });
    }
    
    // Delete old image if it's being replaced
    if (req.body.image && data.updates[index].image && 
        data.updates[index].image !== req.body.image) {
      const oldImagePath = path.join(__dirname, 'public', data.updates[index].image);
      await deleteFileIfExists(oldImagePath);
    }
    
    const updatedUpdate = {
      ...data.updates[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    data.updates[index] = updatedUpdate;
    await writeJsonFile(updatesFilePath, data);
    
    res.json(updatedUpdate);
  } catch (error) {
    console.error('Error updating update:', error);
    res.status(500).json({ error: 'Failed to update update' });
  }
});

// Delete update
app.delete('/api/updates/:id', async (req, res) => {
  try {
    const data = await readJsonFile(updatesFilePath);
    
    if (!Array.isArray(data.updates)) {
      return res.status(404).json({ error: 'Update not found' });
    }
    
    const update = data.updates.find(u => u.id === req.params.id);
    if (!update) {
      return res.status(404).json({ error: 'Update not found' });
    }
    
    // Delete associated image if exists
    if (update.image) {
      const imagePath = path.join(__dirname, 'public', update.image);
      await deleteFileIfExists(imagePath);
    }
    
    data.updates = data.updates.filter(u => u.id !== req.params.id);
    await writeJsonFile(updatesFilePath, data);
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting update:', error);
    res.status(500).json({ error: 'Failed to delete update' });
  }
});

// Projects API Routes

// Upload image for project
app.post('/api/projects/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ 
    imageUrl: `/uploads/projects/${req.file.filename}` 
  });
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const data = await readJsonFile(projectsFilePath);
    res.json(data.projects || []);
  } catch (error) {
    console.error('Error reading projects:', error);
    res.status(500).json({ error: 'Failed to read projects' });
  }
});

// Get single project
app.get('/api/projects/:id', async (req, res) => {
  try {
    const data = await readJsonFile(projectsFilePath);
    const project = data.projects.find(p => p.id === req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error reading project:', error);
    res.status(500).json({ error: 'Failed to read project' });
  }
});

// Create new project
app.post('/api/projects', async (req, res) => {
  try {
    const data = await readJsonFile(projectsFilePath);
    
    const newProject = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    if (!Array.isArray(data.projects)) {
      data.projects = [];
    }
    
    data.projects.push(newProject);
    await writeJsonFile(projectsFilePath, data);
    
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update existing project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const data = await readJsonFile(projectsFilePath);
    
    if (!Array.isArray(data.projects)) {
      data.projects = [];
    }
    
    const index = data.projects.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Delete old image if it's being replaced
    if (req.body.image && data.projects[index].image && 
        data.projects[index].image !== req.body.image) {
      const oldImagePath = path.join(__dirname, 'public', data.projects[index].image);
      await deleteFileIfExists(oldImagePath);
    }
    
    const updatedProject = {
      ...data.projects[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    data.projects[index] = updatedProject;
    await writeJsonFile(projectsFilePath, data);
    
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const data = await readJsonFile(projectsFilePath);
    
    if (!Array.isArray(data.projects)) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const project = data.projects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Delete associated image if exists
    if (project.image) {
      const imagePath = path.join(__dirname, 'public', project.image);
      await deleteFileIfExists(imagePath);
    }
    
    data.projects = data.projects.filter(p => p.id !== req.params.id);
    await writeJsonFile(projectsFilePath, data);
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `Portfolio Contact Form: Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Serve static files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize data files
async function initializeDataFiles() {
  try {
    await ensureDirectories();
    await ensureFile(updatesFilePath);
    await ensureFile(projectsFilePath);
    console.log('Data files initialized successfully');
  } catch (error) {
    console.error('Error initializing data files:', error);
    process.exit(1);
  }
}

// Start server
const startServer = async () => {
  try {
    // Initialize data files
    await initializeDataFiles();
    console.log('Data files initialized successfully');

    // Try to start server on port 3000, if that fails try 3001, etc.
    let port = 3000;
    const maxPort = 3010;
    
    while (port <= maxPort) {
      try {
        app.listen(port, () => {
          console.log(`Server is running on port ${port}`);
        });
        break; // If we get here, server started successfully
      } catch (err) {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${port} is in use, trying ${port + 1}...`);
          port++;
        } else {
          throw err; // If it's not a port-in-use error, rethrow it
        }
      }
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 