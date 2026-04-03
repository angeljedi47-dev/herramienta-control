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
        | 'GET_PROJECTS_PUBLIC_STATUS'
        | 'GET_TIPOS_INFORME'
        | 'GET_TIPO_INFORME_PUBLIC_STATUS'
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
    | 'DELETE_PROJECT'
    | 'CREATE_TIPO_INFORME'
    | 'DELETE_TIPO_INFORME',
];

export type { QueryKey, MutationKey };
