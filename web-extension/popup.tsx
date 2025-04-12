import logo from "data-base64:~assets/logo.png"
import { useState } from "react"

function IndexPopup() {
  const [data, setData] = useState("")

  return (
    <div>
      <div
        style={{
          right: "1rem",
          width: "350px",
          borderRadius: "1rem",
          display: "flex",
          flexDirection: "column"
        }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            borderBottom: "1px solid #e5e7eb",
            padding: "0.5rem 0.5rem"
          }}>
          <img src={logo} height={30} width={30} alt="logo" />
          <h2
            style={{
              margin: "auto"
            }}>
            QConnect
          </h2>
          <a href="/newtab.html">
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: 5,
                justifyContent: "center",
                gap: "0.5rem", // equivalent to gap-2
                whiteSpace: "nowrap",
                borderRadius: "0.375rem", // equivalent to rounded-md
                fontSize: "0.875rem", // equivalent to text-sm
                fontWeight: "500", // equivalent to font-medium
                transition: "all 0.2s",
                border: "1px solid rgba(0, 0, 0, 0.15)",
                backgroundColor: "var(--background)",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)", // equivalent to shadow-sm
                outline: "none",
                pointerEvents: "auto",
                opacity: 1
              }}>
              Get Started
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </a>
        </div>
        <h2 style={{ margin: "auto", marginBottom: 10, marginTop: 10 }}>
          Welcome to{" "}
          {/* <a href="https://www.finnovate-ai.vercel.app" target="_blank"> */}
          QConnect {/* </a> */}
          Extension!
        </h2>
        <p
          style={{
            margin: "auto",
            textAlign: "center",
            fontSize: "0.7rem",
            marginBottom: 10
          }}>
          QConnect is your personal LMS assistant! Ask me any questions regarding
          your courses, assignments, or exams. I am here to help you with all your
          academic needs.
        </p>
        {/* <textarea
        style={{ borderRadius: 5, borderColor: "#999999", padding: 7 }}
        rows={5}
        onChange={(e) => setData(e.target.value)}
        value={data}
      />
      <div style={{ justifyItems: "flex-end" }}>
        <button>Search</button>
      </div> */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 3
          }}>
          <img
            src="https://cdn.dribbble.com/userupload/16766229/file/original-9a72ce217ec05cbb67cb462801094776.png?resize=2056x1542&vertical=center"
            height={350}
            width={350}
            alt="Hero Image"
          />
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
