import React, { Component } from 'react';
import './App.css';
import { Document, Page } from 'react-pdf';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
const YOUR_LOCAL_IP_ADDR = 'INSERT LOCAL IP ADDRESS HERE'; // Insert your own device's IP local address
const API_IP_ADDR = `http://${YOUR_LOCAL_IP_ADDR}:4201`; 

class App extends Component {
  state = {
    numPages: null,
    pageNumber: 1,
    files: [],
    currentFile: 'Select a magazine',
    pageWidth: 500,
    singlePageView: false,
    pageOrder: 'normal'
  }

  callAPI(path) {
    let initialFiles = [];
    fetch(`${API_IP_ADDR}${path}`)
    .then(response => {
      return response.json();
    }).then(data => {
    initialFiles = data.map((file) => {
        return file
    });
    this.setState({ 
      files: initialFiles,
      currentFile: initialFiles[0]
      });
    });
  };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ 
      numPages,
      pageNumber: 1
    });
  }

  changePage = offset => this.setState(prevState => ({
    pageNumber: prevState.pageNumber + offset,
  }));

  changePageWidth = offset => this.setState(prevState => ({
    pageWidth: prevState.pageWidth + offset
  }));

  previousPage = () => {
    if(this.state.pageNumber > 1) {
      if(this.state.singlePageView) {
        this.changePage(-1);
      } else if (!this.state.singlePageView && this.state.pageNumber > 2) {
        this.changePage(-2);
      } else if (!this.state.singlePageView && this.state.pageNumber === 2) {
        this.changePage(-1);
      }
    }
  }

  nextPage = () => {
    const { pageNumber, numPages, singlePageView } = this.state;
    if (pageNumber < numPages) {
      if(singlePageView) {
        this.changePage(1);
      } else if(!singlePageView && pageNumber === numPages-1) {
        return;
      } else {
        this.changePage(2);
      }
    }
  }

  increasePageWidth = () => this.changePageWidth(100);

  decreasePageWidth = () => this.changePageWidth(-100);

  toggleSinglePageView = () => {
    const { pageNumber, numPages, singlePageView } = this.state;
    if (pageNumber === numPages) {
      this.setState({
        pageNumber: numPages - 1
      })
    } else if (singlePageView && (pageNumber % 2 === 0)) {
      this.setState({
        pageNumber: pageNumber - 1
      })
    }
    this.setState({
      singlePageView: !this.state.singlePageView
    });
  }

  fixPageOrder = () => {
    const { pageOrder, pageNumber } = this.state;
    if (pageOrder === 'normal') {
      this.setState({
        pageNumber: pageNumber + 1,
        pageOrder: 'increased'
      })
    } else if (pageOrder === 'increased') {
      this.setState({
        pageNumber: pageNumber - 1,
        pageOrder: 'normal'
      })
    }
  }

  componentDidMount() {
    this.callAPI('/pdfs')
    document.addEventListener('keydown', event => {
      if(event.key === 'ArrowLeft') { this.previousPage(); }
      if(event.key === 'ArrowRight') { this.nextPage(); }
      if(event.key === '=' || event.key === '+') { this.increasePageWidth(); }
      if(event.key === '-') { this.decreasePageWidth(); }
      if(event.key === 'v') { this.toggleSinglePageView(); }
      console.log(event.key);
    });
  }

  componentWillUnmount() {
    console.log('will unmount');
  }

  handleClick(e, fileName) {
    this.setState({ 
      currentFile: fileName,
      pageNumber: 1
     })
  }

  registerKeyDown(e) {
    switch(e.code) {
    case 'ArrowLeft':
      this.previousPage();
    case 'ArrowRight':
      this.nextPage();
    }
  }

  render() {
    const { pageNumber, numPages, files, currentFile, pageWidth, singlePageView, pageOrder } = this.state;

    return (
      <div className="App">
        <div className="App-menu">

          <Dropdown >
            <Dropdown.Toggle  
            variant="info"
            id="dropdown-basic">
              {currentFile}
            </Dropdown.Toggle>
            <Dropdown.Menu className='App-scrollable-menu'>
            {files.map(fileName => (
                <Dropdown.Item key={fileName} onClick={e => this.handleClick(e, fileName)}>
                    {fileName}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Button
            variant="warning"
            className="App-menu--item"
            onClick={this.fixPageOrder}
          >
            Fix Page Order
          </Button>

          <Button
            className="App-menu--item"
            disabled={pageNumber <= 1}
            onClick={this.previousPage}
          >
            {'<- Previous Page'}
          </Button>
            
          {!singlePageView && 
            <div className="App-menu--item">
              Pages {pageNumber},{pageNumber+1} of {numPages}
            </div>
          }

          {singlePageView &&
            <div className="App-menu--item">
              Page {pageNumber} of {numPages}
            </div>
          }

          <Button
            className="App-menu--item"
            disabled={pageNumber >= numPages-1}
            onClick={this.nextPage}
          >
            Next Page ->
          </Button>

          <Button
          variant="danger"
            className="App-menu--item"
            onClick={this.decreasePageWidth}
          >
            Zoom out (-)
          </Button>

          <Button
            variant="success"
            className="App-menu--item"
            onClick={this.increasePageWidth}
          >
            Zoom in (+)
          </Button>

          {!singlePageView && 
            <Button
              variant="secondary"
              className="App-menu--item"
              onClick={this.toggleSinglePageView}
            >
              Single Page View (v)
            </Button>
          }

          {singlePageView && 
            <Button
              variant="secondary"
              className="App-menu--item"
              onClick={this.toggleSinglePageView}
            >
              Double Page View (v)
            </Button>
          }
        </div>

        <div className="App-main-content">
          <Document 
            file={'assets/pdf/'+currentFile}
            onLoadSuccess={this.onDocumentLoadSuccess}
            width='100'
          >
            <div style={{display: "flex"}}>
              <Page pageNumber={pageNumber} width={pageWidth}/>
              {!singlePageView && 
                <Page pageNumber={pageNumber+1} width={pageWidth} />
              }
            </div>
          </Document>
        </div>
      </div>
    );
  }
}

export default App;
