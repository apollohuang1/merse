import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { NextResponse } from "next/server"
import { NextApiRequest, NextApiResponse } from "next"


export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (session) {
    return res.send({
      content:
        "This is protected content. You can access this content because you are signed in.",
    })
  } else {
    return res.send({
      error: "You must be signed in to view the protected content on this page.",
    })
  }
}