import React from "react";

const IDCardTemplate = ({ collegeInfo, student }) => {
  const {
    collegeName,
    address,
    approval,
    accreditation,
    logoUrl,
    principalSignUrl,
  } = collegeInfo;

  const {
    name,
    branch,
    validity,
    usn,
    bloodGroup,
    contact,
    studentAddress,
    image,
  } = student;

  return (
    <div className="w-[650px] border border-gray-300 rounded-lg overflow-hidden shadow-lg bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {logoUrl && (
            <img
              src={logoUrl}
              alt="College Logo"
              className="w-16 h-16 object-contain"
            />
          )}
          <div>
            <h2 className="text-lg font-bold text-blue-900 uppercase leading-tight">
              {collegeName}
            </h2>
            <p className="text-sm text-gray-700">{address}</p>
            {approval && (
              <p className="text-[13px] text-gray-600">{approval}</p>
            )}
            {accreditation && (
              <p className="text-[13px] text-gray-600 italic">
                {accreditation}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex p-4">
        {/* Left: Photo */}
        <div className="w-1/3 flex justify-center items-start">
          <img
            src={image}
            alt="Student"
            className="w-32 h-36 border border-gray-300 rounded-md object-cover"
          />
        </div>

        {/* Right: Info */}
        <div className="w-2/3 pl-6 text-sm">
          <p>
            <span className="font-semibold">Name:</span>{" "}
            <span className="text-blue-900 font-bold">{name}</span>
          </p>
          <p>
            <span className="font-semibold">Branch:</span> {branch}
          </p>
          <p>
            <span className="font-semibold">Validity:</span> {validity}
          </p>
          <p>
            <span className="font-semibold">USN No:</span> {usn}
          </p>
          <p className="flex items-center gap-2">
            <span className="font-semibold">Blood Group:</span>{" "}
            <span className="text-red-600 font-semibold">{bloodGroup}</span>
          </p>
          <p>
            <span className="font-semibold">Contact:</span>{" "}
            <a href={`tel:${contact}`} className="text-blue-700">
              {contact}
            </a>
          </p>
          <p>
            <span className="font-semibold">Address:</span> {studentAddress}
          </p>

          {/* Principal Sign */}
          {principalSignUrl && (
            <div className="mt-4 text-right">
              <img
                src={principalSignUrl}
                alt="Principal Signature"
                className="h-8 inline-block"
              />
              <p className="text-xs text-gray-600 font-semibold">Principal</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IDCardTemplate;
