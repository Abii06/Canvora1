const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const asyncHandler = require('express-async-handler');
const Request = require('../models/Request');

// @desc    Create a new request
// @route   POST /api/requests
// @access  Private
const createRequest = asyncHandler(async (req, res) => {
    const { productId, artistId, price, message } = req.body;

    if (!productId || !artistId || !price) {
        res.status(400);
        throw new Error('Please fill all fields');
    }

    const request = new Request({
        product: productId,
        requester: req.user._id,
        artist: artistId,
        price,
        message,
    });

    const createdRequest = await request.save();
    const artist = await User.findById(artistId);

if (artist) {
    await sendEmail(
        artist.email,
        'New Request Received',
        `You have received a new request on Canvora.

Price Offered: ${price}

Please login to review it.`
    );
}
    res.status(201).json(createdRequest);
});

// @desc    Get user requests (incoming & outgoing)
// @route   GET /api/requests/myrequests
// @access  Private
const getMyRequests = asyncHandler(async (req, res) => {
    const outgoing = await Request.find({ requester: req.user._id }).populate('product').populate('artist', 'name email');
    const incoming = await Request.find({ artist: req.user._id }).populate('product').populate('requester', 'name email');

    res.json({ outgoing, incoming });
});

// @desc    Update request status
// @route   PUT /api/requests/:id
// @access  Private (Artist only)
const updateRequestStatus = asyncHandler(async (req, res) => {
    const request = await Request.findById(req.params.id);

    if (request) {
        // Check if user is the artist
        if (request.artist.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this request');
        }

        request.status = req.body.status || request.status;
        const updatedRequest = await request.save();
        const requester = await User.findById(request.requester);

if (requester) {
    await sendEmail(
        requester.email,
        'Request Status Updated',
        `Your request status has been updated to: ${request.status}`
    );
}
        res.json(updatedRequest);
    } else {
        res.status(404);
        throw new Error('Request not found');
    }
});

const deleteRequest = asyncHandler(async (req, res) => {
    const request = await Request.findById(req.params.id);

    if (request) {
        if (request.requester.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to cancel this request');
        }

        await Request.deleteOne({ _id: req.params.id });
        res.json({ message: 'Request cancelled' });
    } else {
        res.status(404);
        throw new Error('Request not found');
    }
});

module.exports = {
    createRequest,
    getMyRequests,
    updateRequestStatus,
    deleteRequest,
};
