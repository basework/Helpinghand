export default function Head() {
  const site = "https://helpinghands.money"
  const title = "Sign Up — Helping Hands"
  const description = "Create an account on Helping Hands and start earning rewards today."
  const image = `${site}/register-preview.jpg`

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Helping Hands - Create Your Account" />
      <link rel="image_src" href={image} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${site}/register`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  )
}
