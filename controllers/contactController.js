const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
//@desc Get all contacts
//@route Get /api/contacts
//@access private
const getContacts = asyncHandler(async(req, res) => {
	const contacts = await Contact.find({user_id: req.user.id});
	res.status(200).json(contacts);
});

//@desc Create new contacts
//@route post /api/contacts
//@access private
const createContact = asyncHandler(async(req, res) => {
    
	const{name, email, phone} = req.body;
    if(!name || !email || !phone) {
		res.status(400);
		throw new Error("All field are mandatory !");
	}
	const contact = await Contact.create({
		name, email, phone, user_id: req.user.id,
	});
    console.log("The body is :", req.body);
	res.status(201).json(contact);
});

//@desc Get a contact
//@route Get /api/contacts/id
//@access private
const getContact = asyncHandler(async(req, res) => {
	const contact = await Contact.findById(req.params.id);
	if(!contact) {
		res.status(404);
		throw new Error("Contact not found");
	}
	res.status(200).json(contact);
});

//@desc Update contacts
//@route Put /api/contacts/id
//@access private
const updateContact = asyncHandler(async(req, res) => {
	const contact = await Contact.findById(req.params.id);
	if(!contact) {
		res.status(404);
		throw new Error("Contact not found");
	}

	if (contact.user_id.toString() !== req.user_id) {
		res.status(403);
		throw new Error("User don't have permission to update other user contacts")
	}

	const updateContact = await Contact.findByIdAndUpdate(
		req.params.id,
		req.body,
		{new: true}
	);
	res.status(200).json(updateContact);
});

//@desc Delete contacts
//@route Delete /api/contacts/id
//@access private
const deleteContact = asyncHandler(async(req, res) => {

	const contact = await Contact.findByIdAndRemove({_id: req.params.id});		
	if (!contact) {
		res.status(404);
		throw new Error("Contact not found");
	
	}
	res.status(200).json(contact);
});

module.exports = {
	getContacts, 
	createContact, 
	getContact, 
	updateContact, 
	deleteContact,
};