import * as classNames from 'classnames';
import { always, cond, propEq } from 'ramda';
import * as React from 'react';
import Reload from 'src/assets/icons/reload.svg';
import Button, { ButtonProps } from 'src/components/core/Button';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from 'src/components/core/styles';
import HelpIcon from 'src/components/HelpIcon';

type ClassNames =
  | 'root'
  | 'loading'
  | 'destructive'
  | 'compact'
  | 'hidden'
  | 'reg';

export interface Props extends ButtonProps {
  loading?: boolean;
  destructive?: boolean;
  buttonType?: 'primary' | 'secondary' | 'cancel' | 'remove';
  className?: string;
  tooltipText?: string;
  compact?: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    '@keyframes rotate': {
      from: {
        transform: 'rotate(0deg)'
      },
      to: {
        transform: 'rotate(360deg)'
      }
    },
    root: {
      '&.cancel': {
        border: `1px solid transparent`,
        transition: theme.transitions.create(['color', 'border-color']),
        '&:hover, &:focus': {
          color: theme.palette.primary.light,
          borderColor: theme.palette.primary.light
        }
      },
      '&.remove': {
        fontSize: '.9rem',
        border: 0,
        color: '#C44742',
        padding: `${theme.spacing(2) + 2}px  ${theme.spacing(2) +
          2}px ${theme.spacing(3) + 2}px ${theme.spacing(2) + 2}px`,
        transition: theme.transitions.create(['color', 'border-color']),
        '&:hover, &:focus': {
          color: '#DF6560'
        }
      }
    },
    loading: {
      '& svg': {
        position: 'absolute',
        left: 0,
        top: -3,
        right: 0,
        bottom: 0,
        margin: '0 auto',
        width: theme.spacing(1) + 14,
        height: theme.spacing(1) + 14,
        animation: '$rotate 2s linear infinite'
      }
    },
    destructive: {
      borderColor: '#C44742',
      color: '#C44742',
      background: theme.color.white,
      '&.primary:not(.disabled)': {
        backgroundColor: '#C44742',
        color: theme.color.white,
        '&:hover, &:focus': {
          backgroundColor: '#DF6560',
          color: theme.color.white
        }
      },
      '&:hover, &:focus': {
        background: theme.color.white,
        color: '#DF6560',
        borderColor: '#DF6560'
      },
      '&:active': {
        color: '#963530',
        borderColor: '#963530'
      },
      '&$loading': {
        color: '#C44742 !important',
        '&.primary': {
          background: 'rgba(0, 0, 0, 0.12) !important'
        }
      }
    },
    compact: {
      paddingLeft: theme.spacing(2) - 2,
      paddingRight: theme.spacing(2) - 2
    },
    hidden: {
      visibility: 'hidden'
    },
    reg: {
      display: 'flex',
      alignItems: 'center'
    }
  });

type CombinedProps = Props & WithStyles<ClassNames>;

const getVariant = cond([
  [propEq('buttonType', 'primary'), always('contained')],
  [propEq('buttonType', 'secondary'), always('contained')],
  [propEq('buttonType', 'remove'), always('contained')],
  [propEq('buttonType', 'cancel'), always('contained')],
  [() => true, always(undefined)]
]);

const getColor = cond([
  [propEq('buttonType', 'primary'), always('primary')],
  [propEq('buttonType', 'secondary'), always('secondary')],
  [propEq('buttonType', 'remove'), always('secondary')],
  [propEq('buttonType', 'cancel'), always('secondary')],
  [() => true, always(undefined)]
]);

// Add invariant warning if loading destructive cancel
// Add invariant warning if destructive cancel

const wrappedButton: React.StatelessComponent<CombinedProps> = props => {
  const {
    classes,
    loading,
    destructive,
    tooltipText,
    buttonType,
    compact,
    className,
    ...rest
  } = props;

  return (
    <React.Fragment>
      <Button
        {...rest}
        variant={getVariant(props)}
        disabled={props.disabled || loading}
        color={getColor(props)}
        className={classNames(
          buttonType,
          {
            [classes.root]: true,
            [classes.loading]: loading,
            loading,
            [classes.destructive]: destructive,
            [classes.compact]: compact,
            disabled: props.disabled
          },
          className
        )}
      >
        {loading && <Reload />}
        <span
          className={classNames({
            [classes.hidden]: loading,
            [classes.reg]: !loading
          })}
        >
          {props.children}
        </span>
        {buttonType === 'remove' && 'Remove'}
      </Button>
      {tooltipText && <HelpIcon text={tooltipText} />}
    </React.Fragment>
  );
};

const styled = withStyles(styles);

export default styled(wrappedButton);
