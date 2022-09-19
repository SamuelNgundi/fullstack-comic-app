import classNames from "classnames/bind";
import MyImage from "~/components/MyImage";
import styles from "./ComicCardV2.module.scss";

const cx = classNames.bind(styles);

function ComicCardV2({ comic, width, height, priority = false, fill = false }) {
  return (
    <div className={cx(`big`)}>
      <article className={cx(`card`)}>
        <div
          className={cx(`pizza-box`)}
          style={{ position: "relative", width: width, height: height }}
        >
          <MyImage
            className={cx("card__image")}
            src={comic.src}
            alt={comic.title}
            priority={priority}
            fill={fill}
            width={width}
            height={height}
          />
        </div>
        <div className={cx(`card-content`)}>
          <p className={cx(`card-tags`)}>
            <span className={cx(`card-tag`)}>Gluten Free</span>
            <span className={cx(`card-tag`)}>Main dish</span>
          </p>

          <h1 className={cx(`card-title`)}>
            <a href="#">Gluten Free Pan Pizza</a>
          </h1>

          <p className={cx(`card-metadata`)}>
            <span className={cx(`card-rating`)}>
              ★★★★<span>☆</span>
            </span>
            <span className={cx(`card-votes`)}>(12 votes)</span>
          </p>

          <p className={cx(`card-desc truncate-blur h2-line`)}>
            It really is possible to make excellent gluten free pizza at home in
            your own oven with our cards and techniques.
          </p>

          <button className={cx(`card-save`)} type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#000000"
            >
              <path
                d="M 6.0097656 2 C 4.9143111 2 4.0097656 2.9025988 4.0097656 3.9980469 L 4 22 L 12 19 L 20 22 L 20 20.556641 L 20 4 C 20 2.9069372 19.093063 2 18 2 L 6.0097656 2 z M 6.0097656 4 L 18 4 L 18 19.113281 L 12 16.863281 L 6.0019531 19.113281 L 6.0097656 4 z"
                fill="currentColor"
              />
            </svg>
            Save
          </button>
        </div>
      </article>
    </div>
  );
}

export default ComicCardV2;
