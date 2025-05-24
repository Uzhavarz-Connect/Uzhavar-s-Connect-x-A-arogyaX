"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MessageCircle } from "lucide-react";

interface Comment {
  id: string;
  created_at?: string;
  author: string;
  content: string;
  post_id: string;
}

interface Post {
  id: string;
  created_at?: string;
  content: string;
  author: string;
  title: string;
}

interface PostWC extends Post {
  comments: Comment[];
  commentCount: number;
}

interface newpost {
  created_at: string;
  content: string;
  author: string;
}

export default function Forum() {
  const [posts, setPosts] = useState<PostWC[]>([]);
  const [newPost, setNewPost] = useState<newpost>({
    created_at: "",
    content: "",
    author: "",
  });
  const [hoveredPostId, setHoveredPostId] = useState<string | null>(null);

  const fetchDoctorMap = async () => {
    const { data: doctors, error } = await supabase
      .from("Doctors")
      .select("id, name");
    if (error) {
      console.error("Error fetching doctors", error);
      return {};
    }

    // Map id to name
    return doctors.reduce((acc, doc) => {
      acc[doc.id] = doc.name;
      return acc;
    }, {} as Record<string, string>);
  };

  useEffect(() => {
    const fetchPostsWithComments = async () => {
      const doctorMap = await fetchDoctorMap();

      const { data: postData, error: postError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (postError || !postData) {
        console.error(postError);
        return;
      }

      const enrichedPosts: PostWC[] = await Promise.all(
        postData.map(async (post) => {
          const { data: comments, error: commentError } = await supabase
            .from("comments")
            .select("*")
            .eq("post_id", post.id);

          const resolvedComments = (comments || []).map((comment) => ({
            ...comment,
            author: doctorMap[comment.author] || comment.author,
          }));

          return {
            ...post,
            author: doctorMap[post.author] || post.author,
            comments: resolvedComments,
            commentCount: resolvedComments.length,
          };
        })
      );

      setPosts(enrichedPosts);
    };

    fetchPostsWithComments();
  }, []);

  const handlePost = async () => {
    if (!newPost.content) return;

    const storedDoctor = JSON.parse(localStorage.getItem("doctor") || "{}");
    const today = new Date().toISOString();

    const postToInsert = {
      content: newPost.content,
      author: storedDoctor.id, // still store ID in DB
      created_at: today,
    };

    const { data, error } = await supabase
      .from("posts")
      .insert([postToInsert])
      .select();

    if (error) {
      console.error(error);
      return;
    }

    if (data && data[0]) {
      const doctorMap = await fetchDoctorMap();

      const post = data[0];

      // Fetch comments (none yet for a new post)
      const { data: comments } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", post.id);

      const newPostWC: PostWC = {
        ...post,
        author: doctorMap[post.author] || post.author, // Convert ID to name
        comments:
          comments?.map((comment) => ({
            ...comment,
            author: doctorMap[comment.author] || comment.author,
          })) || [],
        commentCount: comments?.length || 0,
      };

      setPosts((prevPosts) => [newPostWC, ...prevPosts]);
    }

    setNewPost({ created_at: "", content: "", author: "" });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Doctor Overflow</h1>
      <Card className="mb-6">
        <CardContent className="p-4 space-y-2">
          <Textarea
            placeholder="Describe your issue or topic..."
            value={newPost.content}
            onChange={(e) =>
              setNewPost({ ...newPost, content: e.target.value })
            }
          />
          <Button onClick={handlePost}>Post</Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            onMouseEnter={() => setHoveredPostId(post.id)}
            onMouseLeave={() => setHoveredPostId(null)}
          >
            <Card className="border border-gray-300">
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-500 mb-2">By {post.author}</p>
                <p>{post.content}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <MessageCircle className="w-4 h-4" /> {post.commentCount}{" "}
                  Comments
                </div>

                {hoveredPostId === post.id && (
                  <div className="mt-2 border-t pt-2 text-sm text-gray-700 space-y-2">
                    {post.comments.map((comment) => (
                      <div key={comment.id}>
                        <strong>{comment.author}</strong>: {comment.content}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
