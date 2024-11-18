import React from 'react';
import { Composition } from 'remotion';
import RemotionVideo from '@/app/dashboard/_components/RemotionVideo';
import { videoParams } from '@/types/types';

const defaultProps: videoParams = {
  script: [], 
  imageList: [],
  audioFileUrl: '',
  captions: [],
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