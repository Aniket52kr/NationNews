import React from 'react'

const NewItem = ({ title, description, imageUrl, newsUrl, date, source }) => {
    return (
        <div className='container my-3 d-flex justify-content-center'>
            <div className="card shadow p-3 mb-3 rounded d-flex justify-content-center" style={{ width: "21rem" }}>
                <a href={newsUrl}>
                    <img 
                        src={imageUrl ? imageUrl : "https://media.istockphoto.com/id/1212994499/photo/online-news-on-a-smartphone-woman-reading-news-or-articles-in-a-mobile-phone-screen.jpg?s=612x612&w=0&k=20&c=JMWqSlIFkJpprukRp5GqdyzZjh5HWFYcsQGLiUVNJ7g="} 
                        className="card-img-top" 
                        alt="newsImage" 
                    />
                </a>
                <div className="card-body">
                    <span className="position-absolute top-0 translate-middle badge rounded-pill bg-danger" style={{ left: "50%", zIndex: 1 }}>
                        {source}
                        <span className="visually-hidden">{source}</span>
                    </span>
                    <h5 className="card-title">{title}...</h5>
                    <p className="card-text">{description}...</p>
                    <p className="card-text "><small className="text-danger">Published at {date}</small></p>
                    <a href={newsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-dark d-flex justify-content-center">Read More</a>
                </div>
            </div>
        </div>
    );
}

export default NewItem;
