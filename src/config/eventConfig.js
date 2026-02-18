const eventConfig = {
  titulo: 'Janaina & Carlos',
  subtitulo: 'Enlace Matrimonial • 12/10/2025',

  senha: '1234',

  backgrounds: {
    home: '/assets/bg-home.jpg',
    capitulos: '/assets/bg-capitulos.jpg',
    extras: '/assets/bg-capitulos.jpg',
    login: '/assets/bg-home.jpg',
  },

  filmePrincipal: {
    provider: 'youtube',
    url: 'https://www.youtube.com/embed/VIDEO_ID',
  },

  capitulos: [
    { label: 'Making Of', start: 30 },
    { label: 'Cerimônia', start: 420 },
    { label: 'Festa', start: 1800 },
  ],

  extras: [
    {
      label: 'Entrevistas',
      provider: 'vimeo',
      url: 'https://player.vimeo.com/video/VIDEO_ID',
    },
    {
      label: 'Trailer',
      provider: 'youtube',
      url: 'https://www.youtube.com/embed/VIDEO_ID',
    },
  ],
};

export default eventConfig;
