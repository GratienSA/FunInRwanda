import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetPasswordEmail = async (
    email: string,
    token: string
) => {
    const resetLink = `https://localhost:3000/auth/new-password?token=${token}`;

    try {
        const { data, error } = await resend.emails.send({
            from: 'FunInRwanda <safari.gratien@gmail.com>',
            to: email,
            subject: 'Reset Your Password',
            html: `
                <h1>Reset Your Password</h1>
                <p>You have requested to reset your password. Please click the link below to set a new password:</p>
                <a href="${resetLink}">Reset My Password</a>
                <p>If you did not request this password reset, you can ignore this email.</p>
            `
        });

        if (error) {
            console.error('Error sending reset password email:', error);
            return { success: false, error };
        }

        console.log('Reset password email sent successfully:', data);
        return { success: true, data };

    } catch (err) {
        console.error('Unexpected error sending reset password email:', err);
        return { success: false, error: err };
    }
}

export const sendVerificationEmail = async (
    email: string,
    token: string
) => {
    const confirmLink = `https://localhost:3000/auth/new-verification?token=${token}`;

    try {
        const { data, error } = await resend.emails.send({
            from: 'FunInRwanda <safari.gratien@gmail.com>',
            to: email,
            subject: 'Confirm Your Email Address',
            html: `
                <h1>Email Verification</h1>
                <p>Thank you for signing up. Please click the link below to confirm your email address:</p>
                <a href="${confirmLink}">Confirm My Email</a>
                <p>If you did not request this verification, you can ignore this email.</p>
            `
        });

        if (error) {
            console.error('Error sending verification email:', error);
            return { success: false, error };
        }

        console.log('Verification email sent successfully:', data);
        return { success: true, data };

    } catch (err) {
        console.error('Unexpected error sending verification email:', err);
        return { success: false, error: err };
    }
}