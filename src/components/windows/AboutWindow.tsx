import React, { useState } from 'react';
import Lottie from 'lottie-react';
import { Badge } from '@/components/ui/badge';
import { Code2, Database, Shield, Server } from 'lucide-react';
import profileAnimation from '@/assets/profile-avatar.json';

const PHOTO_URL = '/photo/photo.jpg';

export function AboutWindow() {
  const [photoError, setPhotoError] = useState(false);

  const highlights = [
    { icon: <Code2 className="w-4 h-4" />, text: 'React & Next.js Expert' },
    { icon: <Server className="w-4 h-4" />, text: 'Node.js & Express' },
    { icon: <Database className="w-4 h-4" />, text: 'PostgreSQL & Oracle' },
    { icon: <Shield className="w-4 h-4" />, text: 'Security & Auth Systems' },
  ];

  const skills = [
    'React', 'Next.js', 'Node.js', 'Express', 'PostgreSQL', 'Oracle',
    'JWT', 'REST APIs', 'NGINX', 'TypeScript', 'Tailwind CSS', 'Git'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30">
          {photoError ? (
            <Lottie 
              animationData={profileAnimation} 
              loop={true}
              className="w-full h-full scale-150"
            />
          ) : (
            <img
              src={PHOTO_URL}
              alt="Mayank Sharma"
              className="w-full h-full object-cover"
              onError={() => setPhotoError(true)}
            />
          )}
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-foreground">Mayank Sharma</h1>
          <p className="text-primary font-medium">Full-Stack Software Developer</p>
          <p className="text-sm text-muted-foreground mt-1">Building reliable, production-ready systems</p>
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">About</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          I'm a full-stack software developer who enjoys building reliable, production-ready systems 
          rather than just writing code that "works." I focus on clean architecture and maintainable code, 
          preferring to keep business logic intact while improving performance, structure, and readability.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          I've handled real-world authentication flows, role-based access control, admin/customer separation, 
          and secure API design using JWTs, OTPs, and token blacklisting. I see myself as a problem-solver 
          first and a coder second—I like understanding why something works, not just how.
        </p>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-2 gap-3">
        {highlights.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border"
          >
            <div className="text-primary">{item.icon}</div>
            <span className="text-sm text-foreground">{item.text}</span>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
