import React, {useState,useEffect} from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {

  const [articles,setArticles] = useState([]);
  const [loading,setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  
  const captilizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const updateNews = async () =>  {
    props.setProgress(10);
      setLoading(true)
      let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
      let data = await fetch(url);
      props.setProgress(30)
      let parseData = await data.json();
      props.setProgress(60)
      
        setArticles(parseData.articles);
        setTotalResults(parseData.totalResults);
        setLoading(false);
        setTotalResults(parseData.totalResults)
        props.setProgress(100)
  }

  useEffect (() => {
    document.title = `GoodNews - ${captilizeFirstLetter(props.category)}`;
    updateNews();
    // eslint-disable-next-line
  },[])

  const fetchMoreData = async () => {
    setPage(page + 1);
    if (!(page + 1 >Math.ceil(totalResults / props.pageSize))) {
      let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
      let data = await fetch(url);
      let parseData = await data.json();
      
        setArticles(articles.concat(parseData.articles));// to add articles at end
        setTotalResults(parseData.totalResults)
      
    }
  };

    return (
      <>
        <div>
          <h1 className="text-center"  style={{margin: "35px 0px", marginTop: '90px'}} > GoodNews - Top {captilizeFirstLetter(props.category)} headlines</h1>
          {loading && <Spinner/>}
          <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults }
          loader={<Spinner/>} 
        >
          <div className="container">
          <div className="row">
            {articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title : ""}
                    description={element.description ? element.description : ""}
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
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
      </>
    );
  
}


export default News;
