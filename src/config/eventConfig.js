const eventConfig = {
  titulo: 'Janaina & Carlos',
  subtitulo: 'Casamento • 12/10/2025',

  senha: '1234',

  backgrounds: {
    home: '/assets/principal.jpg',
    capitulos: '/assets/principal.jpg',
    extras: '/assets/Extra-bg.jpg',
    login: '/assets/principal.jpg',
  },

  filmePrincipal: {
    provider: 'vimeo',
    url: 'https://player.vimeo.com/video/224409192?badge=0&autopause=0&player_id=0&app_id=58479',
  },

  capitulos: [
    { label: 'Making Of', start: 0 },
    { label: 'Cerimônia', start: 87 },
    { label: 'Festa', start: 345 },
  ],

  extras: [
    {
      label: 'Entrevistas',
      url: 'https://player.vimeo.com/video/224409192?badge=0&autopause=0&player_id=0&app_id=58479',
    },
    {
      label: 'Trailer',
      url: 'https://player.vimeo.com/video/224409192?badge=0&autopause=0&player_id=0&app_id=58479',
    },
  ],
};

export default eventConfig;
