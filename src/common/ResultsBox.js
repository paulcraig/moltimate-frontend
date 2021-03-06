import React, { useState } from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';

import ResultItem from './ResultItem';


export default function ResultsBox(props) {
  const { failedResult, successResult, handleSelectedResult, temp } = props;

  return (
    <div>
      <List>
        {
          successResult ?
            <ResultItem
              handleSelectedResult={handleSelectedResult}
              results={successResult}
              isSuccess={1}
            /> : null
        }
        {
          failedResult ?
            <ResultItem
              handleSelectedResult={handleSelectedResult}
              results={failedResult}
              isSuccess={0}
            /> : null
        }
        {
          temp ?
            temp.map((m, k) => {
              return (
                <ResultItem
                  key={k}
                  parent={{pdbId: m.pdbId, ecNumber: m.ecNumber}}
                  handleSelectedResult={handleSelectedResult}
                  results={m.alignments}
                />
              )
            }) : null
        }
      </List>
    </div>
  );
}

ResultsBox.propTypes = {
  classes: PropTypes.object,
  handleSelectedResult: PropTypes.func,
  successResult: PropTypes.array,
  failedResult: PropTypes.array,
};

ResultsBox.defaultProps = {
  successResult: [],
};
