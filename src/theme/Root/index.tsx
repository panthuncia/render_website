import type {ReactNode} from 'react';
import ImageViewer from '@site/src/components/ImageViewer';

export default function Root({children}: {children: ReactNode}): ReactNode {
  return <>{children}<ImageViewer /></>;
}
