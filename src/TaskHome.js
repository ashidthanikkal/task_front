import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { viewTask, addTask, editTask, deleteTask } from './Services/allApis'; // Import editTask function

function TaskHome() {
    const [displayTask, setDisplayTask] = useState([]);
    const [show, setShow] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // New state for editing
    const [currentTaskId, setCurrentTaskId] = useState(null); // New state for current task id
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        status: '',
        progress: 0
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const getData = async () => {
        const result = await viewTask();
        if (result.status >= 200 && result.status < 300) {
            setDisplayTask(result.data);
            console.log(result.data);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleClose = () => {
        setShow(false);
        setIsEditing(false); // Reset editing state
        setNewTask({
            title: '',
            description: '',
            startDate: '',
            endDate: '',
            status: '',
            progress: 0
        });
    };

    const handleShow = (task = null) => {
        if (task) {
            setNewTask(task);
            setCurrentTaskId(task.id);
            setIsEditing(true);
        } else {
            setNewTask({
                title: '',
                description: '',
                startDate: '',
                endDate: '',
                status: '',
                progress: 0
            });
            setIsEditing(false);
        }
        setShow(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTask(prevTask => ({
            ...prevTask,
            [name]: value
        }));
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSort = () => {
        const order = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(order);
    };

    const handleSubmit = async () => {
        const { title, description, startDate, endDate, status, progress } = newTask;

        if (!title || !description || !startDate || !endDate || !status || !progress) {
            alert('Please fill in all fields');
            return;
        }

        let result;
        if (isEditing) {
            result = await editTask(currentTaskId, newTask);
        } else {
            result = await addTask(newTask);
        }

        if (result.status >= 200 && result.status < 300) {
            if (isEditing) {
                setDisplayTask(displayTask.map(task => task.id === currentTaskId ? result.data : task));
            } else {
                setDisplayTask([...displayTask, result.data]);
            }
            handleClose();
        }
    };

    const handleDelete = async (id) => {
        const result = await deleteTask(id);
        if (result.status >= 200 && result.status < 300) {
            setDisplayTask(displayTask.filter(task => task.id !== id));
        }
    };

    const filteredTasks = displayTask
        .filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            const dateA = new Date(a.startDate);
            const dateB = new Date(b.startDate);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

    return (
        <div>
            <h1 className='text-center py-5'>Task Manager</h1>

            <div className='container w-75'>
                <input 
                        type='text' 
                        placeholder='Search by title' 
                        value={searchQuery} 
                        onChange={handleSearchChange} 
                        className='mb-3 form-control'
                    />
            </div>

            <div className='text-center'>
            
                <Button variant="outline-dark" onClick={handleSort}>
                    Sort by Date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
                </Button>
                <Button className='ms-2' variant="outline-dark" onClick={() => handleShow()}>
                    Add A New Task
                </Button>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{isEditing ? 'Edit Task' : 'Add A New Task'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <FloatingLabel controlId="floatingTitle" label="Title" className="mb-3">
                                <Form.Control type="text" placeholder="Add a title" name="title" value={newTask.title} onChange={handleChange} />
                            </FloatingLabel>

                            <FloatingLabel controlId="floatingDescription" label="Task" className="mb-3">
                                <Form.Control as="textarea" placeholder="Add a description" style={{ height: '100px' }} name="description" value={newTask.description} onChange={handleChange} />
                            </FloatingLabel>

                            <FloatingLabel controlId="floatingStartDate" label="Start Date" className="mb-3">
                                <Form.Control type="date" name="startDate" value={newTask.startDate} onChange={handleChange} />
                            </FloatingLabel>

                            <FloatingLabel controlId="floatingEndDate" label="End Date" className="mb-3">
                                <Form.Control type="date" name="endDate" value={newTask.endDate} onChange={handleChange} />
                            </FloatingLabel>

                            <FloatingLabel controlId="floatingStatus" label="Status" className="mb-3">
                                <Form.Control type="text" placeholder="Add Status" name="status" value={newTask.status} onChange={handleChange} />
                            </FloatingLabel>

                            <FloatingLabel controlId="floatingProgress" label="Progress" className="mb-3">
                                <Form.Control type="number" placeholder="Add Progress" name="progress" value={newTask.progress} onChange={handleChange} />
                            </FloatingLabel>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

            <div className='d-flex flex-wrap gap-3 justify-content-center align-items-center py-5 mt-3 container'>
                { 
                    filteredTasks.length > 0 ?
                    filteredTasks.map(task => (
                        <div key={task.id} className='card shadow' style={{ width: "250px", height: "400px" }}>
                            <h5 className='text-center py-2'>{task.title}</h5>
                            <p className='text-center'>{task.description}</p>
                            <h6 className='ms-2'>Start date:</h6>
                            <p className='text-center'>{task.startDate}</p>
                            <h6 className='ms-2'>End date:</h6>
                            <p className='text-center'>{task.endDate}</p>
                            <h6 className='ms-2'>Status:</h6>
                            <p className='text-center'>{task.status}</p>
                            <h6 className='ms-2'>Progress:</h6>
                            <p className='text-center'>{task.progress}%</p>
                            <i className="fa-solid fa-lg fa-pen-to-square ms-3" style={{color: "#000000"}} onClick={() => handleShow(task)}></i>
                            <i className="fa-solid fa-lg fa-trash text-end me-3" onClick={() => handleDelete(task.id)} style={{color: "#ff0000"}}></i>
                        </div>
                    )) : <h1>No Tasks to do</h1>
                }
            </div>
        </div>
    );
}

export default TaskHome;
