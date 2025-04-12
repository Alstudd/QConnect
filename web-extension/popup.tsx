import logo from "data-base64:~assets/logo.png"
import { useState, useEffect } from "react"

function IndexPopup() {
  const [data, setData] = useState("")
  const [currentUrl, setCurrentUrl] = useState("")

  // Get current tab URL when popup opens
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        setCurrentUrl(tabs[0].url)
      }
    })
  }, [])

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
                gap: "0.5rem",
                whiteSpace: "nowrap",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                transition: "all 0.2s",
                border: "1px solid rgba(0, 0, 0, 0.15)",
                backgroundColor: "var(--background)",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </a>
        </div>
        <h2 style={{ margin: "auto", marginBottom: 10, marginTop: 10 }}>
          Welcome to QConnect Extension!
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
        
        {/* Feature Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            margin: "15px 0"
          }}>
          <a href="/newtab.html">
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "8px 16px",
                justifyContent: "center",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                cursor: "pointer"
              }}>
              Chat
            </button>
          </a>
          <a href={`/newtab.html?url=${encodeURIComponent(currentUrl)}`}>
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "8px 16px",
                justifyContent: "center",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                cursor: "pointer"
              }}>
              Video
            </button>
          </a>
        </div>

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