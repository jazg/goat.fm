interface Image {
  url: string;
  height: number;
  width: number;
}

export interface Artist {
  id: string;
  name: string;
  images?: Image[];
}

export interface Track {
  artists: Artist[];
  href: string;
  id: string;
  name: string;
  popularity: number;
  preview_url: string;
}

export interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
  };
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

export interface VideoResponse {
  items: Video[];
}
