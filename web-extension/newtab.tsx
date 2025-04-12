// import logo from "data-base64:~assets/logo.png"
// import { useState } from "react"

// function IndexPopup() {
//   const [data, setData] = useState("")

//   return (
//     <div>
//       {/* Chat Container */}
//       <div
//         style={{
//           right: "1rem",
//           width: "350px",
//           borderRadius: "1rem",
//           display: "flex",
//           flexDirection: "column"
//         }}>
//         {/* Header */}
//         <header
//           style={{
//             display: "flex",
//             alignItems: "center",
//             padding: "0.5rem 0.5rem",
//             borderBottom: "1px solid #e5e7eb",
//             borderRadius: "1rem 1rem 0 0"
//           }}>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "row",
//               gap: 3
//             }}>
//             <img src={logo} height={30} width={30} alt="logo" />
//             <h2
//               style={{
//                 margin: "auto"
//               }}>
//               QConnect
//             </h2>
//           </div>
//         </header>

//         {/* Messages Area */}
//         <div
//           style={{
//             height: "400px",
//             overflowY: "auto",
//             padding: "1rem"
//           }}>
//           {/* Empty State */}
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "0.75rem",
//               textAlign: "center",
//               height: "80%",
//               padding: "2rem"
//             }}>
//             <img src={logo} height={30} width={30} alt="logo" />
//             <p style={{ margin: 0, fontSize: "1rem" }}>
//               QConnect, your personal LMS assistant!
//             </p>
//             <p style={{ margin: 0, fontSize: "0.7rem" }}>
//               Ask me any questions regarding your courses, assignments, or exams.
//             </p>
//             <p
//               style={{
//                 margin: 0,
//                 fontSize: "0.875rem",
//                 color: "#6b7280"
//               }}>
//               Type your message below!
//             </p>
//           </div>

//           {/* Example Message - Bot */}
//           <div
//             style={{
//               display: "flex",
//               gap: "0.75rem",
//               alignItems: "flex-start",
//               marginBottom: "1rem"
//             }}>
//             <svg
//               style={{
//                 width: "2.25rem",
//                 height: "2.25rem",
//                 padding: "0.375rem",
//                 borderRadius: "9999px"
//               }}
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2">
//               <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
//             </svg>
//             <div
//               style={{
//                 padding: "0.75rem",
//                 borderRadius: "1rem",
//                 maxWidth: "70%",
//                 wordBreak: "break-word",
//                 background: "#f3f4f6"
//               }}>
//               Hello! How can I help you today?
//             </div>
//           </div>

//           {/* Example Message - User */}
//           <div
//             style={{
//               display: "flex",
//               gap: "0.75rem",
//               alignItems: "flex-start",
//               justifyContent: "flex-end",
//               marginBottom: "1rem"
//             }}>
//             <div
//               style={{
//                 padding: "0.75rem",
//                 borderRadius: "1rem",
//                 maxWidth: "70%",
//                 wordBreak: "break-word",
//                 background: "#3b82f6",
//                 color: "#ffffff"
//               }}>
//               I have a question about taxes
//             </div>
//             <svg
//               style={{
//                 width: "2.25rem",
//                 height: "2.25rem",
//                 padding: "0.375rem",
//                 borderRadius: "9999px"
//               }}
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2">
//               <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
//             </svg>
//           </div>
//         </div>

//         {/* Input Area */}
//         <form
//           style={{
//             position: "fixed",
//             bottom: "0px",
//             width: "90%",
//             padding: "1rem",
//             borderTop: "1px solid #e5e7eb",
//             display: "flex",
//             gap: "0.5rem",
//             alignItems: "center",
//             background: "#ffffff",
//             borderRadius: "0 0 1rem 1rem"
//           }}>
//           <button
//             // onClick={onClear}
//             type="button"
//             style={{
//               background: "none",
//               border: "none",
//               color: "#111827",
//               width: "2.5rem",
//               height: "2.5rem",
//               cursor: "pointer",
//               padding: 0,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center"
//             }}>
//             <svg
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2">
//               <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
//             </svg>
//           </button>
//           <input
//             type="text"
//             style={{
//               flex: 1,
//               padding: "0.5rem",
//               border: "1px solid #e5e7eb",
//               borderRadius: "0.5rem",
//               fontSize: "0.875rem"
//             }}
//             placeholder="Type your message..."
//           />
//           <button
//             type="submit"
//             style={{
//               background: "none",
//               border: "none",
//               color: "#111827",
//               cursor: "pointer",
//               padding: "0.5rem"
//             }}>
//             <svg
//               width="20"
//               height="20"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2">
//               <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
//             </svg>
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default IndexPopup


import logo from "data-base64:~assets/logo.png"
import { useEffect, useState } from "react"
import { YoutubeTranscript } from "youtube-transcript"

function IndexPopup() {
  const [url, setUrl] = useState("")
  const [transcript, setTranscript] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const passedUrl = urlParams.get("url")

    if (passedUrl && isYoutubeUrl(passedUrl)) {
      setUrl(passedUrl)
      fetchTranscript(passedUrl)
    }
  }, [])

  const isYoutubeUrl = (url: string): boolean => {
    return url.includes("youtube.com/watch") || url.includes("youtu.be/")
  }

  const getVideoId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const fetchTranscript = async (videoUrl: string) => {
    setLoading(true)
    setError("")
    setTranscript("")

    const videoId = getVideoId(videoUrl)

    if (!videoId) {
      setError("Invalid YouTube URL. Please enter a valid URL.")
      setLoading(false)
      return
    }

    try {
      const transcriptData = await YoutubeTranscript.fetchTranscript(videoId)
      if (transcriptData && transcriptData.length > 0) {
        const formattedTranscript = transcriptData
          .map((item) => `[${formatTime(item.offset)}] ${item.text}`)
          .join("\n")
        setTranscript(formattedTranscript)
      } else {
        setError("No transcript available for this video.")
      }
    } catch (err) {
      setError(
        "Failed to fetch transcript. Make sure the video has captions available."
      )
      console.error("Transcript error:", err)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timeInMs: number): string => {
    const totalSeconds = Math.floor(timeInMs / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url && isYoutubeUrl(url)) {
      fetchTranscript(url)
    } else {
      setError("Please enter a valid YouTube URL.")
    }
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "1rem"
      }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.5rem",
          borderBottom: "1px solid #e5e7eb",
          marginBottom: "1rem"
        }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
          <img src={logo} height={30} width={30} alt="logo" />
          <h2 style={{ margin: 0 }}>QConnect Video Transcription</h2>
        </div>
        <a href="/popup.html">
          <button
            style={{
              padding: "8px 16px",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              border: "1px solid #e5e7eb",
              background: "white",
              cursor: "pointer"
            }}>
            Back to Home
          </button>
        </a>
      </header>

      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: "1.5rem"
        }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            marginBottom: "1rem"
          }}>
          <label htmlFor="youtube-url" style={{ fontWeight: "500" }}>
            YouTube Video URL:
          </label>
          <div
            style={{
              display: "flex",
              gap: "0.5rem"
            }}>
            <input
              type="text"
              id="youtube-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              style={{
                flex: "1",
                padding: "0.5rem",
                borderRadius: "0.375rem",
                border: "1px solid #e5e7eb"
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1
              }}>
              {loading ? "Loading..." : "Get Transcript"}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div
          style={{
            padding: "0.75rem",
            backgroundColor: "#fee2e2",
            borderRadius: "0.375rem",
            color: "#b91c1c",
            marginBottom: "1rem"
          }}>
          {error}
        </div>
      )}

      {transcript && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem"
            }}>
            <h3 style={{ margin: 0 }}>Video Transcript</h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(transcript)
                alert("Transcript copied to clipboard!")
              }}
              style={{
                padding: "0.25rem 0.5rem",
                borderRadius: "0.375rem",
                border: "1px solid #e5e7eb",
                backgroundColor: "white",
                fontSize: "0.75rem",
                cursor: "pointer"
              }}>
              Copy to Clipboard
            </button>
          </div>
          <div
            style={{
              backgroundColor: "#f9fafb",
              padding: "1rem",
              borderRadius: "0.375rem",
              border: "1px solid #e5e7eb",
              maxHeight: "500px",
              overflowY: "auto",
              whiteSpace: "pre-wrap",
              lineHeight: "1.5",
              fontSize: "0.875rem"
            }}>
            {transcript}
          </div>
        </div>
      )}
    </div>
  )
}

export default IndexPopup

