import React from "react";
import {Button, Card, Modal} from "react-bootstrap";
import {Grid, Cell} from "react-mdl";
import EachMeal from "./EachMeal";
import PropTypes from "prop-types";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

SelectMealModal.propTypes = {
  mealLeft: PropTypes.number,
  Meals: PropTypes.object,
  incrementMealLeft: PropTypes.func,
  decrementMealLeft: PropTypes.func,
  clickSkip: PropTypes.func,
  clickSurprise: PropTypes.func
};

export default function SelectMealModal(props) {
  const modalStyle = {
    position: "absolute",
    top: "2%",
    left: "-25%",
    zIndex: "50",
    height: "700px",
    width: "700px"
  };
  console.log(props.mealLeft, "mealleft");
  return (
    <Card style={modalStyle}>
      <Card.Header>
        <Modal.Title style={{width: "100%"}}>
          <h4 style={{float: "left", margin: "0"}} className='font2'>
            Please Select {props.mealLeft} Meals:
          </h4>
          <div style={{float: "right"}}>
            &nbsp;&nbsp;
            <Button style={{marginRight: "10px"}} onClick={props.clickSkip}>
              Skip This Week
            </Button>
            <Button style={{marginRight: "10px"}} onClick={props.clickSurprise}>
              Surprise Me!
            </Button>
            {props.mealLeft !== 0 ? (
              <span className='d-inline-block'>
                <Tippy
                  content="Select additional meals to activate this button or click
                  'Skip This Week'/'Surprise Me' to close this box."
                >
                  <span>
                    <Button
                      variant='success'
                      disabled={true}
                      //   style={{ pointerEvents: "auto" }}
                    >
                      Save
                    </Button>
                  </span>
                </Tippy>
              </span>
            ) : (
              <Button variant='success' onClick={props.saveSelectMeal}>
                Save
              </Button>
            )}
          </div>
        </Modal.Title>
      </Card.Header>
      <div className='scrollMenu'>
        {Object.values(props.Meals).map(meal => (
          <Grid key={meal.Category}>
            <Cell col={12}>
              <h4 style={{margin: "0"}}>{meal.Category}</h4>
            </Cell>

            {meal.Menu.map(description => {
              let quantity = 0;
              if (props.currentMealSelected.meals_selected !== undefined) {
                for (let [k, v] of Object.entries(
                  props.currentMealSelected.meals_selected
                )) {
                  if (k === description.meal_id) {
                    quantity = v;
                  }
                }
              }

              return (
                <Cell col={4} key={description.meal_id}>
                  <EachMeal
                    id={description.meal_id}
                    description={description}
                    incrementMealLeft={props.incrementMealLeft}
                    decrementMealLeft={props.decrementMealLeft}
                    currentMealSelected={props.currentMealSelected}
                    quantity={quantity}
                    mealLeft={props.mealLeft}
                  />
                </Cell>
              );
            })}
          </Grid>
        ))}
      </div>
    </Card>
  );
}
