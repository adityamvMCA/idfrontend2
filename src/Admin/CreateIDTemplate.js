import React from "react";
import "./IDCard.css";

const ID1Template = ({ student, college }) => {
  return (
    <div className="id-card">
      <div className="header">
        <h3>{college.name}</h3>
        <p>{college.address}</p>
        <p className="sub">{college.subtitle}</p>
      </div>

      <div className="body">
        <div className="photo">
          <img src={student.photo} alt="student" />
        </div>
        <div className="details">
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Branch:</strong> {student.branch}</p>
          <p><strong>Validity:</strong> {student.validity}</p>
          <p><strong>USN:</strong> {student.usn}</p>
          <p><strong>Contact:</strong> {student.contact}</p>
          <p><strong>Address:</strong> {student.address}</p>
        </div>
      </div>

      <div className="footer">
        <span>Blood Group: {student.bloodGroup}</span>
        <div className="sign">
          <p>Principal</p>
        </div>
      </div>
    </div>
  );
};

export default ID1Template;
