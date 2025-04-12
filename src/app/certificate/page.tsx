'use client';

import Certificate from '../../components/Certificate';
import { useState } from 'react';
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";

export default function CertificatePage() {
  const [certificateData, setCertificateData] = useState({
    studentName: 'John Doe',
    courseName: 'Advanced Machine Learning',
    completionDate: new Date().toISOString().split('T')[0],
    teacherName: 'Dr. Jane Smith',
  });

  const updateCertificateData = (key: keyof typeof certificateData, value: string) => {
    setCertificateData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen dark:bg-black bg-white py-12">
      <div className="container mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="p-6 col-span-1 dark:bg-zinc-900 bg-zinc-50 shadow-md">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Certificate Details</h2>
              
              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name</Label>
                <Input
                  id="studentName"
                  value={certificateData.studentName}
                  onChange={(e) => updateCertificateData('studentName', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  value={certificateData.courseName}
                  onChange={(e) => updateCertificateData('courseName', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="completionDate">Completion Date</Label>
                <Input
                  id="completionDate"
                  type="date"
                  value={certificateData.completionDate}
                  onChange={(e) => updateCertificateData('completionDate', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="teacherName">Teacher Name</Label>
                <Input
                  id="teacherName"
                  value={certificateData.teacherName}
                  onChange={(e) => updateCertificateData('teacherName', e.target.value)}
                />
              </div>
            </div>
          </Card>
          
          <div className="col-span-1 lg:col-span-2">
            <Certificate {...{ ...certificateData, completionDate: certificateData.completionDate || '' }} />
          </div>
        </div>
      </div>
    </div>
  );
}