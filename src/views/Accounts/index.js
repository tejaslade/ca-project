// material-ui
import { gql, useQuery } from "@apollo/client";
import { Box, Container, Grid } from "@mui/material";

// project imports
import MainCard from "ui-component/cards/MainCard";
import { AccountProfile } from "./account-profile";
import { AccountProfileDetails } from "./account-profile-details";
import { SettingsPassword } from "./SettingPassword";

// ==============================|| SAMPLE PAGE ||============================== //

const Account = () => {
  const userID = localStorage.getItem("user");

  const AccountUser = gql`
    query {
      usersPermissionsUser(id: ${userID}) {
        data {
          id
          attributes {
            username
            email
            first_name
            last_name
            phone_no
            avatar {
              data {
                id
                attributes {
                  url
                }
              }
            }
          }
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(AccountUser);
  console.log(data);
  const user = data?.usersPermissionsUser?.data?.attributes;
  if (error) {
    console.log(error);
  }

  return (
    <>
      <MainCard title="Accounts profile">
        <Box>
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              <Grid item lg={4} md={6} xs={12}>
                <AccountProfile user={user} />
              </Grid>

              <Grid item lg={8} md={6} xs={12}>
                <AccountProfileDetails user={user} />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </MainCard>
      <br />
      <br />
      {/* <MainCard title="Update Password"> */}
      {/* <Box sx={{ pt: 3 }}> */}
      {/* <SettingsPassword /> */}
      {/* </Box> */}
      {/* </MainCard> */}
    </>
  );
};

export default Account;

// import { AccountProfile } from '../components/account/account-profile';
// import { AccountProfileDetails } from '../components/account/account-profile-details';
// import { DashboardLayout } from '../components/dashboard-layout';
