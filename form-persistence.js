// form-persistence.js

function getFormIdentifier(form) {
    // Create a unique identifier based on the page path or a form ID
    // For simplicity, we'll use the pathname
    return window.location.pathname;
}

function saveFormData(form) {
    const formId = getFormIdentifier(form);
    const formData = new FormData(form);
    const dataObject = {};
    formData.forEach((value, key) => {
        // Handle checkboxes and radio buttons if you add them
        // For now, this handles text, select, textarea
        dataObject[key] = value;
    });
    sessionStorage.setItem(formId, JSON.stringify(dataObject));
    console.log('Form data saved for:', formId);
}

function loadFormData(form) {
    const formId = getFormIdentifier(form);
    const savedData = sessionStorage.getItem(formId);
    if (savedData) {
        const dataObject = JSON.parse(savedData);
        console.log('Loading form data for:', formId, dataObject);
        for (const key in dataObject) {
            if (dataObject.hasOwnProperty(key)) {
                const element = form.elements[key];
                if (element) {
                    // Handle different input types if necessary (e.g., radio, checkbox)
                    // For text, select, textarea:
                    if (element.type === 'radio' || element.type === 'checkbox') {
                        // This needs more specific handling if you have multiple radio/checkboxes with the same name
                        // For a single checkbox, this works:
                        // element.checked = dataObject[key] === element.value || dataObject[key] === true;
                        // For radio buttons, find the one with the matching value:
                        if (form.elements[key].length > 1) { // NodeList of radio buttons
                            Array.from(form.elements[key]).forEach(radio => {
                                if (radio.value === dataObject[key]) {
                                    radio.checked = true;
                                }
                            });
                        } else { // Single radio/checkbox (though less common for radio)
                            element.checked = dataObject[key] === element.value || dataObject[key] === true;
                        }
                    } else {
                        element.value = dataObject[key];
                    }

                    // Trigger change event for dependent logic (like 'Other' timezone)
                    if (element.id === 'timezone' && element.value === 'Other') {
                        const event = new Event('change', { bubbles: true });
                        element.dispatchEvent(event);
                    }
                }
            }
        }
    } else {
        console.log('No saved data found for:', formId);
    }
}

// Function to clear form data for a specific form, e.g., on successful submission
function clearSavedFormData(form) {
    const formId = getFormIdentifier(form);
    sessionStorage.removeItem(formId);
    console.log('Cleared saved data for:', formId);
}

// Function to clear ALL application form data from sessionStorage (e.g., on starting fresh)
function clearAllApplicationFormData() {
    // Iterate through sessionStorage keys and remove those related to this app
    // This is a naive approach; better to prefix keys
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        // Assuming form IDs are pathnames for this app
        if (key.startsWith('/')) { // Adjust if your paths are different or you use IDs
            sessionStorage.removeItem(key);
        }
    }
    console.log('Cleared all application form data from sessionStorage.');
}