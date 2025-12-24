import React, { useState } from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RESUME_URL = '/resume/resume.pdf';

export function ResumeWindow() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = RESUME_URL;
    link.download = 'Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(RESUME_URL, '_blank');
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Action Bar */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="w-4 h-4" />
          <span>Resume.pdf</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenInNewTab}
            className="gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 rounded-lg overflow-hidden border border-border bg-muted/30 min-h-[400px]">
        {hasError ? (
          <div className="flex flex-col items-center justify-center h-full py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-foreground">Resume Not Available</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Please add your resume.pdf file to the public/resume folder.
              </p>
            </div>
          </div>
        ) : (
          <>
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-muted-foreground">Loading resume...</div>
              </div>
            )}
            <iframe
              src={RESUME_URL}
              className={`w-full h-full ${isLoading ? 'hidden' : 'block'}`}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              title="Resume"
            />
          </>
        )}
      </div>
    </div>
  );
}
