import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";

class SocketService {
  private static instance: SocketService;
  private io: Server | null = null;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public initialize(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: [
          "http://localhost:3000",
          "https://ecommerce-shop-cosmetics.vercel.app"
        ],
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    this.io.on("connection", (socket: Socket) => {
      console.log(`[Socket] New connection: ${socket.id}`);

      // Handle joining product rooms for real-time reviews
      socket.on("join_product", (productId: string) => {
        socket.join(`product:${productId}`);
        console.log(`[Socket] Client ${socket.id} joined product:${productId}`);
      });

      // Handle leaving product rooms
      socket.on("leave_product", (productId: string) => {
        socket.leave(`product:${productId}`);
        console.log(`[Socket] Client ${socket.id} left product:${productId}`);
      });

      // Handle joining admin room for notifications
      socket.on("join_admin", () => {
        socket.join("admin");
        console.log(`[Socket] Client ${socket.id} joined admin room`);
      });

      socket.on("disconnect", () => {
        console.log(`[Socket] Client disconnected: ${socket.id}`);
      });
    });
  }

  /**
   * Emit new review to product room
   */
  public emitNewReview(productId: string, review: any) {
    if (this.io) {
      this.io.to(`product:${productId}`).emit("new_review", review);
      // Also notify admins
      this.io.to("admin").emit("admin_notification", {
        type: "NEW_REVIEW",
        title: "Đánh giá mới",
        content: `Sản phẩm ${review.productName} vừa có đánh giá mới từ ${review.userName}`,
        metadata: { productId, reviewId: review.id }
      });
    }
  }

  /**
   * Emit new reply to product room
   */
  public emitNewReply(productId: string, reply: any) {
    if (this.io) {
      this.io.to(`product:${productId}`).emit("new_reply", reply);
    }
  }

  /**
   * Emit new question to product room
   */
  public emitNewQuestion(productId: string, question: any) {
    if (this.io) {
      this.io.to(`product:${productId}`).emit("new_question", question);
      // Also notify admins
      this.io.to("admin").emit("admin_notification", {
        type: "NEW_QUESTION",
        title: "Câu hỏi mới",
        content: `Sản phẩm vừa có câu hỏi mới: ${question.content.substring(0, 50)}...`,
        metadata: { productId, questionId: question.id }
      });
    }
  }

  /**
   * Emit new answer to product room
   */
  public emitNewAnswer(productId: string, answer: any) {
    if (this.io) {
      this.io.to(`product:${productId}`).emit("new_answer", answer);
    }
  }

  /**
   * General notification for admins
   */
  public notifyAdmin(notification: { type: string; title: string; content: string; metadata?: any }) {
    if (this.io) {
      this.io.to("admin").emit("admin_notification", notification);
    }
  }
}

export const socketService = SocketService.getInstance();
