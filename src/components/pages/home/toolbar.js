import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';

import AddIcon from '@material-ui/icons/Add';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import connectComponent from '../../../helpers/connect-component';

import StatedMenu from '../../shared/stated-menu';

import { requestOpenInBrowser } from '../../../senders';

import { open as openDialogCreateCustomApp } from '../../../state/dialog-create-custom-app/actions';
import { resetThenGetHits } from '../../../state/home/actions';

const styles = (theme) => ({
  root: {
    display: 'flex',
    height: 36,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  left: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  statusText: {
    marginRight: theme.spacing(1),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  actionButton: {
    marginLeft: theme.spacing(1),
  },
});

const Toolbar = ({
  classes,
  currentQuery,
  onOpenDialogCreateCustomApp,
  onResetThenGetHits,
}) => (
  <div className={classes.root}>
    <div className={classes.left}>
      {currentQuery.length > 0 && (
        <Typography variant="body2" color="textPrimary" className={classes.statusText}>
          Search results for
          &quot;
          {currentQuery}
          &quot;
        </Typography>
      )}
    </div>
    <div className={classes.right}>
      <Button
        className={classes.actionButton}
        size="small"
        startIcon={<AddIcon />}
        onClick={onOpenDialogCreateCustomApp}
      >
        Create Custom App
      </Button>
      <StatedMenu
        id="more-options"
        buttonElement={(
          <Tooltip title="More">
            <IconButton
              size="small"
              aria-label="More"
              className={classes.actionButton}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      >
        <MenuItem
          dense
          onClick={() => requestOpenInBrowser('https://github.com/atomery/catalog/issues')}
        >
          Submit New App
        </MenuItem>
        <Divider />
        <MenuItem
          dense
          onClick={() => onResetThenGetHits(true)}
        >
          Refresh
        </MenuItem>
      </StatedMenu>
    </div>
  </div>
);

Toolbar.defaultProps = {
  currentQuery: '',
};

Toolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  onOpenDialogCreateCustomApp: PropTypes.func.isRequired,
  onResetThenGetHits: PropTypes.func.isRequired,
  currentQuery: PropTypes.string,
};

const actionCreators = {
  openDialogCreateCustomApp,
  resetThenGetHits,
};

const mapStateToProps = (state) => ({
  currentQuery: state.home.currentQuery,
});

export default connectComponent(
  Toolbar,
  mapStateToProps,
  actionCreators,
  styles,
);
