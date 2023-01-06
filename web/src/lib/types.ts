export interface Artist {
  name: string;
  id: string;
  images: Image[];
}

export interface Track {
  href: string;
  id: string;
  name: string;
  popularity: number;
  preview_url: string;
}

interface Image {
  url: string;
  height: number;
  width: number;
}

export interface SearchResponse {
  artists: SearchResponseArtists;
}

interface SearchResponseArtists {
  items: Artist[];
}

export interface RelatedArtistsResponse {
  artists: Artist[];
}

export interface TopTracksResponse {
  tracks: Track[];
}
