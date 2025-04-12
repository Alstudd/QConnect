// src/components/Certificate.tsx
import React, { useRef } from 'react';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Download, Share2, User } from "lucide-react";
import html2canvas from 'html2canvas';
import { useTheme } from "next-themes";

interface CertificateProps {
  studentName: string;
  courseName: string;
  completionDate: string;
  teacherName: string;
}

const Certificate: React.FC<CertificateProps> = ({
  studentName,
  courseName,
  completionDate,
  teacherName,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    
    const canvas = await html2canvas(certificateRef.current, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff'
    });
    
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `${studentName}-${courseName}-Certificate.png`;
    link.click();
  };

  const formattedDate = new Date(completionDate).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const certificateId = Math.random().toString(36).substring(2, 12).toUpperCase();

  return (
    <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto p-6">
      <Card className="dark:bg-zinc-900 bg-zinc-50 relative w-full overflow-hidden border-0 shadow-xl dark:shadow-zinc-900/30">
        {/* Certificate content */}
        <div 
          ref={certificateRef} 
          className="p-12 relative z-10"
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-4 opacity-5">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="border border-zinc-400 dark:border-zinc-600"></div>
            ))}
          </div>
          
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-zinc-800 via-zinc-500 to-zinc-800 dark:from-zinc-100 dark:via-zinc-400 dark:to-zinc-100" />
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-zinc-800 via-zinc-500 to-zinc-800 dark:from-zinc-100 dark:via-zinc-400 dark:to-zinc-100" />
          
          {/* Certificate header */}
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-4">
              <div className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-full">
                <User className="h-8 w-8 text-zinc-900 dark:text-zinc-50" />
              </div>
              <Badge variant="outline" className="text-xs uppercase tracking-wider">Official Certificate</Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Certificate ID: {certificateId}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Issue Date: {formattedDate}</p>
            </div>
          </div>

          {/* Certificate title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">Certificate of Completion</h1>
            <div className="w-32 h-px bg-zinc-800 dark:bg-zinc-200 mx-auto" />
          </div>
          
          {/* Certificate body */}
          <div className="text-center mb-12">
            <p className="text-zinc-600 dark:text-zinc-300 mb-6">This is to certify that</p>
            <div className="flex justify-center mb-10">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 mx-auto mb-4 ring-4 ring-zinc-100 dark:ring-zinc-800">
                  <User className="h-32 w-32 object-cover" />
                </div>
              </div>
            </div>
            <h2 className="text-5xl font-bold mb-8 text-zinc-900 dark:text-zinc-50">
              {studentName}
            </h2>
            <p className="text-xl text-zinc-700 dark:text-zinc-300 mb-2">
              Has successfully completed the course
            </p>
            <p className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              {courseName}
            </p>
            <div className="flex justify-center gap-2 items-center">
              <div className="h-px w-12 bg-zinc-300 dark:bg-zinc-700"></div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{formattedDate}</p>
              <div className="h-px w-12 bg-zinc-300 dark:bg-zinc-700"></div>
            </div>
          </div>
          
          {/* Certificate footer */}
          <div className="flex justify-between items-end mt-16 px-8">
            <div className="text-center">
              <div className="w-48 h-px bg-zinc-300 dark:bg-zinc-700 mb-2 mx-auto" />
              <p className="font-medium text-zinc-800 dark:text-zinc-200">{teacherName}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Course Instructor</p>
            </div>
            
            <div className="mx-auto flex items-center justify-center">
              <div className="w-20 h-20 opacity-10 dark:opacity-20">
                <svg viewBox="0 0 100 100" className="fill-current text-zinc-900 dark:text-zinc-100">
                  <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90C27.9 90 10 72.1 10 50S27.9 10 50 10s40 17.9 40 40-17.9 40-40 40zm0-70c-16.5 0-30 13.5-30 30s13.5 30 30 30 30-13.5 30-30-13.5-30-30-30z" />
                </svg>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-48 h-px bg-zinc-300 dark:bg-zinc-700 mb-2 mx-auto" />
              <p className="font-medium text-zinc-800 dark:text-zinc-200">Academy Director</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Official Signature</p>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Actions */}
      <div className="flex gap-4">
        <Button 
          onClick={downloadCertificate} 
          variant="default"
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Download Certificate
        </Button>
        <Button variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default Certificate;