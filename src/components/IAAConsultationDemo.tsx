import { useEffect } from 'react';
import Head from 'next/head';
import IAAConsultationDemo from '../components/IAAConsultationDemo';

export default function DemoPage() {
    useEffect(() => {
        // Optional: Add any tracking or initialization here
        console.log('IAA Consultation Demo loaded');
    }, []);

    return (
        <>
            <Head>
                <title>IAA Life Consultation Scheduler - Live Demo</title>
                <meta name="description" content="Experience IAA Life's AI-powered consultation booking system with live n8n workflow integration" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />

                {/* Open Graph tags for social sharing */}
                <meta property="og:title" content="IAA Life Consultation Scheduler Demo" />
                <meta property="og:description" content="Book your insurance career consultation with our AI-powered scheduling system" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://yourdomain.com/demo" />

                {/* Additional SEO */}
                <meta name="keywords" content="IAA Life, insurance consultation, career booking, n8n automation, AI scheduling" />
                <meta name="author" content="IAA Life" />
            </Head>

            <main>
                <IAAConsultationDemo />
            </main>
        </>
    );
}