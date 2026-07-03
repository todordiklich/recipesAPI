const notFound = (req, res, next) => {
  res.status(404).json({ error: 'Page Not Found' });
};

export default notFound;
