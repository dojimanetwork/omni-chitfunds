import React, { useState } from "react";
import "./QnA.css";

export default function QnA() {
  // Separate states for each card's active question
  const [activeQuestionLeft, setActiveQuestionLeft] = useState(null);
  const [activeQuestionRight, setActiveQuestionRight] = useState(null);

  const toggleAnswerLeft = (questionId) => {
    setActiveQuestionLeft((prevQuestionId) =>
      prevQuestionId === questionId ? null : questionId
    );
  };

  const toggleAnswerRight = (questionId) => {
    setActiveQuestionRight((prevQuestionId) =>
      prevQuestionId === questionId ? null : questionId
    );
  };

  const questions = [
    {
      id: 1,
      question: "What is a blockchain-based chit fund?",
      answer:
        "A blockchain-based chit fund leverages blockchain technology to provide transparency, security and efficiency in managing contributions, bids and payouts eliminating the risks of fraud and manipulation.",
    },
    {
      id: 2,
      question: "How does blockchain improve transparency in chit funds?",
      answer:
        "All transactions are recorded on an immutable ledger, visible to all participants. This ensures every contribution, bid and payout is tracked and cannot be altered.",
    },
    {
      id: 3,
      question: "Are my contributions secure on this platform?",
      answer:
        "Yes, contributions are stored and managed using blockchain, which employs cryptographic security measures to protect funds from fraud or unauthorized access.",
    },
    {
      id: 4,
      question: "How are payouts automated?",
      answer:
        "Smart contracts execute payouts based on predefined rules, ensuring timely and accurate distribution without manual intervention or delays.",
    },
    {
      id: 5,
      question: "Can I track my contributions and payouts in real-time?",
      answer:
        "Yes, participants have access to a dashboard or app that provides real-time updates on contributions, bidding processes and payout statuses.",
    }
  ];
  const questions2 = [
    {
      id: 6,
      question: "What happens if there's a dispute?",
      answer:
        "Blockchain's immutable records provide a tamper-proof history of all transactions, making it easy to resolve disputes fairly and transparently.",
    },
    {
      id:7,
      question: "Do I need to understand blockchain technology to participate?",
      answer:
        "No, the platform is user-friendly and designed to provide all the benefits of blockchain without requiring technical expertise.",
    },
    {
      id: 8,
      question: "How are participants verified?",
      answer:
        "Participants are verified using digital identity systems such as KYC (Know Your Customer) processes, ensuring only legitimate users can join.",
    },
    {
      id: 9,
      question: "Is this solution compliant with legal regulations?",
      answer:
        "Yes, the platform adheres to financial regulations and legal guidelines to ensure compliance and safeguard participants.",
    },
    {
      id: 10,
      question: "What are the benefits compared to traditional chit funds?",
      answer:
        "Blockchain-based chit funds offer increased transparency, reduced risks, automated processes, faster payouts and a secure system for all participants.",
    }
  ];

  return (
    <section className="QnA">
      <div className="container-fluid">
        <div className="row">
          <h2>FREQUENTLY ASKED <span>QUESTIONS</span></h2>
        </div>
        <div className="row">
          <div className="col-md-6 card">
            {questions.map((q, index) => (
              <div className="question" key={q.id}>
                <h5 onClick={() => toggleAnswerLeft(q.id)} data-active={activeQuestionLeft === q.id}>
                  {q.question}
                  {activeQuestionLeft === q.id ? (
                    <i className="bi bi-dash-lg"></i>
                  ) : (
                    <i className="bi bi-plus-lg"></i>
                  )}
                </h5>
                {activeQuestionLeft === q.id && (
                  <p>{q.answer}</p>
                )}
                {index !== questions.length - 1 && <hr />}
              </div>
            ))}
          </div>

          <div className="col-md-6 card">
            {questions2.map((q, index) => (
              <div className="question" key={q.id}>
                <h5 onClick={() => toggleAnswerRight(q.id)} data-active={activeQuestionRight === q.id}>
                  {q.question}
                  {activeQuestionRight === q.id ? (
                    <i className="bi bi-dash-lg"></i>
                  ) : (
                    <i className="bi bi-plus-lg"></i>
                  )}
                </h5>
                {activeQuestionRight === q.id && (
                  <p>{q.answer}</p>
                )}
                {index !== questions2.length - 1 && <hr />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
