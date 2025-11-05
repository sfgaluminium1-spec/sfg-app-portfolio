
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, sessionId } = await request.json()

    // Get or create chat session
    let chatSession: any
    if (sessionId) {
      chatSession = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: { messages: true },
      })
    } else {
      chatSession = await prisma.chatSession.create({
        data: {
          userId: session.user.id,
          title: message.substring(0, 50) + (message.length > 50 ? "..." : ""),
        },
        include: { messages: true },
      })
    }

    if (!chatSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Save user message
    await prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        role: "USER",
        content: message,
      },
    })

    // Get relevant procedures for RAG context
    const relevantProcedures = await prisma.procedure.findMany({
      where: {
        isLatestVersion: true,
        status: "ACTIVE",
        OR: [
          { title: { contains: message, mode: "insensitive" } },
          { content: { contains: message, mode: "insensitive" } },
          { summary: { contains: message, mode: "insensitive" } },
        ],
      },
      include: {
        category: true,
      },
      take: 5,
    })

    // Prepare context for LLM
    const context = relevantProcedures
      .map(
        (proc) =>
          `Title: ${proc.title}\nCategory: ${proc.category.name}\nContent: ${proc.content}`
      )
      .join("\n\n---\n\n")

    const systemPrompt = `You are a helpful assistant for a company knowledge management system. Use the following company procedures and information to answer questions accurately and helpfully.

COMPANY PROCEDURES:
${context}

Instructions:
- Answer based on the provided company procedures
- If information is not available in the procedures, say so clearly
- Provide specific references to procedure titles when possible
- Be concise but comprehensive
- If asked about conflicts or inconsistencies, highlight them
- Focus on practical, actionable guidance`

    // Call LLM API
    const response = await fetch("https://apps.abacus.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ABACUSAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        stream: true,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.statusText}`)
    }

    // Stream the response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        const encoder = new TextEncoder()
        let fullResponse = ""

        try {
          while (true) {
            const { done, value } = await reader!.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split("\n")

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6)
                if (data === "[DONE]") {
                  // Save assistant response to database
                  await prisma.chatMessage.create({
                    data: {
                      sessionId: chatSession.id,
                      role: "ASSISTANT",
                      content: fullResponse,
                      metadata: {
                        sources: relevantProcedures.map((proc) => ({
                          id: proc.id,
                          title: proc.title,
                          category: proc.category.name,
                        })),
                      },
                    },
                  })
                  return
                }

                try {
                  const parsed = JSON.parse(data)
                  const content = parsed.choices?.[0]?.delta?.content || ""
                  if (content) {
                    fullResponse += content
                    controller.enqueue(encoder.encode(chunk))
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (error) {
          console.error("Stream error:", error)
          controller.error(error)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
