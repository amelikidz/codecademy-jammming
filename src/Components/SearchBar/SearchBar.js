import React from "react";
import './SearchBar.css';

export class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {searchTerm: ''};
  }
  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} />
        <button className="SearchButton" onClick={this.search}>SEARCH</button>
      </div>
    );
  }

  search = () => {
    this.props.onSearch(this.state.searchTerm);
  }

  handleTermChange = (e) => {
    this.setState({searchTerm: e.target.value});
  }
}