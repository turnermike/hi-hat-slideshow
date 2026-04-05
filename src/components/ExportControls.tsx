const handleExport = async () => {
    console.log('handleExport called, images.length:', images.length);
    
    if (images.length === 0) {
      console.log('No images, returning early');
      setExportError('Please upload images first');
      return;
    }

    console.log('Starting client-side export process...');
    setIsExporting(true);
    setExporting(true);
    setExportProgress(0);
    setExportError(null);

    try {
      console.log('Converting images to data URLs...');
      setExportProgress(10);
      const imageDataUrls = await Promise.all(project.images.map((image) => toDataUrl(image.url)));

      console.log('Creating video project data...');
      setExportProgress(20);
      const videoProject = {
        images: project.images.map((image, index) => ({
          id: image.id,
          url: imageDataUrls[index],
          order: image.order,
        })),
        transitions: project.transitions,
        slideDurations: project.slideDurations,
        transitionDurations: project.transitionDurations,
        captions: project.captions,
        captionColors: project.captionColors,
        musicUrl: null, // TODO: Handle music later
        exportSettings: project.exportSettings,
        aspectRatio: project.aspectRatio,
      };

      console.log('Initializing client video processor...');
      setExportProgress(30);
      const processor = new ClientVideoProcessor(videoProject, (progress) => {
        console.log('Video processing progress:', progress);
        setExportProgress(30 + Math.floor(progress * 0.6)); // 30-90% range
      });

      console.log('Generating video...');
      setExportProgress(35);
      const videoBlob = await processor.generateVideo();
      
      console.log('Video generated successfully, downloading...');
      setExportProgress(95);
      
      const codecInfo = getCodecInfo(project.exportSettings.format);
      const filename = `portfolio-video-${Date.now()}.${codecInfo.container}`;
      downloadBlob(videoBlob, filename);
      
      setExportProgress(100);
      console.log('Export completed successfully');
      
    } catch (error) {
      console.log('Export error caught:', error);
      setExportError(error instanceof Error ? error.message : 'Export failed');
    } finally {
      console.log('Export process finished, resetting state...');
      setIsExporting(false);
      setExporting(false);
    }
  };