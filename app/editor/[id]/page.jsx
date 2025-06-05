'use client';

import JoditEditor from 'jodit-react';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import socket from '@/app/utils/socket'; // 
import ProtectedEditor from '@/app/components/ProtectedEditor';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function EditorPage() {
    const { id } = useParams();
    const editor = useRef(null);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [flashUpdate, setFlashUpdate] = useState(false);
    const [userCount, setUserCount] = useState(1); 

    // Fetch document initially
    useEffect(() => {
        const fetchDoc = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/realdocs/docs/${id}`);
                const data = await res.json();
                setContent(data.content || '');
                setTitle(data.title || 'Untitled Document');
            } catch (err) {
                console.error('Fetch error:', err);
            }
        };

        if (id) fetchDoc();
    }, [id]);

    // Setup socket
    useEffect(() => {
        if (!id) return;

        socket.connect();
        socket.emit('join-doc', id);

        socket.on('receive-changes', (incomingContent) => {
            setContent(incomingContent);
            setFlashUpdate(true); // Flash effect
            setTimeout(() => setFlashUpdate(false), 1000);
        });

        socket.on('users-count', (count) => {
            setUserCount(count);
        });

        return () => {
            socket.off('receive-changes');
            socket.off('users-count');
            socket.disconnect();
        };
    }, [id]);

    // Auto-save every 5s
    useEffect(() => {
        const interval = setInterval(() => {
            if (!content) return;

            setIsSaving(true);
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/realdocs/docs/update/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            })
                .then(() => setIsSaving(false))
                .catch((err) => {
                    console.error('Save error:', err);
                    setIsSaving(false);
                });
        }, 5000);

        return () => clearInterval(interval);
    }, [content, id]);

    const handleEditorChange = (newContent) => {
        setContent(newContent);
        socket.emit('doc-changes', { docId: id, content: newContent });
    };

    return (
        <div className="my-20 py-4">
            <div className={`max-w-5xl mx-auto bg-white shadow-md rounded p-4 transition-all duration-300 ${flashUpdate ? 'ring-2 ring-green-400' : ''}`}>
                <Link href="/dashboard" className='flex text-center gap-1.5 w-[90px] border px-1.5 py-2 rounded-full items-center'>
                <FaArrowLeft></FaArrowLeft>
                <span>Back</span>
                </Link>
                <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">{title}</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">active user({userCount}) </span>
                        <span className="text-sm text-gray-500">{isSaving ? 'Saving...' : 'Saved ✔️'}</span>
                        <button
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            onClick={() => {
                                const url = `${window.location.origin}/editor/${id}`;
                                navigator.clipboard.writeText(url)
                                    .then(() => {
                                        alert("Link copied to clipboard!");
                                    })
                                    .catch((err) => {
                                        console.error("Failed to copy:", err);
                                        alert("Failed to copy the link, please try manually.");
                                    });
                            }}
                        >
                            Share
                        </button>

                    </div>
                </div>

                <ProtectedEditor>
                    <JoditEditor
                    ref={editor}
                    value={content}
                    onChange={handleEditorChange}
                />
                </ProtectedEditor>
            </div>
        </div>
    );
}
