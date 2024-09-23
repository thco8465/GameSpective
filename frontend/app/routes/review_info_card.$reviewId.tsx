import React, { useEffect, useState } from 'react';
import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData, useParams } from '@remix-run/react';
import ReviewInfoCardComponent from '../components/reviewCard/review_info_card';
import Title from '../components/Title/title';
import Header from '../components/header/header';
import Layout from '../components/layout/layout';

interface Review_Info {
    id: number;
    review_id: number;
    high: string;
    low: string;
    atmosphere: number;
    story: number;
    dev_note: string;
    gameplay: number;
    difficulty: number;
    username?: string;
    game_name: string;
    cover: string;
}

export const loader: LoaderFunction = async ({ params }) => {
    const reviewId = params.reviewId;
    console.log('reviewId: ', reviewId);
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/review/review/in-depth/${reviewId}`);
        console.log('response: ', response);
        if (!response.ok) {
            throw new Response('Review not found', { status: response.status });
        }

        const reviewData = await response.json();

        return json(reviewData);
    } catch (error) {
        console.error('Error fetching review info:', error);
        throw new Response('Internal Server Error', { status: 500 });
    }
};

const ReviewInfoCard = () => {
    const reviewData = useLoaderData<Review_Info>(); // Fetch data with correct type
    return (
        <div>
            <Title />
            <Header />
            <Layout>
                <ReviewInfoCardComponent review={reviewData} /> {/* Pass the data to the component */}
            </Layout>
        </div>
    );
};

export default ReviewInfoCard;
