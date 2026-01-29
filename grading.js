import wixData from 'wix-data';
import wixWindow from 'wix-window';
import wixLocation from 'wix-location';

let generatedInputId = '';

$w.onReady(async () => {
    console.log("Form initialized. Setting input1 to read-only.");
    $w('#input1').readOnly = true;

    // Trigger handleSubmit on button click
    $w("#button1").onClick(async () => {
        console.log("Submit button clicked.");
        await handleSubmit();
    });
});

// Display next number
async function displayNextInput1() {
    console.log("Querying CardGrades for the next ID...");
    const res = await wixData.query('CardGrades')
        .descending('input1Value')
        .limit(1)
        .find({ suppressAuth: true });

    const lastVal = res.items[0]?.input1Value;
    console.log("Last input1Value found:", lastVal);

    const nextNum = Number(lastVal.replace(/\D/g, '')) + 1;

    let idfield = String(nextNum).padStart(6, '0');
    $w('#input1').value = idfield;
    console.log("Generated next input ID:", idfield);

    return idfield;
}

// Handle form submission
async function handleSubmit() {
    console.log("Starting form submission process...");
    $w('#button1').disable();

    try {
        console.log("Attempting to upload photos...");
        const upload = await $w('#scanPhoto').uploadFiles();
        console.log("Upload successful:", upload);

        generatedInputId = await displayNextInput1();

        // Collect front grades from repeater
        console.log("Collecting front grades data...");
        let frontGrades = [];
        $w('#frontRepeater').forEachItem(($item) => {
            frontGrades.push({
                question: $item('#frontQuestionText').text,
                grade: $item('#frontGradeRadio').value,
                description: $item('#frontIssueDescription').value || ""
            });
        });

        // Collect back grades from repeater
        console.log("Collecting back grades data...");
        let backGrades = [];
        $w('#backRepeater').forEachItem(($item) => {
            backGrades.push({
                question: $item('#backQuestionText').text,
                grade: $item('#backGradeRadio').value,
                description: $item('#backIssueDescription').value || ""
            });
        });

        // Validate finalGrade (Numeric Input vs Radio)
        const numericGrade = $w('#finalGrade').value;
        const radioGrade = $w('#finalGradeRadio').value;
        console.log(`Numeric Grade Input: "${numericGrade}", Radio Grade selection: "${radioGrade}"`);

        // Prioritize the numeric input (1-10) as mentioned by client
        let finalGradeValue = Number(numericGrade);

        // Fallback or secondary check using numeric parts of any input
        if (isNaN(finalGradeValue) || finalGradeValue < 1 || finalGradeValue > 10) {
            if (radioGrade && !isNaN(Number(radioGrade))) {
                finalGradeValue = Number(radioGrade);
            } else if (radioGrade) {
                // Try to extract digits from radio selection (e.g., "Grade 10")
                const match = String(radioGrade).match(/[\d.]+/);
                if (match) {
                    finalGradeValue = Number(match[0]);
                }
            }
        }

        if (isNaN(finalGradeValue) || finalGradeValue < 1 || finalGradeValue > 10) {
            console.warn(`Validation failed: No valid 1-10 grade found. (Numeric: "${numericGrade}", Radio: "${radioGrade}")`);
            showError('❌ Please enter a valid final grade between 1 and 10.');
            $w('#button1').enable();
            return; // stop submission
        }

        // Construct record
        const record = {
            graderId: $w('#graderId').value,
            cardMake: $w('#cardMake').value,
            year: $w('#year').value,
            variation: $w('#variation').value,
            description: $w('#description').value,
            cardNumber: $w('#cardNumber').value,

            // Save repeater data as objects
            frontGrades: frontGrades,
            backGrades: backGrades,

            finalGrade: finalGradeValue,
            graderNotes: $w('#graderNotes').value,
            scanPhoto: upload[0]?.fileUrl || "",
            input1Value: generatedInputId
        };

        console.log("Inserting record into database:", record);
        // Insert the record into CMS
        await wixData.insert('CardGrades', record);
        console.log("Record successfully inserted.");

        showSuccess('✅ Submission completed successfully.');

        console.log("Resetting form...");
        fullResetForm();
        await displayNextInput1(); // display next number

        // Refresh page after 5 seconds to ensure a completely clean state
        console.log("Page will refresh in 5 seconds...");
        setTimeout(() => {
            wixLocation.to(wixLocation.url);
        }, 5000);

    } catch (err) {
        console.error("Critical error during submission:", err);
        showError('❌ Something went wrong. Please try again.');
    }

    $w('#button1').enable();
}

// Reset form
function fullResetForm() {
    // We use an empty space ' ' to satisfy 'required' validation as requested, 
    // and resetValidityIndication to clear any red error borders.
    const fields = ['#graderId', '#cardMake', '#year', '#variation', '#description', '#cardNumber', '#graderNotes', '#input1', '#finalGrade'];
    fields.forEach(id => {
        $w(id).value = ' ';
        if ($w(id).resetValidityIndication) $w(id).resetValidityIndication();
    });

    $w('#finalGradeRadio').value = null;
    $w('#scanPhoto').reset();

    // Reset repeaters
    $w('#frontRepeater').forEachItem(($item) => {
        $item('#frontGradeRadio').value = null;
        if ($item('#frontIssueDescription')) {
            $item('#frontIssueDescription').value = ' ';
            if ($item('#frontIssueDescription').resetValidityIndication) $item('#frontIssueDescription').resetValidityIndication();
        }
    });

    $w('#backRepeater').forEachItem(($item) => {
        $item('#backGradeRadio').value = null;
        if ($item('#backIssueDescription')) {
            $item('#backIssueDescription').value = ' ';
            if ($item('#backIssueDescription').resetValidityIndication) $item('#backIssueDescription').resetValidityIndication();
        }
    });
}

// Messages
function showError(msg) {
    $w('#error').text = msg;
    $w('#error').show();
    setTimeout(() => { $w('#error').hide(); }, 3000);
}

function showSuccess(msg) {
    $w('#success').text = msg;
    $w('#success').show();
    setTimeout(() => { $w('#success').hide(); }, 3000);
}

