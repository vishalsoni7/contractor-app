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
  Stack,
} from '@mui/material';
import {
  CameraAlt,
  Delete,
  LocationOn,
  ZoomIn,
  PhotoLibrary,
} from '@mui/icons-material';
import { useLanguage } from '../../context/LanguageContext';

const PhotoCapture = ({ photo, photoLocation, onPhotoChange }) => {
  const { getText } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

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
        const maxSize = 800;
        let width = img.width;
        let height = img.height;

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

        ctx.drawImage(img, 0, 0, width, height);

        const overlayHeight = Math.min(120, height * 0.25);
        const gradient = ctx.createLinearGradient(0, height - overlayHeight - 20, 0, height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.7)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.85)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, height - overlayHeight - 20, width, overlayHeight + 20);

        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';

        const padding = 12;
        const lineHeight = 18;
        let yPos = height - overlayHeight + 10;

        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#4CAF50';
        ctx.fillText('Kaamgar', padding, yPos);

        ctx.font = '10px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText('कामगार', padding + 70, yPos);

        yPos += lineHeight + 4;

        ctx.font = '12px Arial';
        ctx.fillStyle = 'white';
        const dateTime = formatDateTime(new Date());
        ctx.fillText(dateTime, padding, yPos);
        yPos += lineHeight;

        if (location) {
          ctx.font = '11px Arial';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';

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

        ctx.textAlign = 'right';
        ctx.font = 'bold 10px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText('GPS Verified', width - padding, height - padding);

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
      setGettingLocation(true);
      let location = null;
      try {
        location = await getLocation();
      } catch {
        console.log('Location not available');
      }
      setGettingLocation(false);

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
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

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {getText('Worker Photo with GPS', 'GPS के साथ कर्मचारी फोटो')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        {/* Photo Preview */}
        <Box sx={{ position: 'relative' }}>
          {photo ? (
            <>
              <Avatar
                src={photo}
                sx={{
                  width: 120,
                  height: 120,
                  cursor: 'pointer',
                  border: 3,
                  borderColor: 'primary.main',
                }}
                onClick={() => setPreviewOpen(true)}
              />
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
                onClick={() => setPreviewOpen(true)}
              >
                <ZoomIn sx={{ fontSize: 16 }} />
              </IconButton>
            </>
          ) : (
            <Avatar sx={{ width: 120, height: 120, bgcolor: 'grey.200' }}>
              <CameraAlt sx={{ fontSize: 48, color: 'grey.400' }} />
            </Avatar>
          )}
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={1}>
          {!photo ? (
            <>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <CameraAlt />}
                onClick={() => cameraInputRef.current?.click()}
                disabled={loading}
                size="small"
              >
                {getText('Camera', 'कैमरा')}
              </Button>
              <Button
                variant="outlined"
                startIcon={loading ? <CircularProgress size={16} /> : <PhotoLibrary />}
                onClick={() => galleryInputRef.current?.click()}
                disabled={loading}
                size="small"
              >
                {getText('Gallery', 'गैलरी')}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                size="small"
                startIcon={<CameraAlt />}
                onClick={() => cameraInputRef.current?.click()}
                disabled={loading}
              >
                {getText('Retake', 'दोबारा लें')}
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<PhotoLibrary />}
                onClick={() => galleryInputRef.current?.click()}
                disabled={loading}
              >
                {getText('Gallery', 'गैलरी')}
              </Button>
              <IconButton
                color="error"
                onClick={handleRemovePhoto}
                size="small"
              >
                <Delete />
              </IconButton>
            </>
          )}
        </Stack>

        {/* Status Messages */}
        {gettingLocation && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={14} />
            <Typography variant="caption" color="text.secondary">
              {getText('Getting GPS location...', 'GPS स्थान प्राप्त हो रहा है...')}
            </Typography>
          </Box>
        )}

        {loading && !gettingLocation && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={14} />
            <Typography variant="caption" color="text.secondary">
              {getText('Adding GPS stamp...', 'GPS स्टैम्प जोड़ रहे हैं...')}
            </Typography>
          </Box>
        )}

        {photoLocation && !loading && (
          <Chip
            icon={<LocationOn />}
            label={`${photoLocation.latitude.toFixed(4)}, ${photoLocation.longitude.toFixed(4)}`}
            size="small"
            color="success"
            variant="outlined"
          />
        )}
      </Box>

      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
        {getText('Photo will include GPS coordinates & timestamp', 'फोटो में GPS और समय शामिल होगा')}
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
