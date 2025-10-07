import dotenv from 'dotenv';
// import checkEnv from '../utils/checkEnv';
import crypto from 'crypto';
import axios from 'axios';
import { query } from '../datastore/dbClient.js';

dotenv.config();

// if (!checkEnv(process.env)) {
//     throw new Error('Missing required environment variables');
// }

/**
 * initiatePayment
 *
 * Handles the PhonePe payment callback
 */
export const initiatePayment = async (req, res) => {
    try {
        const { userId, username, amount, transactionId } = req.body;

        if (!userId || !username || !amount || !transactionId) {
            return res.status(400).json({ error: 'Invalid request payload' });
        }

        const initiatedAt = new Date().toISOString();
        const payload = {
            merchantId: process.env.PHONEPE_MERCHANTID,
            merchantTransactionId: transactionId,
            merchantUserId: userId,
            amount: amount * 100,
            redirectUrl: `${`${process.env.VITE_API_URL}`}/payment-callback?transactionId=${transactionId}&status=true`,
            redirectMode: 'REDIRECT',
            mobileNumber: '9999999999',
            paymentInstrument: {
                type: 'PAY_PAGE',
            },
        };

        const sha256 = (data) => crypto.createHash('sha256').update(data).digest('hex');
        const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
        const verifyString = base64Payload + '/pg/v1/pay' + process.env.PHONEPE_SALT_KEY;
        const xVerifyChecksum = sha256(verifyString) + '###' + process.env.PHONEPE_SALT_INDEX;

        const phonePeResponse = await axios.post(
            `${process.env.PHONE_PE_HOST_URL}/pg/v1/pay`,
            { request: base64Payload },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-VERIFY': xVerifyChecksum,
                    accept: 'application/json',
                },
            },
        );

        const { success, data } = phonePeResponse.data;
        const redirectUrl = data.instrumentResponse.redirectInfo.url;

        // const userQuery = await query('SELECT * FROM users WHERE user_id = $1', [userId]);
        // const user = userQuery[0];

        // await query(
        //     'INSERT INTO payments (transaction_id, username, user_id, amount, status, previous_balance, metadata, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        //     [
        //         transactionId,
        //         username,
        //         userId,
        //         amount,
        //         success ? 'SUCCESS' : 'PENDING',
        //         user.balance,
        //         phonePeResponse.data,
        //         initiatedAt,
        //     ],
        // );

        res.status(200).json({ redirectUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Payment initiation failed' });
    }
};

/**
 * Handles the PhonePe payment callback
 */
export const paymentCallback = async (req, res) => {
    try {
        const { transactionId, status } = req.query;

        if (!transactionId || !status) {
            return res.status(400).json({ error: 'Invalid callback payload' });
        }

        // Fetch payment record from DB
        const paymentQuery = await query('SELECT * FROM payments WHERE transaction_id = $1', [
            transactionId,
        ]);

        if (paymentQuery.length === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        const payment = paymentQuery[0];

        if (payment.status === 'COMPLETED') {
            return res.status(200).json({ message: 'Payment already processed' });
        }

        const phonePeResponse = await verifyTransactionWithPhonePe(transactionId);

        if (phonePeResponse.success && phonePeResponse.data.state === 'COMPLETED') {
            await query('UPDATE payments SET status = $1, metadata= $2 WHERE transaction_id = $3', [
                'COMPLETED',
                phonePeResponse.data,
                transactionId,
            ]);

            const userQuery = await query('SELECT * FROM users WHERE user_id = $1', [
                payment.user_id,
            ]);
            const user = userQuery[0];

            if (user) {
                const updatedBalance = Number(user.balance) + Number(payment.amount);

                await query('UPDATE users SET balance = $1 WHERE user_id = $2', [
                    updatedBalance,
                    user.user_id,
                ]);
            }

            return res.redirect('http://localhost:5173/');
        } else {
            res.status(400).json({ message: 'Payment verification failed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing callback' });
    }
};

const verifyTransactionWithPhonePe = async (transactionId) => {
    const merchantId = process.env.PHONEPE_MERCHANTID;
    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX;

    const sha256 = (data) => crypto.createHash('sha256').update(data).digest('hex');

    const verifyString = `/pg/v1/status/${merchantId}/${transactionId}` + saltKey;
    const xVerifyChecksum = sha256(verifyString) + '###' + saltIndex;

    const response = await axios.get(
        `${process.env.PHONE_PE_HOST_URL}/pg/v1/status/${merchantId}/${transactionId}`,
        {
            headers: {
                'X-VERIFY': xVerifyChecksum,
                accept: 'application/json',
            },
        },
    );

    return response.data;
};
