import { Text, Title } from '@vkontakte/vkui';
import { CenterModal } from '../CenterModal';
import videoFile from '../../assets/GX010501.mp4';
import './VideoInfoModal.css';

export function VideoInfoModal({ open, onClose, quote, title, text }) {
  return (
    <CenterModal open={open} onClose={onClose}>
      <div className="video-info">
        <video className="video-info__video" src={videoFile} controls playsInline />

        {quote && <blockquote className="video-info__quote">{quote}</blockquote>}

        {title && (
          <Title level="3" className="video-info__title">
            {title}
          </Title>
        )}

        {text && <Text className="video-info__text">{text}</Text>}
      </div>
    </CenterModal>
  );
}