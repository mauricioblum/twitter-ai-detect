import React from 'react';
import { render } from 'react-dom';
import { RobotIcon } from './robotIcon';
import axios from 'axios';
import { getAIResponse } from '../../utils/getAiResponse';

function Content(): JSX.Element {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const twitterContentParent =
      e.currentTarget.parentElement?.parentElement?.parentElement?.parentElement;
    if (twitterContentParent) {
      const twitterContent = twitterContentParent.querySelector('div[data-testid="tweetText"]');
      let tweet = '';
      twitterContent?.childNodes.forEach((node) => {
        if (node.nodeName === 'SPAN') {
          tweet += node.textContent;
        } else if (node.nodeName === 'IMG') {
          tweet += (node as Element).getAttribute('alt');
        } else if (node.nodeName === 'DIV') {
          tweet += (node as Element).firstChild?.firstChild?.textContent;
        }
      });

      if (tweet === '') {
        return;
      }

      while (tweet.length < 1000) {
        tweet += tweet;
      }
      console.log('[LOG] ~ handleClick ~ tweet:', tweet);

      const aiRequest = await axios.post(
        'https://api.openai.com/v1/completions',
        {
          prompt: tweet,
          max_tokens: 1,
          temperature: 1,
          top_p: 1,
          n: 1,
          logprobs: 5,
          stop: '\n',
          stream: false,
          model: 'model-detect-v2',
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );
      const result = aiRequest.data.choices[0].text;
      console.log('[LOG] ~ handleClick ~ result:', result);
      if (result) {
        const aiResponse = getAIResponse(result);
        console.log('[LOG] ~ handleClick ~ aiResponse:', aiResponse);
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      aria-label="AI Detect"
      style={{
        padding: 0,
        boxSizing: 'border-box',
        marginTop: 2,
        display: 'inline-grid',
        justifyContent: 'inherit',
      }}
    >
      <RobotIcon />
    </div>
  );
}

async function init() {
  const pathname = window.location.pathname;

  if (pathname.includes('status')) {
    let targetNode = document.querySelector("div[aria-label='Timeline: Conversation']");
    // try to find it 5 times waiting 2 seconds in promise
    let retries = 0;

    while (targetNode === null && retries < 5) {
      retries++;
      await new Promise((resolve) => setTimeout(resolve, 3000));
      targetNode = document.querySelector("div[aria-label='Timeline: Conversation']");
    }
    console.log('[LOG] ~ init ~ retries:', retries);

    const twitterDivSingle = document.body.querySelectorAll(
      'div[class="css-1dbjc4n r-1oszu61 r-1igl3o0 r-rull8r r-qklmqi r-2sztyj r-1efd50x r-5kkj8d r-1ta3fxp r-18u37iz r-h3s6tt r-a2tzq0 r-3qxfft r-s1qlax"]'
    );
    if (!twitterDivSingle) throw new Error("Can't find Twitter DIV element");
    // loop through all nodes and render the react component for each one
    twitterDivSingle.forEach((node) => {
      const newElement = document.createElement('div');
      if (node) {
        node.appendChild(newElement);
        render(<Content />, newElement);
      }
    });
    const twitterDivHome = document.body.querySelectorAll(
      'div[class="css-1dbjc4n r-1ta3fxp r-18u37iz r-1wtj0ep r-1s2bzr4 r-1mdbhws"]'
    );
    if (!twitterDivHome) throw new Error("Can't find Twitter DIV element");
    // loop through all nodes and render the react component for each one
    twitterDivHome.forEach((node) => {
      const newElement = document.createElement('div');
      if (node) {
        node.appendChild(newElement);
        render(<Content />, newElement);
      }
    });
  } else {
    let targetNode = document.querySelector("div[aria-label='Timeline: Your Home Timeline']");
    // try to find it 5 times waiting 2 seconds in promise
    let retries = 0;

    while (targetNode === null && retries < 5) {
      retries++;
      await new Promise((resolve) => setTimeout(resolve, 3000));
      targetNode = document.querySelector("div[aria-label='Timeline: Your Home Timeline']");
    }
    console.log('[LOG] ~ init ~ retries:', retries);
    const twitterDivHome = document.body.querySelectorAll(
      'div[class="css-1dbjc4n r-1ta3fxp r-18u37iz r-1wtj0ep r-1s2bzr4 r-1mdbhws"]'
    );
    if (!twitterDivHome) throw new Error("Can't find Twitter DIV element");
    // loop through all nodes and render the react component for each one
    twitterDivHome.forEach((node) => {
      const newElement = document.createElement('div');
      if (node) {
        node.appendChild(newElement);
        render(<Content />, newElement);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', init);
