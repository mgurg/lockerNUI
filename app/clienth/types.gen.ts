// This file is auto-generated by @hey-api/openapi-ts

export type AnswerRequest = {
    choice: number;
};

export type CompaniesPaginated = {
    data: Array<CompanyIndexResponse>;
    count: number;
    limit: number;
    offset: number;
};

export type CompanyAdd = {
    name: string;
    brand?: (string | null);
    gov_id?: (string | null);
    gov_id_type?: (string | null);
    place_id?: (string | null);
    website?: (string | null);
    email?: (string | null);
    phone?: (string | null);
    location: LocationAdd;
};

export type CompanyIndexResponse = {
    uuid: string;
    name: string;
};

export type CurrentPuzzleResponse = {
    scenario: string;
    base_hint: string;
    options: Array<Option>;
    correct: number;
    result: string;
    wrong_feedback: Array<WrongFeedback>;
    current_puzzle: number;
};

export type DepartmentAdd = {
    company_uuid?: (string | null);
    location: LocationAdd;
    name: string;
};

export type GameOutro = {
    outro: string;
};

export type GameStart = {
    theme: string;
    description: string;
    difficulty: string;
    category: string;
    occasion: string;
    email?: (string | null);
};

export type GameStartResponse = {
    uuid: string;
    token: string;
    intro: string;
    created_at: string;
};

export type GameState = {
    theme: string;
    details: string;
    current_puzzle: number;
    wrong_answers: number;
    moves: number;
    hints_remaining: number;
    game_state: string;
    story: string;
    puzzle_descriptions: Array<(string)>;
    puzzle_history: Array<(string)>;
};

export type GeoNameAdd = {
    name: string;
    lang: string;
};

export type HTTPValidationError = {
    detail?: Array<ValidationError>;
};

export type LocationAdd = {
    street_address: string;
    city: string;
    state_province?: (string | null);
    postal_code?: (string | null);
    country: string;
    located_in?: (string | null);
    type?: ('company' | 'department' | 'room' | null);
    lat?: (number | null);
    lon?: (number | null);
};

export type Option = {
    number: number;
    text: string;
};

export type PlaceAdd = {
    lat: (number | string | null);
    lon: (number | string | null);
    lat_min: (number | string | null);
    lat_max: (number | string | null);
    lon_min: (number | string | null);
    lon_max: (number | string | null);
    population: (number | null);
    importance: (number | null);
    category: string;
    region: (string | null);
    country: (string | null);
    geo_names: Array<GeoNameAdd>;
};

export type RoomAdd = {
    name: string;
    company_uuid: string;
    department_uuid?: (string | null);
    price_from?: (number | null);
    game_duration?: (number | null);
    players_min?: (number | null);
    players_max?: (number | null);
    reservation_url?: (string | null);
    lm_id?: (string | null);
    mt_id?: (string | null);
    location: LocationAdd;
    translation: TranslationAdd;
};

export type TranslationAdd = {
    lang: string;
    title: string;
    lead?: (string | null);
    description?: (string | null);
};

export type ValidationError = {
    loc: Array<(string | number)>;
    msg: string;
    type: string;
};

export type WrongFeedback = {
    number: number;
    feedback: string;
};

export type RoomByUuidRoomsRoomUuidGetData = {
    path: {
        room_uuid: string;
    };
};

export type RoomByUuidRoomsRoomUuidGetResponse = (unknown);

export type RoomByUuidRoomsRoomUuidGetError = (HTTPValidationError);

export type RoomByUrlSlugRoomsUrlLanguageRoomUrlSlugGetData = {
    path: {
        language: string;
        room_url_slug: string;
    };
};

export type RoomByUrlSlugRoomsUrlLanguageRoomUrlSlugGetResponse = (unknown);

export type RoomByUrlSlugRoomsUrlLanguageRoomUrlSlugGetError = (HTTPValidationError);

export type RoomsByLocationRoomsUrlLanguagePlaceLocationGetData = {
    path: {
        language: string;
        location: string;
    };
};

export type RoomsByLocationRoomsUrlLanguagePlaceLocationGetResponse = (unknown);

export type RoomsByLocationRoomsUrlLanguagePlaceLocationGetError = (HTTPValidationError);

export type AddDepartmentRoomsDepartmentPostData = {
    body: RoomAdd;
};

export type AddDepartmentRoomsDepartmentPostResponse = (unknown);

export type AddDepartmentRoomsDepartmentPostError = (HTTPValidationError);

export type AddRoomRoomsPostData = {
    body: RoomAdd;
};

export type AddRoomRoomsPostResponse = (unknown);

export type AddRoomRoomsPostError = (HTTPValidationError);

export type PlaceByNamePlacesLocationNameGetData = {
    path: {
        location_name: string;
    };
    query?: {
        language?: (string | null);
    };
};

export type PlaceByNamePlacesLocationNameGetResponse = (unknown);

export type PlaceByNamePlacesLocationNameGetError = (HTTPValidationError);

export type PlaceByUuidPlacesGeoipGetResponse = (unknown);

export type PlaceByUuidPlacesGeoipGetError = unknown;

export type PlacesWithRoomsPlacesGetData = {
    query?: {
        country?: (string | null);
    };
};

export type PlacesWithRoomsPlacesGetResponse = (unknown);

export type PlacesWithRoomsPlacesGetError = (HTTPValidationError);

export type AddRoomPlacesPostData = {
    body: PlaceAdd;
};

export type AddRoomPlacesPostResponse = (void);

export type AddRoomPlacesPostError = (HTTPValidationError);

export type GetCompaniesCompaniesGetData = {
    query?: {
        field?: 'name' | 'created_at';
        limit?: number;
        offset?: number;
        order?: 'asc' | 'desc';
        search?: (string | null);
    };
};

export type GetCompaniesCompaniesGetResponse = (CompaniesPaginated);

export type GetCompaniesCompaniesGetError = (HTTPValidationError);

export type AddCompanyCompaniesPostData = {
    body: CompanyAdd;
};

export type AddCompanyCompaniesPostResponse = (void);

export type AddCompanyCompaniesPostError = (HTTPValidationError);

export type AddRoomCompaniesDepartmentPostData = {
    body: DepartmentAdd;
};

export type AddRoomCompaniesDepartmentPostResponse = (unknown);

export type AddRoomCompaniesDepartmentPostError = (HTTPValidationError);

export type GetTestGamesTestGetData = {
    query: {
        game_uuid: string;
    };
};

export type GetTestGamesTestGetResponse = (unknown);

export type GetTestGamesTestGetError = (HTTPValidationError);

export type PostTestGamesTestGameUuidPostData = {
    path: {
        game_uuid: string;
    };
};

export type PostTestGamesTestGameUuidPostResponse = (unknown);

export type PostTestGamesTestGameUuidPostError = (HTTPValidationError);

export type StartGameGamesStartPostData = {
    body: GameStart;
};

export type StartGameGamesStartPostResponse = (GameStartResponse);

export type StartGameGamesStartPostError = (HTTPValidationError);

export type GetIntroGamesIntroGameUuidGetData = {
    path: {
        game_uuid: string;
    };
};

export type GetIntroGamesIntroGameUuidGetResponse = (unknown);

export type GetIntroGamesIntroGameUuidGetError = (HTTPValidationError);

export type GetPuzzleGamesPuzzleGameUuidGetData = {
    path: {
        game_uuid: string;
    };
};

export type GetPuzzleGamesPuzzleGameUuidGetResponse = (CurrentPuzzleResponse);

export type GetPuzzleGamesPuzzleGameUuidGetError = (HTTPValidationError);

export type SubmitAnswerGamesAnswerGameUuidPostData = {
    body: AnswerRequest;
    path: {
        game_uuid: string;
    };
};

export type SubmitAnswerGamesAnswerGameUuidPostResponse = (unknown);

export type SubmitAnswerGamesAnswerGameUuidPostError = (HTTPValidationError);

export type GetHintGamesHintPostData = {
    query: {
        game_uuid: string;
    };
};

export type GetHintGamesHintPostResponse = (unknown);

export type GetHintGamesHintPostError = (HTTPValidationError);

export type GetGameStatusGamesStatusGetData = {
    query: {
        game_uuid: string;
    };
};

export type GetGameStatusGamesStatusGetResponse = (GameState);

export type GetGameStatusGamesStatusGetError = (HTTPValidationError);

export type GetEndingGamesEndingGameUuidGetData = {
    path: {
        game_uuid: string;
    };
};

export type GetEndingGamesEndingGameUuidGetResponse = (GameOutro);

export type GetEndingGamesEndingGameUuidGetError = (HTTPValidationError);

export type ReadRootGetResponse = (unknown);

export type ReadRootGetError = unknown;