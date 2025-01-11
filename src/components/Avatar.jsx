import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { useFacialExpressions } from "../hooks/useFacialExpressions";
import { useBlinking } from "../hooks/useBlinking";
import { useLipSync } from "../hooks/useLipSync";
import { filterEndTracks } from "../utils/animations";
import { applyMorphTarget } from "../utils/morphTargets";

export function Avatar(props) {
  const { nodes, materials, scene } = useGLTF("/models/678250d39d91f0cde79136f6.glb");
  const { animations: originalAnimations } = useGLTF("/models/animations.glb");
  const animations = filterEndTracks(originalAnimations);
  const group = useRef();
  const { actions } = useAnimations(animations, group);
  const [animation, setAnimation] = useState("Standing Idle");
  const { message, onMessagePlayed } = useChat();
  const { blink } = useBlinking();
  const { currentViseme } = useLipSync();
  const { currentExpression, applyExpression, setupMode, setupControls } = useFacialExpressions(nodes);

  // Check if required nodes and materials are loaded
  if (!nodes || !materials) {
    console.warn("3D model resources not loaded yet");
    return null;
  }

  useEffect(() => {
    actions[animation]?.reset().fadeIn(0.5).play();
    return () => {
      actions[animation]?.fadeOut(0.5);
    };
  }, [animation]);

  useEffect(() => {
    if (message) {
      setAnimation("Talking_0");
      const timeout = setTimeout(() => {
        setAnimation("Standing Idle");
        onMessagePlayed();
      }, 2000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [message]);

  useControls({
    Animation: {
      value: animation,
      options: Object.keys(actions),
      onChange: (value) => {
        setAnimation(value);
      },
    },
  });

  useFrame(() => {
    if (!nodes?.Wolf3D_Head) return;

    // Reset all morphs at the start of each frame
    Object.keys(nodes.Wolf3D_Head.morphTargetDictionary || {}).forEach(key => {
      applyMorphTarget(nodes.Wolf3D_Head, key, 0);
    });

    if (setupMode) {
      // Apply setup mode controls
      Object.entries(setupControls).forEach(([key, value]) => {
        applyMorphTarget(nodes.Wolf3D_Head, key, value);
      });
    } else {
      // Apply current expression
      applyExpression(currentExpression);
    }

    // Apply blinking (should override expression)
    applyMorphTarget(nodes.Wolf3D_Head, 'eyeBlinkLeft', blink ? 1 : 0);
    applyMorphTarget(nodes.Wolf3D_Head, 'eyeBlinkRight', blink ? 1 : 0);

    // Apply lip sync (should override expression)
    if (currentViseme) {
      applyMorphTarget(nodes.Wolf3D_Head, currentViseme, 1);
    }
  });

  return (
    <group {...props} ref={group} dispose={null}>
      <group name="Scene">
        <group name="Armature">
          {nodes.Hips && <primitive object={nodes.Hips} />}
          {nodes.EyeLeft && materials.Wolf3D_Eye && (
            <skinnedMesh
              name="EyeLeft"
              geometry={nodes.EyeLeft.geometry}
              material={materials.Wolf3D_Eye}
              skeleton={nodes.EyeLeft.skeleton}
              morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
              morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
            />
          )}
          {nodes.EyeRight && materials.Wolf3D_Eye && (
            <skinnedMesh
              name="EyeRight"
              geometry={nodes.EyeRight.geometry}
              material={materials.Wolf3D_Eye}
              skeleton={nodes.EyeRight.skeleton}
              morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
              morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
            />
          )}
          {nodes.Wolf3D_Head && materials.Wolf3D_Skin && (
            <skinnedMesh
              name="Wolf3D_Head"
              geometry={nodes.Wolf3D_Head.geometry}
              material={materials.Wolf3D_Skin}
              skeleton={nodes.Wolf3D_Head.skeleton}
              morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
              morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
            />
          )}
          {nodes.Wolf3D_Teeth && materials.Wolf3D_Teeth && (
            <skinnedMesh
              name="Wolf3D_Teeth"
              geometry={nodes.Wolf3D_Teeth.geometry}
              material={materials.Wolf3D_Teeth}
              skeleton={nodes.Wolf3D_Teeth.skeleton}
              morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
              morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
            />
          )}
          {nodes.Wolf3D_Body && materials.Wolf3D_Body && (
            <skinnedMesh
              name="Wolf3D_Body"
              geometry={nodes.Wolf3D_Body.geometry}
              material={materials.Wolf3D_Body}
              skeleton={nodes.Wolf3D_Body.skeleton}
            />
          )}
          {nodes.Wolf3D_Outfit_Bottom && materials.Wolf3D_Outfit_Bottom && (
            <skinnedMesh
              name="Wolf3D_Outfit_Bottom"
              geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
              material={materials.Wolf3D_Outfit_Bottom}
              skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
            />
          )}
          {nodes.Wolf3D_Outfit_Footwear && materials.Wolf3D_Outfit_Footwear && (
            <skinnedMesh
              name="Wolf3D_Outfit_Footwear"
              geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
              material={materials.Wolf3D_Outfit_Footwear}
              skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
            />
          )}
          {nodes.Wolf3D_Outfit_Top && materials.Wolf3D_Outfit_Top && (
            <skinnedMesh
              name="Wolf3D_Outfit_Top"
              geometry={nodes.Wolf3D_Outfit_Top.geometry}
              material={materials.Wolf3D_Outfit_Top}
              skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
            />
          )}
          {nodes.Wolf3D_Hair && materials.Wolf3D_Hair && (
            <skinnedMesh
              name="Wolf3D_Hair"
              geometry={nodes.Wolf3D_Hair.geometry}
              material={materials.Wolf3D_Hair}
              skeleton={nodes.Wolf3D_Hair.skeleton}
            />
          )}
        </group>
      </group>
    </group>
  );
}