const mongoose = require('mongoose');
require('dotenv').config();
const { getDistrictsByState } = require('../src/controllers/locationController');
const State = require('../src/models/State');
const District = require('../src/models/District');

// Mock req and res objects
const mockReq = (params) => ({ params });
const mockRes = () => {
    const res = {};
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };
    res.json = (data) => {
        res.body = data;
        return res;
    };
    return res;
};

async function verifyFix() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socio_economic_survey');

        let success = true;

        // Test case 1: State Code "UP"
        process.stdout.write('Testing UP: ');
        const req1 = mockReq({ stateId: 'UP' });
        const res1 = mockRes();

        await getDistrictsByState(req1, res1);

        // Check if we got data back
        if (res1.body && res1.body.success && Array.isArray(res1.body.data)) {
            console.log('OK (Found ' + res1.body.data.length + ' districts)');
        } else {
            console.log('FAIL');
            console.log('Response:', JSON.stringify(res1.body));
            success = false;
        }

        // Test case 2: Invalid Code
        process.stdout.write('Testing INVALID: ');
        const req2 = mockReq({ stateId: 'INVALID_CODE_123' });
        const res2 = mockRes();

        await getDistrictsByState(req2, res2);

        if (res2.statusCode === 404) {
            console.log('OK');
        } else {
            console.log('FAIL');
            console.log('Response status:', res2.statusCode);
            success = false;
        }

        if (success) {
            console.log('VERIFICATION_PASSED');
        } else {
            console.log('VERIFICATION_FAILED');
        }

    } catch (error) {
        console.error('Test crashed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

verifyFix();
