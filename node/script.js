// --- Data and Elements Setup ---

// Simulating a student list (for selection) - Now uses 'let' to allow modification
let STUDENTS = ['Liau Ze Xi', 'Fathima Nuha Nizar', 'Dina Kamelia Binti Muhamad Husaini', 'Lee Bi Ying'];

// Simulated database: Stores all submitted feedback
let feedbackData = [
     // Pre-populate with some data for demonstration
    { target: 'Fathima Nuha Nizar', comment: 'She was excellent at organization and kept the project on track. Great leadership!' },
    { target: 'Fathima Nuha Nizar', comment: 'Needs to improve communication during code reviews; sometimes too brief.' },
    { target: 'Dina Kamelia Binti Muhamad Husaini', comment: 'He did a fantastic job on the design mockups. Very creative.' },
    { target: 'Lee Bi Ying', comment: 'Bi Ying struggled a bit with the backend integration, maybe needs more practice with APIs.' }
];

// Existing Elements
const targetSelect = document.getElementById('targetSelect'); // For Give Feedback Form
const summarySelect = document.getElementById('summarySelect'); // For Summary View
const feedbackForm = document.getElementById('feedbackForm');
const submissionPanel = document.getElementById('submissionPanel');
const summaryPanel = document.getElementById('summaryPanel');
const viewSummaryBtn = document.getElementById('viewSummaryBtn');
const giveFeedbackBtn = document.getElementById('giveFeedbackBtn');
const feedbackSummaryList = document.getElementById('feedbackSummaryList');

// New Elements for Peer Management
const peerNameInput = document.getElementById('peerNameInput');
const addPeerBtn = document.getElementById('addPeerBtn');
const removePeerBtn = document.getElementById('removePeerBtn');


// --- Helper Function: Populate All Student Dropdowns ---
// This function is now called on initial load and whenever the STUDENTS list changes
function populateDropdowns() {
    // Clear existing options, keeping the default placeholder
    targetSelect.innerHTML = '<option value="" disabled selected>Select Peer</option>';
    summarySelect.innerHTML = '<option value="" disabled selected>Select Peer</option>';

    // Sort the list alphabetically for better UX
    STUDENTS.sort().forEach(student => {
        // 1. Populate the 'Give Feedback' dropdown (targetSelect)
        let option1 = document.createElement('option');
        option1.value = student;
        option1.textContent = student;
        targetSelect.appendChild(option1);

        // 2. Populate the 'View Summary' dropdown (summarySelect)
        let option2 = document.createElement('option');
        option2.value = student;
        option2.textContent = student;
        summarySelect.appendChild(option2);
    });
}

// --- Initialization ---
populateDropdowns();


// --- Function 3: Peer Management Logic (NEW) ---

addPeerBtn.addEventListener('click', function() {
    const newPeer = peerNameInput.value.trim();

    if (newPeer === "") {
        alert("Please enter a name to add.");
        return;
    }

    // Check if peer already exists (case-insensitive)
    if (STUDENTS.map(s => s.toLowerCase()).includes(newPeer.toLowerCase())) {
        alert(`'${newPeer}' is already in the list.`);
        peerNameInput.value = '';
        return;
    }

    STUDENTS.push(newPeer);
    populateDropdowns(); // Re-render the dropdowns
    alert(`Peer '${newPeer}' added successfully.`);
    peerNameInput.value = ''; // Clear input
});

removePeerBtn.addEventListener('click', function() {
    const peerToRemove = peerNameInput.value.trim();

    if (peerToRemove === "") {
        alert("Please enter a name to remove.");
        return;
    }

    const index = STUDENTS.findIndex(s => s.toLowerCase() === peerToRemove.toLowerCase());

    if (index !== -1) {
        STUDENTS.splice(index, 1); // Remove the peer from the list

        // Important: Update UI
        populateDropdowns(); 

        // Reset the summary view if the removed peer was currently selected
        if (summarySelect.value === peerToRemove) {
            summarySelect.value = ""; // Reset the select
            renderSummary(""); // Clear the displayed summary
        }

        alert(`Peer '${peerToRemove}' removed successfully. (Existing feedback remains in memory)`);
        peerNameInput.value = ''; // Clear input
    } else {
        alert(`Peer '${peerToRemove}' not found in the list.`);
    }
});

// --- Function 1: Anonymous Feedback Forms (Submission Logic) ---
feedbackForm.addEventListener('submit', function(event) {
    event.preventDefault(); 

    const targetName = targetSelect.value;
    const comment = document.getElementById('feedbackText').value.trim();

    if (targetName && comment) {
        // Store the new feedback anonymously
        feedbackData.push({
            target: targetName,
            comment: comment
        });

        // Confirmation message and reset form
        alert(`Anonymous feedback successfully submitted for ${targetName}.`);
        feedbackForm.reset();
        // Reset the select to default placeholder
        targetSelect.value = "";
    }
});


// --- Function 2: Feedback Summary View (Aggregation and Display) ---

// Navigation: Toggle to Summary View
viewSummaryBtn.addEventListener('click', function(event) {
    event.preventDefault();
    submissionPanel.classList.add('hidden');
    summaryPanel.classList.remove('hidden');

    // Update active state on navigation
    viewSummaryBtn.classList.add('active');
    giveFeedbackBtn.classList.remove('active');

    // Clear summary on toggle, awaiting selection
    feedbackSummaryList.innerHTML = '<p style="text-align: center; color: #9ca3af;">Please select a peer above to view their feedback.</p>';
    document.getElementById('summaryTargetName').textContent = 'Selected Peer';
});

// Navigation: Toggle back to Give Feedback View
giveFeedbackBtn.addEventListener('click', function(event) {
    event.preventDefault();
    summaryPanel.classList.add('hidden');
    submissionPanel.classList.remove('hidden');

    // Update active state on navigation
    giveFeedbackBtn.classList.add('active');
    viewSummaryBtn.classList.remove('active');
});

// Event listener for the new Summary Select dropdown
summarySelect.addEventListener('change', function() {
    renderSummary(summarySelect.value);
});

function renderSummary(targetPeer) {
    // Clear previous summary data
    feedbackSummaryList.innerHTML = ''; 

    if (!targetPeer) {
         // Fallback for no selection
        feedbackSummaryList.innerHTML = '<p style="text-align: center; color: #9ca3af;">Please select a peer above.</p>';
        document.getElementById('summaryTargetName').textContent = 'Selected Peer';
        return;
    }

    // Update the header to show the selected name
    document.getElementById('summaryTargetName').textContent = targetPeer;

    // Filter the 'database' to find all feedback directed at the selected peer
    const aggregatedFeedback = feedbackData.filter(item => item.target === targetPeer);

    if (aggregatedFeedback.length === 0) {
        feedbackSummaryList.innerHTML = `<p style="text-align: center; color: #9ca3af;">No anonymous feedback has been submitted for **${targetPeer}** yet.</p>`;
        return;
    }

    // Display each piece of feedback
    aggregatedFeedback.forEach((feedback, index) => {
        const card = document.createElement('div');
        card.classList.add('feedback-card');

        card.innerHTML = `
            <p>"${feedback.comment}"</p>
            <small>— Anonymous Peer #${index + 1}</small>
        `;
        feedbackSummaryList.appendChild(card);
    });
}