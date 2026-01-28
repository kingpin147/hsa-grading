import wixData from 'wix-data';
import wixWindow from 'wix-window';

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

    const lastVal = res.items[0]?.input1Value || '000340';
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

        // Validate finalGrade
        let finalGradeValue = Number($w('#finalGradeRadio').value);
        if (!finalGradeValue || finalGradeValue < 1 || finalGradeValue > 10) {
            console.warn("Validation failed: Final grade choice is invalid.");
            showError('❌ Please check your entries and try again.');
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

    } catch (err) {
        console.error("Critical error during submission:", err);
        showError('❌ Something went wrong. Please try again.');
    }

    $w('#button1').enable();
}

// Reset form
function fullResetForm() {
    ['#graderId', '#cardMake', '#year', '#variation', '#description', '#cardNumber', '#graderNotes', '#input1'].forEach(id => $w(id).value = '');
    $w('#finalGradeRadio').value = null;
    $w('#scanPhoto').reset();

    // Reset front repeater
    $w('#frontRepeater').forEachItem(($item) => {
        $item('#frontGradeRadio').value = null;
        if ($item('#frontIssueDescription')) $item('#frontIssueDescription').value = '';
    });

    // Reset back repeater
    $w('#backRepeater').forEachItem(($item) => {
        $item('#backGradeRadio').value = null;
        if ($item('#backIssueDescription')) $item('#backIssueDescription').value = '';
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

