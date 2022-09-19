import classNames from "classnames/bind";
import Image from "next/future/image";
import Link from "next/link";
import { Fragment } from "react";
import { blur } from "../Shimmer/Shimmer";
import styles from "./MyImage.module.scss";

const cx = classNames.bind(styles);

export default function MyImage({
  src,
  href,
  alt,
  width,
  height,
  className,
  fill = false,
  priority,
  hasBlur = true,
}) {
  const classes = cx("card__card", {
    [className]: className,
    objectFit: "objectFit",
  });

  let LinkWrapper = Fragment;

  if (href) {
    LinkWrapper = Wrapper;
  }

  return (
    <LinkWrapper {...(href && { href: href })}>
      <Image
        className={classes}
        src={src}
        alt={alt}
        width={width}
        height={height}
        {...(fill && { fill: true })}
        priority={priority}
        placeholder={hasBlur ? "blur" : ""}
        blurDataURL={blur}
      />
    </LinkWrapper>
  );
}

const Wrapper = ({ href, children }) => {
  return (
    <Link href={href}>
      <a className={cx("card__link")}>{children}</a>
    </Link>
  );
};
