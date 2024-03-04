import React from 'react';
import ReactGA from "react-ga4";
import './style.css';
import VCFSplitter from './vcf-splitter';

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

export default function App() {
  return <VCFSplitter></VCFSplitter>;
}
