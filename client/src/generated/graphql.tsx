import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  getMovies: PaginatedMovies;
  getOne: Movie;
};


export type QueryGetMoviesArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryGetOneArgs = {
  id: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
};

export type PaginatedMovies = {
  __typename?: 'PaginatedMovies';
  movies: Array<Movie>;
  hasMore: Scalars['Boolean'];
};

export type Movie = {
  __typename?: 'Movie';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  title: Scalars['String'];
  creatorId: Scalars['Float'];
  creator: User;
  description: Scalars['String'];
  poster: Scalars['String'];
  reason: Scalars['String'];
  rating: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: UserResponse;
  resetPassword: Scalars['Boolean'];
  registerUser: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  addMovie: Movie;
  updateMovie?: Maybe<Movie>;
  deleteMovie: Scalars['Boolean'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  email: Scalars['String'];
};


export type MutationRegisterUserArgs = {
  options: UserCredentials;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationAddMovieArgs = {
  input: MovieInput;
};


export type MutationUpdateMovieArgs = {
  title?: Maybe<Scalars['String']>;
  id: Scalars['Float'];
};


export type MutationDeleteMovieArgs = {
  id: Scalars['Float'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type UserCredentials = {
  email: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
};

export type MovieInput = {
  title: Scalars['String'];
  description: Scalars['String'];
  poster: Scalars['String'];
  reason: Scalars['String'];
  rating: Scalars['String'];
};

export type MovieInfoFragment = (
  { __typename?: 'Movie' }
  & Pick<Movie, 'id' | 'createdAt' | 'updatedAt' | 'title' | 'rating' | 'description' | 'reason' | 'poster'>
  & { creator: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'email'>
  ) }
);

export type RegularErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type RegularUserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & RegularErrorFragment
  )>>, user?: Maybe<(
    { __typename?: 'User' }
    & UserInfoFragment
  )> }
);

export type UserInfoFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username'>
);

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type ResetPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ResetPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'resetPassword'>
);

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  options: UserCredentials;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { registerUser: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type AddMovieMutationVariables = Exact<{
  input: MovieInput;
}>;


export type AddMovieMutation = (
  { __typename?: 'Mutation' }
  & { addMovie: (
    { __typename?: 'Movie' }
    & Pick<Movie, 'id' | 'createdAt' | 'updatedAt' | 'title' | 'description' | 'reason' | 'poster' | 'rating' | 'creatorId'>
  ) }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & UserInfoFragment
  )> }
);

export type GetMoviesQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type GetMoviesQuery = (
  { __typename?: 'Query' }
  & { getMovies: (
    { __typename?: 'PaginatedMovies' }
    & Pick<PaginatedMovies, 'hasMore'>
    & { movies: Array<(
      { __typename?: 'Movie' }
      & MovieInfoFragment
    )> }
  ) }
);

export const MovieInfoFragmentDoc = gql`
    fragment MovieInfo on Movie {
  id
  createdAt
  updatedAt
  title
  rating
  description
  reason
  poster
  creator {
    id
    username
    email
  }
}
    `;
export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const UserInfoFragmentDoc = gql`
    fragment UserInfo on User {
  id
  username
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ...UserInfo
  }
}
    ${RegularErrorFragmentDoc}
${UserInfoFragmentDoc}`;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const ResetPasswordDocument = gql`
    mutation resetPassword($email: String!) {
  resetPassword(email: $email)
}
    `;

export function useResetPasswordMutation() {
  return Urql.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($options: UserCredentials!) {
  registerUser(options: $options) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const AddMovieDocument = gql`
    mutation addMovie($input: MovieInput!) {
  addMovie(input: $input) {
    id
    createdAt
    updatedAt
    title
    description
    reason
    poster
    rating
    creatorId
  }
}
    `;

export function useAddMovieMutation() {
  return Urql.useMutation<AddMovieMutation, AddMovieMutationVariables>(AddMovieDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    ...UserInfo
  }
}
    ${UserInfoFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const GetMoviesDocument = gql`
    query getMovies($limit: Int!, $cursor: String) {
  getMovies(cursor: $cursor, limit: $limit) {
    hasMore
    movies {
      ...MovieInfo
    }
  }
}
    ${MovieInfoFragmentDoc}`;

export function useGetMoviesQuery(options: Omit<Urql.UseQueryArgs<GetMoviesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetMoviesQuery>({ query: GetMoviesDocument, ...options });
};