const express = require('express');
const router = express.Router();

// Mock Data
let articles = [
    {
        id: '1',
        title: 'Article 1',
        author_id: 1,
        date: '2024-07-26',
        content: 'This is the content of the first article. It is a brief description of the article.'
    },
    {
        id: '2',
        title: 'Article 2',
        author_id: 2,
        date: '2024-07-25',
        content: 'This is the content of the second article. It is a brief description of the article.'
    },
    {
        id: '3',
        title: 'Article 3',
        author_id: 3,
        date: '2024-07-28',
        content: 'This is the content of the third article. It is a brief description of the article.'
    },
    {
        id: '4',
        title: 'Article 4',
        author_id: 999,
        date: '2024-07-25',
        content: 'This is the content of the second article. It is a brief description of the article.'
    },
    {
        id: '5',
        title: 'Article 5',
        author_id: 999,
        date: '2024-07-28',
        content: 'This is the content of the third article. It is a brief description of the article.'
    }
];

// Get all articles
router.get('/', (req, res) => {
    res.json(articles);
});

// Get article by ID
router.get('/:id', (req, res) => {
    const article = articles.find(u => u.id === parseInt(req.params.id));
    if (!article) return res.status(404).send('Article not found');
    res.json(article);
});

// Create a new article
router.post('/', (req, res) => {
    const newarticle = {
        id: articles.length + 1,
        name: req.body.name,
        email: req.body.email,
        dob: req.body.dob,
        profession: req.body.profession,
    };
    articles.push(newarticle);
    res.status(200).json(newarticle);
});

// Update article by ID
router.put('/:id', (req, res) => {
    const article = articles.find(u => u.id === parseInt(req.params.id));
    if (!article) return res.status(404).send('Article not found');

    article.name = req.body.name;
    article.email = req.body.email;
    article.dob = req.body.dob;
    article.profession = req.body.profession;
    res.json(article);
});

// Delete article by ID
router.delete('/:id', (req, res) => {
    const articleIndex = articles.findIndex(u => u.id === parseInt(req.params.id));
    if (articleIndex === -1) return res.status(404).send('Article not found');

    articles.splice(articleIndex, 1);
    res.status(201).send();
});

module.exports = router;