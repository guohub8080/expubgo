import React from 'react'

const DefaultAvatar = () => (
  <svg viewBox="-10 -10 620 620" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        {`.st0 { fill: #4DD0E1; } .st1 { fill: #fff; } .st2 { fill: #1976D2; }`}
      </style>
    </defs>
    <g>
      <path className="st1" d="M297.6,20.3L51.6,162.3v284.1l246,142,246-142V162.3L297.6,20.3Z"/>
      <path className="st2" d="M106.3,225.4v189.4l164,94.7v-189.4l-164-94.7ZM243,51.8l54.7-31.6,246,142v31.6l-218.7,126.3v189.4s164-94.7,164-94.7v-63.1l-109.3,63.1v-63.1l164-94.7v189.4s-246,142-246,142L51.6,446.4V162.3l27.3-15.8,218.7,126.3,164-94.7L243,51.8Z"/>
    </g>
    <polygon className="st0" points="79 146.5 297.6 20.3 297.6 272.8 79 146.5"/>
  </svg>
)

export default {
  publisherId: "expubgo",
  publisherName: "示例推文",
  avatar: <DefaultAvatar />,
  theme: {
    spine: ["#a8b8ca", "#64748b"],
    cover: ["#f1f5f9", "#e2e8f0"],
  },
  weight: 0,
  articleDir: "./examples",
  alias: {},
}
