// src/pages/Contact.tsx
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("문의 내용:", form);
    alert("문의가 정상적으로 제출되었습니다!");
    setForm({ name: "", email: "", message: "" }); // 제출 후 초기화
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "50px auto",
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 10 }}>문의하기</h1>
      <p style={{ textAlign: "center", marginBottom: 30, color: "#555" }}>
        궁금한 내용이나 문의사항을 남겨주시면 운영진이 확인 후 답변드릴게요😊
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 15 }}
      >
        <div>
  <label style={{ fontWeight: 500 }}>
    이름 <span style={{ color: "red" }}>*</span>
  </label>
  <input
    type="text"
    name="name"
    value={form.name}
    onChange={handleChange}
    placeholder="이름을 입력하세요"
    required
    style={{
      width: "100%",
      padding: 10,
      marginTop: 5,
      borderRadius: 4,
      border: "1px solid #ccc",
    }}
  />
</div>

<div>
  <label style={{ fontWeight: 500 }}>
    이메일 <span style={{ color: "red" }}>*</span>
  </label>
  <input
    type="email"
    name="email"
    value={form.email}
    onChange={handleChange}
    placeholder="이메일을 입력하세요"
    required
    style={{
      width: "100%",
      padding: 10,
      marginTop: 5,
      borderRadius: 4,
      border: "1px solid #ccc",
    }}
  />
</div>


      <div>
  <label style={{ fontWeight: 500 }}>
    문의 내용 <span style={{ color: "red" }}>*</span>
  </label>
  <textarea
    name="message"
    value={form.message}
    onChange={handleChange}
    required
    style={{
      width: "100%",
      padding: 10,
      marginTop: 5,
      borderRadius: 4,
      border: "1px solid #ccc",
      minHeight: 120,
      resize: "vertical",
    }}
  />
</div>

          

        <button
          type="submit"
          style={{
            padding: 12,
            borderRadius: 4,
            border: "none",
            backgroundColor: "#0d47a1",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#0b3a91")
          }
          onMouseOut={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#0d47a1")
          }
        >
          문의 보내기
        </button>
      </form>
    </div>
  );
}
