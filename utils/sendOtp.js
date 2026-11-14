import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtp = async (email, otp) => {
    const { error } = await resend.emails.send({
        from: 'Movie Booking <onboarding@resend.dev>',
        to: email,
        subject: 'Your OTP for Movie Booking',
        html: `<p>Your OTP is <strong>${otp}</strong>. Valid for 5 minutes. Do not share with anyone.</p>`
    });

    if (error) throw new Error(error.message);
};
