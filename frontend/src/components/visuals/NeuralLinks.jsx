import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

export const NeuralLinks = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      data-testid="neural-links-bg"
      init={particlesInit}
      options={{
        fullScreen: { enable: false },
        background: { color: 'transparent' },
        fpsLimit: 30,
        interactivity: {
          events: {
            onHover: { enable: false },
            resize: true
          }
        },
        particles: {
          number: {
            value: 28,
            density: {
              enable: true,
              area: 900
            }
          },
          color: { value: '#06d6a0' },
          links: {
            enable: true,
            color: '#1e3a8a',
            opacity: 0.35,
            width: 1
          },
          move: {
            enable: true,
            speed: 0.4
          },
          opacity: { value: 0.25 },
          size: {
            value: { min: 1, max: 2 }
          }
        },
        detectRetina: true
      }}
    />
  );
};

export default NeuralLinks;