const IMAGE_HOST = "https://img.applytodate.com";

const DEFAULT_SIZES = [1.0, 1.5, 2, 3, 4.0];

const normalizeSize = size => {
  if (typeof size === "string") {
    return parseInt(size.split("px")[0], 10);
  } else {
    return size;
  }
};

export const buildImgSrc = (source, size) => {
  return `${IMAGE_HOST}/${normalizeSize(size)}/${source}`;
};

export const buildImgSrcSet = (
  source,
  rawDesiredSize,
  sizes = DEFAULT_SIZES
) => {
  if (!source) {
    return null;
  }

  const desiredSize = normalizeSize(rawDesiredSize);

  return DEFAULT_SIZES.map(size =>
    [buildImgSrc(source, Math.ceil(desiredSize * size)), `${size}x`].join(" ")
  ).join(",\n");
};
