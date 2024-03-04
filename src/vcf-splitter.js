import React, { useState } from 'react';
import JSZip from 'jszip';

const VCFSplitter = () => {
  const [vcfFile, setVcfFile] = useState(null);
  const [chunkSize, setChunkSize] = useState(1000);
  const [splitLinks, setSplitLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const outputFileNamePrefix = 'split_contacts_';

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setVcfFile(file);
  };

  const handleChunkSizeChange = (event) => {
    const size = parseInt(event.target.value, 10);
    setChunkSize(isNaN(size) ? 1000 : size);
  };

  const splitVCF = async () => {
    if (!vcfFile || isLoading) return;

    setIsLoading(true);

    const fileReader = new FileReader();
    const textDecoder = new TextDecoder('utf-8');
    const chunks = [];

    fileReader.onload = () => {
      const content = textDecoder.decode(fileReader.result);
      const contacts = content.split('END:VCARD');

      while (contacts.length > 0) {
        chunks.push(
          contacts.splice(0, chunkSize).join('END:VCARD') + 'END:VCARD'
        );
      }

      processChunks(chunks);
    };

    fileReader.readAsArrayBuffer(vcfFile);
  };

  const processChunks = (chunks) => {
    const zip = new JSZip();
    const splitLinksArray = [];

    chunks.forEach((chunk, index) => {
      const splitFileName = `${outputFileNamePrefix}${index + 1}.vcf`;
      zip.file(splitFileName, chunk);

      splitLinksArray.push(
        <div key={index} className="link-item">
          <a
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(chunk)}`}
            download={splitFileName}
            className="split-link"
          >
            {splitFileName} ⬇️
          </a>
        </div>
      );
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
      const zipLink = URL.createObjectURL(content);

      splitLinksArray.push(
        <div key="zip" className="link-item zip-link">
          <a href={zipLink} download="all_split_files.zip" className="zip-link">
            Download All Parts as ZIP ⬇️
          </a>
        </div>
      );

      setSplitLinks(splitLinksArray);
      setIsLoading(false);
    });
  };

  return (
    <div className="vcf-splitter">
      <h2>👥 VCF Splitter 🔪</h2>
      <div className="file-input">
        <input type="file" accept=".vcf" onChange={handleFileChange} />
        <button onClick={splitVCF} disabled={isLoading}>
          {isLoading ? 'Splitting...' : 'Split VCF'}
        </button>
      </div>

      <div className="options">
        <div className="chunk-size-input">
          <input
            type="number"
            min="1"
            value={chunkSize}
            onChange={handleChunkSizeChange}
          />
          <p className="help-text">
            Enter the number of contacts per file (default is 1000).
          </p>
        </div>
      </div>

      <div className="loader-container">
        {isLoading && <div className="loader">Loading...</div>}
      </div>

      {splitLinks.length > 0 && <div className="link-list">{splitLinks}</div>}

      <div className="footer">
        <p>
          This VCF Splitter tool helps you split your VCF files for easier
          management. Simply upload your VCF file, choose the chunk size, and
          click "Split VCF". You can download individual parts or all parts
          combined in a ZIP file.
        </p>
        <p>
          Built using <a target="_blank" href="https://chat.openai.com/">ChatGPT 🚀</a>,{' '}
          <a target="_blank" href="https://stackblitz.com/">Stackblitz ⚡️</a> and React
        </p>
        <p>
          Created by{' '}
          <a target="_blank" href="https://www.linkedin.com/in/im-suhail-akhtar/">
            Suhail Akhtar
          </a>
        </p>
      </div>
    </div>
  );
};

export default VCFSplitter;
