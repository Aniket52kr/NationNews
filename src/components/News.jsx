import React, { useEffect, useState, useCallback } from 'react';
import NewItem from './NewItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import ScrollToTop from './ScroolToTop';

const MAX_KEY_RETRIES = 4; // matches the number of API keys rotated in App.js

const News = (props) => {
  const { category, country, apiKey, pgSize, setProgress, switchApiKey } = props;
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0); // Track retry count
  const [errorMessage, setErrorMessage] = useState('');

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Single attempt per call. On a 429, rotate to the next API key and bail out
  // immediately instead of sleeping on an already-exhausted key.
  const fetchNews = useCallback(
    async (pageNumber = 1) => {
      const url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=${country}&apikey=${apiKey}&page=${pageNumber}&pageSize=${pgSize}`;

      try {
        const response = await fetch(url);

        if (response.status === 429) {
          console.warn('Rate limit hit for current API key, rotating to next key...');
          setRetryCount((prev) => prev + 1);
          switchApiKey();
          return null;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch news: ${response.status} ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Error fetching news:', error.message);
        return null;
      }
    },
    [apiKey, category, country, pgSize, switchApiKey]
  );

  const updateNews = useCallback(async () => {
    if (retryCount >= MAX_KEY_RETRIES) {
      setLoading(false);
      setErrorMessage('All API keys are currently rate-limited. Please try again later.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setProgress(10);

    const data = await fetchNews();
    if (!data) {
      setLoading(false); // Skip if fetch fails or rate limit is exceeded
      return;
    }

    setProgress(30);
    setArticles(data.articles || []);
    setTotalArticles(data.totalArticles || 0);
    setLoading(false);
    setProgress(100);
  }, [fetchNews, setProgress, retryCount]);

  // Re-fetch only when the category (route) changes or the API key actually
  // rotates — not on every incidental re-creation of the memoized callbacks.
  useEffect(() => {
    document.title = `NationNews | ${capitalizeFirstLetter(category)}`;
    updateNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, apiKey]);

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
      {retryCount > 0 && !errorMessage && (
        <div className="retry-count">
          <p>Retry attempts: {retryCount}</p>
        </div>
      )}

      {errorMessage && (
        <div className="text-center text-danger">
          <p>{errorMessage}</p>
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
  switchApiKey: PropTypes.func.isRequired,
};

export default News;
