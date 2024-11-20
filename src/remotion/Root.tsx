import React from 'react';
import { Composition } from 'remotion';
import RemotionVideo from '@/app/dashboard/_components/RemotionVideo';
import { RemotionVideoProps } from '@/types/types';

const defaultProps: RemotionVideoProps = {
  script: [], 
  imageList: [],
  audioFileUrl: '',
  captions: [],
  setDurationInFrame: () => {}
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Empty"
        component={RemotionVideo}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
        defaultProps={defaultProps}
      />
    </>
  );
};