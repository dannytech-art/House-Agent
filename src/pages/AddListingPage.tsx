import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, MapPin, Home, DollarSign, Image, CheckCircle, X, Loader2, Video } from 'lucide-react';
import { DuplicateListingModal } from '../components/DuplicateListingModal';
import { ChatInterface } from '../components/ChatInterface';
import { PropertyType, DirectAgentContact } from '../types';
import { mockAgent } from '../utils/mockData';
import apiClient from '../lib/api-client';

export function AddListingPage() {
  const [step, setStep] = useState(1);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [directAgentContact, setDirectAgentContact] = useState<DirectAgentContact>({
    agentId: 'agent-direct-1',
    agentName: 'Chidi Okafor',
    agentPhone: '+234 803 456 7890',
    agentEmail: 'chidi@vilanow.com',
    agentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chidi&backgroundColor=D4AF37',
    verified: true,
    rating: 4.8,
    propertyId: 'prop-1',
    unlocked: false
  });
  const [formData, setFormData] = useState({
    location: '',
    type: '' as PropertyType | '',
    title: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    amenities: [] as string[],
    agentType: 'semi-direct' as 'direct' | 'semi-direct'
  });
  
  // File upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const locations = ['Ikate', 'Lekki', 'Ajah', 'Victoria Island'];
  const propertyTypes: PropertyType[] = ['apartment', 'house', 'duplex', 'penthouse', 'studio', 'land'];
  const amenitiesList = ['Pool', 'Gym', '24/7 Security', 'Parking', 'Generator', 'BQ', 'Garden', 'Smart Home'];
  
  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };
  
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle file selection and upload
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const fileArray = Array.from(files);
      
      // Validate file types and sizes
      const validFiles = fileArray.filter(file => {
        const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB max
        return isValidType && isValidSize;
      });

      if (validFiles.length === 0) {
        setUploadError('Please select valid image or video files (max 10MB each)');
        setIsUploading(false);
        return;
      }

      // Create local preview URLs immediately for better UX
      const newImages: string[] = [];
      const newVideos: string[] = [];

      validFiles.forEach(file => {
        const url = URL.createObjectURL(file);
        if (file.type.startsWith('video/')) {
          newVideos.push(url);
        } else {
          newImages.push(url);
        }
      });

      // Add local previews immediately
      setUploadedImages(prev => [...prev, ...newImages]);
      setUploadedVideos(prev => [...prev, ...newVideos]);

      // Try to upload to server in background (optional - for when backend is configured)
      try {
        const result = await apiClient.uploadPropertyMedia(validFiles);
        
        // If server upload succeeded, replace local URLs with server URLs
        if (result.images && result.images.length > 0) {
          // Replace the last N images with server URLs
          setUploadedImages(prev => {
            const prevWithoutNew = prev.slice(0, prev.length - newImages.length);
            return [...prevWithoutNew, ...result.images];
          });
        }
        if (result.videos && result.videos.length > 0) {
          setUploadedVideos(prev => {
            const prevWithoutNew = prev.slice(0, prev.length - newVideos.length);
            return [...prevWithoutNew, ...result.videos];
          });
        }
        
        console.log('Files uploaded to server:', result);
      } catch (uploadErr) {
        // Server upload failed, but local previews are already shown
        console.log('Server upload not available, using local previews:', uploadErr);
      }

    } catch (error) {
      console.error('Error processing files:', error);
      setUploadError('Failed to process files. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index]);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const removeVideo = (index: number) => {
    setUploadedVideos(prev => {
      const newVideos = [...prev];
      URL.revokeObjectURL(newVideos[index]);
      newVideos.splice(index, 1);
      return newVideos;
    });
  };

  const handleSubmit = async () => {
    // Show duplicate modal for Ikate and Lekki locations with semi-direct agents
    if (formData.agentType === 'semi-direct' && (formData.location === 'Ikate' || formData.location === 'Lekki')) {
      setShowDuplicateModal(true);
      return;
    }

    setIsSubmitting(true);
    try {
      // Create property via apiClient (connects to backend at localhost:3000)
      await apiClient.createProperty({
        title: formData.title,
        type: formData.type,
        price: parseFloat(formData.price),
        location: formData.location,
        area: formData.location,
        bedrooms: parseInt(formData.bedrooms) || undefined,
        bathrooms: parseInt(formData.bathrooms) || undefined,
        description: formData.description,
        amenities: formData.amenities,
        agentType: formData.agentType,
        images: uploadedImages,
        videos: uploadedVideos,
      });
      
      alert('Listing created successfully!');
      
      // Reset form
      setStep(1);
      setFormData({
        location: '',
        type: '',
        title: '',
        price: '',
        bedrooms: '',
        bathrooms: '',
        description: '',
        amenities: [],
        agentType: 'semi-direct'
      });
      setUploadedImages([]);
      setUploadedVideos([]);
    } catch (error) {
      console.error('Error creating listing:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create listing';
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnlockDirectAgent = () => {
    const currentCredits = mockAgent.credits;
    const unlockCost = 50;
    if (currentCredits >= unlockCost) {
      setDirectAgentContact(prev => ({
        ...prev,
        unlocked: true
      }));
      alert(`Direct agent contact unlocked!\n\n${unlockCost} credits deducted from your account.`);
    }
  };

  const handleStartChatWithDirectAgent = () => {
    setShowDuplicateModal(false);
    setChatOpen(true);
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity) ? prev.amenities.filter(a => a !== amenity) : [...prev.amenities, amenity]
    }));
  };

  const steps = [{
    number: 1,
    title: 'Location & Type',
    icon: MapPin
  }, {
    number: 2,
    title: 'Details',
    icon: Home
  }, {
    number: 3,
    title: 'Media',
    icon: Image
  }, {
    number: 4,
    title: 'Review',
    icon: CheckCircle
  }];

  return <>
      <div className="min-h-screen bg-bg-secondary pb-20">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Header */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="mb-8">
            <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
              Add New Listing
            </h1>
            <p className="text-text-secondary">
              List your property and start receiving inquiries
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((s, index) => {
              const Icon = s.icon;
              const isActive = step === s.number;
              const isCompleted = step > s.number;
              return <div key={s.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${isCompleted ? 'bg-success text-white' : isActive ? 'bg-primary text-white' : 'bg-bg-tertiary text-text-tertiary'}`}>
                        {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <p className={`text-xs font-medium text-center ${isActive ? 'text-primary' : 'text-text-tertiary'}`}>
                        {s.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 transition-colors ${isCompleted ? 'bg-success' : 'bg-border-color'}`} />}
                  </div>;
            })}
            </div>
          </motion.div>

          {/* Form Content */}
          <motion.div key={step} initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: -20
        }} className="bg-bg-primary rounded-2xl p-6 border border-border-color mb-6">
            {step === 1 && <div>
                {/* Location Selection - FIRST */}
                <div className="mb-8">
                  <h2 className="font-display text-xl font-bold text-text-primary mb-4">
                    Select Location
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {locations.map(location => <button key={location} onClick={() => setFormData({
                  ...formData,
                  location
                })} className={`p-4 rounded-xl border-2 transition-all text-left ${formData.location === location ? 'border-primary bg-primary/5' : 'border-border-color hover:border-primary/50'}`}>
                        <div className="flex items-center gap-2">
                          <MapPin className={`w-5 h-5 ${formData.location === location ? 'text-primary' : 'text-text-tertiary'}`} />
                          <p className="font-semibold text-text-primary">
                            {location}
                          </p>
                        </div>
                      </button>)}
                  </div>
                </div>

                {/* Property Type Selection - SECOND */}
                <div className="mb-6">
                  <h2 className="font-display text-xl font-bold text-text-primary mb-4">
                    Select Property Type
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {propertyTypes.map(type => <button key={type} onClick={() => setFormData({
                  ...formData,
                  type
                })} className={`p-4 rounded-xl border-2 transition-all text-left ${formData.type === type ? 'border-primary bg-primary/5' : 'border-border-color hover:border-primary/50'}`}>
                        <p className="font-semibold text-text-primary capitalize">
                          {type}
                        </p>
                      </button>)}
                  </div>
                </div>

                {/* Agent Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Agent Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['direct', 'semi-direct'].map(type => <button key={type} onClick={() => setFormData({
                  ...formData,
                  agentType: type as 'direct' | 'semi-direct'
                })} className={`p-4 rounded-xl border-2 transition-all ${formData.agentType === type ? 'border-primary bg-primary/5' : 'border-border-color hover:border-primary/50'}`}>
                        <p className="font-semibold text-text-primary capitalize">
                          {type === 'direct' ? 'Direct Agent' : 'Semi-Direct'}
                        </p>
                      </button>)}
                  </div>
                </div>
              </div>}

            {step === 2 && <div className="space-y-4">
                <h2 className="font-display text-xl font-bold text-text-primary mb-4">
                  Property Details
                </h2>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Title
                  </label>
                  <input type="text" value={formData.title} onChange={e => setFormData({
                ...formData,
                title: e.target.value
              })} placeholder="e.g., Luxury 3-Bedroom Apartment" className="w-full px-4 py-3 bg-bg-secondary border border-border-color rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Price (₦)
                  </label>
                  <input type="number" value={formData.price} onChange={e => setFormData({
                ...formData,
                price: e.target.value
              })} placeholder="12000000" className="w-full px-4 py-3 bg-bg-secondary border border-border-color rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Bedrooms
                    </label>
                    <input type="number" value={formData.bedrooms} onChange={e => setFormData({
                  ...formData,
                  bedrooms: e.target.value
                })} placeholder="3" className="w-full px-4 py-3 bg-bg-secondary border border-border-color rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Bathrooms
                    </label>
                    <input type="number" value={formData.bathrooms} onChange={e => setFormData({
                  ...formData,
                  bathrooms: e.target.value
                })} placeholder="3" className="w-full px-4 py-3 bg-bg-secondary border border-border-color rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Description
                  </label>
                  <textarea value={formData.description} onChange={e => setFormData({
                ...formData,
                description: e.target.value
              })} placeholder="Describe your property..." rows={4} className="w-full px-4 py-3 bg-bg-secondary border border-border-color rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary resize-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Amenities
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {amenitiesList.map(amenity => <button key={amenity} onClick={() => toggleAmenity(amenity)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${formData.amenities.includes(amenity) ? 'bg-primary text-white' : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'}`}>
                        {amenity}
                      </button>)}
                  </div>
                </div>
              </div>}

            {step === 3 && <div>
                <h2 className="font-display text-xl font-bold text-text-primary mb-4">
                  Upload Media
                </h2>
                
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {/* Upload area */}
                <div 
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                    isUploading ? 'border-primary/50 bg-primary/5' : 'border-border-color hover:border-primary'
                  }`}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                      <p className="font-medium text-text-primary mb-2">
                        Uploading files...
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                      <p className="font-medium text-text-primary mb-2">
                        Upload photos and videos
                      </p>
                      <p className="text-sm text-text-tertiary mb-4">
                        Click to browse or drag and drop
                      </p>
                      <button 
                        type="button"
                        className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
                      >
                        Choose Files
                      </button>
                    </>
                  )}
                </div>

                {/* Error message */}
                {uploadError && (
                  <p className="text-sm text-danger mt-2">{uploadError}</p>
                )}

                {/* Uploaded Images Preview */}
                {uploadedImages.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Images ({uploadedImages.length})
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {uploadedImages.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                          <img 
                            src={url} 
                            alt={`Upload ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1 bg-danger text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Uploaded Videos Preview */}
                {uploadedVideos.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Videos ({uploadedVideos.length})
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {uploadedVideos.map((url, index) => (
                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden group">
                          <video 
                            src={url} 
                            className="w-full h-full object-cover"
                            controls
                          />
                          <button
                            onClick={() => removeVideo(index)}
                            className="absolute top-2 right-2 p-1 bg-danger text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-xs text-text-tertiary mt-4 text-center">
                  Supported formats: JPG, PNG, MP4. Max size: 10MB per file
                </p>
              </div>}

            {step === 4 && <div>
                <h2 className="font-display text-xl font-bold text-text-primary mb-4">
                  Review & Submit
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-bg-secondary rounded-xl">
                    <p className="text-sm text-text-tertiary mb-1">Location</p>
                    <p className="font-semibold text-text-primary">
                      {formData.location || 'Not set'}
                    </p>
                  </div>
                  <div className="p-4 bg-bg-secondary rounded-xl">
                    <p className="text-sm text-text-tertiary mb-1">
                      Property Type
                    </p>
                    <p className="font-semibold text-text-primary capitalize">
                      {formData.type}
                    </p>
                  </div>
                  <div className="p-4 bg-bg-secondary rounded-xl">
                    <p className="text-sm text-text-tertiary mb-1">Title</p>
                    <p className="font-semibold text-text-primary">
                      {formData.title || 'Not set'}
                    </p>
                  </div>
                  <div className="p-4 bg-bg-secondary rounded-xl">
                    <p className="text-sm text-text-tertiary mb-1">Price</p>
                    <p className="font-semibold text-text-primary">
                      ₦
                      {formData.price ? Number(formData.price).toLocaleString() : 'Not set'}
                    </p>
                  </div>
                  <div className="p-4 bg-bg-secondary rounded-xl">
                    <p className="text-sm text-text-tertiary mb-1">
                      Agent Type
                    </p>
                    <p className="font-semibold text-text-primary capitalize">
                      {formData.agentType === 'direct' ? 'Direct Agent' : 'Semi-Direct Agent'}
                    </p>
                  </div>
                  <div className="p-4 bg-bg-secondary rounded-xl">
                    <p className="text-sm text-text-tertiary mb-1">Media</p>
                    <p className="font-semibold text-text-primary">
                      {uploadedImages.length} images, {uploadedVideos.length} videos
                    </p>
                  </div>
                </div>

                {/* Warning for Ikate/Lekki + Semi-Direct */}
                {formData.agentType === 'semi-direct' && (formData.location === 'Ikate' || formData.location === 'Lekki') && <motion.div initial={{
              opacity: 0,
              scale: 0.95
            }} animate={{
              opacity: 1,
              scale: 1
            }} className="mt-6 p-4 bg-warning/10 border border-warning/30 rounded-xl">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-warning mb-1">
                            Duplicate Check Required
                          </p>
                          <p className="text-xs text-text-secondary">
                            We'll check if a Direct Agent already has this
                            property in {formData.location}
                          </p>
                        </div>
                      </div>
                    </motion.div>}
              </div>}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {step > 1 && <button onClick={handleBack} disabled={isSubmitting} className="flex-1 px-6 py-3 bg-bg-primary hover:bg-bg-tertiary border border-border-color text-text-primary rounded-xl font-medium transition-colors disabled:opacity-50">
                Back
              </button>}
            <button onClick={step === 4 ? handleSubmit : handleNext} disabled={(step === 1 && (!formData.location || !formData.type)) || isSubmitting} className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? 'Submitting...' : step === 4 ? 'Submit Listing' : 'Continue'}
            </button>
          </div>
        </div>
      </div>

      {/* Duplicate Listing Modal */}
      <DuplicateListingModal isOpen={showDuplicateModal} onClose={() => setShowDuplicateModal(false)} directAgent={directAgentContact} onUnlock={handleUnlockDirectAgent} onStartChat={handleStartChatWithDirectAgent} credits={mockAgent.credits} />

      {/* Chat with Direct Agent */}
      {directAgentContact.unlocked && <ChatInterface isOpen={chatOpen} onClose={() => setChatOpen(false)} participant={{
      name: directAgentContact.agentName,
      avatar: directAgentContact.agentAvatar
    }} />}
    </>;
}
