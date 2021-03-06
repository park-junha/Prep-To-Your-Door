import React, {Component} from "react";

import ChangePassword from "../ChangePassword";
import {
  Form,
  Modal,
  Button,
  Tooltip,
  Col,
  OverlayTrigger
} from "react-bootstrap";
import moment from "moment";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";

export default class MakeChange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      currentPurchase: this.props.currentPurchase,
      mealPlans: this.props.mealPlans,

      paymentPlans: [], // use for reconstruct mealPlans
      showPasswordChange: false,
      showDeleteModal: false,
      showSaveModal: false,
      //handle error
      showErrorModal: false,
      errorMessage: "",
      //some variables need for submit forms
      updateMealPlan: {
        meal_plan_id: this.props.currentPurchase.meal_plan_id, //use for saving temporary value when updating
        name: this.props.currentPurchase.meal_plan_desc,
        price: this.props.currentPurchase.meal_plan_price,
        amount_paid: 0
      },
      tax_rate: this.props.tax_rate, //these info should be taken from database instead of hard coded
      shipping: this.props.shipping,
      loading: false,
      creditCard: {
        cc_num: this.props.currentPurchase.cc_num,
        cc_cvv: this.props.currentPurchase.cc_cvv,
        cc_exp_month:
          moment(this.props.currentPurchase.cc_exp_date)._d.getMonth() + 1, // 0 for January
        cc_exp_year: moment(
          this.props.currentPurchase.cc_exp_date
        )._d.getFullYear()
      },
      deliveryAddress: {
        delivery_first_name: this.props.currentPurchase.delivery_first_name,
        delivery_last_name: this.props.currentPurchase.delivery_last_name,
        delivery_email: this.props.currentPurchase.delivery_email,
        delivery_phone: this.props.currentPurchase.delivery_phone,
        delivery_address: this.props.currentPurchase.delivery_address,
        delivery_address_unit:
          this.props.currentPurchase.delivery_address_unit !== undefined &&
          this.props.currentPurchase.delivery_address_unit !== null
            ? this.props.currentPurchase.delivery_address_unit
            : "",
        delivery_city: this.props.currentPurchase.delivery_city,
        delivery_state: this.props.currentPurchase.delivery_state,
        delivery_zip: this.props.currentPurchase.delivery_zip,
        delivery_region: this.props.currentPurchase.delivery_region,
        delivery_instructions: this.props.currentPurchase.delivery_instructions
      }
    };
  }
  componentDidMount = () => {
    //re-construct meal plans array
    if (this.state.mealPlans !== null && this.state.mealPlans !== undefined) {
      let fiveMealPaymentPlans = this.state.mealPlans.FiveMealPaymentPlans
        .result;
      let tenMealPaymentPlans = this.state.mealPlans.TenMealPaymentPlans.result;
      let fifteenMealPaymentPlans = this.state.mealPlans.FifteenMealPaymentPlans
        .result;
      let twentyMealPaymentPlans = this.state.mealPlans.TwentyMealPaymentPlans
        .result;

      let temp_array = [];
      for (let plan of fiveMealPaymentPlans) {
        temp_array.push(plan);
      }
      for (let plan of tenMealPaymentPlans) {
        temp_array.push(plan);
      }
      for (let plan of fifteenMealPaymentPlans) {
        temp_array.push(plan);
      }
      for (let plan of twentyMealPaymentPlans) {
        temp_array.push(plan);
      }
      this.setState({paymentPlans: temp_array});
    }
  };
  componentDidUpdate = prevProps => {
    //watching parent changes to update currentPurchase
    // updatingn meal planns
    if (prevProps.mealPlans !== this.props.mealPlans) {
      this.setState({mealPlans: this.props.mealPlans});
    }
    //update the currentPurchase and its associated infomation
    if (
      prevProps.currentPurchase.purchase_id !==
      this.props.currentPurchase.purchase_id
    ) {
      this.setState({
        currentPurchase: this.props.currentPurchase,
        updateMealPlan: {
          meal_plan_id: this.props.currentPurchase.meal_plan_id, //use for saving temporary value when updating
          name: this.props.currentPurchase.meal_plan_desc,
          price: this.props.currentPurchase.meal_plan_price,
          amount_paid: 0
        },
        creditCard: {
          cc_num: this.props.currentPurchase.cc_num,
          cc_cvv: this.props.currentPurchase.cc_cvv,
          cc_exp_month:
            moment(this.props.currentPurchase.cc_exp_date)._d.getMonth() + 1, // 0 for January
          cc_exp_year: moment(
            this.props.currentPurchase.cc_exp_date
          )._d.getFullYear()
        },
        deliveryAddress: {
          delivery_first_name: this.props.currentPurchase.delivery_first_name,
          delivery_last_name: this.props.currentPurchase.delivery_last_name,
          delivery_email: this.props.currentPurchase.delivery_email,
          delivery_phone: this.props.currentPurchase.delivery_phone,
          delivery_address: this.props.currentPurchase.delivery_address,
          delivery_address_unit:
            this.props.currentPurchase.delivery_address_unit !== undefined &&
            this.props.currentPurchase.delivery_address_unit !== null
              ? this.props.currentPurchase.delivery_address_unit
              : "",
          delivery_city: this.props.currentPurchase.delivery_city,
          delivery_state: this.props.currentPurchase.delivery_state,
          delivery_zip: this.props.currentPurchase.delivery_zip,
          delivery_region: this.props.currentPurchase.delivery_region,
          delivery_instructions: this.props.currentPurchase
            .delivery_instructions
        }
      });
    }
  };

  ShowHideChangePasswordModal = () => {
    this.state.showPasswordChange
      ? this.setState({showPasswordChange: false})
      : this.setState({showPasswordChange: true});
  };

  ShowHideDeleteModal = () => {
    this.state.showDeleteModal
      ? this.setState({showDeleteModal: false})
      : this.setState({showDeleteModal: true});
  };

  ShowHideSaveModal = () => {
    if (
      this.state.currentPurchase.meal_plan_id !==
      this.state.updateMealPlan.meal_plan_id
    ) {
      this.state.showSaveModal
        ? this.setState({showSaveModal: false})
        : this.setState({showSaveModal: true});
    } else {
      this.UpdateChangingSubcription();
    }
  };
  ShowHideErrorModal = () => {
    this.state.showErrorModal
      ? this.setState({showErrorModal: false})
      : this.setState({showErrorModal: true});
  };
  DeleteCurrentPurchase = () => {
    this.setState({loading: true});
    axios
      .patch(this.props.DELETE_URL, {
        purchase_id: this.state.currentPurchase.purchase_id
      })
      .then(res => {
        //success => reload the current page
        this.props.history.push("/mealschedule");
        window.location.reload(false);
        // this.setState({loading: false});
      })
      .catch(err => {
        console.log(err);

        this.setState({
          errorMessage: err,
          showDeleteModal: false,
          showPasswordChange: false,
          showSaveModal: false,
          loading: false
        });
        this.ShowHideErrorModal();
      });
  };
  handleChangeSubcription = async e => {
    e.persist();

    let paymentPlans = this.state.paymentPlans;
    let res = await axios.get(`${this.props.REFUND_URL}`, {
      params: {
        purchase_id: this.state.currentPurchase.purchase_id
      }
    });
    let paid = res.data.refund_amount;
    console.log(paid);
    this.setState(prevState => ({
      updateMealPlan: {
        ...prevState.updateMealPlan,
        meal_plan_id: paymentPlans[e.target.value].meal_plan_id,
        name: paymentPlans[e.target.value].meal_plan_desc,
        price: paymentPlans[e.target.value].meal_plan_price,
        amount_paid: parseFloat(
          (
            parseFloat(paymentPlans[e.target.value].meal_plan_price) *
              (1 + this.state.tax_rate) +
            this.state.shipping -
            paid
          ).toFixed(2)
        )
      }
    }));
  };
  UpdateChangingSubcription = async () => {
    this.setState({loading: true});
    // update changing subcription
    try {
      //update changing delivery address
      await axios.patch(`${this.props.UPDATE_ADDRESS_URL}`, {
        ...this.state.deliveryAddress,
        purchase_id: this.state.currentPurchase.purchase_id
      });
      //update changing payment for subcription
      let creditCard = this.state.creditCard;
      await axios.patch(this.props.UPDATE_PAYMENT_URL, {
        purchase_id: this.state.currentPurchase.purchase_id,
        ...this.state.creditCard,
        cc_exp_month: creditCard.cc_exp_month,
        cc_exp_year: creditCard.cc_exp_year
      });
      if (
        this.state.currentPurchase.meal_plan_id !==
        this.state.updateMealPlan.meal_plan_id
      ) {
        // mealplan ID is changed
        // buy a new purchase
        let data = {
          user_uid: this.props.user_uid,
          purchase_id: this.state.currentPurchase.purchase_id,
          is_gift: this.state.currentPurchase.gift,
          item: this.state.updateMealPlan.name, // target meal plan
          item_price: this.state.updateMealPlan.price, //target meal plan's price
          tax_rate: this.state.tax_rate,
          shipping: this.state.shipping,
          ...this.state.creditCard,
          billing_zip: this.state.currentPurchase.billing_zip,
          ...this.state.deliveryAddress
        };
        await axios
          .post(`${this.props.CHANGE_SUBCRIPTION_URL}`, data)
          .catch(err => {
            throw err.response.data.message;
          }); //update
      }

      this.props.history.push("/mealschedule");
      window.location.reload("false");
      // this.setState({loading: false});
    } catch (err) {
      this.setState({
        errorMessage: err,
        showDeleteModal: false,
        showPasswordChange: false,
        showSaveModal: false,
        loading: false
      });
      this.ShowHideErrorModal();
    }
  };
  render() {
    return (
      <>
        {this.state.show &&
          !this.state.showPasswordChange &&
          !this.state.showDeleteModal &&
          !this.state.showSaveModal &&
          !this.state.ShowHideErrorModal && (
            <Modal
              show={this.state.show}
              onHide={this.props.ChangeAccountInfo}
              size='lg'
              aria-labelledby='contained-modal-title-vcenter'
              centered
            >
              <Modal.Header>
                <div className='d-flex'>
                  <Modal.Title
                    id='contained-modal-title-vcenter'
                    className='has-text-info font6'
                  >
                    Edit Profile
                  </Modal.Title>
                  {this.props.searchCookie4LoggedInBy === "direct" && (
                    <Button
                      className='ml-2 font2'
                      onClick={this.ShowHideChangePasswordModal}
                    >
                      Change Password
                    </Button>
                  )}
                </div>
              </Modal.Header>
              <Modal.Body>
                <div className='scrollMenu-profile font2'>
                  <h5 style={{marginTop: "0"}}>Subscription Details</h5>
                  <Form>
                    <Form.Row>
                      <Form.Group
                        as={Col}
                        md={6}
                        controlId='formGridCardSubscription'
                      >
                        <Form.Label>Current Subscription</Form.Label>

                        <Form.Control
                          name='currentSubcription'
                          defaultValue={
                            this.state.currentPurchase.meal_plan_desc
                          }
                          readOnly
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md={6}
                        controlId='formGridCardPayment'
                      >
                        <Form.Label>Change Subscription</Form.Label>
                        <Form.Control
                          as='select'
                          name='subscription'
                          onChange={this.handleChangeSubcription}
                        >
                          <option>Choose...</option>
                          {/* drop down meal plans goes here */}
                          {this.state.paymentPlans.map((plan, key) => (
                            <option key={key} value={key}>
                              {plan.meal_plan_desc} --- ${plan.meal_plan_price}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Form.Row>
                    <h5>Credit Card Details</h5>
                    <Form.Row>
                      <Form.Group
                        as={Col}
                        md={6}
                        controlId='formGridCardNumber'
                      >
                        <Form.Label>Credit Card Number</Form.Label>
                        <Form.Control
                          placeholder='Enter Card Number'
                          name='cc_num'
                          value={this.state.creditCard.cc_num}
                          onChange={e => {
                            e.persist();
                            this.setState(prevState => ({
                              creditCard: {
                                ...prevState.creditCard,
                                cc_num: e.target.value
                              }
                            }));
                          }}
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group as={Col} md={4} controlId='formGridCardCvc'>
                        <Form.Label>CVV</Form.Label>
                        <Form.Control
                          placeholder='123'
                          name='cc_cvv'
                          value={this.state.creditCard.cc_cvv}
                          onChange={e => {
                            e.persist();
                            this.setState(prevState => ({
                              creditCard: {
                                ...prevState.creditCard,
                                cc_cvv: e.target.value
                              }
                            }));
                          }}
                        />
                      </Form.Group>

                      <Form.Group as={Col} md={4} controlId='formGridCardMonth'>
                        <Form.Label>Month</Form.Label>

                        <Form.Control
                          as='select'
                          name='cc_exp_month'
                          onChange={e => {
                            console.log("event: ", e.target);
                            e.persist();
                            this.setState(prevState => ({
                              creditCard: {
                                ...prevState.creditCard,
                                cc_exp_month: e.target.value
                              }
                            }));
                          }}
                          value={this.state.creditCard.cc_exp_month}
                        >
                          <option>{1}</option>
                          <option>{2}</option>
                          <option>{3}</option>
                          <option>{4}</option>
                          <option>{5}</option>
                          <option>{6}</option>
                          <option>{7}</option>
                          <option>{8}</option>
                          <option>{9}</option>
                          <option>{10}</option>
                          <option>{11}</option>
                          <option>{12}</option>
                        </Form.Control>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} md={4} controlId='formGridCardYear'>
                        <Form.Label>Year</Form.Label>
                        <Form.Control
                          as='select'
                          name='cc_exp_year'
                          value={this.state.creditCard.cc_exp_year}
                          onChange={e => {
                            e.persist();
                            this.setState(prevState => ({
                              creditCard: {
                                ...prevState.creditCard,
                                cc_exp_year: e.target.value
                              }
                            }));
                          }}
                        >
                          <option>2020</option>
                          <option>2021</option>
                          <option>2022</option>
                          <option>2023</option>
                          <option>2024</option>
                          <option>2025</option>
                          <option>2026</option>
                          <option>2027</option>
                          <option>2028</option>
                          <option>2029</option>
                        </Form.Control>
                      </Form.Group>
                    </Form.Row>
                    <h5>Delivery Details</h5>
                    <Form.Group controlId='formGridAddress'>
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        placeholder='1234 Main St'
                        name='delivery_address'
                        value={this.state.deliveryAddress.delivery_address}
                        onChange={e => {
                          e.persist();
                          this.setState(prevState => ({
                            deliveryAddress: {
                              ...prevState.deliveryAddress,
                              delivery_address: e.target.value
                            }
                          }));
                        }}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md={4}
                      style={{marginLeft: "-15px"}}
                      controlId='formGridAptNum'
                    >
                      <Form.Label>
                        Apartment/Unit <b>(Optional)</b>
                      </Form.Label>
                      <Form.Control
                        placeholder='Apartment, studio, or floor'
                        name='delivery_address_unit'
                        value={this.state.deliveryAddress.delivery_address_unit}
                        onChange={e => {
                          e.persist();
                          this.setState(prevState => ({
                            deliveryAddress: {
                              ...prevState.deliveryAddress,
                              delivery_address_unit: e.target.value
                            }
                          }));
                        }}
                      />
                    </Form.Group>

                    <Form.Row>
                      <Form.Group as={Col} controlId='formGridCity'>
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          placeholder='Prep City'
                          name='delivery_city'
                          value={this.state.deliveryAddress.delivery_city}
                          onChange={e => {
                            e.persist();
                            this.setState(prevState => ({
                              deliveryAddress: {
                                ...prevState.deliveryAddress,
                                delivery_city: e.target.value
                              }
                            }));
                          }}
                        />
                      </Form.Group>
                      <Form.Group as={Col} controlId='formGridState'>
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          as='select'
                          name='delivery_state'
                          onChange={e => {
                            e.persist();
                            this.setState(prevState => ({
                              deliveryAddress: {
                                ...prevState.deliveryAddress,
                                delivery_state: e.target.value
                              }
                            }));
                          }}
                          value={this.state.deliveryAddress.delivery_state}
                        >
                          <option>Choose...</option>
                          <option>TX</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group as={Col} controlId='formGridZip'>
                        <Form.Label>Zip</Form.Label>
                        <Form.Control
                          placeholder='12345'
                          name='delivery_zip'
                          value={this.state.deliveryAddress.delivery_zip}
                          onChange={e => {
                            e.persist();
                            this.setState(prevState => ({
                              deliveryAddress: {
                                ...prevState.deliveryAddress,
                                delivery_zip: e.target.value
                              }
                            }));
                          }}
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Group controlId='exampleForm.ControlTextarea1'>
                      <Form.Label>Instructions</Form.Label>
                      <Form.Control
                        placeholder='Instruction notes'
                        name='delivery_instructions'
                        value={this.state.deliveryAddress.delivery_instructions}
                        onChange={e => {
                          e.persist();
                          this.setState(prevState => ({
                            deliveryAddress: {
                              ...prevState.deliveryAddress,
                              delivery_instructions: e.target.value
                            }
                          }));
                        }}
                      />
                    </Form.Group>
                  </Form>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <OverlayTrigger
                  key={"top"}
                  placement={"top"}
                  overlay={
                    <Tooltip id='deleteSubcription'>
                      <p>This will permanently delete your subscription</p>
                    </Tooltip>
                  }
                >
                  <Button
                    className='font2'
                    variant='danger'
                    type='submit'
                    style={{float: "left"}}
                    onClick={this.ShowHideDeleteModal}
                  >
                    Delete My Subscription
                  </Button>
                </OverlayTrigger>{" "}
                <Button
                  className='font2'
                  variant='success'
                  type='submit'
                  onClick={this.ShowHideSaveModal}
                >
                  Save Changes
                </Button>
                <Button className='font2' variant='light' onClick={this.props.ChangeAccountInfo}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        {this.state.showPasswordChange && (
          <ChangePassword
            ShowHideChangePasswordModal={this.ShowHideChangePasswordModal}
            DEV_URL={this.props.DEV_URL}
            user_uid={this.props.user_uid}
          />
        )}
        {this.state.showDeleteModal && (
          <div>
            <Dialog
              open={this.state.showDeleteModal}
              aria-labelledby='alert-dialog-title'
              aria-describedby='alert-dialog-description'
            >
              <DialogTitle id='alert-dialog-title'>{"Warning"}</DialogTitle>
              <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                  Are you sure you want to delete your subscription?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={this.ShowHideDeleteModal}
                  color='primary'
                  disabled={this.state.loading}
                >
                  No,Keep
                </Button>
                <Button
                  onClick={this.DeleteCurrentPurchase}
                  variant='danger'
                  autoFocus
                  disabled={this.state.loading}
                >
                  {this.state.loading ? "Please Wait..." : "Yes,Delete"}
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        )}
        {this.state.showSaveModal && (
          <div>
            <Dialog
              open={this.state.showSaveModal}
              aria-labelledby='alert-dialog-title'
              aria-describedby='alert-dialog-description'
            >
              <DialogTitle id='alert-dialog-title'>{"Warning"}</DialogTitle>

              <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                  You will be{" "}
                  <span>
                    {this.state.updateMealPlan.amount_paid &&
                    this.state.updateMealPlan.amount_paid >= 0 ? (
                      <span>
                        charged ${this.state.updateMealPlan.amount_paid}.{" "}
                      </span>
                    ) : (
                      <span>
                        refunded ${0 - this.state.updateMealPlan.amount_paid}.{" "}
                      </span>
                    )}
                  </span>
                  Do you want to continue this transaction.
                </DialogContentText>
              </DialogContent>

              <DialogActions>
                <Button
                  onClick={this.ShowHideSaveModal}
                  color='primary'
                  disabled={this.state.loading}
                >
                  No,Thanks
                </Button>
                <Button
                  onClick={this.UpdateChangingSubcription}
                  variant='danger'
                  autoFocus
                  disabled={this.state.loading}
                >
                  {this.state.loading ? "Please wait..." : "Yes,Please"}
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        )}
        {this.state.showErrorModal && (
          <div>
            <Dialog
              open={this.state.showErrorModal}
              aria-labelledby='alert-dialog-title'
              aria-describedby='alert-dialog-description'
            >
              <DialogTitle id='alert-dialog-title'>{"Warning"}</DialogTitle>

              <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                  Sorry!!! {this.state.errorMessage}
                </DialogContentText>
              </DialogContent>

              <DialogActions>
                <Button onClick={this.ShowHideErrorModal} color='primary'>
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        )}
      </>
    );
  }
}
