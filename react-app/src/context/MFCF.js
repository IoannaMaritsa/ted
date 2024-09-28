import { getAllUsers, getJobViewsByUser } from "../api";

// Refactor MatrixFactorization to not use React hooks
const MatrixFactorization = async (user, jobs) => {
    const UJMatrix = [];
    const userMatrix = [];
    const jobMatrix = [];

    try {
        // Step 1: Fetch all users
        const users = await getAllUsers();

        if (!users || users.length === 0) {
            console.error("No users found.");
            return; // Early exit if no users are found
        }

        if (!jobs || jobs.length === 0) {
            console.error("No jobs found.");
            return;
        }

        // Step 2: Create matrix
        const numofJobs = jobs.length;

        // Step 3: Fill job views for each user
        await Promise.all(users.map(async (user) => {
            const userViews = await getJobViewsByUser(user.email); // Fetch views for each user

            if (!userViews) {
                console.error(`No views found for user: ${user.email}`);
                return; // Skip this user if no views found
            }
            const row = [];

            for (const job of jobs) {
                const view = userViews.find(view => view.job_id === job.id);
                const viewCount = view ? view.count : 0; // Default to 0 if no views
                row.push(viewCount);
            }

            UJMatrix.push(row);
        }));

        // Step 4: Initialize user and job matrices with random factors
        const numFactors = 50;
        for (let i = 0; i < users.length; i++) {
            userMatrix.push(Array.from({ length: numFactors }, () => Math.random()));
        }
        for (let j = 0; j < numofJobs; j++) {
            jobMatrix.push(Array.from({ length: numFactors }, () => Math.random()));
        }

        // Step 5: Train the model using matrix factorization (SGD)
        const learningRate = 0.01;
        const numEpochs = 1000;

        for (let epoch = 0; epoch < numEpochs; epoch++) {
            for (let userIndex = 0; userIndex < UJMatrix.length; userIndex++) {
                for (let jobIndex = 0; jobIndex < jobMatrix.length; jobIndex++) {
                    const realRating = UJMatrix[userIndex][jobIndex];
                    if (realRating > 0) {
                        const predictedRating = dotProduct(userMatrix[userIndex], jobMatrix[jobIndex]);
                        const error = calculateError(realRating, predictedRating);
                        sgdUpdate(userIndex, jobIndex, error, userMatrix, jobMatrix, learningRate);
                    }
                }
            }
        }

        // Step 6: Calculate user vector
        const userIndexMap = {};
        users.forEach((user, index) => {
            userIndexMap[user.id] = index; // Map user.id to its index in userMatrix
        });
        const userIndex = userIndexMap[user.id];
        const userVector = userMatrix[userIndex];

        // Step 7: Get jobs unseen by the user and recommend based on the network
        const userSeenJobs = (await getJobViewsByUser(user.email)).map(view => view.job_id);
        const unseenJobs = jobs.filter(job => !userSeenJobs.includes(job.id));

        const jobIndexMap = jobs.reduce((acc, job, index) => {
            acc[job.id] = index; // Map job ID to its index
            return acc;
        }, {});

        const recommend = unseenJobs.map(job => {
            const jobIndex = jobIndexMap[job.id];

            const jobVector = jobMatrix[jobIndex];
            const predictedScore = dotProduct(userVector, jobVector);
            return { job, predictedScore };
        });

        // Sort recommendations by predicted score
        recommend.sort((a, b) => b.predictedScore - a.predictedScore);
        console.log('MF RECOMMENDATION', recommend);
        return recommend;

    } catch (error) {
        console.error('Error creating matrix:', error);
        throw error;
    }
};

// Utility functions
function dotProduct(vec1, vec2) {
    return vec1.reduce((sum, value, index) => sum + value * vec2[index], 0);
}

function calculateError(realRating, predictedRating) {
    return realRating - predictedRating;
}

function sgdUpdate(userIndex, jobIndex, error, userMatrix, jobMatrix, learningRate) {
    for (let k = 0; k < 50; k++) {
        const userFactor = userMatrix[userIndex][k];
        const jobFactor = jobMatrix[jobIndex][k];

        userMatrix[userIndex][k] += learningRate * error * jobFactor;
        jobMatrix[jobIndex][k] += learningRate * error * userFactor;
    }
}

export default MatrixFactorization;