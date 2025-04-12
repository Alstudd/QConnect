import logo from "data-base64:~assets/logo.png"
import { useState } from "react"

function IndexPopup() {
  const [data, setData] = useState("")

  return (
    <div>
      {/* Chat Container */}
      <div
        style={{
          right: "1rem",
          width: "350px",
          borderRadius: "1rem",
          display: "flex",
          flexDirection: "column"
        }}>
        {/* Header */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0.5rem 0.5rem",
            borderBottom: "1px solid #e5e7eb",
            borderRadius: "1rem 1rem 0 0"
          }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 3
            }}>
            <img src={logo} height={30} width={30} alt="logo" />
            <h2
              style={{
                margin: "auto"
              }}>
              QConnect
            </h2>
          </div>
        </header>

        {/* Messages Area */}
        <div
          style={{
            height: "400px",
            overflowY: "auto",
            padding: "1rem"
          }}>
          {/* Empty State */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              textAlign: "center",
              height: "80%",
              padding: "2rem"
            }}>
            <img src={logo} height={30} width={30} alt="logo" />
            <p style={{ margin: 0, fontSize: "1rem" }}>
              QConnect, your personal LMS assistant!
            </p>
            <p style={{ margin: 0, fontSize: "0.7rem" }}>
              Ask me any questions regarding your courses, assignments, or exams.
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "0.875rem",
                color: "#6b7280"
              }}>
              Type your message below!
            </p>
          </div>

          {/* Example Message - Bot */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              alignItems: "flex-start",
              marginBottom: "1rem"
            }}>
            <svg
              style={{
                width: "2.25rem",
                height: "2.25rem",
                padding: "0.375rem",
                borderRadius: "9999px"
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
            <div
              style={{
                padding: "0.75rem",
                borderRadius: "1rem",
                maxWidth: "70%",
                wordBreak: "break-word",
                background: "#f3f4f6"
              }}>
              Hello! How can I help you today?
            </div>
          </div>

          {/* Example Message - User */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              alignItems: "flex-start",
              justifyContent: "flex-end",
              marginBottom: "1rem"
            }}>
            <div
              style={{
                padding: "0.75rem",
                borderRadius: "1rem",
                maxWidth: "70%",
                wordBreak: "break-word",
                background: "#3b82f6",
                color: "#ffffff"
              }}>
              I have a question about taxes
            </div>
            <svg
              style={{
                width: "2.25rem",
                height: "2.25rem",
                padding: "0.375rem",
                borderRadius: "9999px"
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
            </svg>
          </div>
        </div>

        {/* Input Area */}
        <form
          style={{
            position: "fixed",
            bottom: "0px",
            width: "90%",
            padding: "1rem",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            background: "#ffffff",
            borderRadius: "0 0 1rem 1rem"
          }}>
          <button
            // onClick={onClear}
            type="button"
            style={{
              background: "none",
              border: "none",
              color: "#111827",
              width: "2.5rem",
              height: "2.5rem",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
          <input
            type="text"
            style={{
              flex: 1,
              padding: "0.5rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              fontSize: "0.875rem"
            }}
            placeholder="Type your message..."
          />
          <button
            type="submit"
            style={{
              background: "none",
              border: "none",
              color: "#111827",
              cursor: "pointer",
              padding: "0.5rem"
            }}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}

export default IndexPopup
