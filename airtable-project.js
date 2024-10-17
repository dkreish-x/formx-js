// Airtable API setup
const AIRTABLE_API_KEY = 'pat17x7sCYnEA7RrR.f439e009d58b1a9c728cc892af816749fe966c3486797d9c83fd65f3ce326865';
const BASE_ID = 'appmKkFc4bHW00Wfq';
const PROJECTS_TABLE_NAME = 'Projects';
const CUSTOMERS_TABLE_NAME = 'Customers';

// Function to fetch or create Customer by email
async function getOrCreateCustomer(userEmail, userName) {
    try {
        const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${CUSTOMERS_TABLE_NAME}?filterByFormula={Email}="${userEmail}"`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`
            }
        });
        const result = await response.json();

        if (result.records.length > 0) {
            return result.records[0].id;
        } else {
            const newCustomerResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${CUSTOMERS_TABLE_NAME}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fields: {
                        "Email": userEmail,
                        "Name": userName
                    }
                })
            });
            const newCustomerResult = await newCustomerResponse.json();
            return newCustomerResult.id;
        }
    } catch (error) {
        console.error('Error handling customer:', error);
        alert('Failed to create or fetch customer from Airtable.');
    }
}

// Function to create a project in Airtable
async function createProjectInAirtable(projectName, serviceType, customerId) {
    try {
        const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${PROJECTS_TABLE_NAME}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: {
                    "Project Name": projectName,
                    "Service Type": serviceType,
                    "Customer ID": [customerId]
                }
            })
        });

        const result = await response.json();
        console.log('Project created in Airtable:', result);
        return result.id;
    } catch (error) {
        console.error('Error creating project:', error);
        alert('Failed to create project in Airtable.');
    }
}
