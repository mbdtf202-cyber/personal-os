import { CreatePostForm } from '@/components/blog/create-post-form'

export default function NewPostPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <p className="text-muted-foreground mt-1">
          Start by entering a title and category. You'll be able to write the content in the next step.
        </p>
      </div>
      <CreatePostForm />
    </div>
  )
}
