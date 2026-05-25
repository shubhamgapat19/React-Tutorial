// ========================================
// REACT QUERY (TanStack Query) - Practice
// ========================================

import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    }
  }
});

// Wrap app
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UsersList />
      <CreatePost />
    </QueryClientProvider>
  );
}

// ========================================
// 1. BASIC QUERY (useQuery)
// ========================================

function UsersList() {
  const { data: users, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    }
  });

  if (isLoading) return <p>Loading users...</p>;
  if (isError) return <p>Error: {error.message} <button onClick={refetch}>Retry</button></p>;

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}

// ========================================
// 2. QUERY WITH PARAMETERS
// ========================================

function UserProfile({ userId }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId], // Cache per userId
    queryFn: () => fetch(`https://jsonplaceholder.typicode.com/users/${userId}`).then(r => r.json()),
    enabled: !!userId, // Only fetch when userId exists
  });

  if (isLoading) return <p>Loading...</p>;
  return <h2>{user?.name}</h2>;
}

function UserPosts({ userId }) {
  const { data: posts = [] } = useQuery({
    queryKey: ['posts', { userId }],
    queryFn: () => fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`).then(r => r.json()),
    enabled: !!userId,
  });

  return (
    <div>
      <h3>Posts ({posts.length})</h3>
      {posts.map(post => <p key={post.id}>{post.title}</p>)}
    </div>
  );
}

// ========================================
// 3. MUTATIONS (Create/Update/Delete)
// ========================================

function CreatePost() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');

  const mutation = useMutation({
    mutationFn: (newPost) => {
      return fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      }).then(r => r.json());
    },
    onSuccess: () => {
      // Invalidate and refetch posts list
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setTitle('');
    },
    onError: (error) => {
      alert('Error: ' + error.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ title, body: 'Content', userId: 1 });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title" />
      <button disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create Post'}
      </button>
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
      {mutation.isSuccess && <p>Post created!</p>}
    </form>
  );
}

// ========================================
// 4. OPTIMISTIC UPDATES
// ========================================

function TodoWithOptimistic() {
  const queryClient = useQueryClient();

  const { data: todos = [] } = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetch('https://jsonplaceholder.typicode.com/todos?_limit=5').then(r => r.json())
  });

  const toggleMutation = useMutation({
    mutationFn: (todo) => {
      return fetch(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed })
      }).then(r => r.json());
    },
    // Optimistic update
    onMutate: async (todo) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previous = queryClient.getQueryData(['todos']);

      queryClient.setQueryData(['todos'], old =>
        old.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t)
      );

      return { previous };
    },
    onError: (err, todo, context) => {
      // Rollback on error
      queryClient.setQueryData(['todos'], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id} onClick={() => toggleMutation.mutate(todo)}>
          <input type="checkbox" checked={todo.completed} readOnly />
          {todo.title}
        </li>
      ))}
    </ul>
  );
}

// ========================================
// 5. PAGINATION
// ========================================

function PaginatedPosts() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isPreviousData } = useQuery({
    queryKey: ['posts', page],
    queryFn: () => fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=5`).then(r => r.json()),
    keepPreviousData: true, // Show old data while fetching new page
  });

  return (
    <div>
      {isLoading ? <p>Loading...</p> : (
        data.map(post => <div key={post.id}><h4>{post.title}</h4></div>)
      )}
      <div>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
          Previous
        </button>
        <span> Page {page} {isFetching && '(updating...)'} </span>
        <button onClick={() => setPage(p => p + 1)} disabled={isPreviousData}>
          Next
        </button>
      </div>
    </div>
  );
}

// ========================================
// 6. INFINITE SCROLL
// ========================================

function InfinitePosts() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['infinite-posts'],
    queryFn: ({ pageParam = 1 }) =>
      fetch(`https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=10`).then(r => r.json()),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length + 1 : undefined;
    }
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      {data.pages.map((page, i) => (
        <div key={i}>
          {page.map(post => <p key={post.id}>{post.title}</p>)}
        </div>
      ))}
      <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
        {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load More' : 'No more posts'}
      </button>
    </div>
  );
}

// ========================================
// 7. DEPENDENT QUERIES
// ========================================

function UserWithPosts({ userId }) {
  // First query
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json())
  });

  // Dependent query - only runs after user is loaded
  const { data: posts } = useQuery({
    queryKey: ['posts', user?.id],
    queryFn: () => fetch(`/api/posts?userId=${user.id}`).then(r => r.json()),
    enabled: !!user?.id // Only run when user.id exists
  });

  return (
    <div>
      <h2>{user?.name}</h2>
      <ul>{posts?.map(p => <li key={p.id}>{p.title}</li>)}</ul>
    </div>
  );
}

// ========================================
// EXERCISES
// ========================================

// Exercise 1: Build a GitHub repo search with React Query
// - Search input with debounce
// - Cache results per query
// - Show loading, error, and empty states

// Exercise 2: Build a CRUD app with optimistic updates
// - List items, add, edit, delete
// - Optimistic UI for all mutations

// Exercise 3: Infinite scroll news feed
// - useInfiniteQuery
// - Intersection Observer for auto-load

export default App;
