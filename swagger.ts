
import { createSwaggerSpec } from 'next-swagger-doc'

const apiDocumentation = {
    openapi: '3.0.0',
    info: {
        title: 'API Ikaze',
        version: '1.0.0',
        description:
            "API pour la gestion des utilisateurs, l'authentification, les listings, les réservations, les favoris, la recherche et l'upload de fichiers",
    },
    tags: [
        {
            name: 'Utilisateurs',
            description: 'Opérations liées aux utilisateurs',
        },
        {
            name: 'Authentification',
            description: "Opérations liées à l'authentification",
        },

        {
            name: 'Autorisations',
            description: 'Opérations liées aux autorisations et rôles',
        },

        {
            name: 'Listings',
            description: 'Opérations liées aux listings',
        },
        {
            name: 'Réservations',
            description: 'Opérations liées aux réservations',
        },
        {
            name: 'Favoris',
            description: 'Opérations liées aux favoris',
        },

        {
            name: 'Recherche',
            description: 'Opérations liées à la recherche de listings',
        },

        {
            name: 'Upload',
            description: "Opérations liées à l'upload de fichiers",
        },
    ],
    paths: {
        '/api/user': {
            get: {
                tags: ['Utilisateurs'],
                summary: "Obtenir les informations de l'utilisateur courant",
                responses: {
                    '200': {
                        description:
                            "Informations de l'utilisateur récupérées avec succès",
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/User',
                                },
                            },
                        },
                    },
                    '401': {
                        description: 'Non autorisé',
                    },
                    '404': {
                        description: 'Utilisateur non trouvé',
                    },
                    '500': {
                        description: 'Erreur interne du serveur',
                    },
                },
            },
            put: {
                tags: ['Utilisateurs'],
                summary: "Mettre à jour les informations de l'utilisateur",
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UserUpdate',
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Utilisateur mis à jour avec succès',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/User',
                                },
                            },
                        },
                    },
                    '401': {
                        description: 'Non autorisé',
                    },
                    '404': {
                        description: 'Utilisateur non trouvé',
                    },
                    '500': {
                        description: 'Erreur interne du serveur',
                    },
                },
            },
            delete: {
                tags: ['Utilisateurs'],
                summary: "Supprimer l'utilisateur courant",
                responses: {
                    '200': {
                        description: 'Utilisateur supprimé avec succès',
                    },
                    '401': {
                        description: 'Non autorisé',
                    },
                    '404': {
                        description: 'Utilisateur non trouvé',
                    },
                    '500': {
                        description: 'Erreur interne du serveur',
                    },
                },
            },
        },
        '/api/user/{userId}/image': {
            get: {
                tags: ['Utilisateurs'],
                summary: "Obtenir l'image de profil d'un utilisateur",
                parameters: [
                    {
                        in: 'path',
                        name: 'userId',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: "ID de l'utilisateur",
                    },
                ],
                responses: {
                    '200': {
                        description: 'Image de profil récupérée avec succès',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        profileImage: {
                                            type: 'string',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Utilisateur non trouvé',
                    },
                    '500': {
                        description: 'Erreur interne du serveur',
                    },
                },
            },
        },
        '/api/auth/signin': {
            get: {
                tags: ['Authentification'],
                summary: 'Page de connexion',
                responses: {
                    '302': {
                        description: 'Redirection vers la page de connexion',
                    },
                },
            },
            post: {
                tags: ['Authentification'],
                summary: 'Connexion utilisateur',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string' },
                                    password: { type: 'string' },
                                },
                                required: ['email', 'password'],
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Connexion réussie',
                    },
                    '401': {
                        description: "Échec de l'authentification",
                    },
                },
            },
        },
        '/api/auth/signout': {
            post: {
                tags: ['Authentification'],
                summary: 'Déconnexion utilisateur',
                responses: {
                    '200': {
                        description: 'Déconnexion réussie',
                    },
                },
            },
        },
        '/api/auth/session': {
            get: {
                tags: ['Authentification'],
                summary: 'Obtenir la session actuelle',
                responses: {
                    '200': {
                        description: 'Session récupérée avec succès',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        user: {
                                            $ref: '#/components/schemas/User',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/admin': {
            get: {
                tags: ['Autorisations'],
                summary: "Vérifier l'autorisation d'administrateur",
                description:
                    "Vérifie si l'utilisateur actuel a le rôle d'administrateur",
                responses: {
                    '200': {
                        description:
                            'Utilisateur autorisé (rôle administrateur)',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Authorized',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '403': {
                        description: 'Accès interdit (rôle non administrateur)',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Forbidden',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Erreur interne du serveur',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Internal Server Error',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/listings': {
            get: {
                tags: ['Listings'],
                summary: "Récupérer tous les listings de l'utilisateur",
                responses: {
                    '200': {
                        description: 'Liste des listings récupérée avec succès',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Listing',
                                    },
                                },
                            },
                        },
                    },
                    '401': {
                        description: 'Non autorisé',
                    },
                    '500': {
                        description: 'Erreur interne du serveur',
                    },
                },
            },
            post: {
                tags: ['Listings'],
                summary: 'Créer un nouveau listing',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ListingInput',
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Listing créé avec succès',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Listing',
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Données invalides',
                    },
                    '401': {
                        description: 'Non autorisé',
                    },
                    '500': {
                        description: 'Erreur interne du serveur',
                    },
                },
            },
        },
        '/api/listings/{listingId}': {
            get: {
                tags: ['Listings'],
                summary: 'Récupérer un listing spécifique',
                parameters: [
                    {
                        in: 'path',
                        name: 'listingId',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Listing récupéré avec succès',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ListingWithUser',
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'ID invalide',
                    },
                    '404': {
                        description: 'Listing non trouvé',
                    },
                    '500': {
                        description: 'Erreur interne du serveur',
                    },
                },
            },
            delete: {
                tags: ['Listings'],
                summary: 'Supprimer un listing',
                parameters: [
                    {
                        in: 'path',
                        name: 'listingId',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Listing supprimé avec succès',
                    },
                    '400': {
                        description: 'ID invalide',
                    },
                    '401': {
                        description: 'Non autorisé',
                    },
                    '404': {
                        description: 'Listing non trouvé ou non autorisé',
                    },
                    '500': {
                        description: 'Erreur interne du serveur',
                    },
                },
            },
            put: {
                tags: ['Listings'],
                summary: 'Mettre à jour un listing',
                parameters: [
                    {
                        in: 'path',
                        name: 'listingId',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ListingInput',
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Listing mis à jour avec succès',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Listing',
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Données invalides ou ID invalide',
                    },
                    '401': {
                        description: 'Non autorisé',
                    },
                    '404': {
                        description: 'Listing non trouvé ou non autorisé',
                    },
                    '500': {
                        description: 'Erreur interne du serveur',
                    },
                },
            },
        },
        '/api/reservations': {
            post: {
                tags: ['Réservations'],
                summary: 'Créer une nouvelle réservation',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ReservationInput',
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Réservation créée avec succès',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Listing',
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Données invalides',
                    },
                    '401': {
                        description: 'Non autorisé',
                    },
                    '500': {
                        description: 'Erreur interne du serveur',
                    },
                },
            },
        },
        '/api/reservations/{reservationId}': {
            delete: {
                tags: ['Réservations'],
                summary: 'Supprimer une réservation',
                parameters: [
                    {
                        in: 'path',
                        name: 'reservationId',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Réservation supprimée avec succès',
                    },
                    '400': {
                        description: 'ID de réservation invalide',
                    },
                    '401': {
                        description: 'Non autorisé',
                    },
                    '404': {
                        description:
                            'Réservation non trouvée ou permission insuffisante',
                    },
                    '500': {
                        description: 'Erreur interne du serveur',
                    },
                },
            },
        },
        '/api/favorites/{listingId}': {
            post: {
                tags: ['Favoris'],
                summary: 'Ajouter un listing aux favoris',
                parameters: [
                    {
                        in: 'path',
                        name: 'listingId',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'ID du listing à ajouter aux favoris',
                    },
                ],
                responses: {
                    '200': {
                        description: 'Listing ajouté aux favoris avec succès',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Added to favorites',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'ID invalide',
                    },
                    '401': {
                        description: 'Non autorisé',
                    },
                    '500': {
                        description: 'Erreur interne du serveur',
                    },
                },
            },
            delete: {
                tags: ['Favoris'],
                summary: 'Supprimer un listing des favoris',
                parameters: [
                    {
                        in: 'path',
                        name: 'listingId',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'ID du listing à supprimer des favoris',
                    },
                ],
                responses: {
                    '200': {
                        description: 'Listing supprimé des favoris avec succès',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Removed from favorites',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'ID invalide',
                    },
                    '401': {
                        description: 'Non autorisé',
                    },
                    '500': {
                        description: 'Erreur interne du serveur',
                    },
                },
            },
        },
        '/api/search': {
            get: {
                tags: ['Recherche'],
                summary: 'Rechercher des listings',
                parameters: [
                    {
                        in: 'query',
                        name: 'q',
                        schema: {
                            type: 'string',
                        },
                        description: 'Terme de recherche',
                    },
                    {
                        in: 'query',
                        name: 'page',
                        schema: {
                            type: 'integer',
                            default: 1,
                            minimum: 1,
                        },
                        description: 'Numéro de page',
                    },
                    {
                        in: 'query',
                        name: 'limit',
                        schema: {
                            type: 'integer',
                            default: 10,
                            minimum: 1,
                            maximum: 50,
                        },
                        description: 'Nombre de résultats par page',
                    },
                    {
                        in: 'query',
                        name: 'category',
                        schema: {
                            type: 'string',
                        },
                        description: 'Catégorie de listing',
                    },
                    {
                        in: 'query',
                        name: 'minPrice',
                        schema: {
                            type: 'number',
                            minimum: 0,
                        },
                        description: 'Prix minimum',
                    },
                    {
                        in: 'query',
                        name: 'maxPrice',
                        schema: {
                            type: 'number',
                        },
                        description: 'Prix maximum',
                    },
                ],
                responses: {
                    '200': {
                        description: 'Résultats de recherche',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        results: {
                                            type: 'array',
                                            items: {
                                                $ref: '#/components/schemas/ListingWithUser',
                                            },
                                        },
                                        total: {
                                            type: 'integer',
                                            description:
                                                'Nombre total de résultats',
                                        },
                                        page: {
                                            type: 'integer',
                                            description: 'Page actuelle',
                                        },
                                        limit: {
                                            type: 'integer',
                                            description:
                                                'Nombre de résultats par page',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Erreur interne du serveur',
                    },
                },
            },
        },
    '/api/upload': {
      post: {
        tags: ['Upload'],
        summary: 'Uploader un fichier image',
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Fichier uploadé avec succès',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'File uploaded successfully',
                    },
                    fileUrl: {
                      type: 'string',
                      format: 'uri',
                      description: 'URL sécurisée du fichier uploadé',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Aucun fichier n\'a été uploadé',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'No file uploaded',
                    },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Erreur lors de l\'upload du fichier',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Error uploading file',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },



    components: {
        schemas: {
            User: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    profileImage: { type: 'string' },
                    isTwoFactorEnabled: { type: 'boolean' },
                    favoriteIds: {
                        type: 'array',
                        items: { type: 'string' },
                    },
                    emailVerified: {
                        type: 'string',
                        format: 'date-time',
                        nullable: true,
                    },
                },
            },
            UserUpdate: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    profileImage: { type: 'string' },
                    isTwoFactorEnabled: { type: 'boolean' },
                },
            },
            UserRole: {
                type: 'string',
                enum: ['USER', 'ADMIN'],
                description: "Rôle de l'utilisateur",
            },
            Listing: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    imageSrc: {
                        type: 'array',
                        items: { type: 'string' },
                    },
                    category: { type: 'string' },
                    activityType: { type: 'string' },
                    duration: { type: 'number' },
                    difficulty: { type: 'string' },
                    minParticipants: { type: 'number' },
                    maxParticipants: { type: 'number' },
                    ageRestriction: { type: 'number', nullable: true },
                    equipment: {
                        type: 'array',
                        items: { type: 'string' },
                    },
                    locationName: { type: 'string' },
                    locationAddress: { type: 'string' },
                    latitude: { type: 'number' },
                    longitude: { type: 'number' },
                    price: { type: 'number' },
                    currency: { type: 'string' },
                    isInstantBook: { type: 'boolean' },
                    cancellationPolicy: { type: 'string' },
                    userId: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
            },
            ListingInput: {
                type: 'object',
                properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    imageSrc: {
                        type: 'array',
                        items: { type: 'string' },
                    },
                    category: { type: 'string' },
                    activityType: { type: 'string' },
                    duration: { type: 'number' },
                    difficulty: { type: 'string' },
                    minParticipants: { type: 'number' },
                    maxParticipants: { type: 'number' },
                    ageRestriction: { type: 'number', nullable: true },
                    equipment: {
                        type: 'array',
                        items: { type: 'string' },
                    },
                    locationName: { type: 'string' },
                    locationAddress: { type: 'string' },
                    latitude: { type: 'number' },
                    longitude: { type: 'number' },
                    price: { type: 'number' },
                    currency: { type: 'string' },
                    isInstantBook: { type: 'boolean' },
                    cancellationPolicy: { type: 'string' },
                },
                required: [
                    'title',
                    'description',
                    'imageSrc',
                    'category',
                    'activityType',
                    'duration',
                    'difficulty',
                    'minParticipants',
                    'maxParticipants',
                    'locationName',
                    'locationAddress',
                    'latitude',
                    'longitude',
                    'price',
                ],
            },
            ListingWithUser: {
                type: 'object',
                properties: {
                    listing: {
                        $ref: '#/components/schemas/Listing',
                    },
                    user: {
                        $ref: '#/components/schemas/User',
                    },
                },
            },
            ReservationInput: {
                type: 'object',
                properties: {
                    listingId: { type: 'string' },
                    startDate: { type: 'string', format: 'date' },
                    endDate: { type: 'string', format: 'date' },
                    totalPrice: { type: 'number' },
                },
                required: ['listingId', 'startDate', 'endDate', 'totalPrice'],
            },
            Booking: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    startDate: { type: 'string', format: 'date-time' },
                    endDate: { type: 'string', format: 'date-time' },
                    totalPrice: { type: 'number' },
                    userId: { type: 'string' },
                    listingId: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                    favoriteIds: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description:
                            "Liste des IDs des listings favoris de l'utilisateur",
                    },
                    user: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            image: { type: 'string' },
                        },
                    },
                },
            },
        },
    },
}

const spec = createSwaggerSpec({
    definition: apiDocumentation,
})

export default spec

export const swaggerSpec = createSwaggerSpec({
    definition: apiDocumentation,
})
