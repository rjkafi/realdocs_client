'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Fetch user docs
  useEffect(() => {
    const fetchDocs = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/realdocs/docs/user/${session.user.email}`);
        const data = await res.json();
        setDocuments(data);
      } catch (error) {
        console.error('Failed to fetch documents', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [session]);

  const handleCreate = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/realdocs/docs/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Untitled Document',
        content: '',
        owner: session.user.email,
      }),
    });

    const newDoc = await res.json();
    router.push(`/editor/${newDoc._id}`);
  };

  const handleDelete = async (id) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/realdocs/docs/${id}`, { method: 'DELETE' });
    toast.success("Document deleted successfully")
    setDocuments((prev) => prev.filter((doc) => doc._id !== id));
  };

  const { user } = session || {};

  if (status === 'loading' || !user) {
    return <div className="text-center mt-20 text-xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen  pt-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome to Your Dashboard</h1>

        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
          <img
            src={user.image}
            alt={user.name}
            className="w-20 h-20 rounded-full border-4 border-blue-500"
          />
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-500 mt-1 text-sm">
              Last login: {new Date().toLocaleDateString('en-GB')}
            </p>
          </div>
        </div>

        {/* New Document Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition"
          >
            + New Document
          </button>
        </div>

        {/* Document List */}
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">Your Documents</h3>
          {loading ? (
            <div className="text-center text-gray-600">Loading documents...</div>
          ) : documents.length === 0 ? (
            <div className="text-center text-gray-500">No documents found. Create one!</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="bg-white rounded-lg shadow hover:shadow-lg p-4 transition-all flex flex-col justify-between"
                >
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">{doc.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Created: {new Date(doc.createdAt).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <Link
                      href={`/editor/${doc._id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
