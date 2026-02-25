import React, { useEffect, useState } from "react";
import { FaDownload, FaCheckCircle, FaClock } from "react-icons/fa";

const StudentCertificate = () => {

  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Simulated API call (replace later)
  useEffect(() => {
    setTimeout(() => {
      setCertificate({
        course: "React Development",
        instructorApproved: true,
        adminIssued: true, // toggle to test
        issueDate: "2025-01-10",
        certificateUrl: "/certificates/react-certificate.pdf",
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleDownload = () => {
    if (!certificate?.adminIssued) return;
    window.open(certificate.certificateUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading certificate status...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
        <div className="p-8 max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">
            🎓 My Certificate
          </h1>

          <div className="bg-white rounded-2xl shadow p-6">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-lg font-medium">
                  {certificate.course}
                </p>
                <p className="text-sm text-gray-500">
                  Issued on:{" "}
                  {certificate.issueDate || "—"}
                </p>
              </div>

              {/* STATUS BADGE */}
              {certificate.adminIssued ? (
                <span className="px-3 py-1 rounded-full text-sm
                                 bg-green-100 text-green-700">
                  Certificate Issued
                </span>
              ) : certificate.instructorApproved ? (
                <span className="px-3 py-1 rounded-full text-sm
                                 bg-yellow-100 text-yellow-700">
                  Pending Admin Approval
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-sm
                                 bg-red-100 text-red-700">
                  Not Eligible
                </span>
              )}
            </div>

            <hr className="my-6" />

            {/* STATUS FLOW */}
            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <FaCheckCircle
                  className={`text-2xl ${
                    certificate.instructorApproved
                      ? "text-green-600"
                      : "text-gray-300"
                  }`}
                />
                <p className="text-sm">
                  Instructor Approval
                </p>
              </div>

              <div className="flex flex-col items-center gap-2">
                {certificate.adminIssued ? (
                  <FaCheckCircle className="text-2xl text-green-600" />
                ) : (
                  <FaClock className="text-2xl text-gray-300" />
                )}
                <p className="text-sm">
                  Admin Issuance
                </p>
              </div>

              <div className="flex flex-col items-center gap-2">
                {certificate.adminIssued ? (
                  <FaDownload className="text-2xl text-blue-600" />
                ) : (
                  <FaDownload className="text-2xl text-gray-300" />
                )}
                <p className="text-sm">
                  Download Ready
                </p>
              </div>
            </div>

            {/* DOWNLOAD BUTTON */}
            <div className="flex justify-end">
              <button
                onClick={handleDownload}
                disabled={!certificate.adminIssued}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg transition
                  ${
                    certificate.adminIssued
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                <FaDownload />
                Download Certificate
              </button>
            </div>
          </div>

          {/* INFO */}
          {!certificate.adminIssued && (
            <div className="mt-4 text-sm text-gray-500">
              Your certificate will be available after instructor
              approval and admin issuance.
            </div>
          )}
        </div>
      </div>
  );
};

export default StudentCertificate;
