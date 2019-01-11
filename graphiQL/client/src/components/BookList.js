//Import Components
import React, { Component } from 'react';
import BookDetails from './BookDetails';
//Connect Graph with Apollo
import {graphql} from 'react-apollo';
//import query from queries folder
import {getBooksQuery} from '../queries/queries';
import { runInThisContext } from 'vm';


class BookList extends Component {
  constructor(props){
    super(props);
    this.state = {
      selected: null
    }
  }
  displayBooks(){
    var data = this.props.data;
    if(data.loading === true){
      return(<div>loading Books...</div>);
    } else {
      return data.books.map(book =>{
        return(
          <li key={book.id} onClick={(e) => {this.setState({selected: book.id})}}>{book.name}</li>
        );
      })
    }
  }
  render() {
    // Logging Data back from GraphQL to React
      // console.log(this.props)
    return (
      <div >
        <ul id="book-list"> 
        {this.displayBooks()}
        {/* <li>Book Name</li> */}

        </ul>
        <BookDetails bookId={this.state.selected}/>
      </div>
    );
  }
}

export default graphql(getBooksQuery)(BookList);
