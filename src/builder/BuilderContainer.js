import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import useForm from '../util/request';

import BuildIcon from '@material-ui/icons/Build';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import RestoreIcon from '@material-ui/icons/Restore';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import BuilderForm from './form/BuilderForm';
import ResultsBox from '../common/ResultsBox';
import MenuCard from '../common/MenuCard';
import ErrorBar from '../common/ErrorBar';
import ResultDetails from '../common/ResultDetails';

import classNames from 'classnames';
import styles from './styles.js';
import { withStyles } from '@material-ui/core/styles';

function BuilderContainer(props) {
  const { classes, handleSelectedResult } = props;
  const { values, mode, result, handleChange, handleClearValues, handleSubmit,
    handleChipInput, handleResidues, handleFileUpload, handleFileDelete } = useForm();

  const [expandBuild, setExpandBuild] = useState(false);
  const [expandResult, setExpandResult] = useState(false);
  const [open, setOpen] = useState(true);
  const [ selected, setSelected ] = useState(null);

  function filterHandleSelectedResult(e, pdbId) {
    setSelected(pdbId);
    const parentId = result.data.pdbId;
    const active = result.data.activeSiteResidues;
    const childId = pdbId.pdbId;
    const aligned = pdbId.alignedResidues;

    if ( result.data ) handleSelectedResult(e, parentId, childId, active, aligned);
  }

  function switchHandler(e, type, extra) {
    switch(type) {
      case 0:
        handleChange(e);
        break;
      case 1:
        handleChipInput(e, extra);
        break;
      case 2:
        handleResidues(e);
        break;
      case 3:
        handleFileUpload(e);
        break;
      case 4:
        handleSubmit(e);
        setExpandBuild(false);
        setExpandResult(true);
        break;
      case 5:
        handleClearValues(e)
        break;
      case 6:
        handleFileDelete(e, type, extra);
        break;
      default:
        break;
      };
  }

  return (
    <>
      {result.error ?
        <ErrorBar
          open={open}
          message={result.error.message}
          handleClose={setOpen}
        /> : null
      }
      <MenuCard
        label='Maker'
        expand={expandBuild}
        handleClick={setExpandBuild}
        cardChild={<BuilderForm values={values} handleChange={switchHandler} />}
        childIcon={<BuildIcon />}
      />
      {
        result.mode === 'test' ? <MenuCard
          label='Test Results'
          expand={expandResult}
          handleClick={setExpandResult}
          cardChild={<ResultsBox successResult={result.data.alignments} handleSelectedResult={filterHandleSelectedResult}/>}
          childIcon={result.pending ? <CircularProgress variant="indeterminate" size={24} thickness={4}/> : <RestoreIcon /> }
        /> : null
      }
      {
        selected && result.data ?
          <ResultDetails
            parentEc={result.data.ecNumber}
            rmsd={selected.rmsd}
            parentId={result.data.pdbId}
            childId={selected.pdbId}
            childEc={selected.ecNumber}
            active={result.data.activeSiteResidues || []}
            aligned={selected.alignedResidues || []}
            handleClose={() => setSelected(null)}
        /> : null
      }
    </>
  );
}

BuilderContainer.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(BuilderContainer);
