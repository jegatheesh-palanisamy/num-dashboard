import styles from './Card.module.scss';

interface ICard {
  desc: string;
  imgSrcSet?: string;
  imgSrc: string;
}

const Card = ({ desc, imgSrcSet, imgSrc }: ICard) => {
  return (
    <div className={styles.card}>
      <img srcSet={imgSrcSet} src={imgSrc} alt='' />
      <div className={styles.desc}>
        <b>{desc}</b>
      </div>
    </div>
  );
}

export default Card;