import React, { useEffect, useState } from 'react'
import NewItem from './NewItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'
import ScrollToTop from './ScroolToTop'

const News = (props) => {

  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [loading, setLoading] = useState(true);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const updateNews = async () => {
    setLoading(true);
    props.setProgress(10);
    let url = `https://gnews.io/api/v4/top-headlines?category=${props.category}&lang=en&country=${props.country}&apikey=${props.apiKey}&page=${props.page}&pageSize=${props.pgSize}`;
    let data = await fetch(url);
    if (data.status === 403) {
      props.switchApiKey();
      return;
    }
    props.setProgress(30);

    let parsedData = await data.json();

    props.setProgress(60);

    setArticles(parsedData.articles || []);
    setTotalArticles(parsedData.totalArticles || 0);
    setLoading(false);

    props.setProgress(100);
  }

  useEffect(() => {
    document.title = `NationNews | ${capitalizeFirstLetter(props.category)}`;
    updateNews();
  }, [props.apiKey]);

  const fetchMoreData = async () => {
    setPage(page + 1);

    let url = `https://gnews.io/api/v4/top-headlines?category=${props.category}&lang=en&country=${props.country}&apikey=${props.apiKey}&page=${props.page}&pageSize=${props.pgSize}`;
    let data = await fetch(url);
    if (data.status === 403) {
      props.switchApiKey();
      return;
    }
    let parsedData = await data.json();

    setArticles(articles.concat(parsedData.articles || []));
    setTotalArticles(parsedData.totalArticles || 0);
    setLoading(false);
  };

  return (
    <div className='container pt-10 py-4'>
      <h2 className="text-center" style={{ marginTop: "4rem", padding: "0.9rem 0 1rem" }}>
        Top Headlines - {capitalizeFirstLetter(props.category)} 
      </h2>

      {loading ? <Spinner /> : (
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length < totalArticles}
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row">
              {articles && articles.length > 0 && articles.map((element, index) => {
                // Check if element is valid and contains the necessary properties
                if (!element || !element.title) {
                  return null; // Skip invalid elements
                }

                const title = element.title ? element.title.slice(0, 67) : "No title available";
                const description = element.description ? element.description.slice(0, 75) : "No description available";
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
    </div>
  );
}

News.propTypes = {
  setProgress: PropTypes.func.isRequired,
  apiKey: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  pgSize: PropTypes.number.isRequired,
  switchApiKey: PropTypes.func.isRequired,
};

export default News;
