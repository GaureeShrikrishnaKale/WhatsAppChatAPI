import React from 'react';
import jsPDF from 'jspdf';

const CustomButton = ({ label }) => {
    const doc = new jsPDF();
    //this token is valid for 24hr from the cration time
    // const whatsappToken = "EAAFl371lgNMBOx4dZAAOXmaYHviLxoeq0iQkdyyHjXjLkAbo5cX9SEOXy7L6NhqffSfZBNajbfQotxHFzNKFHZA54QuL9LXgiTjDo1ggVtTWkZA9AAvaNCLDSwTjOw0ovW8rvUz8HtkgGnJlaRZA2ncEptzhK4xSm3rXnaApZAVJjZCsg374oQiR9eIiS9Ccs1N5GqKpnUg8pQY3sWaewkZD";
    const whatsappToken = process.env.REACT_APP_WHATSAPP_TOKEN;
    console.log("access token:", whatsappToken, process.env.REACT_APP_WHATSAPP_API_BASE_URL);

    const handleSendMessageStatic = () => {
        const messageData = {
            messaging_product: "whatsapp",
            to: "917741947640", // Replace with the recipient's phone number
            type: "template",
            template: {
                name: "hello_world",
                language: {
                    code: "en_US"
                }
            }
        };

        try {
            fetch(
                `${process.env.REACT_APP_WHATSAPP_API_BASE_URL}/messages`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${whatsappToken}`,
                    },
                    body: JSON.stringify(messageData),
                }
            )
                .then((res) => {
                    if (res.status > 400) {
                        throw new Error("api_error");
                    } else {
                        return res.json();
                    }
                })
                .then((data) => {
                    // console.log("message sent successfully", data);
                })
                .catch((err) => {
                    console.log("error occured 1::", err);
                });
        } catch (error) {
            console.log("error occured:: ", error);
        }

    }

    const handleSendMessageDynamicVariableURI = () => {
        const text = "Gauree";
        const amount = "$50";
        const date = "25-06-24";
        const mail = "example@gmail.com";
        const url = "https://example.com";

        const messageData = {
            messaging_product: "whatsapp",
            to: "917741947640", // Replace with the recipient's phone number
            type: "template",
            template: {
                name: "mail_verify",
                language: {
                    code: "en_US"
                },
                components: [
                    {
                        type: "body",
                        parameters: [
                            {
                                type: "text",
                                text: text
                            },
                            {
                                type: "text",
                                text: mail
                            }
                        ]
                    },
                    {
                        type: "button",
                        sub_type: "url",
                        index: 0,
                        parameters: [
                            {
                                type: "text",
                                text: url
                            }
                        ]
                    }
                ]
            }
        };

        try {
            fetch(
                `${process.env.REACT_APP_WHATSAPP_API_BASE_URL}/messages`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${whatsappToken}`,
                    },
                    body: JSON.stringify(messageData),
                }
            )
                .then((res) => {
                    if (res.status > 400) {
                        throw new Error("api_error");
                    } else {
                        return res.json();
                    }
                })
                .then((data) => {
                    // console.log("message sent successfully", data);
                })
                .catch((err) => {
                    console.log("error occured 1::", err);
                });
        } catch (error) {
            console.log("error occured:: ", error);
        }

    }

    const generatePDF = (data) => {
        const doc = new jsPDF();
        doc.text(`Receipt`, 10, 10);
        doc.text(`Amount: ${data.amount}`, 10, 20);
        doc.text(`Company: ${data.company}`, 10, 30);
        doc.text(`Type: ${data.type}`, 10, 40);

        return doc.output('blob'); // Return the PDF as a Blob
    };

    const uploadPDF = async (pdfBlob) => {
        const formData = new FormData();
        formData.append("file", pdfBlob, "receipt");
        formData.append("type", "document");
        formData.append("messaging_product", "whatsapp");

        const response = await fetch(
            `${process.env.REACT_APP_WHATSAPP_API_BASE_URL}/media`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${whatsappToken}`
                },
                body: formData
            }
        );

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }

        return data.id;
    };

    const handleSendMessageFileUpload = async () => {
        const receiptData = {
            amount: "$50",
            company: "Pratiti Technologies Pune. Pvt. Ltd.",
            type: "receipt"
        }

        try {
            const pdfBlob = generatePDF(receiptData);
            const mediaId = await uploadPDF(pdfBlob);

            const messageData = {
                messaging_product: "whatsapp",
                to: "917741947640", // Replace with the recipient's phone number
                type: "template",
                template: {
                    name: "purchase_receipt_1",
                    language: {
                        code: "en_US"
                    },
                    components: [
                        {
                            type: "body",
                            parameters: [
                                {
                                    type: "text",
                                    text: receiptData.amount
                                },
                                {
                                    type: "text",
                                    text: receiptData.company
                                }
                                ,
                                {
                                    type: "text",
                                    text: receiptData.type
                                }
                            ]
                        },
                        {
                            type: "header",
                            parameters: [
                                {
                                    type: "document",
                                    document: {
                                        id: mediaId
                                    }
                                }
                            ]
                        }
                    ]
                }
            };

            fetch(
                `${process.env.REACT_APP_WHATSAPP_API_BASE_URL}/messages`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${whatsappToken}`,
                    },
                    body: JSON.stringify(messageData),
                }
            )
                .then((res) => {
                    if (res.status > 400) {
                        throw new Error("api_error");
                    } else {
                        return res.json();
                    }
                })
                .then((data) => {
                    // console.log("message sent successfully", data);
                })
                .catch((err) => {
                    console.log("error occured 1::", err);
                });
        } catch (error) {
            console.log("error occured:: ", error);
        }
    }

    const handleClick = () => {
        if (label === "Static Message") {
            handleSendMessageStatic();
        } else if (label === "Dynamic URI Message") {
            handleSendMessageDynamicVariableURI();
        } else if (label === "File Upload Message") {
            handleSendMessageFileUpload();
        }
    }
    return (
        <div>
            <button style={{
                backgroundColor: '#25D366', // WhatsApp green color
                color: '#ffffff',           // White text color
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
            }} onClick={() => handleClick()}>{label}</button>
        </div>
    )
}

export default CustomButton