import { CSSProperties } from "react";
import { MOMENT_CONSTANTS, baseStyle } from "../../constants";

interface InteractionBarProps {
    likes?: string[]
    comments?: string[]
}

// ============================================ InteractionBar Component ============================================

const InteractionBar = (props: InteractionBarProps) => {
  const { likes, comments } = props;

  // 如果没有点赞和评论，不渲染组件
  if ((!likes || likes.length === 0) && (!comments || comments.length === 0)) {
    return null;
  }

  return (
    <section style={interactionStyle}>
      {/* 点赞 */}
      {likes && likes.length > 0 && (
        <section style={likeSectionStyle}>
          <span style={likeTextStyle}>
            ❤️ {likes[0]}
            {likes.length > 1 && ` 等${likes.length}人`}
          </span>
        </section>
      )}

      {/* 评论 */}
      {comments && comments.length > 0 && (
        <section style={commentSectionStyle}>
          {comments.map((comment, idx) => (
            <section key={idx} style={commentItemStyle}>
              <span style={commentTextStyle}>{comment}</span>
            </section>
          ))}
        </section>
      )}
    </section>
  );
};

export default InteractionBar;

// ============================================ Styles ============================================

const interactionStyle: CSSProperties = {
  ...baseStyle,
  backgroundColor: MOMENT_CONSTANTS.COLOR_INTERACTION_BG,
  borderRadius: 4,
  padding: 8,
};

const likeSectionStyle: CSSProperties = {
  ...baseStyle,
  marginBottom: 4,
};

const likeTextStyle: CSSProperties = {
  fontSize: 14,
  color: MOMENT_CONSTANTS.COLOR_TEXT,
};

const commentSectionStyle: CSSProperties = {
  ...baseStyle,
};

const commentItemStyle: CSSProperties = {
  ...baseStyle,
  marginBottom: 2,
  fontSize: 14,
  color: MOMENT_CONSTANTS.COLOR_TEXT,
  lineHeight: 1.4,
};

const commentTextStyle: CSSProperties = {
  fontSize: 14,
  color: MOMENT_CONSTANTS.COLOR_TEXT,
};
