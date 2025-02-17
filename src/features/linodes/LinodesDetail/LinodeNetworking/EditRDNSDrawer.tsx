import * as React from 'react';
import ActionsPanel from 'src/components/ActionsPanel';
import Button from 'src/components/Button';
import FormHelperText from 'src/components/core/FormHelperText';
import Typography from 'src/components/core/Typography';
import Drawer from 'src/components/Drawer';
import TextField from 'src/components/TextField';
import { updateIP } from 'src/services/networking';
import { getAPIErrorOrDefault } from 'src/utilities/errorUtils';
import getAPIErrorsFor from 'src/utilities/getAPIErrorFor';
import scrollErrorIntoView from 'src/utilities/scrollErrorIntoView';

interface Props {
  open: boolean;
  onClose: () => void;
  rdns?: string | null;
  address?: string;
}

interface State {
  rdns?: string | null;
  address?: string;
  errors?: Linode.ApiFieldError[];
}

type CombinedProps = Props;

class ViewRangeDrawer extends React.Component<CombinedProps, State> {
  state: State = {
    rdns: this.props.rdns,
    address: this.props.address
  };

  errorResources = {
    rdns: 'RDNS'
  };

  componentWillReceiveProps(nextProps: CombinedProps) {
    this.setState({
      rdns: nextProps.rdns,
      address: nextProps.address,
      errors: undefined
    });
  }

  save = () => {
    const { onClose } = this.props;
    const { rdns, address } = this.state;
    updateIP(address!, !rdns || rdns === '' ? null : rdns)
      .then(_ => {
        onClose();
      })
      .catch(errResponse => {
        this.setState(
          {
            errors: getAPIErrorOrDefault(errResponse)
          },
          () => {
            scrollErrorIntoView();
          }
        );
      });
  };

  handleChangeDomain = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ rdns: e.target.value });
  };

  render() {
    const { open, onClose } = this.props;
    const { rdns, errors } = this.state;

    const hasErrorFor = getAPIErrorsFor(this.errorResources, errors);

    return (
      <Drawer open={open} onClose={onClose} title={`Edit Reverse DNS`}>
        <React.Fragment>
          <TextField
            placeholder="Enter a domain name"
            value={rdns || ''}
            errorText={hasErrorFor('rdns')}
            onChange={this.handleChangeDomain}
            data-qa-domain-name
          />
          <Typography variant="body1">
            Leave this field blank to reset RDNS
          </Typography>

          {hasErrorFor('none') && (
            <FormHelperText error style={{ marginTop: 16 }} data-qa-error>
              {hasErrorFor('none')}
            </FormHelperText>
          )}

          <ActionsPanel style={{ marginTop: 16 }}>
            <Button buttonType="primary" onClick={this.save} data-qa-submit>
              Save
            </Button>
            <Button
              buttonType="secondary"
              className="cancel"
              onClick={onClose}
              data-qa-cancel
            >
              Close
            </Button>
          </ActionsPanel>
        </React.Fragment>
      </Drawer>
    );
  }
}

export default ViewRangeDrawer;
