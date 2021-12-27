import styles from './button.module.scss';

interface IButtonProps {
  theme?: 'primary' | 'secondary';
  children?: React.ReactElement | React.ReactElement[] | string;
  className?: string;
}

const Button = ({ children, theme = 'primary', className = '' }: IButtonProps) => {
  return (
    <button className={`${styles.button} ${styles[theme]} ${className}`}>{children}</button>
  );
}

export default Button;