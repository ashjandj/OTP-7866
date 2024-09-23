/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * * ***********************************************************************************************************************************
 * Client Name: Nil
 * 
 * Jira Code: OTP-7866
 * 
 * Title: Custom form to store blood donor details and track them in database
 * 
 * Author: Jobin And Jismi IT Services LLP
 * 
 * Date Created: 13 - 09 - 2024
 *
 * Script Description:
 * This Suitelet script manages blood donation details through a custom form in NetSuite. It collects information like the donor's name, gender, phone number, blood group, and last donation date. Upon submission, it creates a custom record in NetSuite.
 * - Custom Form: Captures and validates required donor information.
 * - Record Creation: Submits data to create a custom blood donation record.
 * - Error Handling: Logs errors and provides user feedback.
 * 

 * 
 * Revision History: 1.0
 *************************************************************************************************************************************8

 */
define(['N/record', 'N/ui/serverWidget', 'N/format'],
    /**
 * @param{record} record
 */
    (record, serverWidget, format) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            if (scriptContext.request.method === 'GET') {
                let form = createBloodDonationForm();
                try {
                    scriptContext.response.writePage(form);
                } catch (err) {
                    log.error("Error creating Form", err);
                    scriptContext.response.write(`<h1 style= "color:red">Something went wrong</h1>`);
                }
            }
            else if (scriptContext.request.method === 'POST') {
                let recordId = createBloodDonarRecord(scriptContext.request.parameters,scriptContext.response);
                if(recordId){
                scriptContext.response.write(`<h3 style= "color:red">Record has been created with the id : ${recordId}
                    </h3>`);}
            }
        }
        /**
            * Creates a Blood Donation Registration form with fields for donor details such as first name, last name, gender, phone number, blood group, and last donation date.
            * The form is used to collect and validate the required data for blood donors.
            *
            * @returns {serverWidget.Form} The form object representing the Blood Requirement Registration Form.
            * 
            * @throws {Error} Logs an error if there is an issue creating the form.
        */
        function createBloodDonationForm() {
            try {
                let form = serverWidget.createForm({
                    title: 'Blood Requirement Registration Form'
                });

                let firstName = form.addField({
                    id: 'custpage_jj_first_name_otp7866',
                    type: serverWidget.FieldType.TEXT,
                    label: 'First Name'
                });
                firstName.isMandatory = true;

                let lastName = form.addField({
                    id: 'custpage_jj_last_name_otp7866',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Last Name'
                });

                let gender = form.addField({
                    id: 'custpage_jj_gender_otp7866',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Gender'
                });

                gender.addSelectOption({
                    value: 1,
                    text: "Male"
                });
                gender.addSelectOption({
                    value: 2,
                    text: "Female"
                });
                gender.addSelectOption({
                    value: 3,
                    text: "Custom"
                });

                let phoneNumber = form.addField({
                    id: 'custpage_jj_phone_otp7866',
                    type: serverWidget.FieldType.PHONE,
                    label: 'Phone Number'
                });
                phoneNumber.isMandatory = true;

                let bloodGroup = form.addField({
                    id: 'custpage_jj_blood_group_otp7866',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Blood Group'
                });
                bloodGroup.addSelectOption({
                    text: "A+",
                    value: 1
                });
                bloodGroup.addSelectOption({
                    text: "A-",
                    value: 2
                });
                bloodGroup.addSelectOption({
                    text: "B+",
                    value: 3
                });
                bloodGroup.addSelectOption({
                    text: "B-",
                    value: 4
                });
                bloodGroup.addSelectOption({
                    text: "AB+",
                    value: 5
                });
                bloodGroup.addSelectOption({
                    text: "AB-",
                    value: 6
                });
                bloodGroup.addSelectOption({
                    text: "O+",
                    value: 7
                });
                bloodGroup.addSelectOption({
                    text: "O-",
                    value: 8
                });
                let lastDonationDate = form.addField({
                    id: 'custpage_jj_last_donation_otp7866',
                    type: serverWidget.FieldType.DATE,
                    label: 'Last Donation Date'
                });

                form.addSubmitButton({
                    label: 'Submit'
                });
                return form;
            }
            catch (err) {
                log.error("Error in the function createBloodDonationForm", err);
            }
        }

        /**
            * Creates a new blood donor record in NetSuite based on provided parameters.
            * Validates the last donation date to ensure it is not a future date before saving the record.
            *
            * @param {Object} scriptContextParameters - The parameters from the script context request.
            * @param {ServerResponse} response - The Suitelet response object used to provide feedback.
            * @returns {number} - The internal ID of the newly created blood donor record.
            * @throws {string} - Throws a "dateError" if the last donation date is a future date.
            * 
            * @property {string} scriptContextParameters.custpage_jj_first_name_otp7866 - The first name of the donor.
            * @property {string} scriptContextParameters.custpage_jj_last_name_otp7866 - The last name of the donor.
            * @property {string} scriptContextParameters.custpage_jj_gender_otp7866 - The gender of the donor.
            * @property {string} scriptContextParameters.custpage_jj_phone_otp7866 - The phone number of the donor.
            * @property {string} scriptContextParameters.custpage_jj_last_donation_otp7866 - The last donation date of the donor.
            * @property {string} scriptContextParameters.custpage_jj_blood_group_otp7866 - The blood group of the donor.
            * 
            * @throws {Error} - Logs an error if there is an issue with the entered values or if the record creation fails.
        */
        function createBloodDonarRecord(scriptContextParameters,response) {
            try {
                let firstName = scriptContextParameters.custpage_jj_first_name_otp7866;
                let lastName = scriptContextParameters.custpage_jj_last_name_otp7866;
                let gender = scriptContextParameters.custpage_jj_gender_otp7866;
                let phoneNumber = scriptContextParameters.custpage_jj_phone_otp7866;
                let lastDonationDate = scriptContextParameters.custpage_jj_last_donation_otp7866;
                let bloodGroup = scriptContextParameters.custpage_jj_blood_group_otp7866;
                let loadDate = format.parse({ value: lastDonationDate, type: format.Type.DATE });
                let todayDate = new Date();
                if(loadDate > todayDate)
                {
                    response.write(`<h3 style= "color:red">The date cannot be a future date!!</h3>`);
                    throw "dateError";
                }
                let bloodDonationForm = record.create({
                    type: "customrecord_jj_blood_requirment",
                    isDynamic: true,
                });

                try {
                    bloodDonationForm.setValue({
                        fieldId: "custrecord_jj_first_name_otp7866",
                        value: firstName
                    });

                    bloodDonationForm.setValue({
                        fieldId: "custrecord_jj_last_name_otp7866",
                        value: lastName
                    });
                    bloodDonationForm.setValue({
                        fieldId: "custrecord_jj_gender_otp7866",
                        value: gender
                    });
                    bloodDonationForm.setValue({
                        fieldId: "custrecord_jj_phone_otp7866",
                        value: phoneNumber
                    });
                    bloodDonationForm.setValue({
                        fieldId: "custrecord_jj_blood_group_otp7866",
                        value: bloodGroup
                    });
                    
                    bloodDonationForm.setValue({
                        fieldId: "custrecord_jj_last_donation_otp7866",
                        value: loadDate
                    });
                } catch (err) {
                    log.error("Issue with the entered value", err);
                }

                let recordId = bloodDonationForm.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: false
                });

                return recordId;
            } catch (err) {
                log.error("Error in the function createBloodDonarRecord", err);
            }

        }

        return { onRequest }

    });
