import React, { useEffect, useState, useCallback } from 'react';
import NewItem from './NewItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import ScrollToTop from './ScroolToTop';

const News = (props) => {
  const { category, country, apiKey, pgSize, setProgress } = props;
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0); // Track retry count
  const [isRateLimited, setIsRateLimited] = useState(false); // Track if rate limit exceeded

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Retry mechanism with fixed backoff time
  const fetchNews = useCallback(
    async (pageNumber = 1) => {
      const url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=${country}&apikey=${apiKey}&page=${pageNumber}&pageSize=${pgSize}`;

      // Handling rate-limit state
      if (isRateLimited) {
        console.warn("Rate limit reached, waiting before retrying...");
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds before retrying
        setIsRateLimited(false); // Reset rate limit status after waiting
      }

      let attempt = 0;
      const maxRetries = 3; // Max retries before failing
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); // Delay function

      while (attempt < maxRetries) {
        try {
          console.log(`Attempting fetch. Attempt ${attempt + 1}`);
          let response = await fetch(url);

          if (response.status === 429) {
            // Rate limit exceeded
            console.warn(`Rate limit exceeded. Attempt ${attempt + 1} of ${maxRetries}. Retrying after waiting...`);
            setRetryCount((prev) => prev + 1); // Increment retry count
            setIsRateLimited(true); // Mark as rate-limited
            attempt += 1; // Increase attempt count
            await delay(10000); // Wait 10 seconds before retrying
            continue; // Retry request after delay
          }

          if (!response.ok) {
            throw new Error(`Failed to fetch news: ${response.status} ${response.statusText}`);
          }

          const parsedData = await response.json();
          return parsedData;
        } catch (error) {
          console.error(`Error in fetch attempt ${attempt + 1}:`, error.message);
          break; // Break the loop if error occurs
        }
      }

      console.error(`Max retries reached: ${maxRetries}. Could not fetch news.`);
      return null; // Return null if max retries exceeded
    },
    [apiKey, category, country, pgSize, isRateLimited]
  );

  const updateNews = useCallback(async () => {
    setLoading(true);
    setProgress(10);

    const data = await fetchNews();
    if (!data) return; // Skip if fetch fails or rate limit is exceeded

    setProgress(30);
    setArticles(data.articles || []);
    setTotalArticles(data.totalArticles || 0);
    setLoading(false);
    setProgress(100);
  }, [fetchNews, setProgress]);

  useEffect(() => {
    document.title = `NationNews | ${capitalizeFirstLetter(category)}`;
    updateNews();
  }, [category, updateNews]);

  const fetchMoreData = async () => {
    const nextPage = page + 1;
    setPage(nextPage);

    const data = await fetchNews(nextPage);
    if (!data) return; // Skip if fetch fails or rate limit is exceeded

    setArticles(articles.concat(data.articles || []));
    setTotalArticles(data.totalArticles || 0);
  };

  return (
    <div className='container pt-10 py-4'>
      <h2 className="text-center" style={{ marginTop: "4rem", padding: "0.9rem 0 1rem" }}>
        Top Headlines - {capitalizeFirstLetter(category)}
      </h2>

      {loading ? (
        <Spinner />
      ) : (
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length < totalArticles}
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row">
              {articles && articles.length > 0 && articles.map((element, index) => {
                if (!element || !element.title) return null;

                const title = element.title.slice(0, 67) || "No title available";
                const description = element.description.slice(0, 75) || "No description available";
                const imageUrl = element.image || '';
                const newsUrl = element.url || '#';
                const date = element.publishedAt || 'No date available';
                const source = element.source?.name || 'Unknown source';

                const key = `${element.url}-${index}`;

                return (
                  <div className="col-md-4" key={key}>
                    <NewItem
                      title={title}
                      description={description}
                      imageUrl={imageUrl}
                      newsUrl={newsUrl}
                      date={date}
                      source={source}
                    />
                  </div>
                );
              })}
              <div className='fixed-bottom p-5 d-flex justify-content-end'>
                <ScrollToTop />
              </div>
            </div>
          </div>
        </InfiniteScroll>
      )}

      {/* Display Retry Count */}
      {retryCount > 0 && (
        <div className="retry-count">
          <p>Retry attempts: {retryCount}</p>
        </div>
      )}
    </div>
  );
};

News.propTypes = {
  setProgress: PropTypes.func.isRequired,
  apiKey: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  pgSize: PropTypes.number.isRequired,
};

export default News;
