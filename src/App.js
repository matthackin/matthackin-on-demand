import React, { Component } from 'react';
import './App.css';
import { Document, Page } from 'react-pdf';
import Button from 'react-bootstrap/Button';

class App extends Component {
  state = {
    numPages: null,
    pageNumber: 1,
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  }

  changePage = offset => this.setState(prevState => ({
    pageNumber: prevState.pageNumber + offset,
  }));

  previousPage = () => this.changePage(-2);

  nextPage = () => this.changePage(2);

  render() {
    const { pageNumber, numPages } = this.state;

    return (
      <div className="App">
        <div className="App-title">
          Fortune.USA.TruePDF-November.2019.pdf
        </div>
        <div className="App-menu">
            <Button
              className="App-menu--item"
              disabled={pageNumber <= 1}
              onClick={this.previousPage}
            >
              Previous Page
            </Button>
            
            <div className="App-menu--item">
             Page {pageNumber},{pageNumber+1} of {numPages}
            </div>

            <Button
              className="App-menu--item"
              disabled={pageNumber >= numPages-1}
              onClick={this.nextPage}
            >
              Next Page
            </Button>
          </div>
        <header className="App-main-content">
          <Document 
            file="assets/pdf/test.pdf"
            onLoadSuccess={this.onDocumentLoadSuccess}
          >
            <div style={{display: "flex"}}>
              <Page pageNumber={pageNumber} />
              <Page pageNumber={pageNumber+1} />
            </div>
          </Document>
        </header>
      </div>
    );
  }
}

export default App;
