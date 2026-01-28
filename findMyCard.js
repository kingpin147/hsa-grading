import wixData from 'wix-data';

$w.onReady(async function () {
    $w('#button2').onClick(async () => {
        const searchValue = $w('#input1').value;

        if (!searchValue) {
            showError("Please enter an ID to search.");
            return;
        }

        try {
            console.log("Searching for card with ID:", searchValue);
            const { items } = await wixData.query("CardGrades")
                .eq("input1Value", searchValue)
                .find({ suppressAuth: true });

            if (items.length > 0) {
                const item = items[0];
                console.log("Card found:", item);

                // Populate fields
                $w('#image10').src = item.scanPhoto || "";
                $w('#text80').text = item.input1Value || "";
                $w('#text81').text = item.graderId || "";
                $w('#text83').text = String(item.finalGrade || "");
                $w('#text85').text = item.graderNotes || "";
                $w('#text93').text = item.cardNumber || "";
                $w('#text87').text = item.variation || "";
                $w('#text89').text = item.year || "";
                $w('#text91').text = item.cardMake || "";
                $w('#text95').text = item.description || "";

                // Display Front/Back Grades summary
                if (item.frontGrades && Array.isArray(item.frontGrades)) {
                    $w('#frontGradeText').text = item.frontGrades.map(g => `${g.question}: ${g.grade}`).join('\n');
                } else {
                    $w('#frontGradeText').text = "No front grades recorded.";
                }

                if (item.backGrades && Array.isArray(item.backGrades)) {
                    $w('#backGradeText').text = item.backGrades.map(g => `${g.question}: ${g.grade}`).join('\n');
                } else {
                    $w('#backGradeText').text = "No back grades recorded.";
                }

                $w('#box23').expand();
                $w('#error').hide();
            } else {
                console.warn("No card found for ID:", searchValue);
                $w('#box23').collapse();
                showError("Card not found. Please check the ID.");
            }
        } catch (err) {
            console.error("Search error:", err);
            $w('#box23').collapse();
            showError("An error occurred during search.");
        }
    });

    function showError(msg) {
        $w('#error').text = msg;
        $w('#error').show();
        // Hide after 4 seconds
        setTimeout(() => { $w('#error').hide(); }, 4000);
    }
});