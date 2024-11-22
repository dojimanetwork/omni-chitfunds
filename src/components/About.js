import React from "react";
import "./About.css";
import collectionImage from "../images/collection.png";

export default function About() {
  return (
    <section className="about">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-md-6 about-image">
            <img src={collectionImage} className="img-fluid" alt="Collection" />
          </div>
          <div className="col-md-6 panel-content">
            <h3 className="about-title">
              ABOUT
              <br />
              <span>COLLECTION</span>
            </h3>
            <p className="about-content">
              Revolutionizing chit funds with blockchain for transparency and
              security.
            </p>
            <p className="about-content">
              We provide a modern solution to traditional chit funds, ensuring
              trust, efficiency and seamless management. With
              blockchain-powered automation and real-time tracking, we help you
              securely grow and manage your financial contributions.
            </p>
            <div className="row justify-content-around">
              <Card
                title="Data Sync & Tracking Accuracy"
                value="93%"
              />
              <Card title="Improved Process Efficiency" value="2.5X" />
              <Card
                title="Trusted Members"
                value="50K+"
              />
            </div>
          </div>

          <div className="row justify-content-center boxs">
            <div className="col-md-3">
              <div className="box">
                <i className="bi bi-layers"></i>
                <h2>400+</h2>
                <p>Successful Chit Fund Groups</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="box">
                <i className="bi bi-person-circle"></i>
                <h2>200+</h2>
                <p>Trusted Participants</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="box">
                <i className="bi bi-person-hearts"></i>
                <h2>1860+</h2>
                <p>Engaged Community Members</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="box">
                <i className="bi bi-rocket-takeoff-fill"></i>
                <h2>2.5x</h2>
                <p>Faster Payouts with Blockchain Automation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const Card = ({ title, value }) => {
  return (
    <div className="col-md-3 about-card">
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  );
};
