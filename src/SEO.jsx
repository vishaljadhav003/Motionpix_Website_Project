import { Helmet } from "react-helmet-async";

const SEO = ({
  title,
  description,
  keywords,
  url,
  image,
}) => {
  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      <meta name="robots" content="index, follow" />
      <meta name="author" content="MotionPix" />

      {/* Open Graph (Facebook, LinkedIn) */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter SEO */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />


       <script type="application/ld+json">
            {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "MotionPix",
                url: "https://yourdomain.com",
                logo: "https://yourdomain.com/logo.png",
                sameAs: [
                    "https://facebook.com/yourpage",
                    "https://instagram.com/yourpage",
                    "https://linkedin.com/company/yourpage"
                ]
            })}
        </script>
    </Helmet>

    
  );
};

export default SEO;


