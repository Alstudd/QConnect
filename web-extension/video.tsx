import logo from "data-base64:~assets/logo.png"
import { useEffect, useState } from "react"
import { YoutubeTranscript } from "youtube-transcript"

function VideoPage() {
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

export default VideoPage
