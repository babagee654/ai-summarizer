import React from "react";
import { useState, useEffect } from "react";
import { copy, linkIcon, loader, tick } from "../assets";

// import article API hook
import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {
    const [article, setArticle] = useState({
        url: "",
        summary: "",
    });

    const [allArticles, setAllArticles] = useState([]);
    const [copied, setCopied] = useState("");

    const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

    useEffect(() => {
        const articlesFromLocalStorage = JSON.parse(localStorage.getItem("articles")); // parse JSON string.

        if (articlesFromLocalStorage) {
            setAllArticles(articlesFromLocalStorage);
        }
    }, []); // Execute as soon as page loads

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { data } = await getSummary({ articleUrl: article.url });

        if (data?.summary) {
            console.log("WE GOT DATA ");
            const newArticle = {
                ...article,
                summary: data.summary,
            };
            const updatedAllArticles = [...allArticles, newArticle];

            setArticle(newArticle);
            setAllArticles(updatedAllArticles);
            localStorage.setItem("articles", JSON.stringify(updatedAllArticles)); // local storage only contains strings.

            console.log(newArticle);
        }
    };

    const handleCopy = (copyUrl) => {
        setCopied(copyUrl);
        navigator.clipboard.writeText(copyUrl);
        setTimeout(() => {
            return setCopied(false);
        }, 3000);
    };

    return (
        <section className="mt-16 w-full max-w-xl">
            {/* Search */}
            <div className="flex flex-col w-full gap-2">
                <form className="relative flex justify-center items-center" onSubmit={handleSubmit}>
                    <img src={linkIcon} alt="link_icon" className="absolute left-0 my-2 ml-3 w-5" />

                    {/*
                    ---Tailwind CSS 'peer' class---
                    When you need to style an element, based on the state of a sibling element, mark the sibling element with a 'peer' class to allow use of modifiers
                    Change the button css, depending on the state of the input
                    */}
                    <input
                        type="url"
                        placeholder="Enter an article URL"
                        value={article.url}
                        onChange={(e) =>
                            setArticle({
                                ...article,
                                url: e.target.value,
                            })
                        }
                        required
                        className="url_input peer"
                    />

                    {/*When <input> is in focus, border + text = gray-700 */}
                    <button className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700" type="submit">
                        ↵
                    </button>
                </form>

                {/* Browse URL History */}
                <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                    {allArticles.map((item, index) => {
                        return (
                            <div key={`link-${index}`} onClick={() => setArticle(item)} className="link_card">
                                <div className="copy_btn" onClick={() => handleCopy(item.url)}>
                                    <img src={copied === item.url ? tick : copy} alt="copy_icon" className="w-[40%] h-[40%] object-contain" />
                                </div>
                                <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">{item.url}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Display Results */}
            <div className="my-10 max-w-full flex justify-center items-center">
                {isFetching ? (
                    <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
                ) : error ? (
                    <p className="font-inter font-bold text-black text-center">
                        Oops an error happened.
                        <br />
                        <span className="font-satoshi font-normal text-gray-700">{error?.data?.error}</span>
                    </p>
                ) : (
                    article.summary && (
                        <div className="flex flex-col gap-3">
                            <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                                Article <span className="blue_gradient">Summary</span>
                            </h2>
                            <div className="summary_box">
                                <p className="font-inter font-medium text-sm text-gray-700">{article.summary}</p>
                            </div>
                        </div>
                    )
                )}
            </div>
        </section>
    );
};

export default Demo;
