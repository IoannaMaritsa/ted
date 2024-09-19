import { useState, useEffect } from "react";
import { getAllContactsByUserEmail, getJobViewsByUser } from "../api";

const MatrixFactorization = ({ user, jobs }) => {
    const [UJMatrix, setUJMatrix] = useState([]);
    const [userMatrix, setUserMatrix] = useState([]);
    const [jobMatrix, setJobMatrix] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    const createMatrix = async () => {
        try {
            // Βήμα 1: Ανάκτηση των χρηστών από το δίκτυο του χρήστη
            const contacts = await getAllContactsByUserEmail(user.email); // Λίστα με τους χρήστες του δικτύου

            // Βήμα 3: Δημιουργία του πίνακα
            const matrix = [];
            const numofJobs = jobs.length;

            // Βήμα 4: Συμπλήρωση των προβολών για κάθε χρήστη
            await Promise.all(contacts.map(async (contact) => {
                const userViews = await getJobViewsByUser(contact); // Ανάκτηση των προβολών του χρήστη
                const row = [];

                // Βήμα 5: Δημιουργία γραμμής για τον κάθε χρήστη με βάση τις αγγελίες
                for (const job of jobs) {
                    const view = userViews.find(view => view.job_id === job.id);
                    const viewCount = view ? view.view_count : 0; // Αν δεν έχει προβολές, βάζουμε 0
                    row.push(viewCount);
                }

                matrix.push(row);
            }));

            console.table(matrix); // Εμφανίζει τον πίνακα (μπορείς να το αντικαταστήσεις με οποιαδήποτε μέθοδο θέλεις)
            setUJMatrix(matrix);

            const numofUsers = contacts.length;
            const numFactors = 20;
            setUserMatrix(Array.from({ length: numofUsers }, () => Array(numFactors).fill(0).map(() => Math.random())));
            setJobMatrix(Array.from({ length: numofJobs }, () => Array(numFactors).fill(0).map(() => Math.random())));
        } catch (error) {
            console.error('Error creating matrix:', error);
        }
    };

    useEffect(() => {
        createMatrix();
    }, [user.email, jobs]);

    useEffect(() => {
        if (UJMatrix.length > 0 && userMatrix.length > 0 && jobMatrix.length > 0) {
            const learningRate = 0.01;
            const numEpochs = 1000;

            for (let epoch = 0; epoch < numEpochs; epoch++) {
                for (let userIndex = 0; userIndex < UJMatrix.length; userIndex++) {
                    for (let jobIndex = 0; jobIndex < jobMatrix.length; jobIndex++) {
                        const realRating = UJMatrix[userIndex][jobIndex];
                        if (realRating > 0) {  // Μόνο για παρατηρούμενες προβολές
                            const predictedRating = dotProduct(userMatrix[userIndex], jobMatrix[jobIndex]);
                            const error = calculateError(realRating, predictedRating);
                            sgdUpdate(userIndex, jobIndex, error, userMatrix, jobMatrix, learningRate);
                        }
                    }
                }
            }

            // Υπολογισμός userVector ως μέσος όρος διανυσμάτων χρηστών από το δίκτυο
            const getUserNetworkVector = () => {
                const avgUserVector = userMatrix[0].map((_, i) =>
                    userMatrix.reduce((sum, vec) => sum + vec[i], 0) / userMatrix.length
                );
                return avgUserVector;
            };

            const getUserSeenJobs = async () => {
                const views = await getJobViewsByUser(user.email);
                return views.map(view => view.job_id);
            };

            getUserSeenJobs().then(userSeenJobs => {
                const unseenJobs = jobs.filter(job => !userSeenJobs.includes(job.id));

                // Υπολογισμός προβλέψεων με βάση το δίκτυο του χρήστη
                const recommend = unseenJobs.map(job => {
                    const userNetworkVector = getUserNetworkVector();
                    const jobVector = jobMatrix[job.id];
                    const predictedScore = dotProduct(userNetworkVector, jobVector);
                    return { job, predictedScore };
                });

                recommend.sort((a, b) => b.predictedScore - a.predictedScore);
                setRecommendations(recommend);
            });
        }
    }, [UJMatrix, userMatrix, jobMatrix, jobs]);

    function dotProduct(vec1, vec2) {
        return vec1.reduce((sum, value, index) => sum + value * vec2[index], 0);
    }

    function calculateError(realRating, predictedRating) {
        return realRating - predictedRating;
    }

    function sgdUpdate(userIndex, jobIndex, error, userMatrix, jobMatrix, learningRate) {
        for (let k = 0; k < 20; k++) {
            const userFactor = userMatrix[userIndex][k];
            const jobFactor = jobMatrix[jobIndex][k];

            userMatrix[userIndex][k] += learningRate * error * jobFactor;
            jobMatrix[jobIndex][k] += learningRate * error * userFactor;
        }
    }

    return recommendations;
};

export default MatrixFactorization;