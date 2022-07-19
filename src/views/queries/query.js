import { gql } from "@apollo/client";

const addRemarkImage = gql`
  mutation UploadFile($id: ID!, $caption: String) {
    updateUploadFile(id: $id, data: { caption: $caption }) {
      data {
        id
      }
    }
  }
`;

// Image checkbox for confirmation the image is not or confirm
const imageCheckbox = gql`
  mutation UploadFile($id: ID!, $alternate_text: String) {
    updateUploadFile(id: $id, data: { alternativeText: $alternate_text }) {
      data {
        id
        attributes {
          name
          url
          alternativeText
        }
      }
    }
  }
`;

const getImageRemark = gql`
  query get_remarks {
    imageRemarks {
      data {
        id
        attributes {
          image_id
          remarks
          checked
        }
      }
    }
  }
`;

const getFilteredImageBills = gql`
  query {
    images(
      filters: {
        service: { service_name: { eq: "Gumasta" } }
        users_permissions_user: { username: { eq: "ankush" } }
      }
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

          image_remarks {
            data {
              id
              attributes {
                image_id
                remarks
                checked
                image {
                  data {
                    id
                  }
                }
              }
            }
          }
          service {
            data {
              attributes {
                service_name
                service_cateogory
              }
            }
          }
        }
      }
    }
  }
`;

export { addRemarkImage, getImageRemark, imageCheckbox, getFilteredImageBills };
