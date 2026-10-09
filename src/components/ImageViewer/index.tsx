import {useEffect, useRef, useState, type ReactNode} from 'react';
import styles from './styles.module.css';

type SelectedImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  element: HTMLImageElement;
};

// Delegation includes Markdown images and native <img> elements in MDX.
export default function ImageViewer(): ReactNode {
  const [image, setImage] = useState<SelectedImage | null>(null);
  const [zoom, setZoom] = useState(1);
  const [viewport, setViewport] = useState({width: 0, height: 0});
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const originals = new Map<HTMLImageElement, (string | null)[]>();
    const attributes = ['tabindex', 'role', 'aria-label', 'aria-haspopup'];
    const enhance = () => {
      document.querySelectorAll<HTMLImageElement>('.markdown img').forEach((img) => {
        if (img.closest('a, button') || originals.has(img)) return;
        originals.set(img, attributes.map((attribute) => img.getAttribute(attribute)));
        img.tabIndex = 0;
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', `Enlarge image${img.alt ? `: ${img.alt}` : ''}`);
        img.setAttribute('aria-haspopup', 'dialog');
      });
    };
    const open = (target: EventTarget | null) => {
      if (!(target instanceof HTMLImageElement) || !originals.has(target)) return;
      setZoom(1);
      setImage({
        src: target.currentSrc || target.src,
        alt: target.alt,
        width: target.naturalWidth || target.width,
        height: target.naturalHeight || target.height,
        element: target,
      });
    };
    const onClick = (event: MouseEvent) => open(event.target);
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.key === 'Enter' || event.key === ' ') &&
          event.target instanceof HTMLImageElement && originals.has(event.target)) {
        event.preventDefault();
        open(event.target);
      }
    };
    enhance();
    const observer = new MutationObserver(enhance);
    observer.observe(document.body, {childList: true, subtree: true});
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      observer.disconnect();
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKeyDown);
      originals.forEach((values, img) => attributes.forEach((attribute, index) => {
        if (values[index] === null) img.removeAttribute(attribute);
        else img.setAttribute(attribute, values[index]);
      }));
    };
  }, []);

  useEffect(() => {
    if (!image) return;
    const modal = dialog.current;
    const updateViewport = () => setViewport({width: window.innerWidth, height: window.innerHeight});
    updateViewport();
    window.addEventListener('resize', updateViewport);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modal?.showModal();
    return () => {
      modal?.close();
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('resize', updateViewport);
      if (image.element.isConnected) image.element.focus({preventScroll: true});
    };
  }, [image]);

  if (!image) return null;
  const fit = Math.min(1,
    Math.max(1, viewport.width * 0.94 - 32) / Math.max(1, image.width),
    Math.max(1, viewport.height * 0.92 - 160) / Math.max(1, image.height));

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-label={image.alt ? `Image viewer: ${image.alt}` : 'Image viewer'}
      onCancel={() => setImage(null)}
      onClick={(event) => {
        if (event.target === event.currentTarget) setImage(null);
      }}>
      <div className={styles.content}>
        <div className={styles.toolbar}>
          <button type="button" disabled={zoom <= 1} aria-label="Zoom out"
            onClick={() => setZoom((value) => Math.max(1, value - 0.5))}>−</button>
          <output aria-live="polite">{Math.round(zoom * 100)}%</output>
          <button type="button" disabled={zoom >= 4} aria-label="Zoom in"
            onClick={() => setZoom((value) => Math.min(4, value + 0.5))}>+</button>
          <button type="button" onClick={() => setZoom(1)}>Fit</button>
          <button type="button" className={styles.close} autoFocus
            onClick={() => setImage(null)}>Close</button>
        </div>
        <div className={styles.stage} tabIndex={0} aria-label="Image; scroll to pan when zoomed">
          <img src={image.src} alt={image.alt} draggable={false}
            style={{width: image.width * fit * zoom, maxWidth: 'none'}} />
        </div>
        <p className={styles.caption}>{image.alt || 'Full-size image'} · Scroll to pan when zoomed</p>
      </div>
    </dialog>
  );
}
