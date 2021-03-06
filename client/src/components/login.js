import React, {useState, useEffect, Fragment} from "react";
// import {useHistory} from "react-router-dom";

import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import {Container} from "react-bootstrap";
import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
// import Spinner from "react-bootstrap/Spinner";
import axios from "axios";
import crypto from "crypto";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import ReactGA from "react-ga";
import {getIp, getBrowser} from "../functions/getClientInfo";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [loginStatus, setLoginStatus] = useState("");
  // const [salt, setSalt] = useState("");
  const [error, RaiseError] = useState(null);
  const [loading, setLoading] = useState(false);

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  useEffect(() => {
    (async function ByPassLogin() {
      await onLoad();
    })();
    //componentDidMount();
    // eslint-disable-next-line
  }, []);

  async function onLoad() {
    // fill it up when needed
    let data, loginSession;
    let params = props.match.params;
    let ip_res = await getIp();
    let browser_type = getBrowser().browser_type;
    let LogIn = (e, p) => {
      if (props.SINGLE_ACC_API_URL !== undefined) {
        axios
          .post(`${props.SINGLE_ACC_API_URL}/${e}/${p}`, {
            ip_address: ip_res.ip,
            browser_type: browser_type
          })
          .then(res => {
            data = res.data.result.result[0];
            loginSession = res.data.login_attempt_log;
            if (data.email_verify === 0) {
              // throw "Your email need to be verified before you can log in.";
              RaiseError(
                "Your email need to be verified before you can log in."
              );
              setLoading(false);
              props.history.push("/login");
              window.location.reload(false);
            } else {
              let first = data.first_name;
              let uid = data.user_uid;
              let login_id = loginSession.login_id;
              let session_id = loginSession.session_id;
              document.cookie = `loginStatus=loggedInBy:direct,first_name:${first},user_uid:${uid},login_id:${login_id},session_id:${session_id}; path=/`;
              props.history.push("/selectmealplan");
              window.location.reload(false);
            }
          })
          .catch(err => {
            document.cookie = `loginStatus=; path=/`;
            props.history.push("/login");
            RaiseError("Login Error. Try again later.");
            window.location.reload(false);
          });
      }
    };
    if (params.email !== undefined && params.password !== undefined) {
      LogIn(params.email, params.password);
    }
  }
  // async function componentDidMount() {
  //   const res = await fetch(props.API_URL);
  //   const api = await res.json();
  //   setSalt(api.result[0].password_salt);
  // }

  // API GET Request for Social Media User Data
  async function grabSocialUserInfo(email) {
    try {
      let res = await axios.get(`${props.SOCIAL_API_URL}/${email}`);
      if (res.data !== undefined && res.data.result.result.length === 0) {
        // throw "No record found.";
        return null;
      }
      let uid = res.data.result.result[0].user_uid;
      const ip_res = await getIp();
      const browser_type = getBrowser().browser_type;
      const res1 = await axios.post(
        `${props.SOCIAL_API_URL}acc/${uid}`,
        {
          ip_address: ip_res.ip,
          browser_type: browser_type
        },
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
      //success
      if (res1.data !== undefined && res1.data.result.result.length === 0) {
        // throw "No record found.";
        return null;
      } else {
        return res1.data;
      }
    } catch (err) {
      if (err.response !== undefined) {
        err.response.data.message === undefined
          ? RaiseError(err.response.data)
          : RaiseError(err.response.data.message);
      } else if (typeof err === "string") {
        RaiseError(err);
      }
    }
  }

  const responseGoogle = async response => {
    if (response.profileObj !== null && response.profileObj !== undefined) {
      const e = response.profileObj.email;
      const at = response.accessToken;
      const rt = response.googleId;
      const first_name = response.profileObj.givenName;
      const last_name = response.profileObj.familyName;
      let data = await grabSocialUserInfo(e);
      if (data === null) {
        //email not found --> render to signup for social
        props.history.push({
          pathname: "/socialsignup",
          state: {
            lastname: last_name,
            firstname: first_name,
            email: e,
            social: "Google",
            accessToken: at,
            refreshToken: rt,
            SOCIAL_API_URL: `${props.SOCIAL_API_URL}acc`
          }
        });
      } else {
        socialLogin(data);
      }
    } else {
      RaiseError("Google does not have file on this user. lol");
    }
  };
  // Maria Alejcgfbaifeg Changsky	104605834561957	pnkuzirrok_1587274227@tfbnw.net

  const responseFacebook = async response => {
    if (response.email !== null && response.email !== undefined) {
      const e = response.email;
      const at = response.accessToken;
      const rt = response.id;
      const name = response.name.split(" ");
      const last_name = name[name.length - 1];
      let first_name = "";
      for (let n = 0; n < name.length - 1; n++) {
        first_name += name[n] + " ";
      }
      let data = await grabSocialUserInfo(e);

      if (data === null) {
        //email not found --> render to signup for social
        props.history.push({
          pathname: "/socialsignup",
          state: {
            lastname: last_name,
            firstname: first_name,
            email: e,
            social: "Facebook",
            accessToken: at,
            refreshToken: rt,
            SOCIAL_API_URL: `${props.SOCIAL_API_URL}acc`
          }
        });
      } else {
        socialLogin(data);
      }
    } else {
      RaiseError(`Facebook does not have any info about this user.`);
    }
  };

  function socialLogin(data) {
    const log_attemp = data.login_attempt_log;
    const result = data.result.result[0];
    let uid = result.user_uid;
    let name = result.first_name;
    let session_id = log_attemp.session_id;
    let login_id = log_attemp.login_id;
    document.cookie = `loginStatus=loggedInBy:social,first_name:${name},user_uid:${uid},login_id:${login_id},session_id:${session_id}; path=/`;
    if (props.history.location.pathname === "/checkout") {
      props.history.push("/selectmealplan");
      window.location.reload(false);
    } else {
      checkForPurchased(uid);
    }
  }

  // Direct Login
  async function checkForPurchased(userId) {
    try {
      const checkPurchases = await fetch(
        `${props.SINGLE_ACC_API_URL}purchases/${userId}`
      );
      if (checkPurchases.status === 200) {
        // if success
        let purchases = await checkPurchases.json();
        if (purchases !== undefined && purchases.result.length !== 0) {
          props.history.push("/mealschedule");
        } else if (purchases !== undefined && purchases.result.length === 0) {
          props.history.push("/selectmealplan");
        } else {
          props.history.push("/");
        }
      } else {
        props.history.push("/"); // should prompt something or asking for re-login
      }
      setLoading(false);
      window.location.reload(false);
    } catch (err) {
      if (err.response !== undefined) {
        err.response.data.message === undefined
          ? RaiseError(err.response.data)
          : RaiseError(err.response.data.message);
      } else if (typeof err === "string") {
        RaiseError(err);
      }
      setLoading(false);
    }
  }
  async function grabLoginInfoForUser(userEmail, userPass) {
    let saltres;
    if (props.API_URL !== undefined) {
      saltres = await fetch(`${props.API_URL}/${userEmail}`);
    } else {
      saltres = await fetch(`${props.SINGLE_ACC_API_URL}salt/${userEmail}`);
    }
    const saltapi = await saltres.json();
    if (saltapi.result.length === 0) {
      // send a request to look up in social login
      let CHECK_SOCIAL_ACCOUNT_URL = `${props.DEV_URL}v2/social/${userEmail}`;
      axios.get(CHECK_SOCIAL_ACCOUNT_URL).then(res => {
        if (res.data !== undefined || res.data !== null) {
          let result = res.data.result.result;
          if (result.length === 0) {
            RaiseError("No email address found");
          } else {
            result = result[0];
            RaiseError(
              `Your account should be logged in by "${result.user_social_media} login"`
            );
          }
        }
      });
    }
    const salt = saltapi.result[0].password_salt;

    const ip_res = await getIp();
    const browser_type = getBrowser().browser_type;
    const pass = crypto
      .createHash("sha512")
      .update(userPass + salt)
      .digest("hex");
    try {
      const res = await axios.post(
        props.SINGLE_ACC_API_URL + "/" + userEmail + "/" + pass,
        {
          ip_address: ip_res.ip,
          browser_type: browser_type
        }
      );
      if (res.status === 200) {
        //success
        if (res.data.result.result[0].email_verify === 0) {
          // throw "Your email need to be verified before log in.";
          RaiseError("Your email need to be verified before you can log in.");
          setLoading(false);
        } else {
          return res.data;
        }
      } else {
        setLoading(false);
        RaiseError("Wrong password");
      }
    } catch (err) {
      if (err.response !== undefined) {
        err.response.data.message === undefined
          ? RaiseError(err.response.data)
          : RaiseError(err.response.data.message);
      } else if (typeof err === "string") {
        RaiseError(err);
      }
      setLoading(false);
    }
  }

  function checkLogin() {
    // let t = [];
    ReactGA.event({
      category: "Log In",
      action: "User is logging in"
    });
    setLoading(true);
    grabLoginInfoForUser(email, password)
      .then(res => {
        login(res);
      })
      .catch(err => {
        if (err.response !== undefined) {
          err.response.data.message === undefined
            ? RaiseError(err.response.data)
            : RaiseError(err.response.data.message);
        } else if (typeof err === "string") {
          RaiseError(err);
        }
        setLoading(false);
      });
  }
  function login(response) {
    if (response !== undefined) {
      if (response.auth_success === true) {
        // setLoginStatus("Logged In");
        let first = response.result.result[0].first_name;
        let uid = response.result.result[0].user_uid;
        let login_id = response.login_attempt_log.login_id;
        let session_id = response.login_attempt_log.session_id;
        document.cookie = `loginStatus=loggedInBy:direct,first_name:${first},user_uid:${uid},login_id:${login_id},session_id:${session_id}; path=/`;
        //check for purchases
        console.log("location: ", props.location);
        if (props.history.location.pathname === "/checkout") {
          props.history.push("/selectmealplan");
          window.location.reload(false);
        } else {
          checkForPurchased(uid);
        }
      } else {
        document.cookie = `loginStatus=; path=/`;
        setLoading(false);
      }
    }
  }
  return (
    <Fragment>
      {loading && (
        <div className='d-flex justify-content-center'>
          {/* <div className='loading'>
            <div className='spinner-border' role='status'>
              <span className='sr-only'>Loading...</span>
            </div>
          </div> */}
        </div>
      )}
      <main
        style={{marginTop: "30px"}}
        className={loading ? "half-opacity" : ""}
      >
        <div className='container text-center' style={{marginTop: "-40px"}}>
          <h1>LOGIN</h1>
          {error !== null && error !== undefined && (
            <Fragment>
              <h6>
                <span className='icon has-text-danger'>
                  <i className='fa fa-info-circle'></i>
                </span>
                <span className='has-text-danger'>{error}</span>
              </h6>
            </Fragment>
          )}
          <div className='text-center'>
            <p>To continue, please log in to Prep to Your Door.</p>
          </div>

          <Row className='justify-content-center' style={{padding: "5px 0"}}>
            <div
              style={{
                boxShadow: "0px 2px 2px 0px rgba(117,117,117,1)",
                borderRadius: "1px",
                background: "#4c69ba"
              }}
            >
              <FacebookLogin
                appId='508721976476931'
                autoLoad={false}
                fields='name,email,picture'
                onClick='return false'
                callback={responseFacebook}
                size='small'
                textButton='Continue with FB'
              />
            </div>
            {/* </div> */}
            &nbsp;
            <div style={{padding: "0 4px"}}>
              <GoogleLogin
                clientId='333899878721-tc2a70pn73hjcnegh2cprvqteiuu39h9.apps.googleusercontent.com'
                buttonText='Continue with Google'
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                isSignedIn={false}
                disable={false}
                cookiePolicy={"single_host_origin"}
              />
              {/* <div class='g-signin2 btn' data-onsuccess='onSignIn'></div> */}
            </div>
          </Row>

          <div className='row'>
            <Container
              className='justify-content-center bg-white font2 w-20'
              style={{
                border: "0",
                boxShadow: "0",
                borderColor: "white",
                padding: "5px 30px",
                cursor: "default",
                width: "400px"
              }}
            >
              <div
                style={{
                  borderTop: "1px solid #d9dadc",
                  margin: "30px 0",
                  display: "block",
                  lineHeight: "1px",
                  textAlign: "center",
                  color: "#494949"
                }}
              >
                <strong style={{background: "#fff", letterSpacing: "1px"}}>
                  &nbsp; OR &nbsp;
                </strong>
              </div>

              <Form onSubmit={handleSubmit} autoComplete='off'>
                <InputGroup className='mb-3'>
                  <FormControl
                    type='email'
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      RaiseError(null);
                    }}
                    id='userForm'
                    placeholder='Email'
                    aria-label='Email'
                    aria-describedby='basic-addon1'
                  />
                </InputGroup>

                <InputGroup className='mb-3'>
                  <FormControl
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                      RaiseError(null);
                    }}
                    id='passForm'
                    placeholder='Password'
                    aria-label='Password'
                    aria-describedby='basic-addon2'
                    type='password'
                  />
                </InputGroup>

                <Button
                  variant='success'
                  onClick={checkLogin}
                  disabled={!validateForm()}
                  type='submit'
                  style={{width: "100%"}}
                >
                  <strong style={{color: "white"}}>Sign In</strong>
                </Button>

                <div className='text-center' style={{padding: "10px"}}>
                  <a href='/resetpassword' style={{color: "#494949"}}>
                    Forgot password?
                  </a>
                </div>
              </Form>
              {/* </Col> */}
              {/* </Row> */}

              {/* <p>&nbsp;</p> */}
              {/* <p style={{color: "#494949", paddingTop: "10px"}}>Or Login With Social Media</p> */}

              <div
                style={{
                  borderTop: "1px solid #d9dadc",
                  margin: "20px 0",
                  display: "block",
                  lineHeight: "1px",
                  textAlign: "center",
                  color: "#494949"
                }}
              ></div>
              {/* <hr/> */}

              <div className='text-center' style={{padding: "10px 0 50px 0px"}}>
                <p style={{fontWeight: "bold", color: "#494949"}}>
                  Don't have an account?
                </p>
                <a
                  id='signupButton'
                  href='/signup'
                  style={{
                    border: "2px solid #469b47",
                    color: "#469b47",
                    padding: "8px 110px",
                    borderRadius: "4px"
                  }}
                >
                  <strong style={{color: "#469b47"}}>Sign Up Here</strong>
                </a>
              </div>
            </Container>
            {/* <Col></Col> */}
          </div>

          {/* &nbsp; */}
        </div>
      </main>
    </Fragment>
  );
}
