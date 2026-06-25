import { useFrame, useThree } from '@react-three/fiber/native';
import { useEffect } from 'react';
import { OrthographicCamera, PerspectiveCamera } from 'three';
import {
  ControlsMode,
  ControlsProps,
  useCreateControls,
} from 'r3f-native-orbitcontrols/src/Controls';

type ControlsInternalProps = ControlsProps & {
  controls: ReturnType<typeof useCreateControls>;
};

function Controls({ controls, ...props }: ControlsInternalProps) {
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    if (
      (camera as PerspectiveCamera).isPerspectiveCamera ||
      (camera as OrthographicCamera).isOrthographicCamera
    ) {
      controls.scope.camera = camera as PerspectiveCamera | OrthographicCamera;
    } else {
      throw new Error(
        'The camera must be a PerspectiveCamera or OrthographicCamera for controls to work',
      );
    }
  }, [camera, controls.scope]);

  useEffect(() => {
    for (const prop in props) {
      (controls.scope[prop as keyof typeof controls.scope] as unknown) =
        props[prop as keyof typeof props];
    }
  }, [props, controls.scope]);

  useFrame(controls.functions.update, -1);

  return null;
}

/** Fixed version of r3f-native-orbitcontrols' useControls (avoids hooks inside useMemo). */
export function useOrbitControls(mode = ControlsMode.ORBIT) {
  const controls = useCreateControls(mode);

  const OrbitControls = (props: ControlsProps) => (
    <Controls controls={controls} {...props} />
  );

  return [OrbitControls, controls.events] as const;
}
