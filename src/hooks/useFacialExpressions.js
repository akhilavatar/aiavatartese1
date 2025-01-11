import { useEffect, useState, useCallback } from 'react';
import { useControls } from 'leva';
import { facialExpressions } from '../constants/facialExpressions';

export const useFacialExpressions = (nodes) => {
  const [currentExpression, setCurrentExpression] = useState('default');
  const [availableMorphs, setAvailableMorphs] = useState([]);

  useEffect(() => {
    if (nodes?.Wolf3D_Head?.morphTargetDictionary) {
      const morphs = Object.keys(nodes.Wolf3D_Head.morphTargetDictionary);
      setAvailableMorphs(morphs);
      console.log('Available morph targets:', morphs);
    }
  }, [nodes]);

  const { expression, setupModeEnabled } = useControls({
    expression: {
      value: 'default',
      options: Object.keys(facialExpressions),
    },
    setupModeEnabled: false,
  });

  const applyExpression = useCallback((expressionName) => {
    if (!nodes?.Wolf3D_Head?.morphTargetDictionary) return;

    const expressionValues = facialExpressions[expressionName];
    if (!expressionValues) return;

    // Reset all morphs first
    const morphDict = nodes.Wolf3D_Head.morphTargetDictionary;
    const morphInfluences = nodes.Wolf3D_Head.morphTargetInfluences;
    
    Object.keys(morphDict).forEach(key => {
      if (!key.startsWith('viseme_')) {
        morphInfluences[morphDict[key]] = 0;
      }
    });

    // Map generic expression names to actual morph target names
    const morphMap = {
      mouthSmile: 'mouthSmile',
      eyeSquint: 'eyeSquint',
      cheekSquint: 'cheekSquint',
      jawOpen: 'jawOpen',
      mouthPucker: 'mouthPucker',
      cheekPuff: 'cheekPuff',
      tongueOut: 'tongueOut',
      browDownRight: 'browDown_R',
      browDownLeft: 'browDown_L',
      mouthFrown: 'mouthFrown',
      eyeWide: 'eyeWide',
      browUp: 'browInnerUp',
      noseSneer: 'noseSneer'
    };

    // Apply expression values using the morph map
    Object.entries(expressionValues).forEach(([key, value]) => {
      const morphName = morphMap[key];
      if (morphName && morphDict.hasOwnProperty(morphName)) {
        morphInfluences[morphDict[morphName]] = value;
      }
    });
  }, [nodes]);

  useEffect(() => {
    if (!setupModeEnabled) {
      setCurrentExpression(expression);
      applyExpression(expression);
    }
  }, [expression, setupModeEnabled, applyExpression]);

  const setupControls = useControls(
    'Expression Setup',
    setupModeEnabled && nodes?.Wolf3D_Head?.morphTargetDictionary ? 
      Object.fromEntries(
        Object.keys(nodes.Wolf3D_Head.morphTargetDictionary)
          .filter(key => !key.startsWith('viseme_'))
          .map(key => [
            key,
            {
              value: 0,
              min: 0,
              max: 1,
              step: 0.01,
            },
          ])
      ) : 
      {},
    [setupModeEnabled, nodes]
  );

  return {
    currentExpression,
    applyExpression,
    setupMode: setupModeEnabled,
    setupControls,
    availableMorphs,
  };
};