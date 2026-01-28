import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Earn Buzz',
    short_name: 'EarnBuzz', 
    description: 'Your ultimate financial companion',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#000',
    icons: [
      {
        src: '/<a href="https://www.flaticon.com/free-icons/explore" title="explore icons">Explore icons created by Hilmy Abiyyu A. - Flaticon</a>favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}