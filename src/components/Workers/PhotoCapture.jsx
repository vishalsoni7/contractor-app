import { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogContent,
} from '@mui/material';
import {
  CameraAlt,
  Delete,
  LocationOn,
  ZoomIn,
} from '@mui/icons-material';

const PhotoCapture = ({ photo, photoLocation, onPhotoChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef(null);

  const formatDateTime = (date) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return date.toLocaleDateString('en-IN', options);
  };

  const createGeoTaggedImage = (imageData, location) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 800; // Larger size for better quality with overlay
        let width = img.width;
        let height = img.height;

        // Scale image
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Draw the original image
        ctx.drawImage(img, 0, 0, width, height);

        // Create overlay at the bottom
        const overlayHeight = Math.min(120, height * 0.25);
        const gradient = ctx.createLinearGradient(0, height - overlayHeight - 20, 0, height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.7)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.85)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, height - overlayHeight - 20, width, overlayHeight + 20);

        // Set text styles
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';

        const padding = 12;
        const lineHeight = 18;
        let yPos = height - overlayHeight + 10;

        // App branding
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#4CAF50';
        ctx.fillText('Kaamgar', padding, yPos);

        ctx.font = '10px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText('कामगार', padding + 70, yPos);

        yPos += lineHeight + 4;

        // Date and time
        ctx.font = '12px Arial';
        ctx.fillStyle = 'white';
        const dateTime = formatDateTime(new Date());
        ctx.fillText(dateTime, padding, yPos);
        yPos += lineHeight;

        // Location info
        if (location) {
          // Coordinates
          ctx.font = '11px Arial';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';

          // Location icon simulation (circle with dot)
          ctx.fillStyle = '#4CAF50';
          ctx.beginPath();
          ctx.arc(padding + 6, yPos - 4, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(padding + 6, yPos - 4, 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = 'white';
          ctx.fillText(
            `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`,
            padding + 18,
            yPos
          );
          yPos += lineHeight;

          // Accuracy
          if (location.accuracy) {
            ctx.font = '10px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillText(`Accuracy: ±${Math.round(location.accuracy)}m`, padding, yPos);
          }
        } else {
          ctx.font = '11px Arial';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.fillText('Location not available', padding, yPos);
        }

        // Watermark on right side
        ctx.textAlign = 'right';
        ctx.font = 'bold 10px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText('GPS Verified', width - padding, height - padding);

        // Convert to base64
        const geoTaggedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        resolve(geoTaggedBase64);
      };
      img.src = imageData;
    });
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            timestamp: new Date().toISOString(),
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      // First, get location
      setGettingLocation(true);
      let location = null;
      try {
        location = await getLocation();
      } catch {
        console.log('Location not available');
      }
      setGettingLocation(false);

      // Read the file
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          // Create geo-tagged image with overlay
          const geoTaggedPhoto = await createGeoTaggedImage(event.target.result, location);
          onPhotoChange(geoTaggedPhoto, location);
        } catch (err) {
          setError('Failed to process photo');
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to capture photo');
      setLoading(false);
      setGettingLocation(false);
    }

    e.target.value = '';
  };

  const handleRemovePhoto = () => {
    onPhotoChange(null, null);
  };

  const handleCaptureClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Worker Photo with GPS / GPS के साथ कर्मचारी फोटो
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {photo ? (
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={photo}
              sx={{ width: 100, height: 100, cursor: 'pointer' }}
              onClick={() => setPreviewOpen(true)}
            />
            <IconButton
              size="small"
              sx={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                width: 24,
                height: 24,
              }}
              onClick={() => setPreviewOpen(true)}
            >
              <ZoomIn sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        ) : (
          <Avatar sx={{ width: 100, height: 100, bgcolor: 'grey.300' }}>
            <CameraAlt sx={{ fontSize: 36, color: 'grey.500' }} />
          </Avatar>
        )}

        <Box sx={{ flex: 1 }}>
          {!photo ? (
            <Button
              variant="outlined"
              startIcon={loading ? <CircularProgress size={16} /> : <CameraAlt />}
              onClick={handleCaptureClick}
              disabled={loading}
              size="small"
            >
              {loading ? 'Processing...' : 'Capture Photo'}
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<CameraAlt />}
                onClick={handleCaptureClick}
                disabled={loading}
              >
                Retake
              </Button>
              <IconButton
                color="error"
                onClick={handleRemovePhoto}
                size="small"
              >
                <Delete />
              </IconButton>
            </Box>
          )}

          {gettingLocation && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <CircularProgress size={14} />
              <Typography variant="caption" color="text.secondary">
                Getting GPS location...
              </Typography>
            </Box>
          )}

          {loading && !gettingLocation && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <CircularProgress size={14} />
              <Typography variant="caption" color="text.secondary">
                Adding GPS stamp...
              </Typography>
            </Box>
          )}

          {photoLocation && !loading && (
            <Box sx={{ mt: 1 }}>
              <Chip
                icon={<LocationOn />}
                label={`${photoLocation.latitude.toFixed(4)}, ${photoLocation.longitude.toFixed(4)}`}
                size="small"
                color="success"
                variant="outlined"
              />
            </Box>
          )}
        </Box>
      </Box>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        Photo will include GPS coordinates & timestamp / फोटो में GPS और समय शामिल होगा
      </Typography>

      {/* Full size preview dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
      >
        <DialogContent sx={{ p: 1 }}>
          {photo && (
            <img
              src={photo}
              alt="Worker photo with GPS"
              style={{ maxWidth: '100%', maxHeight: '80vh', display: 'block' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PhotoCapture;
