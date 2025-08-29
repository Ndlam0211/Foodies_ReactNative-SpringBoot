import React, { useCallback, useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from './Icon';

export type MessageType = 'info' | 'success' | 'warning' | 'error';

export interface InfoMessageProps {
  message: string;
  type?: MessageType;
  visible: boolean;
  onClose?: () => void;
  autoHide?: boolean;
  autoHideDuration?: number;
  position?: 'top' | 'center' | 'bottom';
  showCloseButton?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

const InfoMessage: React.FC<InfoMessageProps> = ({
  message,
  type = 'info',
  visible,
  onClose,
  autoHide = true,
  autoHideDuration = 4000,
  position = 'top',
  showCloseButton = true,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const autoHideTimer = useRef<NodeJS.Timeout | null>(null);
  const isVisible = useRef(false);

  const messageConfig = {
    info: {
      backgroundColor: '#E3F2FD',
      borderColor: '#2196F3',
      textColor: '#1565C0',
      iconName: 'information-circle',
      iconFamily: 'Ionicons' as const,
    },
    success: {
      backgroundColor: '#E8F5E8',
      borderColor: '#4CAF50',
      textColor: '#2E7D32',
      iconName: 'checkmark-circle',
      iconFamily: 'Ionicons' as const,
    },
    warning: {
      backgroundColor: '#FFF3E0',
      borderColor: '#FF9800',
      textColor: '#F57C00',
      iconName: 'warning',
      iconFamily: 'Ionicons' as const,
    },
    error: {
      backgroundColor: '#FFEBEE',
      borderColor: '#F44336',
      textColor: '#C62828',
      iconName: 'close-circle',
      iconFamily: 'Ionicons' as const,
    },
  };

  const config = messageConfig[type];

  const handleClose = useCallback(() => {
    if (autoHideTimer.current) {
      clearTimeout(autoHideTimer.current);
    }
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (visible) {
      isVisible.current = true;
      // Show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide
      if (autoHide && autoHideDuration > 0) {
        autoHideTimer.current = setTimeout(() => {
          handleClose();
        }, autoHideDuration);
      }
    } else {
      // Hide animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: position === 'bottom' ? 100 : -100,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        isVisible.current = false;
      });
    }

    return () => {
      if (autoHideTimer.current) {
        clearTimeout(autoHideTimer.current);
      }
    };
  }, [visible, autoHide, autoHideDuration, position, fadeAnim, slideAnim, handleClose]);

  if (!visible && !isVisible.current) {
    return null;
  }

  const containerStyle = [
    styles.container,
    {
      backgroundColor: config.backgroundColor,
      borderLeftColor: config.borderColor,
      [position]: position === 'center' ? '50%' : 50,
      marginTop: position === 'center' ? 5 : 0,
    },
  ];

  return (
    <Animated.View
      style={[
        containerStyle,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <Icon
          iconFamily={config.iconFamily}
          name={config.iconName}
          size={RFValue(18)}
          color={config.textColor}
        />
        <Text
          style={[
            styles.message,
            { color: config.textColor }
          ]}
          numberOfLines={3}
        >
          {message}
        </Text>
        {showCloseButton && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon
              iconFamily="Ionicons"
              name="close"
              size={RFValue(16)}
              color={config.textColor}
            />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderLeftWidth: 4,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    zIndex: 9999,
    elevation: Platform.OS === 'android' ? 8 : 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxWidth: screenWidth - 32,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  message: {
    flex: 1,
    fontSize: RFValue(14),
    lineHeight: RFValue(20),
    marginLeft: 8,
    marginRight: 8,
    fontFamily: 'Okra-Medium',
  },
  closeButton: {
    padding: 2,
  },
});

export default InfoMessage;
