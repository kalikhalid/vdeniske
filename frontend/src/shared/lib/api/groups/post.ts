import { Configuration } from "../configuration";
import { WithTurnstile } from "./auth";
import { User } from "./user";

export type Pageable<T> = {
  content: T[];
  page_size: number;
  page_number: number;
  last_page: number;
};

export type Attachment = {
  id: string;
  type: string;
  filename: string;
};

export type Post = {
  id: string;
  content: string;

  likes: number;
  dislikes: number;

  author: User[];
  attachments: Attachment[];
};

export type CreatePostReq = {
  content: string;
} & WithTurnstile;

export type Status = {
  success: boolean;
};

export class PostController {
  constructor(private config: Configuration) { }

  async getPosts(page: number): Promise<Pageable<Post>> {
    const res = await fetch(
      `${this.config.basePath}/posts?page_size=15&page_number=${page}&search`
    );

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const data = await res.json();

    return data;
  }

  async getPostsByUserId(
    userId: string,
    page: number
  ): Promise<Pageable<Post>> {
    const res = await fetch(
      `${this.config.basePath}/users/${userId}/posts?page_size=15&page_number=${page}&search`
    );

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const data = await res.json();

    return data;
  }

  async getPostById(id: string): Promise<Post> {
    const res = await fetch(`${this.config.basePath}/posts/${id}`);

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const data = await res.json();

    return data;
  }

  async createPost(dto: CreatePostReq): Promise<Post> {
    const res = await fetch(`${this.config.basePath}/posts`, {
      method: "POST",
      body: JSON.stringify(dto),
      headers: {
        "Content-Type": "application/json",
        Authorization: this.config.accessToken || "",
      },
    });

    return res.json();
  }

  async likePost(postId: string): Promise<Status> {
    const res = await fetch(`${this.config.basePath}/posts/${postId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.config.accessToken || "",
      },
    });

    return res.json();
  }

  async dislikePost(postId: string): Promise<Status> {
    const res = await fetch(`${this.config.basePath}/posts/${postId}/dislike`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.config.accessToken || "",
      },
    });

    return res.json();
  }
}
