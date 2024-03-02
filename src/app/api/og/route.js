import { ImageResponse } from "@vercel/og";
export const runtime = "edge";
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: "80",
          color: "white",
          width: "100%",
          height: "100%",
          fontWeight:"bolder",
          padding: "50px 200px",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor:"#252525",
          background:"linear-gradient(90deg, #ff5858 0%, #f09819 100%)",
        }}
      >
        🍕 Infinite Meals
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
