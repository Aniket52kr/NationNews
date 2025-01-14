import React, { useEffect, useState } from 'react';
import NewItem from './NewItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const filterDuplicates = (articles) => {
    const seen = new Set();
    return articles.filter((article) => {
      const duplicate = seen.has(article.url);
      seen.add(article.url);
      return !duplicate;
    });
  };

  const updateNews = async () => {
    try {
      props.setProgress(10);
      const url = `https://gnews.io/api/v4/top-headlines?category=${props.category}&lang=en&country=${props.country}&apikey=${props.apiKey}&page=${page}&pageSize=${props.pgSize}`;
      const data = await fetch(url);

      // Handle 403 error (rate limit reached)
      if (data.status === 403) {
        console.error('API rate limit reached, switching API key...');
        props.switchApiKey();  // Switch to the next API key
        return;
      }

      const parsedData = await data.json();

      // Check for any errors in the response
      if (parsedData.errors) {
        console.error('API Error:', parsedData.errors[0]);
        setLoading(false);
        return;
      }

      props.setProgress(30);
      props.setProgress(60);

      if (parsedData.articles) {
        const uniqueArticles = filterDuplicates(parsedData.articles);
        setArticles(uniqueArticles);
        setTotalArticles(parsedData.totalArticles || 0);
      }

      setLoading(false);
      props.setProgress(100);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);  // Stop loading if there is an error
    }
  };

  useEffect(() => {
    document.title = `NationNews | ${capitalizeFirstLetter(props.category)}`;
    updateNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.apiKey, props.category]);

  const fetchMoreData = async () => {
    try {
      const nextPage = page + 1;
      const url = `https://gnews.io/api/v4/top-headlines?category=${props.category}&lang=en&country=${props.country}&apikey=${props.apiKey}&page=${nextPage}&pageSize=${props.pgSize}`;
      const data = await fetch(url);

      // Handle 403 error (rate limit reached)
      if (data.status === 403) {
        console.error('API rate limit reached, switching API key...');
        props.switchApiKey();  // Switch to the next API key
        return;
      }

      const parsedData = await data.json();

      if (parsedData.errors) {
        console.error('API Error:', parsedData.errors[0]);
        return;
      }

      if (parsedData.articles) {
        const uniqueArticles = filterDuplicates([
          ...articles,
          ...parsedData.articles,
        ]);
        setArticles(uniqueArticles);
        setTotalArticles(parsedData.totalArticles || 0);
      }

      setPage(nextPage);
    } catch (error) {
      console.error('Error fetching more news:', error);
    }
  };

  return (
    <div className="container pt-10 py-4">
      <h2
        className="text-center"
        style={{ marginTop: '4rem', padding: '0.9rem 0 1rem' }}
      >
        Top Headlines - {capitalizeFirstLetter(props.category)}
      </h2>

      {articles.length === 0 && !loading && (
        <p className="text-center">No articles available.</p>
      )}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length < totalArticles}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles.map((element, index) => {
              return (
                <div className="col-md-4" key={`${element.url}-${index}`}>
                  <NewItem
                    title={element.title ? element.title.slice(0, 67) : 'No title available'}
                    description={element.description ? element.description.slice(0, 75) : 'No description available'}
                    imageUrl={element.image}
                    newsUrl={element.url}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InfiniteScroll>
    </div>
  );
};

// PropTypes validation
News.propTypes = {
  category: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  apiKey: PropTypes.string.isRequired,
  pgSize: PropTypes.number.isRequired,
  setProgress: PropTypes.func.isRequired,
  switchApiKey: PropTypes.func.isRequired,
};

export default News;
