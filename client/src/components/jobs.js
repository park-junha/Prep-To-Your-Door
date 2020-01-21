import React, { Component } from "react";
import { Card, CardDeck, Row, Col, Container } from "react-bootstrap";
import { Grid, Cell } from "react-mdl";
import IMG1 from "../img/img1.jpg";
import IMG9 from "../img/img9.webp";
import { Link } from "react-router-dom";

class Jobs extends Component {
  render() {
    return (
      <section class="content-section">
        <div class="container">
          <center>
            <CardDeck style={{ marginLeft: "90px" }}>
              <Card
                style={{
                  maxWidth: "20rem",
                  boxShadow: "0px 5px 32px 4px rgba(0,0,0,0.3)"
                }}
              >
                {" "}
                <Card.Body>
                  <br />
                  <br />
                  <br />
                  <Card.Title>
                    <b>Why PTYD?</b>
                    <hr class="two" />
                  </Card.Title>
                  <Card.Text style={{ fontSize: "15px" }}>
                    <br />
                    Our priority:
                    <br />
                    <br />
                    People, Profit, Purpose.
                    <br />
                    <br />
                    Employee Benefits: <br />
                    - Affordable Insurance
                    <br />
                    - Health, Vision, Dental
                    <br />
                    <br />
                    ​ Growth Opportunities ​<br />
                    <br />
                    Top Quality Meals ​<br />
                    <br />
                    We take care of our team.
                  </Card.Text>{" "}
                  <br />
                  <br />
                  <br />
                </Card.Body>
              </Card>
              <Card
                style={{
                  maxWidth: "20rem",
                  boxShadow: "0px 5px 32px 4px rgba(0,0,0,0.3)"
                }}
              >
                {" "}
                <Card.Body>
                  <br />
                  <br />
                  <br />
                  <Card.Title>
                    <b>Hiring</b>
                    <hr class="two" />
                  </Card.Title>
                  <Card.Text style={{ fontSize: "15px" }}>
                    <br />
                    <br />
                    <br />
                    Delivery Drivers
                    <br />
                    <br />
                    Sous Chef
                    <br />
                    <br />
                    ​Prep Cook​
                    <br />
                    <br />
                    Sales Associate​
                    <br />
                    <br />
                    Events
                  </Card.Text>{" "}
                  <br />
                  <br />
                  <br />
                </Card.Body>
              </Card>{" "}
              <Card
                style={{
                  maxWidth: "20rem",
                  boxShadow: "0px 5px 32px 4px rgba(0,0,0,0.3)"
                }}
              >
                {" "}
                <Card.Body>
                  <br />
                  <br />
                  <br />
                  <Card.Title>
                    <b>Apply</b>
                    <hr class="two" />
                  </Card.Title>
                  <Card.Text style={{ fontSize: "15px" }}>
                    <br />
                    Send your resume to:
                    <br />
                    <br />
                    frazier@preptoyourdoor.com
                    <br />
                    <br />
                    Include:
                    <br />
                    <br />
                    <br />
                    ​ A bit about yourself ​<br />
                    <br />
                    Updated resume ​<br />
                    <br />
                    Position of interest
                  </Card.Text>{" "}
                  <br />
                  <br />
                  <br />
                </Card.Body>
              </Card>
            </CardDeck>

            <br />
          </center>
        </div>
      </section>
    );
  }
}

export default Jobs;
