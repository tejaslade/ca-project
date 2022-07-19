const { gql } = require("@apollo/client");

const ImageFilterAdmin = gql`
  query FetchImages($user: String, $service_name: String, $searchItem: String) {
    images(
      filters: {
        users_permissions_user: { username: { eq: $user } }
        service: { service_name: { eq: $service_name } }
        or: [
          { service: { service_name: { contains: $searchItem } } }
          { users_permissions_user: { username: { contains: $searchItem } } }
          { users_permissions_user: { first_name: { contains: $searchItem } } }
          { users_permissions_user: { last_name: { contains: $searchItem } } }
          { description: { contains: $searchItem } }
        ]
      }
      pagination: {}
      sort: []
      publicationState: LIVE
    ) {
      data {
        id
        attributes {
          description
          createdAt
          confirmed
          images {
            data {
              id
              attributes {
                url
                caption

                alternativeText
              }
            }
          }
          users_permissions_user {
            data {
              id
              attributes {
                username
                first_name
                last_name
              }
            }
          }
          service {
            data {
              attributes {
                service_name
              }
            }
          }
        }
      }
    }
  }
`;

export { ImageFilterAdmin };
