const express = require('express');
const router = express.Router();

// Mock Data
let jobs = [
    { id: 1, title: 'Sample Job Title 1', company: 'Google', location: 'Άνω Πατήσια', date: '2024-07-27', type: 'Πλήρης', specialization: 'Software Engineer', experience: 2, salary: 80000, details: 'Some more info 1', submissions: [], creator_id: 234 },
    { id: 2, title: 'Sample Job Title 2', company: 'Kotsovolos A.E', location: 'Νέο Ηράκλειο', date: '2024-04-06', type: 'Μερική', specialization: 'Customer Service', experience: 4, salary: 50000, details: 'Some more info 2', submissions: [], creator_id: 700 },
    { id: 3, title: 'Sample Job Title 3', company: 'Ekdoseis Tziola', location: 'Ζωγράφου', date: '2024-08-20', type: 'Πλήρης', specialization: 'Delivery', experience: 0, salary: 25000, details: 'Some more info 3', submissions: [], creator_id: 509 },
    { id: 4, title: 'Sample Job Title 4', company: 'Something1', location: 'Κάτω Πατήσια', date: '2024-04-30', type: 'Εθελοντική', specialization: 'Engineer', experience: 8, salary: 0, details: 'Some more info 4', submissions: [], creator_id: 700 },
    { id: 5, title: 'Sample Job Title 5', company: 'something 2', location: 'Κυψέλη', date: '2019-09-15', type: 'Πλήρης', specialization: 'Cleaning', experience: 0, salary: 150000, details: 'Some more info 5', submissions: [], creator_id: 234 },
    { id: 6, title: 'Sample Job Title 6', company: 'Electroholic', location: 'Άνω Πατήσια', date: '2024-08-17', type: 'Εθελοντική', specialization: 'Software Engineer', experience: 2, salary: 0, details: 'Some more info 6', submissions: [{ job: jobs.find((person) => person.id === 234), date: '2017-02-12' }, { job: jobs.find((person) => person.id === 509), date: '2021-04-25' }], creator_id: 999 },
    { id: 7, title: 'Sample Job Title 7', company: 'Vodafone', location: 'Νέο Ηράκλειο', date: '2019-03-15', type: 'Μερική', specialization: 'Customer Service', experience: 4, salary: 100000, details: 'Some more info 7', submissions: [{ job: jobs.find((person) => person.id === 700), date: '23 / 2 / 2024' }], creator_id: 999 },
];

// Get all jobs
router.get('/', (req, res) => {
    res.json(jobs);
});

// Get job by ID
router.get('/:id', (req, res) => {
    const job = jobs.find(u => u.id === parseInt(req.params.id));
    if (!job) return res.status(404).send('Job not found');
    res.json(job);
});

// Create a new job
router.post('/', (req, res) => {
    const newjob = {
        id: jobs.length + 1,
        name: req.body.name,
        email: req.body.email,
        dob: req.body.dob,
        profession: req.body.profession,
    };
    jobs.push(newjob);
    res.status(200).json(newjob);
});

// Update job by ID
router.put('/:id', (req, res) => {
    const job = jobs.find(u => u.id === parseInt(req.params.id));
    if (!job) return res.status(404).send('Job not found');

    job.name = req.body.name;
    job.email = req.body.email;
    job.dob = req.body.dob;
    job.profession = req.body.profession;
    res.json(job);
});

// Delete job by ID
router.delete('/:id', (req, res) => {
    const jobIndex = jobs.findIndex(u => u.id === parseInt(req.params.id));
    if (jobIndex === -1) return res.status(404).send('Job not found');

    jobs.splice(jobIndex, 1);
    res.status(201).send();
});

module.exports = router;