import { keyframes } from "styled-components";

export function rollingText(length) {
  return keyframes`
        0% {
          transform: translate(0, 0);
        }
        100% {
          transform: translate(-${length}px, 0);
        }
      `;
}
