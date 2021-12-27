import styles from './StatisticsCard.module.scss';

interface IStatisticCardProps {
  label: string;
  value: string | number;
  className: string;
}

const StatisticCard = ({ label, value = 0, className = '' }: IStatisticCardProps) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <label className={styles.label}>{label}</label>
      <div title={`${value}`} className={styles.value}>{value}</div>
    </div>
  );
}

export default StatisticCard;
