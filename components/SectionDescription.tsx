// components/Section.tsx
import React from "react";
import ReactMarkdown from "react-markdown";

interface SectionProps {
    title: string;
    content: string;
}

const SectionDescription: React.FC<SectionProps> = ({ title, content }) => {
    return (
        <section className="my-6">
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <div className="prose max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        </section>
    );
};

export default SectionDescription;
