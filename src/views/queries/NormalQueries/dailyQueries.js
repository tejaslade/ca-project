const { gql } = require("@apollo/client");

const AllImageBills = gql`
  query ImageList($username: String) {
    images(
      filters: { users_permissions_user: { username: { eq: $username } } }
      pagination: { limit: 100000 }
      sort: ["createdAt:DESC", "updatedAt:DESC"]
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

const AllFeedBills = gql`
  query FeedList($username: String) {
    feedForms(
      filters: { users_permissions_user: { username: { eq: $username } } }
      pagination: {}
      sort: []
      publicationState: LIVE
    ) {
      data {
        id
        attributes {
          phone_no
          description
          confirmed
          service {
            data {
              attributes {
                service_name
              }
            }
          }
          users_permissions_user {
            data {
              attributes {
                username
                first_name
                last_name
              }
            }
          }
          createdAt
        }
      }
    }
  }
`;

export { AllImageBills , AllFeedBills };
