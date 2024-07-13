import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { viewTask, addTask, deleteTask } from './Services/allApis'; // Import deleteTask function

function TaskHome() {
    const [displayTask, setDisplayTask] = useState([]);
    const [show, setShow] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        status: '',
        progress: 0
    });

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

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTask(prevTask => ({
            ...prevTask,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        const { title, description, startDate, endDate, status, progress } = newTask;

        if (!title || !description || !startDate || !endDate || !status || !progress) {
            alert('Please fill in all fields');
            return;
        }

        const result = await addTask(newTask);
        if (result.status >= 200 && result.status < 300) {
            setDisplayTask([...displayTask, result.data]); // Update the task list
            handleClose();
        }
    };

    const handleDelete = async (id) => {
        const result = await deleteTask(id);
        if (result.status >= 200 && result.status < 300) {
            setDisplayTask(displayTask.filter(task => task.id !== id)); // Remove the task from the list
        }
    };

    return (
        <div>
            <h1 className='text-center py-5'>Task Manager</h1>

            <div className='text-center'>
                <Button variant="outline-dark" onClick={handleShow}>
                    Add A New Task
                </Button>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add A New Task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <FloatingLabel controlId="floatingTitle" label="Title" className="mb-3">
                                <Form.Control type="text" placeholder="Add a title" name="title" onChange={handleChange} />
                            </FloatingLabel>

                            <FloatingLabel controlId="floatingDescription" label="Task" className="mb-3">
                                <Form.Control as="textarea" placeholder="Add a description" style={{ height: '100px' }} name="description" onChange={handleChange} />
                            </FloatingLabel>

                            <FloatingLabel controlId="floatingStartDate" label="Start Date" className="mb-3">
                                <Form.Control type="date" name="startDate" onChange={handleChange} />
                            </FloatingLabel>

                            <FloatingLabel controlId="floatingEndDate" label="End Date" className="mb-3">
                                <Form.Control type="date" name="endDate" onChange={handleChange} />
                            </FloatingLabel>

                            <FloatingLabel controlId="floatingStatus" label="Status" className="mb-3">
                                <Form.Control type="text" placeholder="Add Status" name="status" onChange={handleChange} />
                            </FloatingLabel>

                            <FloatingLabel controlId="floatingProgress" label="Progress" className="mb-3">
                                <Form.Control type="number" placeholder="Add Progress" name="progress" onChange={handleChange} />
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
                    displayTask.length > 0 ?
                    displayTask.map(task => (
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
                            <i className="fa-solid fa-lg fa-pen-to-square ms-3" style={{color: "#000000"}}></i>
                            <i className="fa-solid fa-lg fa-trash text-end me-3" onClick={() => handleDelete(task.id)} style={{color: "#ff0000"}}></i>
                        </div>
                    )) : <h1>No Tasks to do</h1>
                }
            </div>
        </div>
    );
}

export default TaskHome;
