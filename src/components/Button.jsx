import PropTypes from 'prop-types';
import styles from '/src/style/Button.module.css';
import { Link } from "react-router-dom"; 

export default function Button({
    children,
    onClick,
    type = 'button',
    disabled = false,
    className = '',
    variant = 'generic',
    to = null 
    }) {
    const variantClass = {
        generic: styles.btnGeneric,
        save: styles.btnSave,
        cancel: styles.btnCancel,
    }[variant] || styles.btnGeneric;

    const classes = [
        styles.btnBase,
        variantClass,
        disabled ? styles.btnDisabled : '',
        styles[className] || className,
    ].filter(Boolean).join(' ');

    if (to && !disabled) {
        return (
        <Link to={to} className={classes} onClick={onClick}>
            {children}
        </Link>
        );
    }

    return (
        <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={classes}
        >
        {children}
        </button>
    );
    }

    Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    disabled: PropTypes.bool,
    className: PropTypes.string,
    variant: PropTypes.oneOf(['generic', 'save', 'cancel']),
    to: PropTypes.string, 
    };

    Button.defaultProps = {
    onClick: () => {},
    type: 'button',
    disabled: false,
    className: '',
    variant: 'generic',
    to: null,
    };
