import React from 'react';
import ReactGA from "react-ga4";
import './style.css';
import VCFSplitter from './vcf-splitter';

try {
  ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);
} catch (error) {
  console.log(error)  
}

export default function App() {
  return <VCFSplitter></VCFSplitter>;
}
