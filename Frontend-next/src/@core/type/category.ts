export type Category = {
  name: string;
  slug: string;
  path: string;
  children?: Category[];
};