type QueryKey = [
    (
        | 'PAGINATION_USERS'
        | 'GET_ROLES'
        | 'GET_MODULOS_WITH_OPERATIONS'
        | 'VALIDATE_TOKEN'
        | 'COMBOBOX_SEARCH_DEFAULT'
        | 'COMBOBOX_SEARCH_ROLES'
        | 'GET_IMAGE'
        | 'PAGINATION_PROJECTS'
    ),
    ...ReadonlyArray<unknown>,
];

type MutationKey = [
    | 'VALIDATE_TOKEN'
    | 'SIGN_IN'
    | 'CREATE_ROL'
    | 'CREATE_USER'
    | 'DELETE_ROL'
    | 'DELETE_USER'
    | 'RESTORE_USER'
    | 'CREATE_PROJECT'
    | 'DELETE_PROJECT',
];

export type { QueryKey, MutationKey };
