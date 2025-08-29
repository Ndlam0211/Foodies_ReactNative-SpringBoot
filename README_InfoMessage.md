# InfoMessage Component Documentation

## Overview

The InfoMessage component is a reusable React Native component for displaying informational messages to users. It supports different message types, animations, auto-hide functionality, and global state management through Redux.

## Features

- ✅ Multiple message types (info, success, warning, error)
- ✅ Customizable positioning (top, center, bottom)
- ✅ Auto-hide with configurable duration
- ✅ Dismissible with close button
- ✅ Smooth animations (fade + slide)
- ✅ Global state management with Redux
- ✅ Custom hook for easy usage
- ✅ Responsive design
- ✅ TypeScript support

## Installation & Setup

### 1. Add to Redux Store

The messageSlice has been added to your rootReducer. The store will automatically include message state management.

### 2. Add MessageContainer to App

The MessageContainer has been added to your App.tsx and will display messages globally across all screens.

## Usage

### Basic Usage with useMessage Hook

```tsx
import { useMessage } from "@/hooks/useMessage";

const MyComponent = () => {
  const { showSuccess, showError, showWarning, showInfo } = useMessage();

  const handleSuccess = () => {
    showSuccess("Operation completed successfully!");
  };

  const handleError = () => {
    showError("Something went wrong. Please try again.");
  };

  return (
    <View>
      <TouchableOpacity onPress={handleSuccess}>
        <Text>Show Success</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### Advanced Usage with Custom Options

```tsx
const PaymentComponent = () => {
  const { show } = useMessage();

  const handlePayment = () => {
    show({
      message: "Payment processing...",
      type: "info",
      position: "center",
      autoHide: false,
      showCloseButton: false,
    });
  };
};
```

### Cart Integration Example

```tsx
const CartComponent = () => {
  const { showSuccess, showError } = useMessage();
  const dispatch = useAppDispatch();

  const addToCart = (item: any) => {
    try {
      dispatch(addItemToCart({ restaurant, item }));
      showSuccess(`${item.name} added to cart!`, {
        autoHideDuration: 2000,
      });
    } catch (error) {
      showError("Failed to add item to cart");
    }
  };
};
```

## API Reference

### InfoMessage Props

| Prop               | Type                                          | Default  | Description                            |
| ------------------ | --------------------------------------------- | -------- | -------------------------------------- |
| `message`          | `string`                                      | -        | The message text to display            |
| `type`             | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Message type affecting colors and icon |
| `visible`          | `boolean`                                     | -        | Controls message visibility            |
| `onClose`          | `() => void`                                  | -        | Callback when message is closed        |
| `autoHide`         | `boolean`                                     | `true`   | Whether to auto-hide the message       |
| `autoHideDuration` | `number`                                      | `4000`   | Duration in ms before auto-hide        |
| `position`         | `'top' \| 'center' \| 'bottom'`               | `'top'`  | Message position on screen             |
| `showCloseButton`  | `boolean`                                     | `true`   | Whether to show close button           |

### useMessage Hook Methods

| Method        | Parameters                                               | Description                        |
| ------------- | -------------------------------------------------------- | ---------------------------------- |
| `show`        | `ShowMessageOptions`                                     | Show a message with custom options |
| `showSuccess` | `message: string, options?: Partial<ShowMessageOptions>` | Show success message               |
| `showError`   | `message: string, options?: Partial<ShowMessageOptions>` | Show error message                 |
| `showWarning` | `message: string, options?: Partial<ShowMessageOptions>` | Show warning message               |
| `showInfo`    | `message: string, options?: Partial<ShowMessageOptions>` | Show info message                  |
| `hide`        | `messageId: string`                                      | Hide specific message              |
| `hideAll`     | -                                                        | Hide all messages                  |
| `hideByType`  | `type: MessageType`                                      | Hide all messages of specific type |

## Message Types & Styling

### Info (Blue)

- Background: Light blue (`#E3F2FD`)
- Border: Blue (`#2196F3`)
- Icon: Information circle

### Success (Green)

- Background: Light green (`#E8F5E8`)
- Border: Green (`#4CAF50`)
- Icon: Checkmark circle

### Warning (Orange)

- Background: Light orange (`#FFF3E0`)
- Border: Orange (`#FF9800`)
- Icon: Warning triangle

### Error (Red)

- Background: Light red (`#FFEBEE`)
- Border: Red (`#F44336`)
- Icon: Close circle

## Best Practices

### 1. Use Appropriate Message Types

```tsx
// ✅ Good
showSuccess("Item added to cart");
showError("Network connection failed");
showWarning("Session expires in 5 minutes");
showInfo("New features available");

// ❌ Avoid
showSuccess("Network connection failed"); // Wrong type
```

### 2. Keep Messages Concise

```tsx
// ✅ Good
showError("Payment failed. Please try again.");

// ❌ Too verbose
showError(
  "Your payment could not be processed at this time due to an error with our payment processing system. Please check your payment details and try again later."
);
```

### 3. Use Auto-Hide Appropriately

```tsx
// ✅ Auto-hide for success/info
showSuccess("Settings saved", { autoHideDuration: 2000 });

// ✅ Keep errors visible until dismissed
showError("Payment failed", { autoHide: false });
```

### 4. Position Based on Context

```tsx
// ✅ Top for general notifications
showInfo("New message received");

// ✅ Center for important alerts
showError("Payment failed", { position: "center" });

// ✅ Bottom for non-intrusive updates
showSuccess("Auto-saved", { position: "bottom" });
```

## Integration Examples

### 1. API Error Handling

```tsx
const useApiWithMessages = () => {
  const { showError, showWarning } = useMessage();

  const apiCall = async (url: string) => {
    try {
      const response = await fetch(url);

      if (response.status === 401) {
        showWarning("Session expired. Please login again.");
      } else if (!response.ok) {
        showError("Request failed. Please try again.");
      }

      return response.json();
    } catch (error) {
      showError("Network error. Check your connection.");
      throw error;
    }
  };

  return { apiCall };
};
```

### 2. Form Validation

```tsx
const FormComponent = () => {
  const { showError, showSuccess } = useMessage();

  const handleSubmit = (formData: any) => {
    if (!formData.email) {
      showError("Email is required");
      return;
    }

    if (!formData.password) {
      showError("Password is required");
      return;
    }

    // Submit form
    showSuccess("Form submitted successfully!");
  };
};
```

## Testing Example

To test the InfoMessage component, you can use the MessageExampleScreen:

```tsx
// Add to your navigation to see examples
<Stack.Screen name="MessageExample" component={MessageExampleScreen} />
```

This provides interactive examples of all message types and positions.

## File Structure

```
components/
  global/
    ├── InfoMessage.tsx          # Main component
    └── MessageContainer.tsx     # Global container
states/
  reducers/
    └── messageSlice.tsx         # Redux slice
hooks/
  └── useMessage.tsx             # Custom hook
examples/
  └── InfoMessageUsageExamples.tsx # Usage examples
app/
  examples/
    └── MessageExampleScreen.tsx # Interactive demo
```

## Migration Guide

If you're currently using other notification libraries, here's how to migrate:

### From react-native-flash-message

```tsx
// Old
import { showMessage } from "react-native-flash-message";
showMessage({
  message: "Success!",
  type: "success",
});

// New
import { useMessage } from "@/hooks/useMessage";
const { showSuccess } = useMessage();
showSuccess("Success!");
```

### From react-native-toast-message

```tsx
// Old
import Toast from "react-native-toast-message";
Toast.show({
  type: "success",
  text1: "Success!",
});

// New
import { useMessage } from "@/hooks/useMessage";
const { showSuccess } = useMessage();
showSuccess("Success!");
```
