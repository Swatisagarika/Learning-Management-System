import React, { useState } from "react";
import jsPDF from "jspdf";

const AdminIssueCertificate = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      studentName: "Alice Johnson",
      email: "alice@example.com",
      course: "React Basics",
      instructorApproved: true,
      adminIssued: false,
      certificateNumber: null,
      issuedDate: null,
    },
    {
      id: 2,
      studentName: "Bob Smith",
      email: "bob@example.com",
      course: "Node Advanced",
      instructorApproved: false,
      adminIssued: false,
      certificateNumber: null,
      issuedDate: null,
    },
  ]);

  // 🔹 Admin signature state
  const [adminSignature, setAdminSignature] = useState(null);

  // 🔹 Handle signature upload
  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setAdminSignature(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  // 🔹 Certificate PDF with Admin Signature
  const generateCertificatePDF = (student) => {
    const pdf = new jsPDF("landscape");

    // Background & Borders
    pdf.setFillColor(245, 248, 250);
    pdf.rect(0, 0, 297, 210, "F");

    pdf.setDrawColor(180, 150, 90);
    pdf.setLineWidth(3);
    pdf.rect(10, 10, 277, 190);

    pdf.setLineWidth(1);
    pdf.rect(18, 18, 261, 174);

    // Title & Student Name
    pdf.setFont("times", "bold");
    pdf.setFontSize(32);
    pdf.setTextColor(60, 60, 60);
    pdf.text("Certificate of Completion", 148, 45, { align: "center" });

    pdf.setFont("times", "italic");
    pdf.setFontSize(16);
    pdf.text(
      "This certificate is proudly presented to",
      148,
      65,
      { align: "center" }
    );

    pdf.setFont("times", "bold");
    pdf.setFontSize(28);
    pdf.setTextColor(20, 80, 120);
    pdf.text(student.studentName, 148, 85, { align: "center" });

    pdf.setFont("times", "normal");
    pdf.setFontSize(16);
    pdf.setTextColor(60, 60, 60);
    pdf.text(
      "For successfully completing the course",
      148,
      105,
      { align: "center" }
    );

    pdf.setFont("times", "bold");
    pdf.setFontSize(20);
    pdf.text(student.course, 148, 120, { align: "center" });

    // Footer Details
    pdf.setFontSize(12);
    pdf.setFont("times", "normal");
    pdf.text(`Certificate No: ${student.certificateNumber}`, 30, 165);
    pdf.text(`Issued Date: ${student.issuedDate}`, 30, 175);
    pdf.text(`Email: ${student.email}`, 30, 185); // Optional: Add email in PDF

    // ✍️ Admin Signature – slightly lower
    if (adminSignature) {
      pdf.addImage(adminSignature, "PNG", 205, 155, 45, 20);
    }

    pdf.setLineWidth(0.5);
    pdf.line(200, 178, 260, 178);

    pdf.setFontSize(12);
    pdf.text("Admin Signature", 230, 186, { align: "center" });
    pdf.text("Authorized LMS Authority", 230, 193, { align: "center" });

    // Footer Center Text
    pdf.setFontSize(11);
    pdf.text(
      "Authorized Learning Management System",
      148,
      200,
      { align: "center" }
    );

    pdf.save(`${student.studentName}-certificate.pdf`);
  };

  // 🔹 Issue Certificate
  const issueCertificate = (id) => {
    const updatedStudents = students.map((s) => {
      if (s.id === id) {
        const certNumber = `CERT-${Date.now()}`;
        const date = new Date().toLocaleDateString();

        const updatedStudent = {
          ...s,
          adminIssued: true,
          certificateNumber: certNumber,
          issuedDate: date,
        };

        generateCertificatePDF(updatedStudent);
        return updatedStudent;
      }
      return s;
    });

    setStudents(updatedStudents);
  };

  return (
    <div className=" min-h-screen bg-gray-100">

        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Admin – Issue Certificates
          </h1>

          {/* Signature Upload */}
          <div className="mb-6">
            <label className="block mb-2 font-semibold">
              Upload Admin Signature:
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleSignatureUpload}
              className="border p-2 rounded"
            />
            {adminSignature && (
              <img
                src={adminSignature}
                alt="Admin Signature Preview"
                className="mt-3 w-40 border"
              />
            )}
          </div>

          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[rgba(37,150,190,1)] text-white">
                <tr>
                  <th className="p-3 text-left">Student</th>
                  <th className="p-3 text-left">Email</th> {/* New column */}
                  <th className="p-3 text-left">Course</th>
                  <th className="p-3 text-left">Instructor Approval</th>
                  <th className="p-3 text-center">Certificate Status</th>
                </tr>
              </thead>

              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b">
                    <td className="p-3">{s.studentName}</td>
                    <td className="p-3">{s.email}</td> {/* Display email */}
                    <td className="p-3">{s.course}</td>

                    <td className="p-3">
                      {s.instructorApproved ? (
                        <span className="text-green-600 font-semibold">
                          Approved
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-center">
                      {s.instructorApproved ? (
                        s.adminIssued ? (
                          <span className="text-green-700 font-semibold">
                            Issued ✔
                          </span>
                        ) : (
                          <button
                            onClick={() => issueCertificate(s.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                          >
                            Issue Certificate
                          </button>
                        )
                      ) : (
                        <span className="text-gray-400">
                          Waiting for Instructor
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
};

export default AdminIssueCertificate;
