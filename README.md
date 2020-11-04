# react-native-drag-to-reveal

## 🚀 Getting Started

Using [**Yarn**](https://yarnpkg.com):

```sh
yarn add react-native-drag-to-reveal
```

## ✏️ Example

```javascript
import React, { useCallback, useState } from 'react';
import { useWindowDimensions } from "react-native-use-dimensions";

import { DragToReveal } from "react-native-drag-to-reveal";

export default function App() {
  const { width, height } = useWindowDimensions();
  const [open, onChange] = useState<boolean>(true);
  const radius = 100;
  const maxRadius = 2 * 100;
  return (
    <DragToReveal
      origin={{
        x: -radius,
        y: -radius + height,
      }}
      open={open}
      onChange={onChange}
      radius={radius}
      maxRadius={maxRadius}
      renderChildren={({ open, progress }) => (
        <>
          {/* revealed content here */}
        </>
      )}
    />
  );
}
```

## 🦄 Prop Types

| **Name**         | **Type**                                                 | **Description**                                     |
|------------------|----------------------------------------------------------|-----------------------------------------------------|
| `style`          | `ViewStyle`                                              | The container style of the obscured content.        |
| `radius`         | `number`                                                 | Minimum visible drag radius.                        |
| `maxRadius`      | `number`                                                 | Maximum radius size.                                |
| `origin`         | `{ x: number, y: number }`                               | Placement of the reveal radius w.r.t the container. |
| `renderChildren` | `({ open: boolean, progress: Animated }) => JSX.Element` | Render prop. Progress (0 -> 1).                     |
| `open`           | `boolean`                                                | Content revealed?                                   |
| `onChange`       | `(open: boolean) => unknown`                             | Content reveal state changed.                       |
| `disabled`       | `boolean`                                                | Prevent the reveal state from changing.             |

## ✌️ License
[**MIT**](./LICENSE)
