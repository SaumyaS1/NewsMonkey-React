import React, { Component } from 'react'
import NewsItem from './NewsItem';
import Spinner from './spinner.gif';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';


export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general"
  }

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  }
  // Function to capitalize the first letter of a string
  capitalizeFirstLetter=(string)=> {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
      
   constructor(props){
      super(props);
      console.log("hello i am a constructor from news component")
      this.state={
         articles: [], 
         loading: false,
         page:1,
         totalArticles: 0
      }
      document.title= `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`;
    }
    // refactoring(componentDidmOUNT, handlePrevclick, handleNextClick) to a function ie updateNews()
    async updateNews(){
      this.props.setProgress(10);
      const url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      this.setState({loading:true});
      let data= await fetch(url);
      let parsedData= await data.json()
      console.log(parsedData);
      this.props.setProgress(70);
      this.setState({
        articles: parsedData.articles,
        totalArticles: parsedData.totalResults,
        loading: false, // Set loading to false after fetching data
      })
      this.props.setProgress(100);
    }
    // fecthing API dynamically
    async componentDidMount(){
      console.log("cdm");
      this.updateNews();
    
    }
    
    // handlePrevClick= async ()=>{
    //   console.log("Previous");
    //   this.setState({page: this.state.page - 1});
    //   this.updateNews();
 
    // }

  //   handleNextClick= async ()=>{
  //     console.log("Next");

  //     this.setState({page: this.state.page + 1});
  //     this.updateNews();
  // }
  fetchMoreData= async ()=>{
     // Increment the page number and fetch more data
     this.setState({ page: this.state.page + 1 });
     const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
     let data = await fetch(url);
     let parsedData = await data.json();
     console.log(parsedData);
     this.setState((prevState) => ({
       articles: [...prevState.articles, ...parsedData.articles], // concatenate prevstate and parsedData articles
       totalArticles: parsedData.totalResults,
       loading: false,
      }));
    };

  render() { 
    console.log("render");
  //  console.log("Articles:", this.state.articles);
    return (
      <div className='container my-3'>
        <h1 className='text-center' style={{margin: '70px 0px'}}>NewsMonkey - Top Headlines</h1>
        {this.state.loading && (
          <div className="text-center">
            <img src={Spinner} alt=" Spinner" />
          
          </div>
        )}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.page * this.props.pageSize < this.state.totalArticles}
          loader={<div className="text-center">
                  <img src={Spinner} alt=" Spinner" /> </div>
                  }
        >
       
        {/* ) : (
          <> */}
          <div className='container'>
         <div className='row'>
         {!this.state.loading && this.state.articles.map((element)=>{
            return (
               <div key={element.url} className="col md-4">
                  <NewsItem title={element.title?element.title.slice(0,45):""} description={element.description?element.description.slice(0,88):""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author?element.author:"unknown"} date={element.publishedAt} source={element.source.name}/>
               </div>
            )
            })}
     
        </div>
        </div>
        </InfiniteScroll>
        {/* <div className="container d-flex justify-content-between">
        <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
        <button disabled={(this.state.page+1) > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
        </div> */}
        {/* </>
        )} */}
      </div>
      
    )
  }
}

export default News 