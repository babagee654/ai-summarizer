// One specific part of our Store, AKA a specific part of our Global State
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// pull ApiKey from .env
const rapidApiKey = import.meta.env.VITE_RAPID_API_ARTICLE_KEY

export const articleApi = createApi({
    reducerPath: 'articleApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://article-extractor-and-summarizer.p.rapidapi.com',
        prepareHeaders: (headers) => {
            headers.set('X-RapidAPI-Key', rapidApiKey);
            headers.set('X-RapidAPI-Host', 'article-extractor-and-summarizer.p.rapidapi.com');
            return headers;
        }
    }),
    endpoints: (builder) => {
        return {
            getSummary: builder.query({
                // built in JS function: encodeURIComponent - Encodes a text string as a valid component of a Uniform Resource Identifier (URI).
                // When ever you pass user generated content into URL, wrap it in this function.
                query: (params) => `/summarize?url=${encodeURIComponent(params.articleUrl)}&length=3`
            })
        }
    }
})

// useLazy, allows us to use the hook on demand (on submitting url), rather than immediately
export const { useLazyGetSummaryQuery } = articleApi
// export this hook