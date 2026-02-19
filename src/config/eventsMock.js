const eventsMock = {
    'janaina-e-carlos': {
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
            url: "https://player.vimeo.com/video/170161896?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
        },
        capitulos: [
            { label: 'Making Of', start: 0 },
            { label: 'Cerimônia', start: 87 },
            { label: 'Festa', start: 345 },
        ],
        extras: [
            {
                label: 'Entrevistas',
                url: "https://player.vimeo.com/video/170161896?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
            },
            {
                label: 'Trailer',
                url: 'https://player.vimeo.com/video/224409192?badge=0&autopause=0&player_id=0&app_id=58479',
            },
        ],
    },
    'ana-e-rafael': {
        titulo: 'Ana & Rafael',
        subtitulo: 'Casamento • 20/05/2026',
        senha: 'abc',
        backgrounds: {
            home: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622', // Exemplo URL externa
            capitulos: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
            extras: 'https://images.unsplash.com/photo-1519741497674-611481863552',
            login: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
        },
        filmePrincipal: {
            provider: 'vimeo',
            url: "https://player.vimeo.com/video/76979871",
        },
        capitulos: [
            { label: 'Início', start: 0 },
            { label: 'Votos', start: 50 },
        ],
        extras: [
            {
                label: 'Drone',
                url: "https://player.vimeo.com/video/76979871",
            },
        ],
    }
};

export default eventsMock;
