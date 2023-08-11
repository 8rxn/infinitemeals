export default function sitemap() {
  const routes = [
    "",
    "/dashboard",
    "/recipes",
    "/categories",
    "/features",
    "/documentation",
    "/login",
  ].map((route) => ({
    url: `https://imeals.rajaryan.work${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes];
}
