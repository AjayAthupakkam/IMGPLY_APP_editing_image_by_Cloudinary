export const navLinks = [
  {
    label: "Home",
    route: "/",
    icon: "/assets/icons/home.svg",
  },
  {
    label: "Generative Replace",
    route: "/transformations/add/replace",
    icon: "/assets/icons/refresh.svg",
  },
  {
    label: "Content Extract",
    route: "/transformations/add/extract",
    icon: "/assets/icons/image.svg",
  },
  {
    label: "Object Remove",
    route: "/transformations/add/remove",
    icon: "/assets/icons/scan.svg",
  },
  {
    label: "Object Recolor",
    route: "/transformations/add/recolor",
    icon: "/assets/icons/filter.svg",
  },
  {
    label: "Background Remove",
    route: "/transformations/add/removeBackground",
    icon: "/assets/icons/camera.svg",
  },
  {
    label: "Profile",
    route: "/profile",
    icon: "/assets/icons/profile.svg",
  },
  // Credits option removed
];

export const transformationTypes = {
  removeBackground: {
    type: "removeBackground",
    title: "Background Remove",
    subTitle: "Removes the background of the image using AI",
    config: { removeBackground: true },
    icon: "camera.svg",
  },
  replace: {
    type: "replace",
    title: "Generative Replace",
    subTitle: "Replace specific objects in an image with AI",
    config: {
      replace: { from: "", to: "" }
    },
    icon: "refresh.svg",
  },
  remove: {
    type: "remove",
    title: "Object Remove",
    subTitle: "Identify and eliminate objects from images",
    config: {
      remove: { prompt: "", removeShadow: true, multiple: true },
    },
    icon: "scan.svg",
  },
  recolor: {
    type: "recolor",
    title: "Object Recolor",
    subTitle: "Identify and recolor objects from the image",
    config: {
      recolor: { prompt: "", to: "", multiple: true },
    },
    icon: "filter.svg",
  },
  extract: {
    type: "extract",
    title: "Content Extract",
    subTitle: "Extracts specified items from an image as content or a mask",
    config: { extract: { items: [], mode: "content" } },
    icon: "image.svg",
  },
};

export const aspectRatioOptions = {
  "1:1": {
    aspectRatio: "1:1",
    label: "Square (1:1)",
    width: 1000,
    height: 1000,
  },
  "3:4": {
    aspectRatio: "3:4",
    label: "Standard Portrait (3:4)",
    width: 1000,
    height: 1334,
  },
  "9:16": {
    aspectRatio: "9:16",
    label: "Phone Portrait (9:16)",
    width: 1000,
    height: 1778,
  },
};

export const defaultValues = {
  title: "",
  aspectRatio: "",
  color: "",
  prompt: "",
  publicId: "",
  itemsToExtract: "",
  extractMode: "content",
};

export const apiEndpoints = {
  restore: '/api/cloudinary/restore',
  removeBackground: '/api/cloudinary/remove-background',
  remove: '/api/cloudinary/remove-object',
  recolor: '/api/cloudinary/recolor',
  replace: '/api/cloudinary/generative-replace',
  extract: '/api/cloudinary/extract',
};

// Remove the commented-out creditFee
// // Comment out or delete creditFee
// // export const creditFee = -1; 